// A scripted protocol fixture, not a quality evaluation of a real model.
const http = require('node:http');
const assert = require('node:assert/strict');
const { appendFileSync } = require('node:fs');
http
	.createServer(async (req, res) => {
		try {
			assert.equal(req.url, '/v1/chat/completions');
			assert.equal(req.headers.authorization, 'Bearer model-test-not-a-secret');
			const chunks = [];
			for await (const chunk of req) chunks.push(chunk);
			const body = JSON.parse(Buffer.concat(chunks));
			const observations = body.messages.filter((m) => m.role === 'tool');
			const question = body.messages.find((m) => m.role === 'user')?.content ?? '';
			const scenario =
				['EMPTY', 'SKIP', 'LIMIT', 'PAYMENT'].find((value) =>
					question.includes('FIXTURE_' + value),
				) ?? 'NORMAL';
			const tool = body.tools.find((t) => t.function.name.includes('Search_Google'));
			assert.ok(tool, 'The Agent must expose the actual FlashData tool');
			assert.ok(tool.function.parameters.properties.query, 'query must be supplied by the Agent');
			assert.equal(body.parallel_tool_calls, false);
			appendFileSync(
				'/fixtures/models.jsonl',
				JSON.stringify({
					scenario,
					observations: observations.length,
					tool: tool.function.name,
					messages: body.messages,
				}) + '\n',
			);
			const queries = [
				'n8n GitHub webhook authentication official docs',
				'GitHub webhook signature delivery limits official docs',
			];
			let message;
			if (
				scenario !== 'SKIP' &&
				(scenario === 'LIMIT' ||
					observations.length < (scenario === 'EMPTY' || scenario === 'PAYMENT' ? 1 : 2))
			) {
				if (observations.length && scenario === 'NORMAL')
					assert.match(observations[0].content, /Search fixture/);
				message = {
					role: 'assistant',
					content: null,
					tool_calls: [
						{
							id: 'call_' + observations.length,
							type: 'function',
							function: {
								name: tool.function.name,
								arguments: JSON.stringify({
									query:
										scenario === 'EMPTY'
											? 'fixture-empty-search'
											: scenario === 'PAYMENT'
												? 'simulate-payment-error'
												: scenario === 'LIMIT'
													? 'fixture-loop-' + observations.length
													: queries[observations.length],
								}),
							},
						},
					],
				};
			} else {
				if (scenario === 'NORMAL')
					assert.ok(observations.every((m) => m.content.includes('https://example.com/research')));
				message = {
					role: 'assistant',
					content:
						scenario === 'NORMAL'
							? '# Integration research brief\n\nThe synthetic snippet is a reading lead: [Example documentation](https://example.com/research).\n\n## Recommended next checks\nOpen the real documentation and test webhook delivery.\n\n## Open questions\nAuthentication details and delivery limits remain unverified. This fixture provides snippets only.'
							: '# Open questions\n\nNo usable evidence was retrieved. Verify the documentation and account access before implementation.',
				};
			}
			const reply = {
				id: 'chatcmpl-fixture',
				object: 'chat.completion',
				created: 1,
				model: body.model,
				choices: [{ index: 0, message, finish_reason: message.tool_calls ? 'tool_calls' : 'stop' }],
				usage: { prompt_tokens: 100, completion_tokens: 40, total_tokens: 140 },
			};
			res.writeHead(200, { 'content-type': 'application/json' });
			res.end(JSON.stringify(reply));
		} catch (error) {
			console.error(error);
			res.writeHead(500, { 'content-type': 'application/json' });
			res.end(JSON.stringify({ error: { message: error.message } }));
		}
	})
	.listen(17893, '127.0.0.1');
