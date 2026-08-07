"use client";

import { useEffect, useMemo, useState, type CSSProperties, type KeyboardEvent } from "react";

type MotionId =
  | "orbit"
  | "wave"
  | "drift"
  | "scan"
  | "cascade"
  | "thread"
  | "bloom"
  | "shuffle"
  | "constellation"
  | "flip"
  | "ticker"
  | "focus";

type Step = { label: string; short: string; detail: string };

const steps: Step[] = [
  { label: "Searching 18 sources", short: "Searching", detail: "Finding useful context" },
  { label: "Reading 6 documents", short: "Reading", detail: "Extracting the signal" },
  { label: "Comparing 12 patterns", short: "Comparing", detail: "Resolving differences" },
  { label: "Drafting your answer", short: "Drafting", detail: "Putting it together" },
];

const variations: Array<{ id: MotionId; name: string; character: string; behavior: string }> = [
  { id: "orbit", name: "Orbit", character: "Calm · spatial", behavior: "Particles circle a stable center" },
  { id: "wave", name: "Wave", character: "Fluid · conversational", behavior: "A soft signal travels forward" },
  { id: "drift", name: "Drift", character: "Ambient · quiet", behavior: "A field of dots changes density" },
  { id: "scan", name: "Scan", character: "Precise · technical", behavior: "A beam reveals the active phrase" },
  { id: "cascade", name: "Cascade", character: "Expressive · legible", behavior: "Words enter in reading order" },
  { id: "thread", name: "Thread", character: "Sequential · clear", behavior: "A path connects each operation" },
  { id: "bloom", name: "Bloom", character: "Soft · optimistic", behavior: "Status radiates from the center" },
  { id: "shuffle", name: "Shuffle", character: "Playful · modular", behavior: "Small tiles continuously regroup" },
  { id: "constellation", name: "Constellation", character: "Intelligent · active", behavior: "Nodes discover new connections" },
  { id: "flip", name: "Flip", character: "Direct · compact", behavior: "The next operation pivots in" },
  { id: "ticker", name: "Ticker", character: "Measured · certain", behavior: "Segments mark steady progress" },
  { id: "focus", name: "Focus", character: "Minimal · refined", behavior: "The new thought resolves from blur" },
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1300);
  }

  return <button className="copy" type="button" onClick={copy}>{copied ? "Copied" : "Copy"}</button>;
}

function ThinkingGlyph({ variant }: { variant: MotionId }) {
  if (variant === "orbit") return <span className="glyph glyph-orbit" aria-hidden="true"><i /><i /><i /><b /></span>;
  if (variant === "wave") return <span className="glyph glyph-wave" aria-hidden="true">{Array.from({ length: 7 }, (_, index) => <i key={index} />)}</span>;
  if (variant === "drift") return <span className="glyph glyph-drift" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</span>;
  if (variant === "scan") return <span className="glyph glyph-scan" aria-hidden="true"><i /><b /><em /></span>;
  if (variant === "cascade") return <span className="glyph glyph-cascade" aria-hidden="true"><i /><i /><i /><i /></span>;
  if (variant === "thread") return <span className="glyph glyph-thread" aria-hidden="true"><i /><i /><i /><b /></span>;
  if (variant === "bloom") return <span className="glyph glyph-bloom" aria-hidden="true"><i /><i /><b /></span>;
  if (variant === "shuffle") return <span className="glyph glyph-shuffle" aria-hidden="true">{Array.from({ length: 9 }, (_, index) => <i key={index} />)}</span>;
  if (variant === "constellation") return <span className="glyph glyph-constellation" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <i key={index} />)}<b /><em /></span>;
  if (variant === "flip") return <span className="glyph glyph-flip" aria-hidden="true"><i>01</i><i>02</i><i>03</i></span>;
  if (variant === "ticker") return <span className="glyph glyph-ticker" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i key={index} />)}</span>;
  return <span className="glyph glyph-focus" aria-hidden="true"><i /><i /><i /></span>;
}

function ThinkingPill({ variant, step, large = false }: { variant: MotionId; step: Step; large?: boolean }) {
  return (
    <div className={`thinking-pill thinking-pill--${variant}${large ? " thinking-pill--large" : ""}`}>
      <ThinkingGlyph variant={variant} />
      <span className="thinking-label" aria-live="polite">
        <strong>{variant === "flip" ? step.short : step.label}</strong>
        {large ? <small>{step.detail}</small> : null}
      </span>
      {variant === "ticker" ? <span className="ticker-percent">72%</span> : null}
    </div>
  );
}

