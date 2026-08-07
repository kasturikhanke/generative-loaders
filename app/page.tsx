"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ProgressNarrative,
  type ProgressAction,
  type ProgressEvent,
} from "progress-narrative";
import "progress-narrative/styles.css";

const research: ProgressEvent[] = [
  { id: "search", action: "search", phase: "complete", count: 6, subject: "sources" },
  { id: "read", action: "read", phase: "complete", count: 4, subject: "articles" },
  { id: "compare", action: "compare", phase: "active", count: 3, subject: "results" },
  { id: "verify", action: "verify", phase: "active", count: 8, subject: "claims" },
  { id: "ready", action: "complete", phase: "complete", result: "Draft ready" },
];

const errorEvents: ProgressEvent[] = [
  { id: "service", action: "wait", phase: "error", result: "Billing service unavailable" },
  { id: "cache", action: "read", phase: "active", subject: "cached records" },
];

const actions: ProgressAction[] = ["search", "read", "compare", "analyze", "verify", "draft", "revise", "wait", "complete"];

function CopyCode({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1000);
  }
  return (
    <div className="code-block">
      <button type="button" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
      <pre><code>{children}</code></pre>
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState(2);
  const [playing, setPlaying] = useState(true);
  const [action, setAction] = useState<ProgressAction>("search");
  const [count, setCount] = useState(6);
  const [subject, setSubject] = useState("sources");

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setStep((value) => (value + 1) % research.length), 1700);
    return () => window.clearInterval(timer);
  }, [playing]);

  const liveEvents = useMemo(() => research.slice(0, step + 1), [step]);
  const customEvents: ProgressEvent[] = [{
    id: "preview",
    action,
    phase: action === "complete" ? "complete" : "active",
    count: action === "complete" ? undefined : count,
    subject: action === "complete" ? undefined : subject,
    result: action === "complete" ? "Work ready" : undefined,
  }];

  const usage = `import { ProgressNarrative } from "progress-narrative";
import "progress-narrative/styles.css";

<ProgressNarrative
  events={${JSON.stringify(customEvents, null, 2)}}
/>`;

  return (
    <main className="site-shell">
      <nav>
        <a href="#top" className="brand">progress/narrative</a>
        <div><a href="#install">Install</a><a href="#playground">Playground</a></div>
      </nav>

      <header id="top">
        <div className="brand-mark" aria-hidden="true"><i /><i /><i /></div>
        <h1>Progress Narrative</h1>
        <p>Readable, animated progress for React agents.</p>
      </header>

      <section className="examples" aria-label="Component examples">
        <article className="example-card example-card--wide">
          <span className="card-label">Live research</span>
          <ProgressNarrative events={liveEvents} defaultExpanded minVisibleMs={350} />
          <button className="replay" type="button" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause" : "Play"}</button>
        </article>

        <article className="example-card">
          <span className="card-label">Compact</span>
          <ProgressNarrative events={[{ id: "a", action: "analyze", phase: "active", count: 12, subject: "metrics" }]} history="hidden" />
        </article>

        <article className="example-card">
          <span className="card-label">Recovery</span>
          <ProgressNarrative events={errorEvents} history="visible" />
        </article>
      </section>

      <section className="install" id="install">
        <h2>Install</h2>
        <CopyCode>npm install progress-narrative</CopyCode>
        <h2>Usage</h2>
        <CopyCode>{`import { ProgressNarrative } from "progress-narrative";
import "progress-narrative/styles.css";

<ProgressNarrative events={events} />`}</CopyCode>
      </section>

      <section className="playground" id="playground">
        <div className="section-title"><h2>Playground</h2><p>Change the event. The sentence updates with it.</p></div>
        <div className="playground-panel">
          <form onSubmit={(event) => event.preventDefault()}>
            <label>Action<select value={action} onChange={(event) => setAction(event.target.value as ProgressAction)}>{actions.map((value) => <option key={value}>{value}</option>)}</select></label>
            <label>Count<input type="number" min="0" value={count} disabled={action === "complete"} onChange={(event) => setCount(Number(event.target.value))} /></label>
            <label>Subject<input value={subject} disabled={action === "complete"} onChange={(event) => setSubject(event.target.value)} /></label>
          </form>
          <div className="playground-preview"><ProgressNarrative events={customEvents} history="hidden" /></div>
          <CopyCode>{usage}</CopyCode>
        </div>
      </section>

      <footer><span>MIT · React · TypeScript</span><span>Operational updates, not private reasoning.</span></footer>
    </main>
  );
}
