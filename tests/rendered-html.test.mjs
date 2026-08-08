import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
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
  assert.match(html, /Text, inline, and image loading states/);
  for (const variant of ["Decode", "Typewriter", "Skeleton", "Cascade", "Focus", "Wipe", "Flip", "Redact", "Line by line", "Terminal", "Wave", "Dissolve", "Slice", "Tracking", "Coalesce", "Fragments"]) {
    assert.match(html, new RegExp(`>${variant}<`));
  }
  assert.match(html, /npm install generative-loaders/);
  assert.match(html, /Text loaders/);
  assert.match(html, /Inline loaders/);
  assert.match(html, /Image loaders/);
  assert.match(html, /aria-selected="true"/);
  assert.doesNotMatch(html, />See them in context\.</);
  assert.match(html, />Generating report</);
  assert.match(html, />Image</);
  assert.match(html, /aria-controls="context-panel-image"/);
  assert.match(html, /aria-label="Activity loader style"/);
  assert.doesNotMatch(html, /aria-label="Context activity loader"/);
  assert.doesNotMatch(html, /Connecting the findings/);
  assert.doesNotMatch(html, />Playground</);
  assert.ok(html.indexOf("Generating report") < html.indexOf("Text loaders"));
  assert.match(html, />Docs</);
  assert.match(html, />GitHub</);
  assert.doesNotMatch(html, />API</);
  assert.doesNotMatch(html, /Ideas arrive quietly/);
  assert.doesNotMatch(html, /Progress Narrative|Thinking steps|codex-preview|react-loading-skeleton/i);
});

test("server-renders complete library documentation", async () => {
  const response = await render("/docs");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Documentation — Generative Loaders/);
  assert.match(html, />Quick start</);
  assert.match(html, />Streaming text</);
  assert.match(html, />TextLoader</);
  assert.match(html, />InlineLoader</);
  assert.match(html, />ImageLoader</);
  assert.match(html, />Accessibility</);
  assert.match(html, /generative-loaders\/styles\.css/);
  assert.match(html, /React 18 or newer/);
});

test("keeps the pending chat skeleton wide enough to render", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.context-message-assistant\s*\{[^}]*width:78%/);
  assert.match(css, /\.context-chat-copy\s*\{[^}]*flex:1;[^}]*min-width:0/);
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
  assert.doesNotMatch(`${layout}${packageJson}${packageManifest}`, /Progress Narrative|codex-preview|react-loading-skeleton/i);
  assert.doesNotMatch(`${packageJson}${packageManifest}`, /"name"\s*:\s*"progress-narrative"/i);
  await access(new URL("../public/generative-loaders-og.png", import.meta.url));
});
