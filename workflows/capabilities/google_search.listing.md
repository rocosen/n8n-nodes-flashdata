![Workflow overview](https://raw.githubusercontent.com/rocosen/n8n-nodes-flashdata/main/workflows/capabilities/images/google_search_agent.png)

**Self-hosted n8n only.** Requires the FlashData community node.

## Who it's for

Developers preparing an API integration who need a cited checklist before implementation. Example: receiving GitHub repository events in n8n while checking authentication, webhook verification and delivery limits.

## How it works

Enter your question, constraints and preferred sources. An AI Agent chooses Google Search queries and follows up on gaps. It produces a Markdown brief with an evidence table: each finding, its source excerpts, unresolved questions, and a suggested implementation or verification step. A JSON companion preserves the original queries, responses and reported FlashData Credits. Cited URLs must match recorded results; this does not verify factual support.

## Setup

Install `n8n-nodes-flashdata` 0.2.1 or later, import the workflow, and select FlashData API and chat-model credentials. Edit **Configure task**, execute, and download both outputs. Adjust the question, language and search settings for your project.

## Requirements and limits

The template is free; searches and model calls are billed separately. Google Search returns snippets, not full documentation. Review cited pages before implementation. Missing evidence remains an open question; the workflow does not build or test the integration. Iteration limits are not a hard spending cap.

[Setup guide](https://github.com/rocosen/n8n-nodes-flashdata/blob/main/workflows/capabilities/google_search.md) · [Synthetic output example](https://github.com/rocosen/n8n-nodes-flashdata/tree/main/workflows/capabilities/examples/google_search) · [Google Search API](https://flashdata.dev/docs/sources/google_search)
