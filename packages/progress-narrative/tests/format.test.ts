import { describe, expect, it } from "vitest";
import { formatProgressEvent, normalizeProgressEvents } from "../src/index.js";

describe("formatProgressEvent", () => {
  it("formats active counts", () => {
    expect(formatProgressEvent({ id: "s", action: "search", phase: "active", count: 6, subject: "sources" })).toBe("Searching 6 sources");
  });

  it("formats progress values", () => {
    expect(formatProgressEvent({ id: "r", action: "read", phase: "active", current: 2, total: 6, subject: "sources" })).toBe("Reading 2 of 6 sources");
  });

  it("uses completion results and message overrides", () => {
    expect(formatProgressEvent({ id: "done", action: "complete", phase: "complete", result: "Draft ready" })).toBe("Draft ready");
    expect(formatProgressEvent({ id: "custom", action: "analyze", phase: "active", message: "Finding the signal" })).toBe("Finding the signal");
  });

  it("uses useful error copy", () => {
    expect(formatProgressEvent({ id: "e", action: "wait", phase: "error", result: "Billing service unavailable" })).toBe("Billing service unavailable");
  });
});

describe("normalizeProgressEvents", () => {
  it("updates repeated operation ids without changing their order", () => {
    const result = normalizeProgressEvents([
      { id: "a", action: "search", phase: "active" },
      { id: "b", action: "read", phase: "queued" },
      { id: "a", action: "search", phase: "complete", count: 4, subject: "sources" },
    ]);
    expect(result).toHaveLength(2);
    expect(result[0].phase).toBe("complete");
    expect(result[1].id).toBe("b");
  });
});
