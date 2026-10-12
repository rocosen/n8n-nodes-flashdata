# Compare Google Shopping price snapshots with FlashData

![Workflow layout](https://raw.githubusercontent.com/flashdata-dev/n8n-nodes-flashdata/main/workflows/capabilities/images/google_shopping.png)

## Who this is for

Developers and researchers who want to compare current shopping results against a supplied previous snapshot and flag new or changed price labels.

## What it does

Compare current shopping results against a supplied previous snapshot and flag new or changed price labels. The workflow keeps the source context and produces a downloadable CSV artifact inside n8n. It does not send data to an external spreadsheet or messaging account.

## Setup

1. Self-hosted n8n only while this community node awaits verification. Install `n8n-nodes-flashdata` version 0.2.0 or later.
2. Create a FlashData account, enable this source, and select your FlashData API credential on the data nodes.
3. Edit **Configure task**, then execute manually and inspect **Prepare output** before downloading **Export file**.

## Requirements and customization

FlashData queries consume Credits; the template itself is free. Set previous_prices to rows containing product_id (or url) and price. Prices remain currency-formatted strings; this does not compute exchange rates or numeric discounts. Adjust the task inputs and transformation for your own dataset. Empty search results can produce no CSV rows; that does not indicate an export error. Treat retrieved titles, descriptions and links as external data.

[Inputs, outputs and source setup](https://flashdata.dev/docs/sources/google_shopping?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_shopping-template) · [Current pricing](https://flashdata.dev/pricing)

## Input example

```json
{
  "query": "wireless headphones",
  "previous_prices": []
}
```

## Output

Download `shopping-comparison.csv` from **Export file**. API results are preserved on the Fetch node.

### Representative output (fixture, not a live API result)

```json
[
  {
    "product_id": "product-1",
    "title": "wireless headphones",
    "merchant": "Example merchant",
    "url": "https://example.com/research",
    "price": "$49.00",
    "previous_price": "",
    "change": "new",
    "captured_at": "2026-10-08T00:00:00Z",
    "credits": 0.01
  }
]
```
