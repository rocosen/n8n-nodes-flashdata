# Map channels in extended YouTube search results with FlashData

![Workflow layout](https://raw.githubusercontent.com/rocosen/n8n-nodes-flashdata/main/workflows/capabilities/images/youtube_search_extended.png)

## Who this is for

Developers and researchers who want to collect a larger video sample, remove duplicate video IDs, and rank channels by their representation in the returned sample.

## What it does

Collect a larger video sample, remove duplicate video IDs, and rank channels by their representation in the returned sample. The workflow keeps the source context and produces a downloadable JSON artifact inside n8n. It does not send data to an external spreadsheet or messaging account.

## Setup

1. Self-hosted n8n only while this community node awaits verification. Install `n8n-nodes-flashdata` version 0.2.0 or later.
2. Create a FlashData account, enable this source, and select your FlashData API credential on the data nodes.
3. Edit **Configure task**, then execute manually and inspect **Prepare output** before downloading **Export file**.

## Requirements and customization

FlashData queries consume Credits; the template itself is free. This is the separate extended-search source and rate, with 1–700 requested results. It does not measure total channel market share. Adjust the task inputs and transformation for your own dataset. Review the exported artifact and its source data before using it downstream. Treat retrieved titles, descriptions and links as external data.

[Inputs, outputs and source setup](https://flashdata.dev/docs/sources/youtube_search_extended?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_search_extended-template) · [Current pricing](https://flashdata.dev/pricing)

## Input example

```json
{
  "query": "battery recycling",
  "maximum_results": 100
}
```

## Output

Download `youtube-channel-map.json` from **Export file**. API results are preserved on the Fetch node.

### Representative output (fixture, not a live API result)

```json
[
  {
    "channel_id": "channel-one",
    "channel": "Example",
    "channel_url": "https://www.youtube.com/@Example",
    "video_ids": [
      "dQw4w9WgXcQ",
      "aqz-KE-bpKQ"
    ],
    "video_count": 2,
    "captured_at": "2026-10-08T00:00:00Z",
    "credits": 0.01
  }
]
```
