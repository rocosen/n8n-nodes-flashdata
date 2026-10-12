# Cloud storage for YouTube downloads

Set the following JSON in **FlashData API credential → Download Storage JSON**. This field is encrypted at rest and masked in the editor. Use a bucket/container you control and credentials scoped to writing to the destination. The integration sends this object to FlashData only when submitting a download. Never embed real values in an exported workflow.

AWS S3 example (replace every placeholder):

```json
{"storage_type":"s3","storage_url":"YOUR_BUCKET","region":"us-east-1","access_key":"YOUR_SCOPED_ACCESS_KEY","secret_key":"YOUR_SECRET_KEY","object_prefix":"n8n-clips"}
```

For S3-compatible storage, use `storage_type: "s3_compatible"` and add `endpoint_url`. The destination is a bucket name, not an object URL. Put folders in `object_prefix`; path traversal and leading slashes are rejected.

| Provider | Fields in addition to storage_type and storage_url |
| --- | --- |
| s3 | access_key, secret_key, region; optional endpoint_url |
| s3_compatible / oss | access_key, secret_key, region, endpoint_url |
| cos | access_key, secret_key, region; bucket includes APPID suffix |
| bos / tos | access_key, secret_key, region; optional endpoint_url |
| azure | account_name, sas_token (container SAS with write permission and expiry) |
| gcs | service_account object with project_id, client_email, private_key |

`object_prefix` is optional for all providers. Use the product's [download storage contract](https://flashdata.dev/docs/sources/youtube_download?utm_source=n8n&utm_medium=integration&utm_campaign=intent_gtm_2026q4&utm_content=youtube_download-storage) for provider-specific configuration. Private URLs in a completed manifest are not public media download links.

The default download template requests one 10-second clip at <=720p. Change the video and clip range before running. Missing destination permissions and upstream restrictions can still fail after local validation. Live uploads require your real destination and are not represented by the package's fixture tests.
