# Deliver a YouTube clip to S3 or cloud storage with FlashData

![Workflow layout](https://raw.githubusercontent.com/flashdata-dev/n8n-nodes-flashdata/main/workflows/capabilities/images/youtube_download.png)

## Who this is for

Developers and researchers who want to submit one short video clip to customer storage, poll only the existing job, and export its completed delivery manifest.

## What it does

Submit one short video clip to customer storage, poll only the existing job, and export its completed delivery manifest. The workflow keeps the source context and produces a downloadable JSON artifact inside n8n. It does not send data to an external spreadsheet or messaging account.

## Setup

1. Self-hosted n8n only while this community node awaits verification. Install `n8n-nodes-flashdata` version 0.2.0 or later.
2. Create a FlashData account, enable this source, and select your FlashData API credential on the data nodes.
3. Edit **Configure task**, then execute manually and inspect **Prepare output** before downloading **Export file**.

## Requirements and customization

FlashData queries consume Credits; the template itself is free. Requires your own bucket/container and scoped write credentials in Download Storage JSON. Files stay private according to your storage policy. Billing is by delivered bytes; a job submission is not a completed upload. Adjust the task inputs and transformation for your own dataset. Review the exported artifact and its source data before using it downstream. Treat retrieved titles, descriptions and links as external data.

[Inputs, outputs and source setup](https://flashdata.dev/docs/sources/youtube_download?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_download-template) · [Current pricing](https://flashdata.dev/pricing)

## Input example

```json
{
  "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "start_at": "00:00:00",
  "end_at": "00:00:10",
  "maximum_polls": 12
}
```

## Output

Download `download-manifest.json` from **Export file**. API results are preserved on the Fetch node.

### Representative output (fixture, not a live API result)

```json
[
  {
    "job_id": "job_fixture",
    "file_url": "s3://customer-bucket/clip.mp4",
    "file_size": 2048,
    "downloaded_bytes": 2048,
    "md5": "fixture-checksum",
    "output_format": "mp4",
    "credits": 0.001
  }
]
```
