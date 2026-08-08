"use client";

import { ImageLoader, InlineLoader, TextLoader, type ImageLoaderVariant, type InlineLoaderVariant, type TextLoaderVariant } from "generative-loaders";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const sampleText = "Ideas arrive quietly,\nthen become something clear.";

const loaders: Array<{ id: TextLoaderVariant; name: string }> = [
  { id: "decode", name: "Decode" },
  { id: "typewriter", name: "Typewriter" },
  { id: "skeleton", name: "Skeleton" },
  { id: "cascade", name: "Cascade" },
  { id: "focus", name: "Focus" },
  { id: "wipe", name: "Wipe" },
  { id: "flip", name: "Flip" },
  { id: "redact", name: "Redact" },
  { id: "line", name: "Line by line" },
  { id: "terminal", name: "Terminal" },
  { id: "wave", name: "Wave" },
  { id: "dissolve", name: "Dissolve" },
  { id: "slice", name: "Slice" },
  { id: "tracking", name: "Tracking" },
  { id: "coalesce", name: "Coalesce" },
  { id: "fragments", name: "Fragments" },
];

const inlineLoaders: Array<{ id: InlineLoaderVariant; name: string; copy: string }> = [
  { id: "glyph", name: "Glyph", copy: "Finding the right shape…" },
  { id: "matrix", name: "Matrix", copy: "Mapping the response…" },
  { id: "orbit", name: "Orbit", copy: "Gathering context…" },
  { id: "ripple", name: "Ripple", copy: "Thinking this through…" },
  { id: "signal", name: "Signal", copy: "Reading the details…" },
  { id: "spark", name: "Spark", copy: "Composing an answer…" },
  { id: "rotor", name: "Rotor", copy: "Spinning up an idea…" },
  { id: "pixel-drift", name: "Pixel drift", copy: "Resolving the picture…" },
  { id: "chomp", name: "Chomp", copy: "Working through the queue…" },
  { id: "snake", name: "Snake", copy: "Following the thread…" },
  { id: "fold", name: "Fold", copy: "Turning this over…" },
  { id: "gravity", name: "Gravity", copy: "Drawing signals inward…" },
  { id: "domino", name: "Domino", copy: "Setting things in motion…" },
  { id: "aperture", name: "Aperture", copy: "Bringing it into focus…" },
];

const imageLoaders: Array<{ id: ImageLoaderVariant; name: string }> = [
  { id: "skeleton", name: "Skeleton" },
  { id: "bands", name: "Bands" },
  { id: "tiles", name: "Tiles" },
  { id: "scan", name: "Scan" },
  { id: "pixel-grid", name: "Pixel grid" },
  { id: "resolution", name: "Resolution" },
  { id: "focus", name: "Focus" },
  { id: "shutter", name: "Shutter" },
  { id: "contour", name: "Contour" },
];

const resolveCells = Array.from({ length: 16 }, (_, index) => ({
  index,
  x: index % 4,
  y: Math.floor(index / 4),
}));

const speeds = [0.75, 1, 1.5];
const spring = { type: "spring" as const, stiffness: 340, damping: 30 };

type Theme = "light" | "dark";

function ThemeIcon({ theme }: { theme: Theme }) {
  return theme === "dark" ? <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.2 15.7A8.5 8.5 0 0 1 8.3 3.8 8.5 8.5 0 1 0 20.2 15.7Z" /></svg> : <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1300);
  }
  return <motion.button className="copy-button" type="button" onClick={copy} whileTap={{ scale: .95 }}><AnimatePresence mode="wait" initial={false}><motion.span key={copied ? "copied" : "copy"} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ duration: .13 }}>{copied ? "Copied ✓" : "Copy"}</motion.span></AnimatePresence></motion.button>;
}

function StreamingDemo({ text, variant, color, speed, paused, phase = 0 }: { text: string; variant: TextLoaderVariant; color: string; speed: number; paused: boolean; phase?: number }) {
  const chunks = useMemo(() => text.match(/\S+\s*/g) ?? [], [text]);
  const [received, setReceived] = useState(0);
  const [fading, setFading] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (paused) return;
    const complete = received >= chunks.length;
    const timer = window.setTimeout(() => {
      if (fading) {
        setReceived(0);
        setFading(false);
      } else if (complete) {
        setFading(true);
      } else {
        setStarted(true);
        setReceived(received + 1);
      }
    }, fading ? 240 : complete ? 1000 : 320 / speed + (started ? 0 : phase));
    return () => window.clearTimeout(timer);
  }, [chunks.length, fading, paused, phase, received, speed, started]);

  const receivedText = variant === "skeleton"
    ? (received >= chunks.length ? chunks.join("") : "")
    : chunks.slice(0, received).join("");

  return <motion.span className="stream-demo-frame" animate={{ opacity: fading ? 0 : 1 }} transition={{ duration: .24, ease: [0.22, 0.65, 0.3, 1] }}><TextLoader text={receivedText} variant={variant} color={color} speed={speed} paused={paused} /></motion.span>;
}

