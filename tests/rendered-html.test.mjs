import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the text loader gallery", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Generative Loaders/);
  assert.match(html, /React loaders for/);
  assert.match(html, /Framer Motion/);
  for (const variant of ["Decode", "Typewriter", "Skeleton", "Cascade", "Focus", "Wipe", "Flip", "Redact", "Line by line", "Terminal", "Wave", "Dissolve", "Slice", "Tracking", "Coalesce", "Fragments"]) {
    assert.match(html, new RegExp(`>${variant}<`));
  }
  assert.match(html, /npm install generative-loaders/);
  assert.match(html, /Text loaders/);
  assert.match(html, /Inline loaders/);
  assert.match(html, /Image loaders/);
  assert.match(html, /aria-selected="true"/);
  assert.match(html, />Playground</);
  assert.match(html, />API</);
  assert.doesNotMatch(html, /Ideas arrive quietly/);
  assert.doesNotMatch(html, /Progress Narrative|Thinking steps|progress-narrative|codex-preview|react-loading-skeleton/i);
});

test("ships renamed metadata and social artwork", async () => {
  const [layout, packageJson, packageManifest] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../packages/generative-loaders/package.json", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /Generative Loaders/);
  assert.match(layout, /text, inline, and image loaders/);
  assert.match(layout, /generative-loaders-og\.png/);
  assert.match(packageJson, /generative-loaders-workspace/);
  assert.match(packageManifest, /"name": "generative-loaders"/);
  assert.doesNotMatch(`${layout}${packageJson}${packageManifest}`, /Progress Narrative|progress-narrative/);
  await access(new URL("../public/generative-loaders-og.png", import.meta.url));
});
