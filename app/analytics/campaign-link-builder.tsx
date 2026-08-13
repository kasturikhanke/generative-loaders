"use client";

import { useMemo, useState } from "react";

function slugify(value: string) { return value.trim().toLowerCase().replace(/[^a-z0-9_.-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80); }

export function CampaignLinkBuilder() {
  const [source, setSource] = useState("reddit");
  const [campaign, setCampaign] = useState("launch");
  const [copied, setCopied] = useState(false);
  const link = useMemo(() => `https://generativeloaders.com/?utm_source=${slugify(source) || "social"}&utm_campaign=${slugify(campaign) || "launch"}`, [source, campaign]);
  async function copy() { await navigator.clipboard.writeText(link); setCopied(true); window.setTimeout(() => setCopied(false), 1400); }
  return <div className="campaign-builder"><div><label htmlFor="campaign-source">Source</label><input id="campaign-source" value={source} onChange={(event) => setSource(event.target.value)} /></div><div><label htmlFor="campaign-name">Campaign</label><input id="campaign-name" value={campaign} onChange={(event) => setCampaign(event.target.value)} /></div><code>{link}</code><button type="button" onClick={copy}>{copied ? "Copied" : "Copy link"}</button></div>;
}
