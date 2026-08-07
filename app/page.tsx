"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

type Variation =
  | "orbit" | "wave" | "drift" | "scan" | "cascade" | "thread"
  | "bloom" | "shuffle" | "constellation" | "flip" | "ticker" | "focus";

const states = [
  { label: "Searching 18 sources", detail: "Finding relevant context" },
  { label: "Reading 6 documents", detail: "Extracting useful details" },
  { label: "Comparing 12 patterns", detail: "Resolving the differences" },
  { label: "Drafting your answer", detail: "Putting it all together" },
];

const variations: Array<{ id: Variation; name: string; feel: string; color: string }> = [
  { id: "orbit", name: "Orbit", feel: "Calm", color: "#7357e8" },
  { id: "wave", name: "Wave", feel: "Fluid", color: "#1677ff" },
  { id: "drift", name: "Drift", feel: "Ambient", color: "#e05a8f" },
  { id: "scan", name: "Scan", feel: "Precise", color: "#00a17a" },
  { id: "cascade", name: "Cascade", feel: "Expressive", color: "#ed7c21" },
  { id: "thread", name: "Thread", feel: "Sequential", color: "#2176d2" },
  { id: "bloom", name: "Bloom", feel: "Soft", color: "#d85186" },
  { id: "shuffle", name: "Shuffle", feel: "Playful", color: "#7659dc" },
  { id: "constellation", name: "Constellation", feel: "Intelligent", color: "#1a8f70" },
  { id: "flip", name: "Flip", feel: "Direct", color: "#e36c2f" },
  { id: "ticker", name: "Ticker", feel: "Measured", color: "#2376d8" },
  { id: "focus", name: "Focus", feel: "Minimal", color: "#7559d9" },
];

const spring = { type: "spring" as const, stiffness: 360, damping: 28 };

