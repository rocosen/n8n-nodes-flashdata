const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const workflow = JSON.parse(readFileSync('workflows/capabilities/google_search.json'));
const config = JSON.parse(
	workflow.nodes.find((n) => n.name === 'Configure task').parameters.jsonOutput,
);
function run(name, input, prior = []) {
	const code = workflow.nodes.find((n) => n.name === name).parameters.jsCode;
	return JSON.parse(
		JSON.stringify(
			vm.runInNewContext(`(function(){${code}})()`, {
				$input: { first: () => input[0], all: () => input },
				$: () => ({ all: () => prior }),
			}),
		),
	);
}
const validate = (overrides) =>
	run('Validate keywords and domains', [{ json: { ...config, ...overrides } }]);
function audit(organic, overrides = {}) {
	const input = validate({ keywords: ['test query'], ...overrides });
	return run(
		'Build ranking audit',
		[
			{
				json: {
					status: 'done',
					results: [{ organic }],
					usage: { credits: 0.01 },
					created_at: '2026-10-15T00:00:00Z',
				},
			},
		],
		input,
	)[0].json;
}
test('keyword/domain validation happens before paid queries and deduplicates whitespace', () => {
	const rows = validate({ keywords: ['one', ' one ', 'two'], target_domain: 'WWW.EXAMPLE.COM.' });
	assert.equal(rows.length, 2);
	assert.equal(rows[0].json.target_domain, 'example.com');
	for (const invalid of [
		{ keywords: [] },
		{ keywords: Array(21).fill('x') },
		{ result_count: 0 },
		{ country: 'usa' },
		{ target_domain: 'https://example.com' },
		{ competitor_domains: ['shop.example.com'] },
		{ competitor_domains: ['example.org', 'blog.example.org'] },
	]) {
		assert.throws(() => validate(invalid));
	}
});
test('exact domain/subdomain matching rejects lookalikes and userinfo URLs', () => {
	const report = audit([
		{ link: 'https://example.com.evil.test/page', position: 1 },
		{ link: 'https://notexample.com/page', position: 2 },
		{ link: 'https://blog.example.org/page', position: 3 },
		{ link: 'https://www.example.com/page', position: 8 },
	]);
	const row = report.keywords[0];
	assert.equal(row.finding, 'competitor_ahead');
	assert.equal(row.position_gap, 5);
	assert.equal(row.target_position, 8);
	assert.equal(row.best_competitor_domain, 'example.org');
	assert.equal(
		audit([{ link: 'https://example.com@evil.test/', position: 1 }]).keywords[0].finding,
		'incomplete_result_fields',
	);
});
test('absence, empty results and incomplete positions are distinct and never invent ranks', () => {
	const missing = audit([{ link: 'https://example.org/', position: 4 }]).keywords[0];
	assert.equal(missing.finding, 'competitor_visible_target_not_found');
	assert.equal(missing.target_position, null);
	assert.equal(missing.position_gap, null);
	assert.equal(audit([]).keywords[0].finding, 'no_organic_results');
	assert.equal(
		audit([{ link: 'https://other.test/', position: 1 }]).keywords[0].finding,
		'no_tracked_domains_found',
	);
	assert.equal(
		audit([{ link: 'https://example.com/' }, { link: 'https://example.org/', position: 1 }])
			.keywords[0].finding,
		'incomplete_result_fields',
	);
	assert.throws(() => audit(undefined));
});
test('URL fragments deduplicate to the best known position and usage stays per query', () => {
	const report = audit([
		{ link: 'https://example.com/page#first', position: 5 },
		{ link: 'https://example.com/page#second', position: 2 },
		{ link: 'https://example.org/page', position: 4 },
	]);
	assert.equal(report.keywords[0].target_position, 2);
	assert.equal(report.keywords[0].evidence.length, 2);
	assert.equal(report.total_credits, 0.01);
	assert.equal(report.review_candidates, 0);
});
test('multiple keyword responses retain their own context and are grouped for review', () => {
	const inputs = validate({ keywords: ['leading', 'missing'] });
	const responses = [
		[{ link: 'https://example.com/', position: 1 }],
		[{ link: 'https://example.org/', position: 2 }],
	].map((organic) => ({ json: { status: 'done', results: [{ organic }] } }));
	const report = run('Build ranking audit', responses, inputs)[0].json;
	assert.equal(report.keywords[0].query, 'missing');
	assert.equal(report.keywords[1].target_position, 1);
	assert.equal(report.total_credits, null);
	assert.throws(() => run('Build ranking audit', responses.slice(0, 1), inputs));
});
test('CSV export neutralizes spreadsheet formulas without changing JSON evidence', () => {
	const report = audit([{ link: 'https://example.com/', position: 1 }], { keywords: ['=1+1'] });
	const rows = run('Prepare output', [{ json: report }]);
	assert.equal(rows[0].json.query, "'=1+1");
	assert.equal(report.keywords[0].query, '=1+1');
});
