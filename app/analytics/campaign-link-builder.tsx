"use client";

import { useMemo, useState } from "react";

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9_.-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

export function CampaignLinkBuilder() {
  const [campaign, setCampaign] = useState("reactjs-launch");
  const [copied, setCopied] = useState<string | null>(null);
  const slug = useMemo(() => slugify(campaign) || "reddit-post", [campaign]);
  const landingLink = `https://generativeloaders.com/?utm_source=reddit&utm_campaign=${slug}`;
  const npmLink = `https://generativeloaders.com/go/npm?source=reddit&campaign=${slug}`;

  async function copy(name: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(name);
    window.setTimeout(() => setCopied(null), 1400);
  }

  return <div className="campaign-builder">
    <label htmlFor="campaign-name">Campaign name</label>
    <input id="campaign-name" value={campaign} onChange={(event) => setCampaign(event.target.value)} placeholder="reactjs-launch" />
    <div className="campaign-link-row">
      <div><span>Landing page</span><code>{landingLink}</code></div>
      <button type="button" onClick={() => copy("landing", landingLink)}>{copied === "landing" ? "Copied" : "Copy"}</button>
    </div>
    <div className="campaign-link-row">
      <div><span>Direct npm</span><code>{npmLink}</code></div>
      <button type="button" onClick={() => copy("npm", npmLink)}>{copied === "npm" ? "Copied" : "Copy"}</button>
    </div>
    <p>Use a different campaign name for every Reddit post. Landing links measure visits and install-command copies; direct npm links measure outbound clicks.</p>
  </div>;
}
