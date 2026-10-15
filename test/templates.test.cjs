const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const { resultFor } = require('./fixtures.cjs');
function transform(source, result) {
	const wf = JSON.parse(readFileSync(`workflows/capabilities/${source}.json`));
	const code = wf.nodes.find((n) => n.name === 'Prepare output').parameters.jsCode;
	const settings = JSON.parse(
		wf.nodes.find((n) => n.name === 'Configure task').parameters.jsonOutput,
	);
	return vm.runInNewContext(`(function(){${code}})()`, {
		$input: {
			first: () => ({
				json: { results: [result], created_at: 'fixture-time', usage: { credits: 0.01 } },
			}),
		},
		$: () => ({ first: () => ({ json: settings }) }),
		URL,
	});
}
test('missing video metadata or captions cannot become invented IDs, permissions or empty subtitle files', () => {
	for (const source of [
		'youtube_metadata',
		'youtube_trainability',
		'youtube_transcript',
		'youtube_captions',
	])
		assert.throws(() => transform(source, {}));
});
test('empty searches stay empty and shopping compares display prices without inventing numeric savings', () => {
	for (const source of [
		'google_images',
		'google_shopping',
		'google_videos',
		'google_places',
		'youtube_search',
		'youtube_search_extended',
		'youtube_channel',
	])
		assert.equal(transform(source, {}).length, 0);
	assert.equal(transform('youtube_suggestions', []).length, 0);
	const rows = transform('google_shopping', resultFor({ source: 'google_shopping' }));
	assert.equal(rows[0].json.price, '$49.00');
	assert.equal(rows[0].json.change, 'new');
});
test('extended search deduplicates video IDs and retains an unknown channel group', () => {
	const rows = transform('youtube_search_extended', {
		results: [{ videoId: 'one' }, { videoId: 'one' }, { videoId: 'two', channelId: 'channel' }],
	});
	assert.equal(
		rows.reduce((sum, r) => sum + r.json.video_count, 0),
		2,
	);
});
