import type { IDataObject } from 'n8n-workflow';

function record(value: unknown): value is IDataObject {
	return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function textField(value: unknown, field: string, max = 4096): string {
	if (typeof value !== 'string' || !value.trim() || value.length > max)
		throw new Error(`Storage ${field} must be a non-empty string of at most ${max} characters.`);
	return value.trim();
}

export function validateStorage(value: unknown): void {
	if (!record(value)) throw new Error('Download storage must be a JSON object.');
	const type = value.storage_type;
	if (
		typeof type !== 'string' ||
		!['azure', 'bos', 'cos', 'gcs', 'oss', 's3', 's3_compatible', 'tos'].includes(type)
	)
		throw new Error('Unsupported storage_type. See the YouTube download guide.');
	const providerFields =
		type === 'gcs'
			? ['service_account']
			: type === 'azure'
				? ['account_name', 'sas_token']
				: type === 'cos'
					? ['access_key', 'secret_key', 'region']
					: ['access_key', 'secret_key', 'region', 'endpoint_url'];
	if (
		Object.keys(value).some(
			(key) => !['storage_type', 'storage_url', 'object_prefix', ...providerFields].includes(key),
		)
	)
		throw new Error('Storage contains unsupported fields for this provider.');
	const bucket = textField(value.storage_url, 'storage_url', 1024);
	if (
		type === 'azure'
			? !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(bucket)
			: !/^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/.test(bucket)
	)
		throw new Error('storage_url must be a bucket or container name, not a URL or object path.');
	if (type === 's3' && (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(bucket) || /\.\.|\.-|-\./.test(bucket)))
		throw new Error('Enter a valid AWS S3 bucket name.');
	value.storage_url = bucket;
	if (value.object_prefix !== undefined) {
		const prefix = textField(value.object_prefix, 'object_prefix', 513).replace(/\/$/, '');
		if (
			!prefix ||
			prefix.length > 512 ||
			prefix
				.split('/')
				.some((part) => !/^[A-Za-z0-9._-]+$/.test(part) || part === '.' || part === '..')
		)
			throw new Error(
				'object_prefix must use safe path segments without leading slashes or traversal.',
			);
		value.object_prefix = prefix;
	}
	if (type === 'gcs') {
		const account = value.service_account;
		if (!record(account)) throw new Error('GCS requires a service_account object.');
		textField(account.project_id, 'project_id', 256);
		if (
			!/^[^@\s]+@[^@\s]+\.gserviceaccount\.com$/.test(
				textField(account.client_email, 'client_email'),
			) ||
			!textField(account.private_key, 'private_key', 16384).includes('BEGIN PRIVATE KEY')
		)
			throw new Error('GCS requires a service account email and PEM private_key.');
	} else if (type === 'azure') {
		if (!/^[a-z0-9]{3,24}$/.test(textField(value.account_name, 'account_name', 24)))
			throw new Error('Enter a valid Azure account_name.');
		const sas = textField(value.sas_token, 'sas_token').replace(/^\?/, '');
		const params = new URLSearchParams(sas);
		if (
			/[\r\n]/.test(sas) ||
			!params.get('sig') ||
			!params.get('se') ||
			!params.get('sv') ||
			!params.get('sp')?.includes('w') ||
			params.get('sr') !== 'c'
		)
			throw new Error(
				'Azure requires a container SAS with write permission, expiry, and signature.',
			);
		value.sas_token = sas;
	} else {
		textField(value.access_key, 'access_key');
		textField(value.secret_key, 'secret_key');
		const region = textField(value.region, 'region');
		if (['bos', 'cos', 'tos'].includes(type)) {
			const valid =
				type === 'bos'
					? ['bj', 'su', 'hkg'].includes(region)
					: type === 'cos'
						? /^ap-[a-z0-9-]+$/.test(region)
						: /^(?:cn|ap|eu|us)-[a-z0-9-]+$/.test(region);
			if (!valid || bucket.includes('.') || (type === 'cos' && !/-\d{5,}$/.test(bucket)))
				throw new Error(
					'Use a valid provider region and bucket name (COS requires its APPID suffix).',
				);
		}
		if (value.endpoint_url !== undefined) textField(value.endpoint_url, 'endpoint_url');
		if (['s3_compatible', 'oss'].includes(type)) textField(value.endpoint_url, 'endpoint_url');
	}
}

export function validateDownload(params: IDataObject, storage: unknown): void {
	const type = params.download_type ?? 'audio_video';
	if (!['audio_video', 'audio', 'video'].includes(String(type)))
		throw new Error('Choose a supported download type.');
	const formats = type === 'audio' ? ['m4a', 'mp3', 'opus'] : ['mp4', 'webm', 'mkv'];
	if (params.output_format !== undefined && !formats.includes(String(params.output_format)))
		throw new Error('Output format does not match the download type.');
	const selector = params.yt_dlp_format;
	if (selector !== undefined) {
		if (
			typeof selector !== 'string' ||
			!selector.trim() ||
			selector.trim().length > 1024 ||
			[...selector].some((char) => char.charCodeAt(0) <= 31 || char.charCodeAt(0) === 127)
		)
			throw new Error('YT-DLP format must contain 1–1024 characters without control characters.');
		params.yt_dlp_format = selector.trim();
		delete params.video_quality;
		delete params.fps;
		delete params.audio_language;
	} else {
		if (type === 'audio' && (params.video_quality !== undefined || params.fps !== undefined))
			throw new Error('Video quality and FPS do not apply to audio-only downloads.');
		if (
			params.video_quality !== undefined &&
			!/^(best|worst|(?:<=|==|>=)(?:144|360|480|720|1080|1440|2160|4320))$/.test(
				String(params.video_quality),
			)
		)
			throw new Error('Unsupported video quality.');
		if (
			params.fps !== undefined &&
			!/^(?:>=|<=|==)(?:[1-9]\d?|1\d\d|2[0-3]\d|240)$/.test(String(params.fps))
		)
			throw new Error('FPS must use >=, <=, or == followed by 1–240.');
		if (type === 'video' && params.audio_language !== undefined)
			throw new Error('Audio language does not apply to video-only downloads.');
		if (
			params.audio_language !== undefined &&
			!['default', 'original'].includes(String(params.audio_language))
		)
			throw new Error('Choose default or original audio language.');
	}
	if (
		params.audio_quality !== undefined &&
		(type !== 'audio' ||
			!['best', '320', '256', '192', '128'].includes(String(params.audio_quality)))
	)
		throw new Error(
			'Audio quality applies only to audio-only downloads and must use a supported value.',
		);
	if (params.upload_metadata !== undefined && typeof params.upload_metadata !== 'boolean')
		throw new Error('Upload metadata must be a boolean.');
	const seconds = (value: unknown): number => {
		if (typeof value !== 'string' || !/^\d{1,2}:[0-5]\d:[0-5]\d$/.test(value))
			throw new Error('Clip timestamps must use HH:MM:SS.');
		const [h, m, s] = value.split(':').map(Number);
		const total = h * 3600 + m * 60 + s;
		if (total > 43200) throw new Error('Clip timestamps cannot exceed 12:00:00.');
		return total;
	};
	const start = params.start_at === undefined ? 0 : seconds(params.start_at);
	if (params.end_at !== undefined && seconds(params.end_at) <= start)
		throw new Error('Clip end must be later than clip start.');
	validateStorage(storage);
}
