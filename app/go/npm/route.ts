import { env } from "cloudflare:workers";

const NPM_URL = "https://www.npmjs.com/package/generative-loaders";

function clean(value: string | null, fallback: string) {
  const normalized = value?.trim().toLowerCase().replace(/[^a-z0-9_.-]+/g, "-").slice(0, 80);
  return normalized || fallback;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const source = clean(url.searchParams.get("source"), "direct");
  const campaign = clean(url.searchParams.get("campaign"), "untagged");
  const day = new Date().toISOString().slice(0, 10);

  try {
    const db = env.DB;
    if (!db) return Response.redirect(NPM_URL, 302);
    await db.prepare(`
      INSERT INTO analytics_daily (day, event, source, campaign, count, updated_at)
      VALUES (?, 'npm_outbound', ?, ?, 1, CURRENT_TIMESTAMP)
      ON CONFLICT(day, event, source, campaign)
      DO UPDATE SET count = count + 1, updated_at = CURRENT_TIMESTAMP
    `).bind(day, source, campaign).run();
  } catch {
    // Tracking must never prevent someone from reaching the package.
  }

  return Response.redirect(NPM_URL, 302);
}
