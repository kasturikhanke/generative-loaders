"use client";

import { useEffect } from "react";

type Attribution = { source: string; campaign: string };

const STORAGE_KEY = "gl-attribution";

function clean(value: string | null, fallback: string) {
  const normalized = value?.trim().toLowerCase().replace(/[^a-z0-9_.-]+/g, "-").slice(0, 80);
  return normalized || fallback;
}

function getAttribution(): Attribution {
  const params = new URLSearchParams(window.location.search);
  const taggedSource = params.get("utm_source") ?? params.get("source");
  const taggedCampaign = params.get("utm_campaign") ?? params.get("campaign");

  if (taggedSource || taggedCampaign) {
    const attribution = {
      source: clean(taggedSource, "direct"),
      campaign: clean(taggedCampaign, "untagged"),
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
    return attribution;
  }

  try {
    const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null") as Attribution | null;
    if (stored?.source && stored?.campaign) return stored;
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
  }

  const referrer = document.referrer;
  const source = referrer.includes("reddit.com") ? "reddit" : referrer ? "referral" : "direct";
  return { source, campaign: "untagged" };
}

function record(event: string, attribution = getAttribution()) {
  const body = JSON.stringify({ event, ...attribution });
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics/events", new Blob([body], { type: "application/json" }));
    return;
  }
  void fetch("/api/analytics/events", { method: "POST", headers: { "content-type": "application/json" }, body, keepalive: true });
}

export function AnalyticsBeacon() {
  useEffect(() => {
    record("page_view");
    const listener = (event: Event) => {
      const detail = (event as CustomEvent<{ event?: string }>).detail;
      if (detail?.event) record(detail.event);
    };
    window.addEventListener("gl-analytics", listener);
    return () => window.removeEventListener("gl-analytics", listener);
  }, []);

  return null;
}
