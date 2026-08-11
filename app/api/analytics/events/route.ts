import { env } from "cloudflare:workers";

const ALLOWED_EVENTS = new Set(["page_view", "install_copy", "npm_outbound"]);

function clean(value: unknown, fallback: string) {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9_.-]+/g, "-").slice(0, 80);
  return normalized || fallback;
}

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    if (origin && new URL(origin).host !== new URL(request.url).host) {
      return Response.json({ error: "Cross-origin analytics events are not accepted" }, { status: 403 });
    }

    const payload = await request.json() as { event?: unknown; source?: unknown; campaign?: unknown };
    const event = clean(payload.event, "");
    if (!ALLOWED_EVENTS.has(event)) return Response.json({ error: "Unsupported event" }, { status: 400 });

    const source = clean(payload.source, "direct");
    const campaign = clean(payload.campaign, "untagged");
    const day = new Date().toISOString().slice(0, 10);
    const db = env.DB;
    if (!db) return Response.json({ error: "Analytics storage is unavailable" }, { status: 503 });

    await db.prepare(`
      INSERT INTO analytics_daily (day, event, source, campaign, count, updated_at)
      VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
      ON CONFLICT(day, event, source, campaign)
      DO UPDATE SET count = count + 1, updated_at = CURRENT_TIMESTAMP
    `).bind(day, event, source, campaign).run();

    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: "Analytics event was not recorded" }, { status: 500 });
  }
}
