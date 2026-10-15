# Google and YouTube data for n8n — FlashData

Search Google, monitor news, collect image and shopping results, find local businesses, retrieve YouTube transcripts and captions, inspect video and channel data, and deliver video or audio to your cloud storage. One FlashData API credential connects all **15 sources** to n8n.

**n8n verification is pending.** Self-hosted users can install the community package; n8n Cloud/node-panel availability requires approval. The task workflows below are repository examples, not yet published template-library listings.

## Install and connect

1. In self-hosted n8n, open **Settings → Community nodes → Install** and enter `n8n-nodes-flashdata`.
2. Create a [FlashData account](https://flashdata.dev/?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=account-setup), enable the sources you need, and create an API key.
3. Create a **FlashData API** credential in n8n, paste the key, and test the connection. The test calls `GET https://api.flashdata.dev/v2/api-access` and does not consume query Credits.
4. Import a task workflow below, select your credential, edit **Configure task**, and run it manually. Every template starts inactive and includes setup notes.

## Choose your task

| Source / search intent | Task workflow and setup | API guide |
| --- | --- | --- |
| Google Search | [Export Google Search SERP rankings to CSV with FlashData](workflows/capabilities/google_search.md) · [Import JSON](workflows/capabilities/google_search.json) | [Inputs and output](https://flashdata.dev/docs/sources/google_search?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_search-readme) |
| Google News | [Build a Google News topic digest with FlashData](workflows/capabilities/google_news.md) · [Import JSON](workflows/capabilities/google_news.json) | [Inputs and output](https://flashdata.dev/docs/sources/google_news?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_news-readme) |
| Google Images | [Filter Google Images by dimensions and export source URLs with FlashData](workflows/capabilities/google_images.md) · [Import JSON](workflows/capabilities/google_images.json) | [Inputs and output](https://flashdata.dev/docs/sources/google_images?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_images-readme) |
| Google Shopping | [Compare Google Shopping price snapshots with FlashData](workflows/capabilities/google_shopping.md) · [Import JSON](workflows/capabilities/google_shopping.json) | [Inputs and output](https://flashdata.dev/docs/sources/google_shopping?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_shopping-readme) |
| Google Videos | [Group Google video search results by website with FlashData](workflows/capabilities/google_videos.md) · [Import JSON](workflows/capabilities/google_videos.json) | [Inputs and output](https://flashdata.dev/docs/sources/google_videos?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_videos-readme) |
| Google Places | [Shortlist Google Places businesses by rating with FlashData](workflows/capabilities/google_places.md) · [Import JSON](workflows/capabilities/google_places.json) | [Inputs and output](https://flashdata.dev/docs/sources/google_places?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=google_places-readme) |
| Youtube Search | [Export YouTube video search candidates with FlashData](workflows/capabilities/youtube_search.md) · [Import JSON](workflows/capabilities/youtube_search.json) | [Inputs and output](https://flashdata.dev/docs/sources/youtube_search?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_search-readme) |
| Youtube Search Extended | [Map channels in extended YouTube search results with FlashData](workflows/capabilities/youtube_search_extended.md) · [Import JSON](workflows/capabilities/youtube_search_extended.json) | [Inputs and output](https://flashdata.dev/docs/sources/youtube_search_extended?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_search_extended-readme) |
| Youtube Metadata | [Create a YouTube metadata and chapters brief with FlashData](workflows/capabilities/youtube_metadata.md) · [Import JSON](workflows/capabilities/youtube_metadata.json) | [Inputs and output](https://flashdata.dev/docs/sources/youtube_metadata?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_metadata-readme) |
| Youtube Transcript | [Export timestamped YouTube transcripts to WebVTT with FlashData](workflows/capabilities/youtube_transcript.md) · [Import JSON](workflows/capabilities/youtube_transcript.json) | [Inputs and output](https://flashdata.dev/docs/sources/youtube_transcript?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_transcript-readme) |
| Youtube Captions | [Export YouTube uploader captions to SRT with FlashData](workflows/capabilities/youtube_captions.md) · [Import JSON](workflows/capabilities/youtube_captions.json) | [Inputs and output](https://flashdata.dev/docs/sources/youtube_captions?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_captions-readme) |
| Youtube Trainability | [Inspect YouTube Creative Commons license labels with FlashData](workflows/capabilities/youtube_trainability.md) · [Import JSON](workflows/capabilities/youtube_trainability.json) | [Inputs and output](https://flashdata.dev/docs/sources/youtube_trainability?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_trainability-readme) |
| Youtube Channel | [Export a YouTube channel video inventory with FlashData](workflows/capabilities/youtube_channel.md) · [Import JSON](workflows/capabilities/youtube_channel.json) | [Inputs and output](https://flashdata.dev/docs/sources/youtube_channel?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_channel-readme) |
| Youtube Suggestions | [Build a YouTube autocomplete keyword sheet with FlashData](workflows/capabilities/youtube_suggestions.md) · [Import JSON](workflows/capabilities/youtube_suggestions.json) | [Inputs and output](https://flashdata.dev/docs/sources/youtube_suggestions?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_suggestions-readme) |
| Youtube Download | [Deliver a YouTube clip to S3 or cloud storage with FlashData](workflows/capabilities/youtube_download.md) · [Import JSON](workflows/capabilities/youtube_download.json) | [Inputs and output](https://flashdata.dev/docs/sources/youtube_download?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_download-readme) |

## Credentials and costs

The API key stays in n8n's encrypted credential store and is sent only to FlashData in `X-API-Key`. A successful connection test proves authentication, not access to every source. Queries consume your account's [Credits](https://flashdata.dev/pricing); this package and its templates add no fee. Google pages are separate paid queries. Extended YouTube search has a separate source/rate. Downloads reserve Credits and settle by actual delivered bytes.

For downloads, set **Download Storage JSON** in that same encrypted credential. Follow the [storage setup guide](workflows/capabilities/storage.md). Never put storage secrets in workflow parameters, Set nodes, descriptions, or shared JSON. You can keep a separate named FlashData credential for each destination.

## Inputs and behavior

- Six Google resources support query, country (`gl`), language (`hl`), location, result count (`num`, 1–100), page (1–100), time filter, and autocorrect. Optional values are sent only when selected; counts and fields can vary.
- YouTube Search requests 1–20 results (the node's existing default remains 10 for compatibility); Search Extended requests 1–700 (default 20). Both expose supported duration, sorting, type, upload-date and feature filters.
- Video inputs accept an 11-character ID or YouTube watch, shorts, embed, live, or `youtu.be` URL. Metadata supports chapter/format inclusion.
- Get Transcript defaults to automatic captions. Get Captions defaults to uploader captions. Both select an existing track/language: no ASR, translation, or fallback.
- Get License Label (Trainability) reports Creative Commons license metadata. `permitted: ["all"]` is a source classification, **not training permission**. Missing metadata can produce `["none"]`.
- Channel uses a handle and 1–100 recent videos. Suggestions returns autocomplete phrases, not videos or search volume.
- Download Video or Audio submits one asynchronous job. It supports audio/video modes, quality, FPS, formats, metadata upload and start/end clips. The response contains a job ID, not a completed media upload.
- **Download Job → Get Status and Manifest** reads status; when completed, it retrieves the JSON result through the authenticated results endpoint and fetches the signed HTTPS URL **without** the API key. JSON results expire after 24 hours; media retention and access follow your own storage policy.

## Output, errors and retries

Each input item returns one full FlashData response, with n8n item linking. Research queries preserve `results`, `usage.credits` and `created_at`. Use `{{$json.results[0]}}` for source data, `.organic` for Google web results, `.news` for news, `.results` for YouTube search, and `.segments` for transcripts/captions. Completed job reads add `output`; delivered files appear in `{{$json.output.results[0]}}`.

The node processes inputs sequentially and does not automatically paginate or retry paid requests. **Retry On Fail** can submit a second paid query. If a submit times out, check job history/usage before repeating it. Status/result reads do not submit work. The download template polls an existing ID every 5–6 seconds and stops after its configured limit; resume the read step to continue waiting.

HTTP `401`, `402`, `403`, `429` and `5xx` failures require checking credentials, Credits, access, rate limits or service availability. Sensitive request bodies are excluded from node errors. Standard n8n continue-on-error settings are supported. The node remains available as an AI Agent tool; retrieved text is untrusted external content.

## Compatibility and development

The stable package name, `n8n-nodes-flashdata.flashdata` type, `flashdataApi` credential and original four operation values are preserved. Version 0.2.0 uses a programmatic executor because completed async results require authenticated status/redirect calls followed by an anonymous storage read. It has no external runtime dependencies and does not read files or environment variables.

Tested with n8n 2.42.5. Other versions are not verified. Build tooling uses Node.js 24.

```sh
nvm use
npm ci
npm run lint
npm test
npm run test:integration
npm run dev
```

The Docker integration suite executes all 15 task workflows, exports their files, and checks legacy workflows against API fixtures without using Credits. It does not prove live upstream availability or actual customer-storage delivery. [Release instructions](RELEASING.md) distinguish npm publication, verification submission, public node discovery, and template-library publication.

[Older multi-service examples](workflows/README.md#older-multi-service-examples) remain available; their external writes/model access require your own setup. [Report an issue](https://github.com/rocosen/n8n-nodes-flashdata/issues) · [Changelog](CHANGELOG.md) · [n8n community nodes](https://docs.n8n.io/integrations/community-nodes/).

[n8n](https://n8n.io/) is a fair-code licensed workflow automation platform. This package is MIT licensed.
