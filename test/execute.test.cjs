const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execute, readJob } = require('../dist/nodes/Flashdata/execute');
const { validateDownload, validateStorage } = require('../dist/nodes/Flashdata/download');
const storage = {
	storage_type: 's3',
	storage_url: 'customer-bucket',
	region: 'us-east-1',
	access_key: 'access-fixture',
	secret_key: 'secret-fixture',
};
function context(parameters, overrides = {}) {
	return {
		getInputData: () => [{ json: {} }],
		getNodeParameter: (key, index, fallback) => parameters[key] ?? fallback,
		getNode: () => ({
			name: 'FlashData',
			type: 'flashdata',
			typeVersion: 1,
			position: [0, 0],
			parameters,
		}),
		continueOnFail: () => false,
		getCredentials: async () => ({
			apiKey: 'test-key',
			downloadStorageSecret: JSON.stringify(storage),
		}),
		...overrides,
	};
}
test('invalid advanced inputs and storage never reach a billable POST', async () => {
	for (const parameters of [
		{ resource: 'youtube', operation: 'searchExtended', query: 'x', maxResults: 701 },
		{ resource: 'youtube', operation: 'getChannel', handle: ' ', videoLimit: 20 },
		{ resource: 'youtube', operation: 'getSuggestions', query: 'x', region: 'USA' },
		{ resource: 'youtube', operation: 'search', query: 'x', filters: { arbitrary: true } },
		{
			resource: 'youtube',
			operation: 'download',
			videoId: 'dQw4w9WgXcQ',
			downloadType: 'audio',
			downloadOptions: { output_format: 'mp4' },
		},
		{
			resource: 'youtube',
			operation: 'download',
			videoId: 'dQw4w9WgXcQ',
			downloadOptions: { start_at: '00:00:10', end_at: '00:00:01' },
		},
	]) {
		let called = false;
		await assert.rejects(
			execute.call(
				context(parameters, {
					helpers: {
						httpRequestWithAuthentication: async () => {
							called = true;
						},
					},
				}),
			),
		);
		assert.equal(called, false);
	}
});
test('storage validation rejects unsafe destinations without echoing their secrets', () => {
	for (const patch of [
		{ storage_url: 'https://bucket.example/a' },
		{ object_prefix: '../escape' },
		{ secret_key: '' },
		{ region: '' },
		{ storage_type: 'unknown' },
		{ extra: 'secret-fixture' },
	]) {
		assert.throws(
			() => validateStorage({ ...storage, ...patch }),
			(e) => !e.message.includes('secret-fixture'),
		);
	}
	const p = {
		download_type: 'audio',
		output_format: 'mp3',
		start_at: '00:00:01',
		end_at: '00:00:02',
	};
	validateDownload(p, { ...storage });
});
test('download POST injects encrypted storage only at request time and never retries or echoes it', async () => {
	let calls = 0;
	const ctx = context(
		{
			resource: 'youtube',
			operation: 'download',
			videoId: 'https://youtu.be/dQw4w9WgXcQ',
			downloadType: 'audio',
			downloadOptions: {},
		},
		{
			helpers: {
				httpRequestWithAuthentication: async (type, options) => {
					calls++;
					assert.equal(type, 'flashdataApi');
					assert.equal(options.url, 'https://data.flashdata.dev/v1/queries');
					assert.equal(options.body.params.storage.secret_key, 'secret-fixture');
					throw { statusCode: 402, request: { body: options.body }, message: 'secret-fixture' };
				},
			},
		},
	);
	await assert.rejects(execute.call(ctx), (e) => !JSON.stringify(e).includes('secret-fixture'));
	assert.equal(calls, 1);
});
test('completed results use authenticated status/redirect reads and an anonymous HTTPS fetch', async () => {
	const calls = [];
	const ctx = context(
		{},
		{
			helpers: {
				httpRequestWithAuthentication: async (type, options) => {
					calls.push(options);
					return options.url.endsWith('/results')
						? {
								statusCode: 302,
								headers: { location: 'https://storage.example/result.json?signature=fixture' },
							}
						: { job: { id: 'job_test', status: 'completed' } };
				},
				httpRequest: async (options) => {
					assert.equal(options.headers, undefined);
					assert.equal(options.disableFollowRedirect, true);
					return { results: [{ file_url: 's3://customer/file.mp4' }] };
				},
			},
		},
	);
	const result = await readJob.call(ctx, 'job_test', 0);
	assert.equal(calls.length, 2);
	assert.ok(calls.every((c) => c.disableFollowRedirect));
	assert.equal(result.output.results[0].file_url, 's3://customer/file.mp4');
});
test('unsafe redirects, expired results and incomplete jobs do not fetch or resubmit', async () => {
	for (const redirect of [
		{ statusCode: 410 },
		{ statusCode: 302, headers: { location: 'http://storage.example/a' } },
		{ statusCode: 302, headers: { location: 'https://user:pass@storage.example/a' } },
	]) {
		let anonymous = 0;
		const ctx = context(
			{},
			{
				helpers: {
					httpRequestWithAuthentication: async (type, options) =>
						options.url.endsWith('/results') ? redirect : { job: { status: 'completed' } },
					httpRequest: async () => {
						anonymous++;
					},
				},
			},
		);
		await assert.rejects(readJob.call(ctx, 'job_test', 0));
		assert.equal(anonymous, 0);
	}
	let requests = 0;
	const ctx = context(
		{},
		{
			helpers: {
				httpRequestWithAuthentication: async () => {
					requests++;
					return { job: { status: 'processing' } };
				},
			},
		},
	);
	await readJob.call(ctx, 'job_test', 0);
	assert.equal(requests, 1);
});
