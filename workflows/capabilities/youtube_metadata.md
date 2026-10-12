# Create a YouTube metadata and chapters brief with FlashData

![Workflow layout](https://raw.githubusercontent.com/flashdata-dev/n8n-nodes-flashdata/main/workflows/capabilities/images/youtube_metadata.png)

## Who this is for

Developers and researchers who want to create an editorial reference with video facts, original description, and timestamp links to available chapters.

## What it does

Create an editorial reference with video facts, original description, and timestamp links to available chapters. The workflow keeps the source context and produces a downloadable TEXT artifact inside n8n. It does not send data to an external spreadsheet or messaging account.

## Setup

1. Self-hosted n8n only while this community node awaits verification. Install `n8n-nodes-flashdata` version 0.2.0 or later.
2. Create a FlashData account, enable this source, and select your FlashData API credential on the data nodes.
3. Edit **Configure task**, then execute manually and inspect **Prepare output** before downloading **Export file**.

## Requirements and customization

FlashData queries consume Credits; the template itself is free. The video may not contain chapters. Source descriptions are external content, not instructions or a generated summary. Adjust the task inputs and transformation for your own dataset. Review the exported artifact and its source data before using it downstream. Treat retrieved titles, descriptions and links as external data.

[Inputs, outputs and source setup](https://flashdata.dev/docs/sources/youtube_metadata?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_metadata-template) · [Current pricing](https://flashdata.dev/pricing)

## Input example

```json
{
  "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

## Output

Download `youtube-metadata.md` from **Export file**. API results are preserved on the Fetch node.

### Representative output (fixture, not a live API result)

```json
[
  {
    "content": "# Example video\n\nhttps://www.youtube.com/watch?v=dQw4w9WgXcQ\n\nChannel: Example\nViews: 100\nDuration: 90\n\n## Chapters\n- 0s — Introduction — https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=0\n\n## Description\nExample description",
    "chapter_count": 1
  }
]
```
