"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ProgressNarrative,
  type NarrativeMotion,
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

const actions: ProgressAction[] = ["search", "read", "compare", "analyze", "verify", "draft", "revise", "wait", "complete"];

const motionStudies: Array<{ motion: NarrativeMotion; name: string; principle: string }> = [
  { motion: "flow", name: "Flow", principle: "Directional continuity" },
  { motion: "focus", name: "Focus", principle: "Optical hierarchy" },
  { motion: "cascade", name: "Cascade", principle: "Staged disclosure" },
  { motion: "flip", name: "Flip", principle: "Direct state change" },
  { motion: "wipe", name: "Wipe", principle: "Anticipation" },
  { motion: "snap", name: "Snap", principle: "Follow-through" },
];

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
  const [motion, setMotion] = useState<NarrativeMotion>("flow");

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
  motion="${motion}"
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

      <section className="motion-section" aria-labelledby="motion-title">
        <div className="motion-heading">
          <div><h2 id="motion-title">Motion studies</h2><p>One changing sentence, six animation principles.</p></div>
          <button className="replay" type="button" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause all" : "Play all"}</button>
        </div>
        <div className="examples">
          {motionStudies.map((study) => (
            <article className="example-card" key={study.motion}>
              <div className="card-title"><span>{study.name}</span><small>{study.principle}</small></div>
              <ProgressNarrative events={liveEvents} history="hidden" minVisibleMs={350} motion={study.motion} />
            </article>
          ))}
        </div>
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
            <label>Motion<select value={motion} onChange={(event) => setMotion(event.target.value as NarrativeMotion)}>{motionStudies.map((study) => <option value={study.motion} key={study.motion}>{study.name}</option>)}</select></label>
          </form>
          <div className="playground-preview"><ProgressNarrative events={customEvents} history="hidden" motion={motion} /></div>
          <CopyCode>{usage}</CopyCode>
        </div>
      </section>

      <footer><span>MIT · React · TypeScript</span><span>Operational updates, not private reasoning.</span></footer>
    </main>
  );
}
