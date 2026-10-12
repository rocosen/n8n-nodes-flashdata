# Build a YouTube autocomplete keyword sheet with FlashData

![Workflow layout](https://raw.githubusercontent.com/flashdata-dev/n8n-nodes-flashdata/main/workflows/capabilities/images/youtube_suggestions.png)

## Who this is for

Developers and researchers who want to turn YouTube autocomplete phrases into a deduplicated keyword research sheet for choosing follow-up searches.

## What it does

Turn YouTube autocomplete phrases into a deduplicated keyword research sheet for choosing follow-up searches. The workflow keeps the source context and produces a downloadable CSV artifact inside n8n. It does not send data to an external spreadsheet or messaging account.

## Setup

1. Self-hosted n8n only while this community node awaits verification. Install `n8n-nodes-flashdata` version 0.2.0 or later.
2. Create a FlashData account, enable this source, and select your FlashData API credential on the data nodes.
3. Edit **Configure task**, then execute manually and inspect **Prepare output** before downloading **Export file**.

## Requirements and customization

FlashData queries consume Credits; the template itself is free. Suggestions are phrases, not video results, ranking guarantees, or search-volume estimates. Adjust the task inputs and transformation for your own dataset. Empty search results can produce no CSV rows; that does not indicate an export error. Treat retrieved titles, descriptions and links as external data.

[Inputs, outputs and source setup](https://flashdata.dev/docs/sources/youtube_suggestions?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_suggestions-template) · [Current pricing](https://flashdata.dev/pricing)

## Input example

```json
{
  "query": "how to recycle",
  "language": "en",
  "region": "US"
}
```

## Output

Download `youtube-suggestions.csv` from **Export file**. API results are preserved on the Fetch node.

### Representative output (fixture, not a live API result)

```json
[
  {
    "prefix": "how to recycle",
    "suggestion": "how to recycle at home",
    "order": 1,
    "language": "en",
    "region": "US",
    "word_count": 5,
    "captured_at": "2026-10-08T00:00:00Z",
    "credits": 0.01
  }
]
```
