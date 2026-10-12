const nock = require('/workspace/node_modules/nock').default;
const { appendFileSync } = require('node:fs');
const { resultFor, manifest } = require('./fixtures.cjs');
nock.disableNetConnect();
nock.enableNetConnect(/^(127\.0\.0\.1|localhost|\[::1\])/);
const record = (value) => appendFileSync('/fixtures/requests.jsonl', JSON.stringify(value) + '\n');
nock('https://data.flashdata.dev', { reqheaders: { 'x-api-key': 'test-key-not-a-secret' } })
	.persist()
	.post('/v1/queries/realtime')
	.reply(async (request) => {
		const body = await request.json();
		record(body);
		if (body.query === 'simulate-payment-error')
			return [402, { error: true, message: 'Insufficient credits' }];
		const result = resultFor(body);
		return result
			? [
					200,
					{
						source: body.source,
						status: 'done',
						results: [result],
						usage: { credits: 0.01 },
						created_at: '2026-10-08T00:00:00Z',
					},
				]
			: [400, { error: true, message: 'Unknown source' }];
	});
nock('https://data.flashdata.dev', { reqheaders: { 'x-api-key': 'test-key-not-a-secret' } })
	.persist()
	.post('/v1/queries')
	.reply(async (request) => {
		const body = await request.json();
		record(body);
		if (
			body.source !== 'youtube_download' ||
			body.params?.storage?.secret_key !== 'storage-secret-fixture'
		)
			return [400, { message: 'Missing encrypted credential storage' }];
		return [
			202,
			{
				id: 'job_download_fixture',
				source: body.source,
				status: 'pending',
				created_at: '2026-10-08T00:00:00Z',
			},
		];
	});
let polls = 0;
nock('https://api.flashdata.dev', { reqheaders: { 'x-api-key': 'test-key-not-a-secret' } })
	.persist()
	.get('/v2/jobs/job_download_fixture')
	.reply(() => {
		record({ method: 'GET', kind: 'status' });
		polls++;
		return [
			200,
			{
				job: {
					id: 'job_download_fixture',
					status: polls === 1 ? 'processing' : 'completed',
					source: 'youtube_download',
					credits: 0.001,
				},
			},
			{ 'Retry-After': '5' },
		];
	});
nock('https://api.flashdata.dev', { reqheaders: { 'x-api-key': 'test-key-not-a-secret' } })
	.persist()
	.get('/v2/jobs/job_download_fixture/results')
	.reply(() => {
		record({ method: 'GET', kind: 'redirect' });
		return [302, '', { Location: 'https://results.example.test/download.json?signature=fixture' }];
	});
nock('https://results.example.test')
	.persist()
	.get('/download.json')
	.query(true)
	.reply((request) => {
		if (request.headers.get('x-api-key') || request.headers.get('authorization'))
			throw new Error('Credential forwarded to result storage');
		record({ method: 'GET', kind: 'anonymous-result' });
		return [200, manifest];
	});
