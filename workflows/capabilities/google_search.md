# Build an API integration brief with an AI Agent and FlashData Google Search

Before building an integration, developers often need to piece together authentication requirements, webhook events, setup steps and service limits across several documentation pages. This workflow turns that question into a cited research brief and a record of the searches behind it.

![Workflow layout](https://raw.githubusercontent.com/rocosen/n8n-nodes-flashdata/main/workflows/capabilities/images/google_search_agent.png)

[Download the workflow JSON](https://raw.githubusercontent.com/rocosen/n8n-nodes-flashdata/main/workflows/capabilities/google_search.json)

**Self-hosted n8n only.** [Inspect a complete synthetic output example](examples/google_search/README.md): the rendered brief and companion evidence JSON show the result format without requiring credentials or paid calls. It is a scripted demonstration, not live GitHub research or a real-model quality result.

## Who this is for

Developers and automation builders planning an API integration who want a useful starting point before opening the full documentation and writing code.

For example: **“How can I receive GitHub repository events in self-hosted n8n, and what authentication, webhook verification and delivery limits should I check?”** You can instead research a payment webhook, a CRM integration or a service's API migration. Supply your actual constraints so the Agent knows what matters.

## What the Agent does

1. Reads your question, project context and preferred sources.
2. Chooses its own Google queries through the **Search Google with FlashData** tool. It can refine a query or investigate a missing detail after seeing the results.
3. Returns a structured report with question-specific findings, evidence assessments, source URLs, recommended next actions, verification steps and open questions.
4. Matches each cited URL to recorded successful search results and attaches the original returned snippets. It renders a Markdown evidence table and source excerpts, followed by an open-question checklist.
5. Exports the brief and a companion JSON file preserving the structured findings, matched source IDs, each query, original API response, collection time and reported Credits.

FlashData supplies structured Google Search results to the Agent. The model chooses research dimensions and assesses the snippets; the workflow checks structure and source matching. Each finding is labeled `supported`, `partial`, `not_established` or `conflicting` **by the Agent**. Those labels are judgments, not automatic fact verification. This is a research step before implementation, not an automatic integration builder.

## Setup and run

1. Use self-hosted n8n and install `n8n-nodes-flashdata` **0.2.1 or later** in **Settings → Community nodes**. Node verification is pending; n8n Cloud availability is not confirmed. This workflow targets n8n **2.42.5**.
2. [Create a FlashData account](https://flashdata.dev/?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_search-account), enable **Google Search**, add sufficient Credits and create an API Key. Read the [Google Search setup and API contract](https://flashdata.dev/docs/sources/google_search?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_search-template).
3. Import the JSON. On **Search Google with FlashData**, select a **FlashData API** credential containing your key. Keep credentials in n8n's credential store.
4. On **Chat model**, select your OpenAI credential and a tool-calling model available to your account. The included `gpt-4.1-mini` is an editable example. You may replace the model node with another compatible provider; recheck its options and tool-calling behavior. Keep built-in web-search tools off if you want the attached FlashData tool to be the only search provider.
5. Edit **Configure task** using the fields below. Keep the Agent's **Return Intermediate Steps** enabled so the exports can retain tool evidence. The **Query** field on FlashData uses `$fromAI('query', ...)`; country, language, page and result count stay under your control.
6. Click **Execute workflow**. Inspect **Research agent** and **Prepare output**, then download **Export file** and **Export evidence report**. The workflow is inactive and has no schedule or external storage destination.
7. Open the cited documentation and resolve the listed gaps before implementing. The workflow does not configure GitHub, create webhooks or write to another service.

## Example input

```json
{
  "question": "How can I receive GitHub repository events in self-hosted n8n, and what authentication, webhook verification and delivery limits should I check before implementation?",
  "context": "Prepare an implementation brief for a developer. We need a testable plan, links to the official documentation and a clear list of facts that still need verification.",
  "preferred_sources": "Official n8n documentation and GitHub documentation; use other sources only when useful and label them.",
  "output_language": "English",
  "country": "us",
  "search_language": "en",
  "results_per_search": 5
}
```

`output_language` controls the brief language; `search_language` is Google's `hl` setting. For a Chinese brief, set `output_language` to `简体中文`. `preferred_sources` guides the Agent's judgment; it is not a strict domain allowlist. The workflow requests page 1 with autocorrect disabled and 1–10 results per search. Returned counts may differ. It does not fetch subsequent pages automatically.

## Outputs you can use

| File | Contents | What to do with it |
| --- | --- | --- |
| `integration-research-brief.md` | A table of findings, Agent assessments, source IDs, next actions and verification steps; original source excerpts, open questions and search execution record | Review each requirement and turn its next action into an implementation or investigation task |
| `integration-research-evidence.json` | A one-element report array containing structured findings, source IDs/URLs, original task, search queries/responses, counts and API Credits | Trace each source ID to a search/result and inspect the original snippet and response |

The report uses `report_schema_version: "2"`. Source IDs such as `S2R1` mean search 2, result 1. If the same URL appears in two searches, both occurrences and snippets remain available. A cited URL absent from successful results stops the export; a finding labeled supported/partial/conflicting must have at least one recorded snippet. These checks prevent missing or invented citations from looking complete, but they do not establish relevance, truth or whether a snippet actually supports the finding. Missing evidence must stay explicit. The report framing is English; the Agent's findings and actions use your requested `output_language`.

Each search is marked `results_returned`, `no_results`, or `tool_error_or_incomplete_response`. These describe the observed tool response, not a model judgment of source quality. Missing usage remains unknown. If the Agent produces an answer without searching, the export explicitly says that no web evidence was recorded. Malformed evidence, invalid report JSON, unknown source URLs or missing Agent output stops the export instead of inventing a completed report. Inspect the saved execution first: rerunning the whole workflow may repeat paid searches. There is no automatic repair-model call or retry.

A brief can legitimately conclude that the returned snippets do not establish the required permission, event name or limit. In that case, the valuable output is a list of documentation pages and concrete checks for the developer. The workflow does not automatically verify that citations support every model claim.

## Costs, data and limits

- **The template is free; FlashData API queries and model calls are billed separately.** See [FlashData pricing](https://flashdata.dev/pricing) and your model provider's rates. There is no fixed cost per question because the Agent chooses its searches and model token usage varies.
- The prompt asks for one to three focused searches. The Agent has a **four-iteration limit**, and the included model disables parallel tool calls. Iterations and prompt instructions are **not a hard API-spend budget**. The JSON reports observed FlashData Credits; it does not include model charges.
- FlashData receives the generated search queries. The model provider receives your research question, context and search results. Avoid putting credentials or private customer data into these fields. n8n may retain execution data according to your settings.
- Google Search provides titles, links, snippets and positions. **This workflow does not fetch full pages**, guarantee up-to-date facts or test an integration. `created_at` is collection time, not page publication time. Ranking position is not evidence of correctness.
- The prompt treats search content as untrusted evidence and asks the Agent to ignore instructions embedded in it. This reduces risk; it does not guarantee resistance to prompt injection or eliminate hallucinations. Review the brief before relying on it.
- There is no automatic pagination, FlashData node retry, model retry or external write. A model/tool error or iteration-limit failure can end the run before files are exported. Inspect execution history, API usage and job history before rerunning; earlier calls may already have been billed. Tool errors surfaced to the Agent must be reported as gaps rather than retried blindly.

## Validation and availability

The automated checks use synthetic search responses and a scripted local model with external networking disabled. They exercise the real n8n Agent → FlashData tool → follow-up search → file export path, including evidence matching, rendering and preservation. Additional checks reject unrecorded citations, missing snippets and malformed reports; preserve repeated-URL evidence; and escape external text in Markdown. They validate wiring and error handling, not real-model research quality or live search completeness. You need your own credentials to assess a real question.

The [synthetic example](examples/google_search/README.md) is generated using the same exported `Prepare output` code and shared test fixtures. Its URLs, excerpts, timestamps and usage are illustrative. They are not a live SERP, a price quote or technical guidance for a real provider. The [short listing description](google_search.listing.md) also appears in the workflow's main sticky note.

The current JSON and guide are repository examples. They are not a public n8n template-library listing. Download the current JSON from this page: the already-published npm **0.2.1** contains an earlier template, although its FlashData node supports this workflow.