function ImageResolveVisual({ variant }: { variant: ImageLoaderVariant }) {
  if (variant === "skeleton") return <span className="image-resolve-preview" />;
  if (variant === "bands") return <span className="image-resolve-bands">{Array.from({ length: 3 }, (_, index) => <i key={index} style={{ "--resolve-i": index, "--resolve-position": `${index * 50}%` } as React.CSSProperties} />)}</span>;
  if (variant === "tiles" || variant === "pixel-grid") return <span className={`image-resolve-${variant}`}>{resolveCells.map(({ index, x, y }) => <i key={index} style={{ "--resolve-x": x, "--resolve-y": y, "--resolve-position-x": `${x * 33.333}%`, "--resolve-position-y": `${y * 33.333}%`, "--resolve-delay": `${(x + y) * .045}s` } as React.CSSProperties} />)}</span>;
  if (variant === "scan") return <span className="image-resolve-scan"><i /><b /></span>;
  if (variant === "resolution") return <span className="image-resolve-resolution"><i /><i /><b /></span>;
  if (variant === "focus") return <span className="image-resolve-focus" />;
  if (variant === "shutter") return <span className="image-resolve-shutter"><i /><i /></span>;
  return <span className="image-resolve-contour"><i />{Array.from({ length: 4 }, (_, index) => <b key={index} />)}</span>;
}

function ImageLoaderDemo({ variant, color, speed, paused }: { variant: ImageLoaderVariant; color: string; speed: number; paused: boolean }) {
  const [phase, setPhase] = useState<"loading" | "resolving" | "loaded">("loading");

  useEffect(() => {
    if (paused) return;
    const nextPhase = phase === "loading" ? "resolving" : phase === "resolving" ? "loaded" : "loading";
    const phaseDuration = phase === "loading" ? 2300 : phase === "resolving" ? 1050 : 1800;
    const timer = window.setTimeout(
      () => setPhase(nextPhase),
      phaseDuration / speed,
    );
    return () => window.clearTimeout(timer);
  }, [paused, phase, speed]);

  return <span className="image-demo-stage" data-phase={phase} data-paused={paused ? "true" : "false"} data-variant={variant}>
    <AnimatePresence initial={false} mode="sync">
      {phase === "loading" && <motion.span className="image-loader-layer" key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: .99 }} transition={{ duration: .3 / speed, ease: [0.65, 0, 0.35, 1] }}>
        <ImageLoader variant={variant} size="100%" speed={speed} color={color} paused={paused} label={`${variant} image generation`} />
      </motion.span>}
      {phase === "resolving" && <motion.span className={`image-resolve-layer image-resolve-layer-${variant}`} key="resolving" role="status" aria-label="Resolving image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .16 / speed }} style={{ "--resolve-duration": `${1.05 / speed}s` } as React.CSSProperties}>
        <ImageResolveVisual variant={variant} />
      </motion.span>}
    </AnimatePresence>
    <motion.img
      className="image-demo-result"
      src="/image-loader-sample.png"
      alt=""
      aria-hidden="true"
      initial={false}
      animate={{ opacity: phase === "loaded" ? 1 : 0 }}
      transition={{ duration: .2 / speed, ease: [0.65, 0, 0.35, 1] }}
    />
  </span>;
}

