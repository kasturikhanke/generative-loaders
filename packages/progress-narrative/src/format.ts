import type { ProgressEvent } from "./types.js";

function target(event: ProgressEvent): string {
  const subject = event.subject?.trim() ?? "";
  if (event.current !== undefined && event.total !== undefined) {
    return `${event.current} of ${event.total}${subject ? ` ${subject}` : ""}`;
  }
  if (event.count !== undefined) {
    return `${event.count}${subject ? ` ${subject}` : ""}`;
  }
  return subject;
}

function phrase(verb: string, event: ProgressEvent): string {
  const value = target(event);
  return value ? `${verb} ${value}` : verb;
}

const verbs = {
  search: {
    queued: "Preparing to search",
    active: "Searching",
    complete: "Found",
    error: "Search failed for",
  },
  read: {
    queued: "Waiting to read",
    active: "Reading",
    complete: "Read",
    error: "Could not read",
  },
  compare: {
    queued: "Preparing to compare",
    active: "Comparing",
    complete: "Compared",
    error: "Could not compare",
  },
  analyze: {
    queued: "Preparing to analyze",
    active: "Analyzing",
    complete: "Analyzed",
    error: "Analysis failed for",
  },
  verify: {
    queued: "Waiting to check",
    active: "Checking",
    complete: "Checked",
    error: "Could not verify",
  },
  draft: {
    queued: "Waiting to draft",
    active: "Drafting",
    complete: "Prepared",
    error: "Could not draft",
  },
  revise: {
    queued: "Waiting to revise",
    active: "Revising",
    complete: "Revised",
    error: "Could not revise",
  },
  wait: {
    queued: "Waiting for",
    active: "Waiting for",
    complete: "Received",
    error: "Timed out waiting for",
  },
  complete: {
    queued: "Preparing result",
    active: "Finishing",
    complete: "Ready",
    error: "Could not finish",
  },
} as const;

export function formatProgressEvent(event: ProgressEvent): string {
  if (event.message?.trim()) return event.message.trim();
  if (event.phase === "error" && event.result?.trim()) return event.result.trim();
  if (event.action === "complete" && event.result?.trim()) return event.result.trim();

  const formatted = phrase(verbs[event.action][event.phase], event);
  if (event.phase === "complete" && event.result?.trim()) {
    return `${formatted} · ${event.result.trim()}`;
  }
  return formatted;
}

export function normalizeProgressEvents(events: ProgressEvent[]): ProgressEvent[] {
  const normalized: ProgressEvent[] = [];
  const positions = new Map<string, number>();

  for (const event of events) {
    const position = positions.get(event.id);
    if (position === undefined) {
      positions.set(event.id, normalized.length);
      normalized.push(event);
    } else {
      normalized[position] = event;
    }
  }

  return normalized;
}
