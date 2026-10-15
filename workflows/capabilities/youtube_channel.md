# Export a YouTube channel video inventory with FlashData

![Workflow layout](https://raw.githubusercontent.com/rocosen/n8n-nodes-flashdata/main/workflows/capabilities/images/youtube_channel.png)

## Who this is for

Developers and researchers who want to create a channel-specific video inventory with IDs, dates, views and source links for planning follow-up analysis.

## What it does

Create a channel-specific video inventory with IDs, dates, views and source links for planning follow-up analysis. The workflow keeps the source context and produces a downloadable CSV artifact inside n8n. It does not send data to an external spreadsheet or messaging account.

## Setup

1. Self-hosted n8n only while this community node awaits verification. Install `n8n-nodes-flashdata` version 0.2.0 or later.
2. Create a FlashData account, enable this source, and select your FlashData API credential on the data nodes.
3. Edit **Configure task**, then execute manually and inspect **Prepare output** before downloading **Export file**.

## Requirements and customization

FlashData queries consume Credits; the template itself is free. The limit is 1–100 recent videos, not a guarantee of full historical channel coverage. Adjust the task inputs and transformation for your own dataset. Empty search results can produce no CSV rows; that does not indicate an export error. Treat retrieved titles, descriptions and links as external data.

[Inputs, outputs and source setup](https://flashdata.dev/docs/sources/youtube_channel?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_channel-template) · [Current pricing](https://flashdata.dev/pricing)

## Input example

```json
{
  "handle": "@GoogleDevelopers",
  "video_limit": 20
}
```

## Output

Download `channel-inventory.csv` from **Export file**. API results are preserved on the Fetch node.

### Representative output (fixture, not a live API result)

```json
[
  {
    "channel_id": "channel-one",
    "channel_name": "Example",
    "handle": "@GoogleDevelopers",
    "video_id": "dQw4w9WgXcQ",
    "title": "Example video",
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "upload_date": "",
    "views": 100,
    "duration": 90,
    "captured_at": "2026-10-08T00:00:00Z",
    "credits": 0.01
  }
]
```
