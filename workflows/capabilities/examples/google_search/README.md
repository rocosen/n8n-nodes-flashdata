# Example output: webhook integration preparation

**Synthetic demonstration — not live research.** The search snippets, example.com URLs, model response, collection timestamps and reported Credits are fixtures. They do not describe GitHub or another real provider, and no paid API or model was used to produce these files.

- [Read the complete Markdown brief](brief.md).
- [Inspect its companion evidence JSON](evidence.json).
- [Import the actual workflow](../../google_search.json) and follow the [setup guide](../../google_search.md) to research your own question.

The example shows three useful outcomes: partial evidence about signature verification, partial evidence about delivery identifiers, and an explicitly unresolved retry policy. Each row supplies a proposed next action and a verification step. Source IDs link the first two findings to the exact supplied snippets; the unresolved requirement has no invented citation.

The two synthetic searches illustrate 0.02 Credits in the evidence file. This is test data, not actual expenditure or a quote. Real FlashData and model charges vary.

From the repository root, reproduce both outputs without credentials or network access:

```sh
node test/export-research-example.cjs
```

This runs the exported workflow's actual `Prepare output` code against shared test fixtures. It demonstrates the export format and traceability, not the judgment of a real model. Open original provider documentation and test an integration before relying on a real report.
