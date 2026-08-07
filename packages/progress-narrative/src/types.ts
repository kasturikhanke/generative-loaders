import type { ReactNode } from "react";

export type ProgressAction =
  | "search"
  | "read"
  | "compare"
  | "analyze"
  | "verify"
  | "draft"
  | "revise"
  | "wait"
  | "complete";

export type ProgressPhase = "queued" | "active" | "complete" | "error";

export type NarrativeMotion =
  | "flow"
  | "focus"
  | "cascade"
  | "flip"
  | "wipe"
  | "snap";

export interface ProgressEvent {
  id: string;
  action: ProgressAction;
  phase: ProgressPhase;
  subject?: string;
  count?: number;
  current?: number;
  total?: number;
  result?: string;
  message?: string;
  occurredAt?: number;
}

export type ProgressFormatter = (event: ProgressEvent) => string;

export interface NarrativeLineProps {
  event?: ProgressEvent;
  formatEvent?: ProgressFormatter;
  minVisibleMs?: number;
  motion?: NarrativeMotion;
  className?: string;
}

export interface NarrativeHistoryProps {
  events: ProgressEvent[];
  formatEvent?: ProgressFormatter;
  maxItems?: number;
  renderDetail?: (event: ProgressEvent) => ReactNode;
  className?: string;
}

export interface ProgressNarrativeProps
  extends Omit<NarrativeHistoryProps, "className"> {
  history?: "collapsible" | "visible" | "hidden";
  defaultExpanded?: boolean;
  minVisibleMs?: number;
  motion?: NarrativeMotion;
  className?: string;
  historyLabel?: string;
}
