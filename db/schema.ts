import { sql } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const analyticsDaily = sqliteTable("analytics_daily", {
  day: text("day").notNull(),
  event: text("event").notNull(),
  source: text("source").notNull().default("direct"),
  campaign: text("campaign").notNull().default("untagged"),
  count: integer("count").notNull().default(0),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [primaryKey({ columns: [table.day, table.event, table.source, table.campaign] })]);
