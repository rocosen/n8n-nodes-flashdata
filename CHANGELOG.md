# Changelog

## 0.2.2 (2026-10-26)

- Correct the codex `node` identifier to `n8n-nodes-flashdata.flashdata` so n8n can associate the metadata with the existing node. Runtime node IDs and API behavior are unchanged.
- Include the previously published Google Search API integration research Agent workflow, listing, and synthetic evidence examples in the package.

## 0.2.1 (2026-10-15)

- Publish from the public `rocosen/n8n-nodes-flashdata` repository with GitHub Actions provenance.
- Update package source, issue, credential documentation and workflow image links after the repository migration. Node IDs, credentials, operations and API behavior are unchanged.

## 0.2.0 (2026-10-12)

- Cover all 15 Google/YouTube sources, with source-specific operations and 30 search aliases.
- Add encrypted download destination configuration, async submission and safe status/result reads without forwarding API keys to storage.
- Preserve original node/credential IDs, four operation values, per-item expressions and full response envelopes.
- Add 15 independent task workflows with exportable artifacts, setup notes, diagrams and source-specific FlashData links.
- Validate extended limits, caption defaults, search filters, storage and clip settings; avoid automatic paid retries.

## 0.1.2 (2026-10-09)

- Use the existing public npm publisher contact email for n8n package ownership verification. No runtime changes.

## 0.1.1 (2026-10-09)

First npm release. Explicit public access enables provenance for the initial package publication.

The `v0.1.0` tag did not produce an npm release because the registry required explicit public access.

- Google Search with optional country, language, location, page, result count, time filter, and autocorrect.
- YouTube search, metadata, and timestamped transcripts.
- FlashData API key credentials with a non-billable connection test.
- Video URL normalization and validation before paid requests.
- Three importable example workflows and GitHub Actions publishing with npm provenance.
