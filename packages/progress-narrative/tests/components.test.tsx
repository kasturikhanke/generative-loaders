import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NarrativeHistory, NarrativeLine, ProgressNarrative } from "../src/index.js";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const events = [
  { id: "search", action: "search" as const, phase: "complete" as const, count: 6, subject: "sources" },
  { id: "compare", action: "compare" as const, phase: "active" as const, count: 3, subject: "results" },
];

describe("components", () => {
  it("renders server-side without browser globals", () => {
    const html = renderToString(<ProgressNarrative events={events} defaultExpanded />);
    expect(html).toContain("Comparing");
    expect(html).toContain("Progress history");
  });

  it("provides a polite atomic status announcement", () => {
    render(<NarrativeLine event={events[1]} motion="focus" />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveAttribute("aria-atomic", "true");
    expect(status).toHaveTextContent("Comparing 3 results");
    expect(status.closest(".pn-line")).toHaveAttribute("data-motion", "focus");
  });

  it("opens and closes activity history with an accessible button", () => {
    render(<ProgressNarrative events={events} />);
    const button = screen.getByRole("button", { name: /activity/i });
    expect(button).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("list", { name: /progress history/i })).toBeInTheDocument();
  });

  it("limits visible history", () => {
    render(<NarrativeHistory events={events} maxItems={1} />);
    expect(screen.queryByText("Found 6 sources")).not.toBeInTheDocument();
    expect(screen.getByText("Comparing 3 results")).toBeInTheDocument();
  });

  it("coalesces rapid updates to the latest phrase", () => {
    vi.useFakeTimers();
    const { rerender } = render(<NarrativeLine event={events[0]} minVisibleMs={650} />);
    rerender(<NarrativeLine event={events[1]} minVisibleMs={650} />);
    rerender(<NarrativeLine event={{ id: "done", action: "complete", phase: "complete", result: "Draft ready" }} minVisibleMs={650} />);
    expect(screen.getByRole("status")).toHaveTextContent("Found 6 sources");
    act(() => vi.advanceTimersByTime(650));
    expect(screen.getByRole("status")).toHaveTextContent("Draft ready");
  });
});
