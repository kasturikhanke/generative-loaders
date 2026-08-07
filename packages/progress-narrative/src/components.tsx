"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { formatProgressEvent, normalizeProgressEvents } from "./format.js";
import type {
  NarrativeHistoryProps,
  NarrativeLineProps,
  ProgressEvent,
  ProgressNarrativeProps,
} from "./types.js";

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function tokenize(value: string): string[] {
  return value.match(/\d+(?:[.,]\d+)*|[\p{L}]+(?:[’'][\p{L}]+)?|[^\s]/gu) ?? [];
}

function tokenKeys(tokens: string[]): string[] {
  const seen = new Map<string, number>();
  return tokens.map((token) => {
    const normalized = token.toLocaleLowerCase();
    const count = seen.get(normalized) ?? 0;
    seen.set(normalized, count + 1);
    return `${normalized}:${count}`;
  });
}

function useCommittedEvent(event: ProgressEvent | undefined, minVisibleMs: number) {
  const [committed, setCommitted] = useState(event);
  const committedAt = useRef(0);
  const pending = useRef(event);

  useEffect(() => {
    pending.current = event;
    if (event === committed) {
      if (committedAt.current === 0) committedAt.current = Date.now();
      return;
    }

    const remaining = committed
      ? Math.max(0, minVisibleMs - (Date.now() - committedAt.current))
      : 0;
    const timer = window.setTimeout(() => {
      setCommitted(pending.current);
      committedAt.current = Date.now();
    }, remaining);
    return () => window.clearTimeout(timer);
  }, [event, committed, minVisibleMs]);

  return committed;
}

function PhaseMark({ phase }: { phase: ProgressEvent["phase"] }) {
  return (
    <span className={`pn-mark pn-mark--${phase}`} aria-hidden="true">
      {phase === "complete" ? "✓" : phase === "error" ? "!" : ""}
    </span>
  );
}

export function NarrativeLine({
  event,
  formatEvent = formatProgressEvent,
  minVisibleMs = 650,
  motion = "flow",
  className,
}: NarrativeLineProps) {
  const committed = useCommittedEvent(event, minVisibleMs);
  const phrase = committed ? formatEvent(committed) : "";
  const previousPhrase = useRef(phrase);
  const [departing, setDeparting] = useState("");

  useEffect(() => {
    if (previousPhrase.current && previousPhrase.current !== phrase) {
      setDeparting(previousPhrase.current);
      const timer = window.setTimeout(() => setDeparting(""), 340);
      previousPhrase.current = phrase;
      return () => window.clearTimeout(timer);
    }
    previousPhrase.current = phrase;
  }, [phrase]);

  const currentTokens = tokenize(phrase);
  const departingTokens = tokenize(departing);
  const currentKeys = tokenKeys(currentTokens);
  const departingKeys = new Set(tokenKeys(departingTokens));

  if (!committed) return null;

  return (
    <div className={cx("pn-line", className)} data-phase={committed.phase} data-motion={motion}>
      <PhaseMark phase={committed.phase} />
      <span className="pn-phrase" aria-hidden="true">
        {currentTokens.map((token, index) => {
          const stable = departingKeys.has(currentKeys[index]);
          const numeric = /^\d/.test(token);
          return (
            <span
              className={cx(
                "pn-token",
                stable && "pn-token--stable",
                numeric && "pn-token--number",
              )}
              key={currentKeys[index]}
              style={{ "--pn-token-index": index } as CSSProperties}
            >
              {token}
            </span>
          );
        })}
      </span>
      <span className="pn-sr-only" role="status" aria-live="polite" aria-atomic="true">
        {phrase}
      </span>
    </div>
  );
}

function HistoryRow({
  event,
  phrase,
  detail,
}: {
  event: ProgressEvent;
  phrase: string;
  detail?: React.ReactNode;
}) {
  return (
    <li className="pn-history-row" data-phase={event.phase}>
      <PhaseMark phase={event.phase} />
      <span className="pn-history-copy">
        <span>{phrase}</span>
        {detail ? <span className="pn-history-detail">{detail}</span> : null}
      </span>
    </li>
  );
}

export function NarrativeHistory({
  events,
  formatEvent = formatProgressEvent,
  maxItems = 20,
  renderDetail,
  className,
}: NarrativeHistoryProps) {
  const normalized = useMemo(() => normalizeProgressEvents(events), [events]);
  const visible = normalized.slice(-Math.max(1, maxItems));

  return (
    <ol className={cx("pn-history", className)} aria-label="Progress history">
      {visible.map((event) => (
        <HistoryRow
          key={event.id}
          event={event}
          phrase={formatEvent(event)}
          detail={renderDetail?.(event)}
        />
      ))}
    </ol>
  );
}

export function ProgressNarrative({
  events,
  formatEvent = formatProgressEvent,
  history = "collapsible",
  defaultExpanded = false,
  minVisibleMs = 650,
  motion = "flow",
  maxItems = 20,
  renderDetail,
  className,
  historyLabel = "Activity",
}: ProgressNarrativeProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const normalized = useMemo(() => normalizeProgressEvents(events), [events]);
  const current = normalized.at(-1);
  const showHistory = history === "visible" || (history === "collapsible" && expanded);

  return (
    <section className={cx("pn-root", className)} aria-label="Progress narrative">
      <div className="pn-current">
        <NarrativeLine
          event={current}
          formatEvent={formatEvent}
          minVisibleMs={minVisibleMs}
          motion={motion}
        />
        {history === "collapsible" && normalized.length > 1 ? (
          <button
            type="button"
            className="pn-disclosure"
            aria-expanded={expanded}
            onClick={() => setExpanded((value) => !value)}
          >
            <span>{historyLabel}</span>
            <span aria-hidden="true">{expanded ? "−" : "+"}</span>
          </button>
        ) : null}
      </div>
      {showHistory ? (
        <div className="pn-history-wrap">
          <NarrativeHistory
            events={normalized}
            formatEvent={formatEvent}
            maxItems={maxItems}
            renderDetail={renderDetail}
          />
        </div>
      ) : null}
    </section>
  );
}
