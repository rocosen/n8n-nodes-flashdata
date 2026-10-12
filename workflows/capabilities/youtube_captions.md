# Export YouTube uploader captions to SRT with FlashData

![Workflow layout](https://raw.githubusercontent.com/flashdata-dev/n8n-nodes-flashdata/main/workflows/capabilities/images/youtube_captions.png)

## Who this is for

Developers and researchers who want to convert existing timestamped subtitle segments into a portable SRT subtitle file for your research or editing pipeline.

## What it does

Convert existing timestamped subtitle segments into a portable SRT subtitle file for your research or editing pipeline. The workflow keeps the source context and produces a downloadable TEXT artifact inside n8n. It does not send data to an external spreadsheet or messaging account.

## Setup

1. Self-hosted n8n only while this community node awaits verification. Install `n8n-nodes-flashdata` version 0.2.0 or later.
2. Create a FlashData account, enable this source, and select your FlashData API credential on the data nodes.
3. Edit **Configure task**, then execute manually and inspect **Prepare output** before downloading **Export file**.

## Requirements and customization

FlashData queries consume Credits; the template itself is free. Select a language actually available on the video. Uploader captions are selected by default. No ASR, translation, or fallback to another track occurs. Adjust the task inputs and transformation for your own dataset. An empty matching track stops before export; choose an available track. Treat retrieved titles, descriptions and links as external data.

[Inputs, outputs and source setup](https://flashdata.dev/docs/sources/youtube_captions?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_captions-template) · [Current pricing](https://flashdata.dev/pricing)

## Input example

```json
{
  "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "language": "en"
}
```

## Output

Download `youtube-subtitles.srt` from **Export file**. API results are preserved on the Fetch node.

### Representative output (fixture, not a live API result)

```json
[
  {
    "content": "1\n00:00:00,000 --> 00:00:03,000\nUploader captions.\n",
    "segment_count": 1
  }
]
```
