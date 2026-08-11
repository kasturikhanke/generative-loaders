import type { Metadata } from "next";
import { env } from "cloudflare:workers";
import { notFound } from "next/navigation";
import { BrandMark } from "../components/brand-mark";
import { requireChatGPTUser } from "../chatgpt-auth";
import { CampaignLinkBuilder } from "./campaign-link-builder";

export const metadata: Metadata = {
  title: "Launch analytics — Generative Loaders",
  description: "Downloads, campaign attribution, and Reddit launch signals for Generative Loaders.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const PACKAGE_NAME = "generative-loaders";
const PUBLISHED_ON = "2026-08-08";
const BASELINE = 212;
const SEED_DOWNLOADS: DownloadDay[] = [
  { day: "2026-08-08", downloads: 256 },
  { day: "2026-08-09", downloads: 212 },
  { day: "2026-08-10", downloads: 900 },
  { day: "2026-08-11", downloads: 0 },
];

type DownloadDay = { day: string; downloads: number };
type CampaignRow = {
  source: string;
  campaign: string;
  pageViews: number;
  installCopies: number;
  npmOutbound: number;
};

function isoDay(date: Date) {
  return date.toISOString().slice(0, 10);
}

function displayDay(day: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

async function getDownloads(): Promise<{ days: DownloadDay[]; live: boolean }> {
  const today = isoDay(new Date());
  try {
    const response = await fetch(`https://api.npmjs.org/downloads/range/${PUBLISHED_ON}:${today}/${PACKAGE_NAME}`, {
      cache: "no-store",
      headers: { accept: "application/json" },
    });
    if (!response.ok) throw new Error("npm response failed");
    const data = await response.json() as { downloads?: DownloadDay[] };
    if (!data.downloads?.length) throw new Error("npm returned no download history");
    return { days: data.downloads, live: true };
  } catch {
    return { days: SEED_DOWNLOADS, live: false };
  }
}

async function getCampaigns(): Promise<CampaignRow[]> {
  try {
    const db = env.DB;
    if (!db) return [];
    const result = await db.prepare(`
      SELECT source, campaign,
        SUM(CASE WHEN event = 'page_view' THEN count ELSE 0 END) AS page_views,
        SUM(CASE WHEN event = 'install_copy' THEN count ELSE 0 END) AS install_copies,
        SUM(CASE WHEN event = 'npm_outbound' THEN count ELSE 0 END) AS npm_outbound
      FROM analytics_daily
      WHERE day >= date('now', '-6 days')
      GROUP BY source, campaign
      ORDER BY (page_views + install_copies + npm_outbound) DESC
      LIMIT 20
    `).all<{ source: string; campaign: string; page_views: number; install_copies: number; npm_outbound: number }>();

    return (result.results ?? []).map((row) => ({
      source: row.source,
      campaign: row.campaign,
      pageViews: Number(row.page_views),
      installCopies: Number(row.install_copies),
      npmOutbound: Number(row.npm_outbound),
    }));
  } catch {
    return [];
  }
}

async function requireAnalyticsAccess() {
  const user = await requireChatGPTUser("/analytics");
  const allowedEmails = (env.ANALYTICS_ALLOWED_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (!allowedEmails.includes(user.email.toLowerCase())) notFound();
}

export default async function AnalyticsPage() {
  await requireAnalyticsAccess();
  const [{ days, live }, campaigns] = await Promise.all([getDownloads(), getCampaigns()]);
  const today = isoDay(new Date());
  const total = days.reduce((sum, day) => sum + day.downloads, 0);
  const completeDays = days.filter((day) => day.day < today);
  const latestComplete = completeDays.at(-1) ?? days.at(-1) ?? SEED_DOWNLOADS[0];
  const previousComplete = completeDays.at(-2) ?? SEED_DOWNLOADS[0];
  const increase = latestComplete.downloads - previousComplete.downloads;
  const increasePercent = previousComplete.downloads ? (increase / previousComplete.downloads) * 100 : 0;
  const watchDays = days.filter((day) => day.day > "2026-08-09" && day.day < today);
  const aboveBaseline = watchDays.filter((day) => day.downloads > BASELINE).length;
  const maxDownloads = Math.max(...days.map((day) => day.downloads), 1);

  return <main className="analytics-page">
    <nav className="analytics-nav shell">
      <a className="brand" href="/"><BrandMark />Generative Loaders</a>
      <div><a href="/">Gallery</a><a href="/docs">Docs</a><a href="/signout-with-chatgpt?return_to=%2F">Sign out</a></div>
    </nav>

    <header className="analytics-hero shell">
      <div>
        <p className="analytics-kicker">Launch pulse · seven-day watch</p>
        <h1>Momentum, with the attribution gaps visible.</h1>
        <p>Daily npm downloads are live. First-party campaign events begin accumulating when tagged links are used.</p>
      </div>
      <span className={`data-status ${live ? "live" : "fallback"}`}><i />{live ? "Live npm data" : "Last verified npm data"}</span>
    </header>

    <section className="analytics-summary shell" aria-label="Download summary">
      <article><span>Total since publication</span><strong>{formatNumber(total)}</strong><small>Since {displayDay(PUBLISHED_ON)}</small></article>
      <article><span>{displayDay(latestComplete.day)}</span><strong>{formatNumber(latestComplete.downloads)}</strong><small>Latest complete day</small></article>
      <article><span>Day-over-day</span><strong className={increase >= 0 ? "positive" : "negative"}>{increase >= 0 ? "+" : ""}{formatNumber(increase)}</strong><small>{increase >= 0 ? "+" : ""}{increasePercent.toFixed(1)}%</small></article>
      <article><span>Above 212 baseline</span><strong>{aboveBaseline}/{watchDays.length || 1}</strong><small>Complete watch days</small></article>
    </section>

    <section className="analytics-grid shell">
      <article className="analytics-panel download-panel">
        <div className="panel-heading"><div><span>01</span><h2>Daily downloads</h2></div><small>npm registry</small></div>
        <div className="download-chart" aria-label="Daily npm download chart">
          {days.map((day) => <div className="download-column" key={day.day}>
            <div className="download-value">{formatNumber(day.downloads)}</div>
            <div className="bar-track"><div className="bar-fill" style={{ height: `${Math.max((day.downloads / maxDownloads) * 100, day.downloads ? 3 : 0)}%` }} /></div>
            <span>{displayDay(day.day)}</span>
            {day.day === today && <small>Incomplete</small>}
          </div>)}
        </div>
        <div className="baseline-key"><i /><span>Baseline: {BASELINE} downloads/day</span></div>
      </article>

      <article className="analytics-panel health-panel">
        <div className="panel-heading"><div><span>02</span><h2>Signal quality</h2></div><small>What npm exposes</small></div>
        <dl className="signal-list">
          <div><dt>Raw downloads</dt><dd className="available">Available</dd></div>
          <div><dt>Unique installers</dt><dd>Not available</dd></div>
          <div><dt>Bot or CI filtering</dt><dd>Not available</dd></div>
          <div><dt>Mirrors and repeat pulls</dt><dd>Not identifiable</dd></div>
        </dl>
        <p className="panel-note">Treat downloads as distribution activity, not a one-to-one count of people. Sustained days above 212 are the stronger signal.</p>
      </article>

      <article className="analytics-panel campaign-panel">
        <div className="panel-heading"><div><span>03</span><h2>Campaign attribution</h2></div><small>Last seven days</small></div>
        {campaigns.length ? <div className="campaign-table" role="table" aria-label="Campaign attribution">
          <div className="campaign-table-head" role="row"><span>Source / campaign</span><span>Views</span><span>Copies</span><span>Npm clicks</span></div>
          {campaigns.map((row) => <div className="campaign-table-row" role="row" key={`${row.source}-${row.campaign}`}>
            <span><strong>{row.source}</strong><small>{row.campaign}</small></span><span>{formatNumber(row.pageViews)}</span><span>{formatNumber(row.installCopies)}</span><span>{formatNumber(row.npmOutbound)}</span>
          </div>)}
        </div> : <div className="empty-state"><strong>No tagged campaign traffic yet</strong><p>Create one link per post below. Existing Reddit traffic cannot be reconstructed retroactively.</p></div>}
        <CampaignLinkBuilder />
      </article>

      <article className="analytics-panel reddit-panel">
        <div className="panel-heading"><div><span>04</span><h2>Reddit post health</h2></div><small>Per post</small></div>
        <div className="reddit-metrics">
          <div><span>Post views</span><strong>Insights</strong><small>Author-only on Reddit</small></div>
          <div><span>Upvote rate</span><strong>Connect post</strong><small>Needs each post URL</small></div>
          <div><span>Comments</span><strong>Connect post</strong><small>Needs each post URL</small></div>
          <div><span>Shares</span><strong>Insights</strong><small>Author-only on Reddit</small></div>
          <div><span>Outbound clicks</span><strong>Tracking now</strong><small>With campaign links</small></div>
          <div><span>Click → download</span><strong>Directional</strong><small>npm has no referral IDs</small></div>
        </div>
        <p className="panel-note">Use Reddit’s Post Insights for views and shares. This dashboard can compare those snapshots with tagged visits, install-command copies, npm clicks, and the download curve.</p>
      </article>
    </section>

    <footer className="analytics-footer shell"><span>Generative Loaders launch analytics</span><a href="/">Back to gallery →</a></footer>
  </main>;
}
