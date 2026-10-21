// Synthetic example data and scripted model output. No live search or model claims.
const researchResults = [
	{
		title: 'Example webhook verification guide — synthetic fixture',
		link: 'https://example.com/webhook-verification',
		snippet:
			'Synthetic search fixture: validate the webhook signature against the original request body before processing an event. The excerpt does not name the header or algorithm.',
		position: 1,
	},
	{
		title: 'Example delivery guide — synthetic fixture',
		link: 'https://example.com/webhook-delivery',
		snippet:
			'Synthetic search fixture: webhook deliveries include a delivery identifier. This excerpt does not establish retry timing or retention guarantees.',
		position: 1,
	},
];
function researchReport(hasEvidence = true) {
	return {
		summary: hasEvidence
			? 'Synthetic demonstration: signature handling and delivery identification need implementation checks; exact settings and retry guarantees remain unresolved.'
			: 'No usable evidence was retrieved. Verify the documentation and account access before implementation.',
		findings: hasEvidence
			? [
					{
						topic: 'Signature verification',
						finding:
							'The synthetic excerpt calls for verifying a signature against the original request body. It does not establish the header, algorithm or secret configuration.',
						assessment: 'partial',
						source_urls: [researchResults[0].link],
						next_action:
							'Read the actual provider documentation, confirm the signing scheme and preserve the original body before parsing.',
						verification:
							'After confirming the scheme, test a valid signature and a tampered payload; confirm the invalid payload is rejected before processing.',
					},
					{
						topic: 'Delivery identification',
						finding:
							'The synthetic excerpt states that deliveries include an identifier. It does not establish identifier reuse during retries.',
						assessment: 'partial',
						source_urls: [researchResults[1].link],
						next_action:
							'Confirm identifier semantics before choosing a deduplication key and storage retention period.',
						verification:
							'Replay a permitted test delivery and inspect identifiers and side effects; define the expected behavior from the actual service contract.',
					},
					{
						topic: 'Retry and timeout policy',
						finding:
							'Retry intervals, timeout limits and retention guarantees are not established by the available snippets.',
						assessment: 'not_established',
						source_urls: [],
						next_action:
							'Inspect the provider delivery and retry documentation before selecting a queue or retention policy.',
						verification:
							'Record the documented limits and perform authorized failure/retry tests in a test environment; do not infer a numeric limit from search ranking.',
					},
				]
			: [],
		open_questions: hasEvidence
			? [
					'Which exact signing header and algorithm apply? Check the actual provider documentation.',
					'Are delivery identifiers reused on retries, and what retry window must the integration support? Verify the service contract before implementation.',
				]
			: [
					'Why was usable evidence unavailable? Inspect search status and account access, then obtain documentation before implementation.',
				],
	};
}
module.exports = { researchResults, researchReport };
