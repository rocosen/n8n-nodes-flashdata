# Find Google Search ranking gaps against competitors with FlashData

![Workflow layout](https://raw.githubusercontent.com/rocosen/n8n-nodes-flashdata/main/workflows/capabilities/images/google_search.png)

## Who this is for
SEO practitioners and founders deciding which keyword/page pairs to investigate next.

## What it does
Search your keyword list, match your website and up to five competitors, and highlight searches where a competitor appears while your site is missing or behind. Download a review queue as CSV and an evidence report as JSON, including competing URLs, each tracked domain's position, source snippets, search settings, collection time and usage. First-page organic results only; no historical database is required.

## Setup
1. Use self-hosted n8n and install `n8n-nodes-flashdata` 0.2.1 or later. The node is awaiting verification.
2. [Create a FlashData account](https://flashdata.dev/), enable Google Search and create an API Key. Select your FlashData API credential on **Fetch google search**.
3. Edit **Configure task**: 1–20 keywords, your bare domain, 1–5 competitor domains, country, language and requested result count. Replace the example domains before running.
4. Run manually. Inspect **Build ranking audit**, then download **Export file** and **Export evidence report**. Open the linked pages before making SEO changes.

## Cost and limits
The template is free; FlashData API queries consume paid Credits. Each unique keyword makes one paid request; the example makes two. No automatic pagination or retries. Returned counts can differ from requested counts. Missing domains mean only “not found in this result set”. This does not measure search volume, inspect page content, prove deindexing or explain ranking causes.

[Google Search setup and API contract](https://flashdata.dev/docs/sources/google_search?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_search-template) · [Current pricing](https://flashdata.dev/pricing)

## Input example

```json
{
  "keywords": [
    "battery recycling services",
    "lithium battery recycling"
  ],
  "target_domain": "example.com",
  "competitor_domains": [
    "example.org",
    "example.net"
  ],
  "country": "us",
  "language": "en",
  "result_count": 10
}
```

Use business-relevant queries that people would search, not only your brand name. Set one country/language for the entire run; the workflow requests page 1 with autocorrect disabled. Domain matching accepts the exact domain and its subdomains, strips `www.`, and rejects overlapping tracked domains. It does not discover your competitors automatically.

## Download and act on the results

- **google-search-review-queue.csv:** one row per unique keyword. Review `competitor_visible_target_not_found` first, then `competitor_ahead`. This ordering is a review convention, not predicted commercial value. Follow `best_competitor_url` and compare the actual page with `target_url` or your intended landing page. Decide whether an existing page needs improvement or further research is necessary.
- **google-search-evidence.json:** a one-element report array with all keyword audits, per-domain positions, source titles/snippets/URLs, returned search parameters and per-query Credits. Other ranking websites are retained so you can reassess the competitor list. Usage is counted once per request, not once per result row.

`position_gap = target_position - best_competitor_position`; a positive value means the target is behind. Missing positions stay null. No organic results still produce an audit row. Malformed envelopes fail explicitly; missing positions on tracked results or invalid URLs produce `incomplete_result_fields`, not a fabricated opportunity. Exact duplicate URLs ignoring fragments are merged using their best known position.

### Example findings (synthetic fixtures, not live rankings)

| Keyword | Target | Best competitor | Finding |
| --- | --- | --- | --- |
| battery recycling services | example.com: 6 | example.org: 2 | competitor_ahead; position gap 4 |
| lithium battery recycling | not found in returned results | example.org: 3 | competitor_visible_target_not_found |

`target_leads_tracked_competitors` means only that none of the selected competitors has a better observed position. `no_tracked_domains_found` calls for checking the query and competitor selection. Google positions vary; this is one snapshot. Collection time is not page publication time. The workflow does not fetch full pages, estimate demand or compare past runs.

CSV text is escaped to prevent spreadsheet formulas; original source text remains in the JSON report. Treat snippets and links as external data. Only FlashData credentials are required; outputs are downloaded from n8n. No external spreadsheet, model or storage account is configured.

## Validation

Tested in n8n 2.42.5 using synthetic API responses, including missing results, domain lookalikes, duplicate URLs and multiple input keywords. This validates workflow behavior, not live search completeness or SEO outcomes.
