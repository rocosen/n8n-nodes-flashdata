# Inspect YouTube Creative Commons license labels with FlashData

![Workflow layout](https://raw.githubusercontent.com/rocosen/n8n-nodes-flashdata/main/workflows/capabilities/images/youtube_trainability.png)

## Who this is for

Developers and researchers who want to record the source API’s trainability field as a Creative Commons license-label observation with an explicit interpretation.

## What it does

Record the source API’s trainability field as a Creative Commons license-label observation with an explicit interpretation. The workflow keeps the source context and produces a downloadable CSV artifact inside n8n. It does not send data to an external spreadsheet or messaging account.

## Setup

1. Self-hosted n8n only while this community node awaits verification. Install `n8n-nodes-flashdata` version 0.2.0 or later.
2. Create a FlashData account, enable this source, and select your FlashData API credential on the data nodes.
3. Edit **Configure task**, then execute manually and inspect **Prepare output** before downloading **Export file**.

## Requirements and customization

FlashData queries consume Credits; the template itself is free. permitted=[all] means a Creative Commons label was detected; none can also mean missing metadata. This does not inspect creator third-party training settings or grant legal permission. Adjust the task inputs and transformation for your own dataset. Empty search results can produce no CSV rows; that does not indicate an export error. Treat retrieved titles, descriptions and links as external data.

[Inputs, outputs and source setup](https://flashdata.dev/docs/sources/youtube_trainability?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_trainability-template) · [Current pricing](https://flashdata.dev/pricing)

## Input example

```json
{
  "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

## Output

Download `license-labels.csv` from **Export file**. API results are preserved on the Fetch node.

### Representative output (fixture, not a live API result)

```json
[
  {
    "video_id": "dQw4w9WgXcQ",
    "creative_commons_label": true,
    "raw_permitted": "[\"all\"]",
    "interpretation": "License metadata classification only; not a grant of training permission",
    "captured_at": "2026-10-08T00:00:00Z",
    "credits": 0.01
  }
]
```
