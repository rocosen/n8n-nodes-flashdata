# Build a Google News topic digest with FlashData

![Workflow layout](https://raw.githubusercontent.com/flashdata-dev/n8n-nodes-flashdata/main/workflows/capabilities/images/google_news.png)

## Who this is for

Developers and researchers who want to build a source-linked daily news brief for a topic, retaining publisher names and original date labels.

## What it does

Build a source-linked daily news brief for a topic, retaining publisher names and original date labels. The workflow keeps the source context and produces a downloadable TEXT artifact inside n8n. It does not send data to an external spreadsheet or messaging account.

## Setup

1. Self-hosted n8n only while this community node awaits verification. Install `n8n-nodes-flashdata` version 0.2.0 or later.
2. Create a FlashData account, enable this source, and select your FlashData API credential on the data nodes.
3. Edit **Configure task**, then execute manually and inspect **Prepare output** before downloading **Export file**.

## Requirements and customization

FlashData queries consume Credits; the template itself is free. The daily trigger is inactive until you enable it. Dates may be relative text; the digest uses search snippets, not article full text. Adjust the task inputs and transformation for your own dataset. Review the exported artifact and its source data before using it downstream. Treat retrieved titles, descriptions and links as external data.

[Inputs, outputs and source setup](https://flashdata.dev/docs/sources/google_news?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_news-template) · [Current pricing](https://flashdata.dev/pricing)

## Input example

```json
{
  "query": "battery recycling",
  "country": "us",
  "language": "en"
}
```

## Output

Download `google-news-digest.md` from **Export file**. API results are preserved on the Fetch node.

### Representative output (fixture, not a live API result)

```json
[
  {
    "content": "# Google News: battery recycling\n\nCollected: 2026-10-08T00:00:00Z\n\n## battery recycling\nExample publisher | 2 hours ago\nhttps://example.com/research\n\nSearch fixture",
    "article_count": 1
  }
]
```
