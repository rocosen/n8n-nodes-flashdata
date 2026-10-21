# API integration preparation brief

## Task

SYNTHETIC EXAMPLE — How should an example service deliver signed webhook events into self\-hosted n8n?

**Context:** Illustrative fixture only: URLs, snippets, timestamps and Credits are synthetic\. No live API or model was called; this is not advice about GitHub or another real provider\.

## Summary

Synthetic demonstration: signature handling and delivery identification need implementation checks; exact settings and retry guarantees remain unresolved\.

## Evidence and implementation checklist

Evidence assessments below are the Agent's judgments, not independently verified facts. Source IDs are checked against recorded search results; that check does not establish that a snippet supports a claim.

| Check | Finding | Agent assessment | Sources | Recommended next action | How to verify |
| --- | --- | --- | --- | --- | --- |
| Signature verification | The synthetic excerpt calls for verifying a signature against the original request body\. It does not establish the header, algorithm or secret configuration\. | partial | [S1R1](<https://example.com/webhook-verification>) | Read the actual provider documentation, confirm the signing scheme and preserve the original body before parsing\. | After confirming the scheme, test a valid signature and a tampered payload; confirm the invalid payload is rejected before processing\. |
| Delivery identification | The synthetic excerpt states that deliveries include an identifier\. It does not establish identifier reuse during retries\. | partial | [S2R1](<https://example.com/webhook-delivery>) | Confirm identifier semantics before choosing a deduplication key and storage retention period\. | Replay a permitted test delivery and inspect identifiers and side effects; define the expected behavior from the actual service contract\. |
| Retry and timeout policy | Retry intervals, timeout limits and retention guarantees are not established by the available snippets\. | not_established | None recorded | Inspect the provider delivery and retry documentation before selecting a queue or retention policy\. | Record the documented limits and perform authorized failure/retry tests in a test environment; do not infer a numeric limit from search ranking\. |

## Source excerpts

These are the original returned snippets, not full pages. Collection time is not publication time. Open the linked documentation before relying on it.

### S1R1: Example webhook verification guide — synthetic fixture

[S1R1](<https://example.com/webhook-verification>)

> Synthetic search fixture: validate the webhook signature against the original request body before processing an event\. The excerpt does not name the header or algorithm\.

Search 1, result 1; collected: 2026\-10\-21T00:00:00Z.

### S2R1: Example delivery guide — synthetic fixture

[S2R1](<https://example.com/webhook-delivery>)

> Synthetic search fixture: webhook deliveries include a delivery identifier\. This excerpt does not establish retry timing or retention guarantees\.

Search 2, result 1; collected: 2026\-10\-21T00:00:00Z.

## Open questions

- [ ] Which exact signing header and algorithm apply? Check the actual provider documentation\.
- [ ] Are delivery identifiers reused on retries, and what retry window must the integration support? Verify the service contract before implementation\.

## Search execution record

- Search 1: "example service webhook signature documentation" — results_returned; results: 1; Credits: 0.01
- Search 2: "example service webhook delivery retry documentation" — results_returned; results: 1; Credits: 0.01

## Limits and costs

Search snippets only. Collection timestamps are not publication dates. Source matching does not verify factual support. Evidence assessments, recommendations and conclusions require human review. Model charges are separate and not included in flashdata_credits.