export default function Home() {
  const [theme, setTheme] = useState<Theme>("light");
  const [collection, setCollection] = useState<"text" | "inline" | "image">("text");
  const [selected, setSelected] = useState<TextLoaderVariant>("decode");
  const [text, setText] = useState("Language takes shape one moment at a time.");
  const [color, setColor] = useState("#111111");
  const [speed, setSpeed] = useState(1);
  const [paused, setPaused] = useState(false);
  const [restartKey, setRestartKey] = useState(0);
  const loaderColor = theme === "dark" ? "#f4f4f5" : "#111111";
  const current = useMemo(() => loaders.find((loader) => loader.id === selected) ?? loaders[0], [selected]);
  const install = "npm install generative-loaders";
  const usage = `import { TextLoader } from "generative-loaders";\nimport "generative-loaders/styles.css";\n\n<TextLoader\n  text={streamedText}\n  variant="${selected}"\n  color="${color}"\n  speed={${speed}}\n/>`;

  useEffect(() => {
    const activeTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const frame = window.requestAnimationFrame(() => {
      setTheme(activeTheme);
      setColor(activeTheme === "dark" ? "#f4f4f5" : "#111111");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    const previousDefault = theme === "dark" ? "#f4f4f5" : "#111111";
    setTheme(nextTheme);
    if (color.toLowerCase() === previousDefault) setColor(nextTheme === "dark" ? "#f4f4f5" : "#111111");
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem("theme", nextTheme);
  }

  function restart() {
    setRestartKey((value) => value + 1);
    setPaused(false);
  }

  function selectLoader(loader: (typeof loaders)[number]) {
    setSelected(loader.id);
    setColor(loaderColor);
    restart();
  }

  function selectCollection(next: "text" | "inline" | "image") {
    if (next === collection) return;
    setCollection(next);
    restart();
  }

  return <main id="top">
    <nav className="nav shell">
      <a className="brand" href="#top"><span className="brand-mark"><i /><i /><i /></span>Generative Loaders</a>
      <div className="nav-links"><a href="#loaders">Loaders</a><a href="#playground">Playground</a><a href="#api">API</a></div>
      <div className="nav-actions"><button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}><ThemeIcon theme={theme} /></button><a className="nav-install" href="#install">Install <span>↘</span></a></div>
    </nav>

    <header className="hero shell">
      <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08, ...spring }}>React loaders for<br /><span>generative UI.</span></motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .18 }}>Text, inline, and image loading states.</motion.p>
      <motion.div className="install-command" id="install" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3, ...spring }}><code>{install}</code><CopyButton value={install} /></motion.div>
    </header>

    <section className="gallery shell" id="loaders" aria-labelledby="gallery-title">
      <div className="gallery-toolbar">
        <div className="collection-tabs" role="tablist" aria-label="Loader collection">
            <button type="button" role="tab" aria-selected={collection === "text"} className={collection === "text" ? "active" : ""} onClick={() => selectCollection("text")}>Text loaders <span>16</span></button>
            <button type="button" role="tab" aria-selected={collection === "inline"} className={collection === "inline" ? "active" : ""} onClick={() => selectCollection("inline")}>Inline loaders <span>14</span></button>
            <button type="button" role="tab" aria-selected={collection === "image"} className={collection === "image" ? "active" : ""} onClick={() => selectCollection("image")}>Image loaders <span>09</span></button>
        </div>
        <h2 id="gallery-title" className="sr-only">{collection === "text" ? "Text loaders" : collection === "inline" ? "Inline loaders" : "Image loaders"}</h2>
        <div className="global-controls">
          <button type="button" onClick={() => setPaused((value) => !value)}>{paused ? "▶ Play" : "Ⅱ Pause"}</button>
          <button type="button" onClick={restart}>↻ Restart</button><span />
          {speeds.map((value) => <button key={value} className={speed === value ? "active" : ""} type="button" onClick={() => setSpeed(value)}>{value}×</button>)}
        </div>
      </div>
      {collection === "text" ? <div className="loader-grid" role="tabpanel" aria-label="Text loaders">
        {loaders.map((loader, index) => <motion.button
          className={`loader-card${selected === loader.id ? " selected" : ""}`}
          style={{ "--card-color": loaderColor } as React.CSSProperties}
          type="button"
          key={loader.id}
          onClick={() => selectLoader(loader)}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: .15 }}
          transition={{ delay: (index % 4) * .04, ...spring }}
          whileHover={{ y: -3 }}
        >
          <span className="card-top"><span>{String(index + 1).padStart(2, "0")}</span><small>{loader.name}</small></span>
          <span className="card-demo"><StreamingDemo key={`${loader.id}-${restartKey}-${theme}`} text={sampleText} variant={loader.id} color={loaderColor} speed={speed} paused={paused} phase={index * 12} /></span>
          <span className="card-copy"><strong>{loader.name}</strong></span>
          <span className="card-arrow">↗</span>
        </motion.button>)}
      </div> : collection === "inline" ? <div className="inline-gallery" role="tabpanel" aria-label="Inline loaders" key={`inline-${restartKey}`}>
        {inlineLoaders.map((loader, index) => <motion.div
          className="inline-card"
          key={loader.id}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: .3 }}
          transition={{ delay: (index % 3) * .05, ...spring }}
        >
          <span className="inline-number">{String(index + 1).padStart(2, "0")}</span>
          <div className="inline-demo"><InlineLoader variant={loader.id} size={28} speed={speed} color={loaderColor} paused={paused} /><span>{loader.copy}</span></div>
          <div className="inline-copy"><strong>{loader.name}</strong></div>
        </motion.div>)}
      </div> : <div className="image-gallery" role="tabpanel" aria-label="Image loaders" key={`image-${restartKey}`}>
        {imageLoaders.map((loader, index) => <motion.div
          className="image-card"
          key={loader.id}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: .25 }}
          transition={{ delay: (index % 4) * .05, ...spring }}
        >
          <span className="image-number">{String(index + 1).padStart(2, "0")}</span>
          <div className="image-demo"><ImageLoaderDemo variant={loader.id} speed={speed} color={loaderColor} paused={paused} /></div>
          <div className="image-copy"><strong>{loader.name}</strong></div>
        </motion.div>)}
      </div>}
    </section>

    <section className="playground shell" id="playground" aria-labelledby="playground-title">
      <div className="section-heading"><h2 id="playground-title">Playground</h2></div>
      <div className="playground-panel">
        <div className="playground-controls">
          <fieldset><legend>Variant</legend><div className="variant-list">{loaders.map((loader) => <button className={selected === loader.id ? "active" : ""} key={loader.id} type="button" onClick={() => selectLoader(loader)}>{loader.name}</button>)}</div></fieldset>
          <fieldset><legend>Speed</legend><div className="segmented">{speeds.map((value) => <button className={speed === value ? "active" : ""} key={value} type="button" onClick={() => { setSpeed(value); restart(); }}>{value}×</button>)}</div></fieldset>
          <label className="field"><span>Color</span><span className="color-field"><input aria-label="Text color" type="color" value={color} onChange={(event) => setColor(event.target.value)} /><code>{color}</code></span></label>
          <label className="field"><span>Text</span><textarea value={text} onChange={(event) => setText(event.target.value)} rows={5} /></label>
          <div className="playback-controls"><button type="button" onClick={() => setPaused((value) => !value)}>{paused ? "Play" : "Pause"}</button><button type="button" onClick={restart}>Restart</button></div>
        </div>
        <div className="playground-preview">
          <div className="preview-grid" />
          <StreamingDemo key={`${selected}-${restartKey}-${text}`} text={text || "Start typing…"} variant={selected} color={color} speed={speed} paused={paused} />
          <p><span style={{ background: color }} />{current.name} · {speed}×</p>
        </div>
        <div className="code-block"><header><span>Usage</span><CopyButton value={usage} /></header><pre><code>{usage}</code></pre></div>
      </div>
    </section>

    <section className="api shell" id="api" aria-labelledby="api-title">
      <div className="section-heading"><h2 id="api-title">API</h2></div>
      <h3>TextLoader</h3>
      <div className="api-table" role="table" aria-label="TextLoader props">
        {[['text', 'accumulated string', 'required'], ['variant', 'TextLoaderVariant', 'required'], ['color', 'CSS color', '#111111'], ['speed', 'positive number', '1'], ['paused', 'boolean', 'false']].map(([name, type, fallback]) => <div role="row" key={name}><code role="cell">{name}</code><span role="cell">{type}</span><small role="cell">{fallback}</small></div>)}
      </div>
      <h3>InlineLoader</h3>
      <div className="api-table inline-api" role="table" aria-label="InlineLoader props">
        {[['variant', 'InlineLoaderVariant', 'required'], ['size', 'number | CSS size', '1.15em'], ['color', 'CSS color', 'currentColor'], ['speed', 'positive number', '1'], ['paused', 'boolean', 'false'], ['label', 'string', 'decorative']].map(([name, type, fallback]) => <div role="row" key={name}><code role="cell">{name}</code><span role="cell">{type}</span><small role="cell">{fallback}</small></div>)}
      </div>
      <h3>ImageLoader</h3>
      <div className="api-table inline-api" role="table" aria-label="ImageLoader props">
        {[['variant', 'ImageLoaderVariant', 'required'], ['size', 'number | CSS size', '10rem'], ['color', 'CSS color', 'currentColor'], ['radius', 'number | CSS size', '10%'], ['speed', 'positive number', '1'], ['paused', 'boolean', 'false'], ['label', 'string', 'Generating image']].map(([name, type, fallback]) => <div role="row" key={name}><code role="cell">{name}</code><span role="cell">{type}</span><small role="cell">{fallback}</small></div>)}
      </div>
    </section>

    <footer className="footer shell"><a className="brand" href="#top"><span className="brand-mark"><i /><i /><i /></span>Generative Loaders</a><p>MIT · React · Framer Motion</p><a href="#top">Back to top ↑</a></footer>
  </main>;
}