function CopyButton({ value, compact = false }: { value: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }
  return (
    <motion.button className={compact ? "copy compact" : "copy"} type="button" onClick={copy} whileTap={{ scale: .94 }} transition={spring}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={copied ? "done" : "copy"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: .14 }}>
          {copied ? "Copied ✓" : "Copy"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

function Loader({ type, color, duration, paused }: { type: Variation; color: string; duration: number; paused: boolean }) {
  const reduceMotion = useReducedMotion();
  const d = reduceMotion || paused ? 0 : duration;
  const infinite = { repeat: d ? Infinity : 0, duration: d || .01, ease: "easeInOut" as const };

  if (type === "orbit") return (
    <span className="loader orbit-loader">
      {[0, 1, 2].map((i) => <motion.i key={i} style={{ color }} animate={{ rotate: d ? 360 : 0 }} transition={{ repeat: d ? Infinity : 0, duration: d * (1 + i * .22) || .01, ease: "linear", delay: -i * .35 }}><b /></motion.i>)}
      <motion.em style={{ background: color }} animate={{ scale: d ? [1, .72, 1] : 1 }} transition={infinite} />
    </span>
  );

  if (type === "wave") return (
    <span className="loader wave-loader">{[0, 1, 2, 3, 4, 5, 6].map((i) => <motion.i key={i} style={{ background: color }} animate={{ scaleY: d ? [.32, 1, .32] : .65, opacity: d ? [.35, 1, .35] : .7 }} transition={{ ...infinite, delay: i * .07 }} />)}</span>
  );

  if (type === "drift") return (
    <motion.span className="loader drift-loader" animate={{ rotate: d ? 360 : 0 }} transition={{ repeat: d ? Infinity : 0, duration: d * 3 || .01, ease: "linear" }}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => <motion.i key={i} style={{ background: i === 4 ? color : undefined, left: `${12 + (i * 23) % 65}%`, top: `${10 + (i * 31) % 70}%` }} animate={{ x: d ? [0, (i % 3 - 1) * 7, 0] : 0, y: d ? [0, ((i + 1) % 3 - 1) * 6, 0] : 0, scale: d ? [.65, 1.2, .65] : 1 }} transition={{ ...infinite, delay: i * .06 }} />)}
    </motion.span>
  );

  if (type === "scan") return (
    <span className="loader scan-loader"><i /><motion.b style={{ background: color, boxShadow: `0 0 10px ${color}` }} animate={{ y: d ? [-13, 13, -13] : 0 }} transition={infinite} /><motion.em animate={{ opacity: d ? [.2, .9, .2] : .6 }} transition={infinite} /></span>
  );

  if (type === "cascade") return (
    <span className="loader cascade-loader">{[.55, .9, .7, 1].map((width, i) => <motion.i key={i} style={{ width: `${width * 30}px`, background: i === 1 ? color : undefined }} animate={{ scaleX: d ? [.18, 1, .18] : 1, opacity: d ? [.25, 1, .25] : .75 }} transition={{ ...infinite, delay: i * .12 }} />)}</span>
  );

  if (type === "thread") return (
    <span className="loader thread-loader"><motion.b style={{ background: color }} animate={{ scaleX: d ? [0, 1, 1, 0] : 1 }} transition={infinite} />{[0, 1, 2].map((i) => <motion.i key={i} style={{ borderColor: color }} animate={{ backgroundColor: d ? ["#fff", color, "#fff"] : color, scale: d ? [1, 1.35, 1] : 1 }} transition={{ ...infinite, delay: i * .22 }} />)}</span>
  );

  if (type === "bloom") return (
    <span className="loader bloom-loader"><motion.b style={{ background: color }} animate={{ scale: d ? [1, .72, 1] : 1 }} transition={infinite} />{[0, 1, 2].map((i) => <motion.i key={i} style={{ borderColor: color }} animate={{ scale: d ? [.3, 2.5] : 1, opacity: d ? [.65, 0] : .2 }} transition={{ repeat: d ? Infinity : 0, duration: d || .01, ease: "easeOut", delay: i * (d / 3) }} />)}</span>
  );

  if (type === "shuffle") return (
    <span className="loader shuffle-loader">{[0,1,2,3,4,5,6,7,8].map((i) => <motion.i key={i} layout style={{ background: i === 4 ? color : undefined }} animate={{ x: d ? [0, (i % 2 ? 3 : -3), 0] : 0, y: d ? [0, (i % 3 - 1) * 4, 0] : 0, rotate: d ? [0, i % 2 ? 20 : -20, 0] : 0 }} transition={{ ...infinite, delay: i * .05 }} />)}</span>
  );

  if (type === "constellation") return (
    <span className="loader constellation-loader"><i className="line one" /><i className="line two" />{[0,1,2,3,4,5].map((i) => <motion.b key={i} style={{ background: i === 3 ? color : undefined }} animate={{ scale: d ? [.65, 1.45, .65] : 1, opacity: d ? [.4, 1, .4] : .8 }} transition={{ ...infinite, delay: i * .13 }} />)}</span>
  );

  if (type === "flip") return (
    <span className="loader flip-loader">{["01", "02", "03"].map((number, i) => <motion.i key={number} style={{ color: i === 1 ? color : undefined }} animate={{ rotateX: d ? [-90, 0, 90] : 0, opacity: d ? [0, 1, 0] : i === 1 ? 1 : 0 }} transition={{ repeat: d ? Infinity : 0, duration: d || .01, times: [0, .25, .55], delay: i * (d / 3), ease: "easeInOut" }}>{number}</motion.i>)}</span>
  );

  if (type === "ticker") return (
    <span className="loader ticker-loader">{[0,1,2,3,4,5,6,7].map((i) => <motion.i key={i} animate={{ backgroundColor: d ? ["#e5e7eb", color, "#e5e7eb"] : i < 5 ? color : "#e5e7eb", scaleY: d ? [.62, 1, .62] : 1 }} transition={{ ...infinite, delay: i * .11 }} />)}</span>
  );

  return (
    <span className="loader focus-loader"><motion.b style={{ background: color }} animate={{ scale: d ? [.65, 1, .65] : 1, filter: d ? ["blur(4px)", "blur(0px)", "blur(4px)"] : "blur(0px)" }} transition={infinite} />{[0,1,2].map((i) => <motion.i key={i} style={{ borderColor: color }} animate={{ scale: d ? [.78, 1.04, .78] : 1, opacity: d ? [.15, .55, .15] : .35 }} transition={{ ...infinite, delay: i * .12 }} />)}</span>
  );
}

function textMotion(type: Variation) {
  if (type === "scan") return { initial: { opacity: 0, clipPath: "inset(0 100% 0 0)" }, animate: { opacity: 1, clipPath: "inset(0 0% 0 0)" }, exit: { opacity: 0, clipPath: "inset(0 0 0 100%)" } };
  if (type === "flip") return { initial: { opacity: 0, rotateX: -75, y: 8 }, animate: { opacity: 1, rotateX: 0, y: 0 }, exit: { opacity: 0, rotateX: 75, y: -8 } };
  if (type === "focus") return { initial: { opacity: 0, filter: "blur(8px)", scale: .97 }, animate: { opacity: 1, filter: "blur(0px)", scale: 1 }, exit: { opacity: 0, filter: "blur(8px)", scale: 1.02 } };
  if (type === "cascade") return { initial: { opacity: 0, x: -12 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 12 } };
  return { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 } };
}

function ThinkingPill({ variation, stateIndex, duration, paused, large = false }: { variation: (typeof variations)[number]; stateIndex: number; duration: number; paused: boolean; large?: boolean }) {
  const state = states[stateIndex];
  const text = textMotion(variation.id);
  return (
    <motion.div className={`thinking-pill${large ? " large" : ""}`} layout transition={spring} style={{ "--accent": variation.color } as CSSProperties} whileHover={{ scale: large ? 1.015 : 1.025 }}>
      <Loader type={variation.id} color={variation.color} duration={duration} paused={paused} />
      <span className="status-copy">
        <AnimatePresence mode="wait" initial={false}>
          <motion.strong key={`${variation.id}-${stateIndex}`} initial={text.initial} animate={text.animate} exit={text.exit} transition={{ duration: .36, ease: [0.22, 1, 0.36, 1] }}>{state.label}</motion.strong>
        </AnimatePresence>
        {large ? <motion.small layout>{state.detail}</motion.small> : null}
      </span>
    </motion.div>
  );
}

