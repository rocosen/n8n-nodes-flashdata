# Export Google Search SERP rankings to CSV with FlashData

![Workflow layout](https://raw.githubusercontent.com/flashdata-dev/n8n-nodes-flashdata/main/workflows/capabilities/images/google_search.png)

## Who this is for

Developers and researchers who want to export ranked Google web search results with source URLs, snippets, and collection time for an auditable research dataset.

## What it does

Export ranked Google web search results with source URLs, snippets, and collection time for an auditable research dataset. The workflow keeps the source context and produces a downloadable CSV artifact inside n8n. It does not send data to an external spreadsheet or messaging account.

## Setup

1. Self-hosted n8n only while this community node awaits verification. Install `n8n-nodes-flashdata` version 0.2.0 or later.
2. Create a FlashData account, enable this source, and select your FlashData API credential on the data nodes.
3. Edit **Configure task**, then execute manually and inspect **Prepare output** before downloading **Export file**.

## Requirements and customization

FlashData queries consume Credits; the template itself is free. One page per run; ranking varies by query and location. This does not fetch article full text. Adjust the task inputs and transformation for your own dataset. Empty search results can produce no CSV rows; that does not indicate an export error. Treat retrieved titles, descriptions and links as external data.

[Inputs, outputs and source setup](https://flashdata.dev/docs/sources/google_search?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_search-template) · [Current pricing](https://flashdata.dev/pricing)

## Input example

```json
{
  "query": "battery recycling research",
  "country": "us",
  "language": "en",
  "result_count": 10
}
```

## Output

Download `google-serp.csv` from **Export file**. API results are preserved on the Fetch node.

### Representative output (fixture, not a live API result)

```json
[
  {
    "query": "battery recycling research",
    "position": 1,
    "title": "battery recycling research",
    "url": "https://example.com/research",
    "snippet": "Search fixture",
    "captured_at": "2026-10-08T00:00:00Z",
    "credits": 0.01
  }
]
```
