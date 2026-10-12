import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { googleResources, operationSources } from './descriptions';
import { validateBody } from './request';
import { validateDownload } from './download';

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const output: INodeExecutionData[] = [];
	for (let i = 0; i < this.getInputData().length; i++) {
		try {
			const get = (name: string, fallback: IDataObject[string] = '') =>
				this.getNodeParameter(name, i, fallback);
			const resource = String(get('resource'));
			const operation = String(get('operation'));
			let response: IDataObject;
			if (resource === 'downloadJob') {
				const id = String(get('jobId')).trim();
				if (!/^job_[A-Za-z0-9_-]{1,116}$/.test(id))
					throw new NodeOperationError(
						this.getNode(),
						'Enter the job ID returned by the download submission.',
						{ itemIndex: i },
					);
				response = await readJob.call(this, id, i);
			} else {
				const google = googleResources.find((item) => item.value === resource);
				const source =
					google?.source ?? (resource === 'youtube' ? operationSources[operation] : undefined);
				if (!source || (google && operation !== 'search'))
					throw new NodeOperationError(this.getNode(), 'Unsupported resource or operation.', {
						itemIndex: i,
					});
				const body: IDataObject = { source, params: {} };
				let params = body.params as IDataObject;
				if (google) {
					body.query = get('query') as string;
					body.params = get('options', {}) as IDataObject;
				} else if (['search', 'searchExtended'].includes(operation)) {
					body.query = get('query') as string;
					params.max_results = get('maxResults', operation === 'search' ? 10 : 20) as number;
					const filters = get('filters', {}) as IDataObject;
					if (Object.keys(filters).length) params.filters = filters;
				} else if (operation === 'getChannel') {
					body.handle = get('handle') as string;
					params.video_limit = get('videoLimit', 20) as number;
				} else if (operation === 'getSuggestions') {
					body.query = get('query') as string;
					params.language = get('language', 'en') as string;
					params.region = get('region', 'US') as string;
				} else {
					body.video_id = get('videoId') as string;
					if (operation === 'getMetadata') {
						const options = get('options', {}) as IDataObject;
						params.include_chapters = options.includeChapters ?? true;
						params.include_formats = options.includeFormats ?? true;
					} else if (['getTranscript', 'getCaptions'].includes(operation)) {
						params.language = get('language', 'en') as string;
						params.auto = get('auto', operation === 'getTranscript') as boolean;
					} else if (operation === 'download') {
						params = {
							...(get('downloadOptions', {}) as IDataObject),
							download_type: get('downloadType', 'audio_video') as string,
						};
						body.params = params;
					}
				}
				try {
					validateBody(body);
					if (operation === 'download') {
						const credentials = await this.getCredentials('flashdataApi', i);
						let storage: unknown;
						try {
							storage = JSON.parse(String(credentials.downloadStorageSecret || ''));
						} catch {
							throw new NodeOperationError(
								this.getNode(),
								'Configure valid Download Storage JSON in the FlashData credential.',
								{ itemIndex: i },
							);
						}
						validateDownload(params, storage);
						params.storage = storage as IDataObject;
					}
				} catch (error) {
					throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
				}
				response = await request.call(
					this,
					'POST',
					`https://data.flashdata.dev/v1/queries${operation === 'download' ? '' : '/realtime'}`,
					i,
					body,
				);
			}
			output.push({ json: response, pairedItem: { item: i } });
		} catch (error) {
			if (!this.continueOnFail()) {
				// Preserve already sanitized n8n errors and their item/status context.

				throw error instanceof NodeApiError || error instanceof NodeOperationError
					? error
					: new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
			output.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
		}
	}
	return [output];
}

async function request(
	this: IExecuteFunctions,
	method: 'GET' | 'POST',
	url: string,
	itemIndex: number,
	body?: IDataObject,
): Promise<IDataObject> {
	try {
		return await this.helpers.httpRequestWithAuthentication.call(this, 'flashdataApi', {
			method,
			url,
			body,
			json: true,
			timeout: 120000,
			disableFollowRedirect: true,
		});
	} catch (error) {
		// Never attach request objects: download bodies contain customer storage secrets.
		const status = Number(error.statusCode ?? error.response?.status ?? 0);
		throw new NodeApiError(
			this.getNode(),
			{
				message: status
					? `FlashData returned HTTP ${status}. Check credits, source access, and request parameters.`
					: 'FlashData request failed before a response was received. Check job history and usage before repeating a paid submission.',
				...(status ? { httpCode: String(status) } : {}),
			},
			{ itemIndex },
		);
	}
}

export async function readJob(
	this: IExecuteFunctions,
	id: string,
	itemIndex: number,
): Promise<IDataObject> {
	const url = `https://api.flashdata.dev/v2/jobs/${encodeURIComponent(id)}`;
	const status = await request.call(this, 'GET', url, itemIndex);
	const job = status.job as IDataObject | undefined;
	if (job?.status !== 'completed') return status;
	try {
		const redirect = await this.helpers.httpRequestWithAuthentication.call(this, 'flashdataApi', {
			method: 'GET',
			url: `${url}/results`,
			returnFullResponse: true,
			ignoreHttpStatusErrors: true,
			disableFollowRedirect: true,
			timeout: 30000,
		});
		if (redirect.statusCode !== 302 || !redirect.headers.location)
			throw new NodeOperationError(
				this.getNode(),
				`Completed job result is unavailable (HTTP ${redirect.statusCode}). Retry this read, not the paid submission.`,
				{ itemIndex },
			);
		const target = new URL(String(redirect.headers.location));
		if (target.protocol !== 'https:' || target.username || target.password || target.hash)
			throw new NodeOperationError(
				this.getNode(),
				'The result service returned an invalid HTTPS result URL.',
				{ itemIndex },
			);
		const result = await this.helpers.httpRequest({
			method: 'GET',
			url: target.href,
			json: true,
			disableFollowRedirect: true,
			timeout: 120000,
		});
		if (!result || typeof result !== 'object' || Array.isArray(result))
			throw new NodeOperationError(this.getNode(), 'The job result is not a JSON object.', {
				itemIndex,
			});
		return { ...status, output: result };
	} catch (error) {
		if (error instanceof NodeOperationError)
			throw new NodeOperationError(this.getNode(), error, { itemIndex });
		throw new NodeApiError(
			this.getNode(),
			{
				message:
					'The completed job result could not be read. Retry this read; do not resubmit the paid download.',
			},
			{ itemIndex },
		);
	}
}
