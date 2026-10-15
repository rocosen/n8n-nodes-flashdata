# Filter Google Images by dimensions and export source URLs with FlashData

![Workflow layout](https://raw.githubusercontent.com/rocosen/n8n-nodes-flashdata/main/workflows/capabilities/images/google_images.png)

## Who this is for

Developers and researchers who want to create a deduplicated image research sheet that meets your minimum width and retains original source pages.

## What it does

Create a deduplicated image research sheet that meets your minimum width and retains original source pages. The workflow keeps the source context and produces a downloadable CSV artifact inside n8n. It does not send data to an external spreadsheet or messaging account.

## Setup

1. Self-hosted n8n only while this community node awaits verification. Install `n8n-nodes-flashdata` version 0.2.0 or later.
2. Create a FlashData account, enable this source, and select your FlashData API credential on the data nodes.
3. Edit **Configure task**, then execute manually and inspect **Prepare output** before downloading **Export file**.

## Requirements and customization

FlashData queries consume Credits; the template itself is free. Rows without known dimensions are excluded. URLs and metadata do not grant image reuse rights; no image files are downloaded. Adjust the task inputs and transformation for your own dataset. Empty search results can produce no CSV rows; that does not indicate an export error. Treat retrieved titles, descriptions and links as external data.

[Inputs, outputs and source setup](https://flashdata.dev/docs/sources/google_images?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_images-template) · [Current pricing](https://flashdata.dev/pricing)

## Input example

```json
{
  "query": "solar panel diagram",
  "minimum_width": 800
}
```

## Output

Download `image-sources.csv` from **Export file**. API results are preserved on the Fetch node.

### Representative output (fixture, not a live API result)

```json
[
  {
    "title": "solar panel diagram",
    "image_url": "https://example.com/image.png",
    "source_url": "https://example.com/research",
    "source": "Example",
    "width": 1200,
    "height": 800,
    "captured_at": "2026-10-08T00:00:00Z",
    "credits": 0.01
  }
]
```
