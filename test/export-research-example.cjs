// Reproduce the public synthetic output example with the exported n8n Code node.
const { readFileSync, writeFileSync, mkdirSync } = require('node:fs');
const vm = require('node:vm');
const { researchResults, researchReport } = require('./research-report-fixture.cjs');
const workflow = JSON.parse(readFileSync('workflows/capabilities/google_search.json'));
const task = {
	...JSON.parse(
		workflow.nodes.find((node) => node.name === 'Configure task').parameters.jsonOutput,
	),
	question:
		'SYNTHETIC EXAMPLE — How should an example service deliver signed webhook events into self-hosted n8n?',
	context:
		'Illustrative fixture only: URLs, snippets, timestamps and Credits are synthetic. No live API or model was called; this is not advice about GitHub or another real provider.',
	preferred_sources: 'Synthetic example.com snippets supplied by the test fixture.',
};
const agent = {
	output: JSON.stringify(researchReport()),
	intermediateSteps: researchResults.map((result, index) => ({
		action: {
			toolInput: {
				query:
					index === 0
						? 'example service webhook signature documentation'
						: 'example service webhook delivery retry documentation',
			},
		},
		observation: JSON.stringify([
			{
				status: 'done',
				results: [{ organic: [result] }],
				usage: { credits: 0.01 },
				created_at: '2026-10-21T00:00:00Z',
			},
		]),
	})),
};
const code = workflow.nodes.find((node) => node.name === 'Prepare output').parameters.jsCode;
const output = vm.runInNewContext(`(function(){${code}})()`, {
	$input: { first: () => ({ json: agent }) },
	$: () => ({ first: () => ({ json: task }) }),
})[0].json;
const destination = 'workflows/capabilities/examples/google_search';
mkdirSync(destination, { recursive: true });
writeFileSync(`${destination}/brief.md`, output.content);
writeFileSync(`${destination}/evidence.json`, JSON.stringify([output], null, 2) + '\n');
console.log(
	`Generated synthetic brief and evidence in ${destination}; no network or credentials used.`,
);
