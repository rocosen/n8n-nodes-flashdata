# Shortlist Google Places businesses by rating with FlashData

![Workflow layout](https://raw.githubusercontent.com/flashdata-dev/n8n-nodes-flashdata/main/workflows/capabilities/images/google_places.png)

## Who this is for

Developers and researchers who want to build a local business shortlist with explicit rating and review-count thresholds, ready for manual review.

## What it does

Build a local business shortlist with explicit rating and review-count thresholds, ready for manual review. The workflow keeps the source context and produces a downloadable CSV artifact inside n8n. It does not send data to an external spreadsheet or messaging account.

## Setup

1. Self-hosted n8n only while this community node awaits verification. Install `n8n-nodes-flashdata` version 0.2.0 or later.
2. Create a FlashData account, enable this source, and select your FlashData API credential on the data nodes.
3. Edit **Configure task**, then execute manually and inspect **Prepare output** before downloading **Export file**.

## Requirements and customization

FlashData queries consume Credits; the template itself is free. Ratings and contact fields can be absent. No outreach is sent; qualifying rows only are exported. Adjust the task inputs and transformation for your own dataset. Empty search results can produce no CSV rows; that does not indicate an export error. Treat retrieved titles, descriptions and links as external data.

[Inputs, outputs and source setup](https://flashdata.dev/docs/sources/google_places?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_places-template) · [Current pricing](https://flashdata.dev/pricing)

## Input example

```json
{
  "query": "coffee shops in Singapore",
  "minimum_rating": 4.2,
  "minimum_reviews": 20
}
```

## Output

Download `business-shortlist.csv` from **Export file**. API results are preserved on the Fetch node.

### Representative output (fixture, not a live API result)

```json
[
  {
    "name": "Example cafe",
    "address": "Example street",
    "rating": 4.8,
    "reviews": 200,
    "category": "Cafe",
    "phone": "",
    "website": "",
    "latitude": null,
    "longitude": null,
    "captured_at": "2026-10-08T00:00:00Z",
    "credits": 0.01
  }
]
```
