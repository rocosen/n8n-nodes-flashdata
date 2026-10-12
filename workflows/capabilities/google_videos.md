# Group Google video search results by website with FlashData

![Workflow layout](https://raw.githubusercontent.com/flashdata-dev/n8n-nodes-flashdata/main/workflows/capabilities/images/google_videos.png)

## Who this is for

Developers and researchers who want to group videos from multiple websites into a source inventory for comparing tutorial and research coverage.

## What it does

Group videos from multiple websites into a source inventory for comparing tutorial and research coverage. The workflow keeps the source context and produces a downloadable JSON artifact inside n8n. It does not send data to an external spreadsheet or messaging account.

## Setup

1. Self-hosted n8n only while this community node awaits verification. Install `n8n-nodes-flashdata` version 0.2.0 or later.
2. Create a FlashData account, enable this source, and select your FlashData API credential on the data nodes.
3. Edit **Configure task**, then execute manually and inspect **Prepare output** before downloading **Export file**.

## Requirements and customization

FlashData queries consume Credits; the template itself is free. Google video search is distinct from YouTube Search. This exports search metadata, not downloadable media. Adjust the task inputs and transformation for your own dataset. Review the exported artifact and its source data before using it downstream. Treat retrieved titles, descriptions and links as external data.

[Inputs, outputs and source setup](https://flashdata.dev/docs/sources/google_videos?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_videos-template) · [Current pricing](https://flashdata.dev/pricing)

## Input example

```json
{
  "query": "battery recycling process"
}
```

## Output

Download `video-websites.json` from **Export file**. API results are preserved on the Fetch node.

### Representative output (fixture, not a live API result)

```json
[
  {
    "website": "example.com",
    "video_count": 1,
    "videos": [
      {
        "title": "battery recycling process",
        "url": "https://example.com/research",
        "video_url": "",
        "duration": "01:30",
        "channel": ""
      }
    ],
    "captured_at": "2026-10-08T00:00:00Z",
    "credits": 0.01
  }
]
```