function VariationCard({ variation, step, selected, onSelect }: {
  variation: (typeof variations)[number];
  step: Step;
  selected: boolean;
  onSelect: () => void;
}) {
  function keyboardSelect(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  }

  return (
    <article className={`variation-card${selected ? " is-selected" : ""}`} tabIndex={0} onClick={onSelect} onKeyDown={keyboardSelect} aria-label={`${variation.name} animation variation`}>
      <header><span>{String(variations.indexOf(variation) + 1).padStart(2, "0")}</span><h2>{variation.name}</h2><small>{variation.character}</small></header>
      <div className="variation-stage"><ThinkingPill key={`${variation.id}-${step.label}`} variant={variation.id} step={step} /></div>
      <footer><p>{variation.behavior}</p><span>View in playground <i aria-hidden="true">↗</i></span></footer>
    </article>
  );
}

export default function Home() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selected, setSelected] = useState<MotionId>("orbit");
  const step = steps[stepIndex];
  const install = "npm install progress-narrative";

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setStepIndex((value) => (value + 1) % steps.length), 2400 / speed);
    return () => window.clearInterval(timer);
  }, [playing, speed]);

  const style = useMemo(() => ({ "--motion-speed": `${2.4 / speed}s` }) as CSSProperties, [speed]);
  const selectedVariation = variations.find((item) => item.id === selected) ?? variations[0];
  const usage = `import { ProgressNarrative } from "progress-narrative";\n\n<ProgressNarrative\n  variation="${selected}"\n  events={events}\n/>`;

  return (
    <main style={style}>
      <nav className="topbar">
        <a className="wordmark" href="#top"><span aria-hidden="true"><i /><i /><i /></span>Progress Narrative</a>
        <div><a href="#variations">12 variations</a><a href="#playground">Playground</a><a href="#install">Install</a></div>
        <span className="version">React · v1.0</span>
      </nav>

      <header className="intro" id="top">
        <div className="intro-mark" aria-hidden="true"><ThinkingGlyph variant="constellation" /></div>
        <p>Animated thinking steps for agent interfaces</p>
        <h1>Show the work.<br /><em>Shape the wait.</em></h1>
        <p className="intro-copy">Twelve motion directions for the same operational update. Compare them side by side, choose the right character, and make waiting feel intentional.</p>
        <div className="global-controls" aria-label="Animation controls">
          <button type="button" className={playing ? "is-active" : ""} onClick={() => setPlaying((value) => !value)}><i aria-hidden="true">{playing ? "Ⅱ" : "▶"}</i>{playing ? "Pause all" : "Play all"}</button>
          <span />
          <small>Speed</small>
          {[0.5, 1, 1.5].map((value) => <button type="button" className={speed === value ? "is-active" : ""} onClick={() => setSpeed(value)} key={value}>{value}×</button>)}
          <span />
          <small>Current step</small>
          <strong>0{stepIndex + 1} / 04</strong>
        </div>
      </header>

      <section className="variation-grid" id="variations" aria-label="Twelve thinking step animation variations">
        {variations.map((variation) => <VariationCard key={variation.id} variation={variation} step={step} selected={variation.id === selected} onSelect={() => setSelected(variation.id)} />)}
      </section>

      <section className="playground" id="playground">
        <div className="playground-head">
          <div><p>Interactive playground</p><h2>Make it yours.</h2></div>
          <p>Choose a motion direction and operation. Every variation preserves the same accessible status announcement.</p>
        </div>
        <div className="playground-shell">
          <div className="playground-controls">
            <fieldset><legend>Variation</legend><div>{variations.map((variation) => <button type="button" className={selected === variation.id ? "is-active" : ""} onClick={() => setSelected(variation.id)} key={variation.id}>{variation.name}</button>)}</div></fieldset>
            <fieldset><legend>Thinking step</legend><div>{steps.map((item, index) => <button type="button" className={stepIndex === index ? "is-active" : ""} onClick={() => { setStepIndex(index); setPlaying(false); }} key={item.short}>{item.short}</button>)}</div></fieldset>
          </div>
          <div className="playground-preview">
            <span className="preview-label">Live preview · {selectedVariation.name}</span>
            <ThinkingPill key={`${selected}-${stepIndex}`} variant={selected} step={step} large />
            <p>{selectedVariation.behavior}</p>
          </div>
          <div className="code-panel"><div><span>Usage</span><CopyButton value={usage} /></div><pre><code>{usage}</code></pre></div>
        </div>
      </section>

      <section className="install-section" id="install">
        <p>Bring one into your interface</p>
        <h2>Pick a motion.<br />Keep users in the loop.</h2>
        <div className="install-command"><code>{install}</code><CopyButton value={install} /></div>
      </section>

      <footer className="site-footer"><a className="wordmark" href="#top"><span aria-hidden="true"><i /><i /><i /></span>Progress Narrative</a><p>Operational updates, never private reasoning.</p><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}