export default function Home() {
  const [stateIndex, setStateIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [selected, setSelected] = useState<Variation>("orbit");
  const duration = 1.8 / speed;

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setStateIndex((value) => (value + 1) % states.length), 2200 / speed);
    return () => window.clearInterval(timer);
  }, [paused, speed]);

  const selectedVariation = useMemo(() => variations.find((item) => item.id === selected) ?? variations[0], [selected]);
  const install = "npm install progress-narrative";
  const code = `<ProgressNarrative\n  variation="${selected}"\n  events={events}\n/>`;

  return (
    <LayoutGroup>
      <main>
        <nav className="nav">
          <a className="brand" href="#top"><motion.span layoutId="brand-dot" />Progress Narrative</a>
          <div><a href="#variations">Variations</a><a href="#playground">Playground</a><a href="#install">Install</a></div>
          <a className="github" href="#install">Get started <span>↗</span></a>
        </nav>

        <header className="hero" id="top">
          <motion.div className="package-badge" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1, ...spring }}>React component · 12 motion styles</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .16, ...spring }}>Thinking steps,<br /><span>beautifully animated.</span></motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .28, duration: .4 }}>A tiny React library for showing clear, polished progress while agents work.</motion.p>
          <motion.div className="install-inline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .34, ...spring }}><code>{install}</code><CopyButton value={install} compact /></motion.div>
        </header>

        <section className="toolbar" aria-label="Animation controls">
          <div><span>12 variations</span><small>One component, twelve motion directions.</small></div>
          <div className="toolbar-actions">
            <motion.button type="button" onClick={() => setPaused((value) => !value)} whileTap={{ scale: .94 }}>{paused ? "▶ Play" : "Ⅱ Pause"}</motion.button>
            <span />
            {[.75, 1, 1.5].map((value) => <motion.button key={value} className={speed === value ? "active" : ""} type="button" onClick={() => setSpeed(value)} whileTap={{ scale: .92 }}>{value}×</motion.button>)}
          </div>
        </section>

        <section className="grid" id="variations" aria-label="Thinking animation variations">
          {variations.map((variation, index) => (
            <motion.article key={variation.id} className={selected === variation.id ? "card selected" : "card"} onClick={() => setSelected(variation.id)} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ delay: (index % 3) * .05, ...spring }} whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(30,34,45,.08)" }}>
              <header><span>{String(index + 1).padStart(2, "0")}</span><strong>{variation.name}</strong><small>{variation.feel}</small></header>
              <div className="demo"><ThinkingPill variation={variation} stateIndex={stateIndex} duration={duration} paused={paused} /></div>
              <footer><span style={{ background: variation.color }} />Click to customize <i>↗</i></footer>
            </motion.article>
          ))}
        </section>

        <section className="playground" id="playground">
          <div className="section-head"><div><span>Playground</span><h2>Try every state.</h2></div><p>Pick a variation, change the operation, and adjust the pace. Everything is driven by Framer Motion.</p></div>
          <div className="playground-box">
            <div className="controls">
              <label>Variation</label><div>{variations.map((variation) => <motion.button layout type="button" key={variation.id} className={selected === variation.id ? "active" : ""} onClick={() => setSelected(variation.id)} whileTap={{ scale: .94 }}>{selected === variation.id ? <motion.span layoutId="active-pill" /> : null}{variation.name}</motion.button>)}</div>
              <label>Step</label><div>{states.map((state, index) => <motion.button type="button" key={state.label} className={stateIndex === index ? "active" : ""} onClick={() => { setStateIndex(index); setPaused(true); }} whileTap={{ scale: .94 }}>{state.label.split(" ")[0]}</motion.button>)}</div>
            </div>
            <div className="preview"><ThinkingPill variation={selectedVariation} stateIndex={stateIndex} duration={duration} paused={paused} large /><p><span style={{ background: selectedVariation.color }} />{selectedVariation.name} · {selectedVariation.feel}</p></div>
            <div className="usage"><div><span>Usage</span><CopyButton value={code} compact /></div><pre><code>{code}</code></pre></div>
          </div>
        </section>

        <section className="install" id="install"><span>Install</span><h2>One command.<br />Twelve ways to think.</h2><div className="install-inline large"><code>{install}</code><CopyButton value={install} compact /></div></section>
        <footer className="footer"><a className="brand" href="#top"><span />Progress Narrative</a><p>MIT · React · Framer Motion</p><a href="#top">Back to top ↑</a></footer>
      </main>
    </LayoutGroup>
  );
}
