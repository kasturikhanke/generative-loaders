import { env } from "cloudflare:workers";

const ALLOWED_EVENTS = new Set(["page_view", "install_copy", "npm_outbound"]);

function dimension(value: unknown, fallback: string, max = 120) {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9_./-]+/g, "-").slice(0, max);
  return normalized || fallback;
}

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    if (origin && new URL(origin).host !== new URL(request.url).host) {
      return Response.json({ error: "Cross-origin analytics events are not accepted" }, { status: 403 });
    }
    const payload = await request.json() as Record<string, unknown>;
    const event = dimension(payload.event, "", 40);
    if (!ALLOWED_EVENTS.has(event)) return Response.json({ error: "Unsupported event" }, { status: 400 });

    const day = new Date().toISOString().slice(0, 10);
    const path = dimension(payload.path, "/");
    const source = dimension(payload.source, "direct", 80);
    const campaign = dimension(payload.campaign, "untagged", 80);
    const referrer = dimension(payload.referrer, "direct", 120);
    const visitorId = dimension(payload.visitorId, "", 64);
    const db = env.DB;
    if (!db) return Response.json({ error: "Analytics storage is unavailable" }, { status: 503 });

    const statements = [db.prepare(`
      INSERT INTO analytics_daily (day, event, path, source, campaign, referrer, count, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
      ON CONFLICT(day, event, path, source, campaign, referrer)
      DO UPDATE SET count = count + 1, updated_at = CURRENT_TIMESTAMP
    `).bind(day, event, path, source, campaign, referrer)];
    if (event === "page_view" && visitorId) {
      statements.push(db.prepare(`
        INSERT INTO analytics_visitors (day, visitor_id, created_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(day, visitor_id) DO NOTHING
      `).bind(day, visitorId));
    }
    await db.batch(statements);
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: "Analytics event was not recorded" }, { status: 500 });
  }
}
