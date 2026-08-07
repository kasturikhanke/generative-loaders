"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ProgressNarrative,
  type NarrativeMotion,
  type ProgressAction,
  type ProgressEvent,
} from "progress-narrative";
import "progress-narrative/styles.css";

type DemoScene = {
  id: string;
  tab: string;
  eyebrow: string;
  title: string;
  accent: string;
  events: ProgressEvent[];
};

const scenes: DemoScene[] = [
  {
    id: "weekend",
    tab: "Plan a trip",
    eyebrow: "Weekend brief · Copenhagen",
    title: "Finding the places worth crossing town for.",
    accent: "#b8f56a",
    events: [
      { id: "map", action: "search", phase: "complete", count: 24, subject: "local guides" },
      { id: "read", action: "read", phase: "complete", count: 9, subject: "shortlists" },
      { id: "compare", action: "compare", phase: "active", count: 12, subject: "neighborhood picks" },
      { id: "verify", action: "verify", phase: "active", count: 7, subject: "opening hours" },
      { id: "ready", action: "complete", phase: "complete", result: "Weekend brief ready" },
    ],
  },
  {
    id: "release",
    tab: "Ship a release",
    eyebrow: "Production release · v2.4",
    title: "Taking the new checkout safely to production.",
    accent: "#9ad7ff",
    events: [
      { id: "tests", action: "verify", phase: "complete", count: 184, subject: "tests" },
      { id: "bundle", action: "analyze", phase: "complete", count: 6, subject: "bundles" },
      { id: "regions", action: "compare", phase: "active", count: 3, subject: "edge regions" },
      { id: "health", action: "wait", phase: "active", subject: "for health checks" },
      { id: "live", action: "complete", phase: "complete", result: "Release is live" },
    ],
  },
  {
    id: "library",
    tab: "Organize files",
    eyebrow: "Photo library · 2,418 items",
    title: "Turning a camera roll into a library you can search.",
    accent: "#ffb4ce",
    events: [
      { id: "scan", action: "analyze", phase: "complete", count: 2418, subject: "photos" },
      { id: "duplicates", action: "compare", phase: "complete", count: 68, subject: "possible duplicates" },
      { id: "dates", action: "verify", phase: "active", count: 312, subject: "dates and places" },
      { id: "albums", action: "draft", phase: "active", count: 14, subject: "smart albums" },
      { id: "done", action: "complete", phase: "complete", result: "Library organized" },
    ],
  },
];

const motionRecipes: Array<{
  motion: NarrativeMotion;
  label: string;
  note: string;
}> = [
  { motion: "flow", label: "Flow", note: "Continuous" },
  { motion: "focus", label: "Focus", note: "Quiet" },
  { motion: "cascade", label: "Cascade", note: "Expressive" },
  { motion: "snap", label: "Snap", note: "Responsive" },
];

const installCommand = "npm install progress-narrative";

function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button className="copy-button" type="button" onClick={copy} aria-label={`${label} to clipboard`}>
      <span className="copy-icon" aria-hidden="true" />
      {copied ? "Copied" : label}
    </button>
  );
}

function StoryDemo({ scene, step }: { scene: DemoScene; step: number }) {
  const visible = scene.events.slice(0, step + 1).map((event, index) => ({
    ...event,
    phase: index < step ? "complete" as const : event.phase,
  }));
  const current = visible.at(-1);
  const percentage = Math.round(((step + 1) / scene.events.length) * 100);

  return (
    <div className="story-window" style={{ "--demo-accent": scene.accent } as React.CSSProperties}>
      <div className="window-bar">
        <div className="traffic-lights" aria-hidden="true"><i /><i /><i /></div>
        <span>Live preview</span>
        <span className="window-status"><i /> Working</span>
      </div>

      <div className="story-body">
        <div className="story-context">
          <span className="scene-number">0{scenes.findIndex((item) => item.id === scene.id) + 1}</span>
          <p>{scene.eyebrow}</p>
          <h2>{scene.title}</h2>
        </div>

        <div className="activity-card">
          <div className="activity-head">
            <div>
              <span className="activity-label">Progress</span>
              <strong>{percentage}%</strong>
            </div>
            <div className="progress-track"><i style={{ width: `${percentage}%` }} /></div>
          </div>

          <ol className="story-steps" aria-label="Activity progress">
            {scene.events.map((event, index) => {
              const complete = index < step || step === scene.events.length - 1;
              const active = index === step && !complete;
              return (
                <li key={event.id} className={complete ? "is-complete" : active ? "is-active" : "is-pending"}>
                  <span className="step-mark" aria-hidden="true">{complete ? "✓" : active ? "" : index + 1}</span>
                  <span>
                    <strong>{event.result ?? event.message ?? `${event.action[0].toUpperCase()}${event.action.slice(1)}${event.count ? ` ${event.count}` : ""} ${event.subject ?? ""}`}</strong>
                    <small>{complete ? "Complete" : active ? "In progress now" : "Coming up"}</small>
                  </span>
                  {active ? <i className="active-wave" aria-hidden="true"><b /><b /><b /></i> : null}
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="live-line">
        <span className="live-label"><i /> Live</span>
        <ProgressNarrative events={visible} history="hidden" minVisibleMs={280} motion="flow" />
        <span className="event-count">0{Math.min(step + 1, scene.events.length)} / 0{scene.events.length}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [step, setStep] = useState(2);
  const [playing, setPlaying] = useState(true);
  const [motion, setMotion] = useState<NarrativeMotion>("cascade");
  const [action, setAction] = useState<ProgressAction>("search");
  const [galleryKey, setGalleryKey] = useState(0);
  const [liked, setLiked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [switchOn, setSwitchOn] = useState(true);
  const [saved, setSaved] = useState(false);
  const scene = scenes[sceneIndex];

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setStep((value) => (value + 1) % scene.events.length);
    }, 2100);
    return () => window.clearInterval(timer);
  }, [playing, scene.events.length]);

  const playgroundEvents = useMemo<ProgressEvent[]>(() => [{
    id: `${action}-${motion}`,
    action,
    phase: action === "complete" ? "complete" : "active",
    count: action === "complete" ? undefined : 18,
    subject: action === "complete" ? undefined : action === "search" ? "independent sources" : "design details",
    result: action === "complete" ? "Research brief ready" : undefined,
  }], [action, motion]);

  const recipeCode = `<ProgressNarrative\n  events={events}\n  motion="${motion}"\n  history="collapsible"\n/>`;

  function chooseScene(index: number) {
    setSceneIndex(index);
    setStep(0);
    setPlaying(true);
  }

  return (
    <main>
      <nav className="nav-shell" aria-label="Primary navigation">
        <a className="brand" href="#top"><span aria-hidden="true"><i /><i /><i /></span>Progress Narrative</a>
        <div className="nav-links"><a href="#recipes">Recipes</a><a href="#playground">Playground</a><a href="#install">Install</a></div>
        <a className="nav-cta" href="#install">Get the component <span aria-hidden="true">↗</span></a>
      </nav>

      <header className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span>Open-source React interaction</span><i>v1.0</i></p>
          <h1>Make waiting<br />feel <em>alive.</em></h1>
          <p className="hero-lede">A small, expressive progress component for the moments between a click and a result. Clear enough to trust. Polished enough to remember.</p>
          <div className="hero-actions">
            <div className="install-pill"><code>{installCommand}</code><CopyButton value={installCommand} /></div>
            <a href="#recipes">Explore the details <span aria-hidden="true">↓</span></a>
          </div>
          <div className="proof-row" aria-label="Project qualities">
            <span><i>01</i> Accessible by default</span>
            <span><i>02</i> Six motion styles</span>
            <span><i>03</i> 3.2kb gzipped</span>
          </div>
        </div>

        <div className="hero-demo">
          <div className="scene-tabs" role="tablist" aria-label="Demo scenarios">
            {scenes.map((item, index) => (
              <button type="button" role="tab" aria-selected={index === sceneIndex} key={item.id} onClick={() => chooseScene(index)}>
                <span>0{index + 1}</span>{item.tab}
              </button>
            ))}
            <button className="demo-control" type="button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause demo" : "Play demo"}>
              {playing ? "Ⅱ" : "▶"}
            </button>
          </div>
          <StoryDemo scene={scene} step={step} />
        </div>
      </header>

      <section className="marquee" aria-label="Component features">
        <div><span>Token-level transitions</span><i>✦</i><span>Live region announcements</span><i>✦</i><span>Motion with meaning</span><i>✦</i><span>Themeable in seconds</span><i>✦</i><span>Token-level transitions</span></div>
      </section>

      <section className="motion-wall section-shell" id="interactions">
        <div className="motion-wall-head">
          <div>
            <p className="section-kicker">The interaction wall / 12 studies</p>
            <h2>More than a loading line.<br /><em>A whole language of feedback.</em></h2>
          </div>
          <button type="button" onClick={() => setGalleryKey((value) => value + 1)}><span aria-hidden="true">↻</span> Replay everything</button>
        </div>

        <div className="interaction-grid" key={galleryKey}>
          <article className="interaction-tile tile-search">
            <div className="tile-top"><span>01 · Search reveal</span><small>Auto</small></div>
            <div className="tile-canvas">
              <div className="search-box"><i aria-hidden="true" /><span>restaurant with a view</span><b /></div>
              <div className="search-result"><span className="result-thumb">N</span><span><strong>Noma Projects</strong><small>Østerbro · 4.9</small></span><em>↗</em></div>
            </div>
            <p>Reveal the best match as the query resolves.</p>
          </article>

          <article className="interaction-tile tile-toast">
            <div className="tile-top"><span>02 · Toast choreography</span><small>Auto</small></div>
            <div className="tile-canvas toast-stage">
              <div className="toast toast-one"><i>✓</i><span><strong>Changes published</strong><small>Just now</small></span></div>
              <div className="toast toast-two"><i>↗</i><span><strong>Preview is ready</strong><small>Open in new tab</small></span></div>
              <div className="toast toast-three"><i>2</i><span><strong>New comments</strong><small>Maya and Rowan</small></span></div>
            </div>
            <p>Stagger alerts so they arrive as a readable queue.</p>
          </article>

          <article className="interaction-tile tile-magnetic">
            <div className="tile-top"><span>03 · Magnetic action</span><small>Hover</small></div>
            <div className="tile-canvas magnetic-stage">
              <button type="button" className="magnetic-button"><span>Start a project</span><i aria-hidden="true">↗</i></button>
              <div className="magnetic-orbit" aria-hidden="true"><i /><i /></div>
            </div>
            <p>A tiny pull makes the primary action feel tangible.</p>
          </article>

          <article className="interaction-tile tile-counter">
            <div className="tile-top"><span>04 · Rolling metric</span><small>Auto</small></div>
            <div className="tile-canvas counter-stage">
              <span>Conversion</span>
              <div className="rolling-number"><strong>+</strong><i><b>0<br />1<br />2<br />3<br />4<br />5<br />6<br />7<br />8</b></i><i className="digit-two"><b>0<br />1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9</b></i><em>.4%</em></div>
              <div className="micro-chart" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></div>
            </div>
            <p>Animate the value, then let the number hold attention.</p>
          </article>

          <article className="interaction-tile tile-dock">
            <div className="tile-top"><span>05 · Proximity dock</span><small>Hover</small></div>
            <div className="tile-canvas dock-stage">
              <div className="mini-window"><span /><span /><span /></div>
              <div className="dock" aria-label="Example navigation">
                <button type="button" aria-label="Home">⌂</button><button type="button" aria-label="Search">⌕</button><button type="button" aria-label="Add">＋</button><button type="button" aria-label="Messages">✦</button><button type="button" aria-label="Profile">◉</button>
              </div>
            </div>
            <p>Scale controls by proximity, not just on/off hover.</p>
          </article>

          <article className="interaction-tile tile-orbit">
            <div className="tile-top"><span>06 · Ambient orbit</span><small>Auto</small></div>
            <div className="tile-canvas orbit-stage">
              <div className="orbit-copy"><strong>Everything synced</strong><small>Across 3 devices</small></div>
              <div className="orbit-system" aria-hidden="true"><span>✓</span><i /><i /><i /></div>
            </div>
            <p>Let a calm ambient loop carry background status.</p>
          </article>

          <article className="interaction-tile tile-ring">
            <div className="tile-top"><span>07 · Elastic progress</span><small>Auto</small></div>
            <div className="tile-canvas ring-stage">
              <div className="progress-ring"><span>84<small>%</small></span></div>
              <div><strong>Uploading campaign.mov</strong><small>42.8 MB of 51 MB</small><button type="button">Cancel</button></div>
            </div>
            <p>Pair exact progress with a softer, elastic finish.</p>
          </article>

          <article className="interaction-tile tile-tilt">
            <div className="tile-top"><span>08 · Dimensional card</span><small>Hover</small></div>
            <div className="tile-canvas tilt-stage">
              <div className="tilt-card"><span>PRO / 08</span><strong>Motion<br />makes meaning.</strong><i>Explore ↗</i></div>
            </div>
            <p>Depth and glare turn a static card into an object.</p>
          </article>

          <article className="interaction-tile tile-toggle">
            <div className="tile-top"><span>09 · State bloom</span><small>Click</small></div>
            <div className="tile-canvas toggle-stage">
              <div><strong>Focus mode</strong><small>Mute everything else</small></div>
              <button className={switchOn ? "switch is-on" : "switch"} type="button" role="switch" aria-checked={switchOn} onClick={() => setSwitchOn((value) => !value)}><span /></button>
              <i className={switchOn ? "state-bloom is-on" : "state-bloom"} aria-hidden="true" />
            </div>
            <p>Make a state change radiate beyond the switch.</p>
          </article>

          <article className="interaction-tile tile-like">
            <div className="tile-top"><span>10 · Particle favorite</span><small>Click</small></div>
            <div className="tile-canvas like-stage">
              <button className={liked ? "like-button is-liked" : "like-button"} type="button" aria-pressed={liked} onClick={() => setLiked((value) => !value)}><span aria-hidden="true">♥</span><strong>{liked ? "2,849" : "2,848"}</strong><i /><i /><i /><i /></button>
            </div>
            <p>Reward intent with a crisp pop, count, and particles.</p>
          </article>

          <article className="interaction-tile tile-follow">
            <div className="tile-top"><span>11 · Morphing follow</span><small>Click</small></div>
            <div className="tile-canvas follow-stage">
              <div className="avatar-stack"><span>RA</span><i /><i /></div>
              <div><strong>Rowan Ames</strong><small>Product designer</small></div>
              <button className={following ? "is-following" : ""} type="button" onClick={() => setFollowing((value) => !value)}>{following ? "Following ✓" : "Follow +"}</button>
            </div>
            <p>Let the control physically settle into its new state.</p>
          </article>

          <article className="interaction-tile tile-save">
            <div className="tile-top"><span>12 · Save confirmation</span><small>Click</small></div>
            <div className="tile-canvas save-stage">
              <button className={saved ? "save-button is-saved" : "save-button"} type="button" onClick={() => setSaved((value) => !value)}><i aria-hidden="true">{saved ? "✓" : "↓"}</i><span>{saved ? "Saved to collection" : "Save interaction"}</span><em>{saved ? "View" : "⌘ S"}</em></button>
            </div>
            <p>Confirm the action inside the control that caused it.</p>
          </article>
        </div>
      </section>

      <section className="recipes section-shell" id="recipes">
        <div className="section-intro">
          <p className="section-kicker">Interaction recipes / 01—04</p>
          <h2>Details people<br />actually <em>feel.</em></h2>
          <p>Not decoration. Each behavior gives users a little more certainty, continuity, or control.</p>
        </div>

        <div className="recipe-grid">
          <article className="recipe recipe-featured">
            <div className="recipe-meta"><span>01 · Continuity</span><small>Keep stable words still</small></div>
            <div className="token-stage">
              <span className="token-ghost">Reviewing</span>
              <strong>18</strong>
              <span>design details</span>
              <div className="token-note"><i /> Only changed tokens move</div>
            </div>
            <div className="recipe-copy"><h3>Change what changed.</h3><p>Stable words hold their position while new information settles in. The update feels continuous instead of replaced.</p></div>
          </article>

          <article className="recipe recipe-motion">
            <div className="recipe-meta"><span>02 · Character</span><small>One signal, four moods</small></div>
            <div className="motion-list">
              {motionRecipes.map((item) => (
                <button key={item.motion} className={motion === item.motion ? "selected" : ""} type="button" onClick={() => setMotion(item.motion)}>
                  <span>{item.label}</span><small>{item.note}</small><i aria-hidden="true">↗</i>
                </button>
              ))}
            </div>
            <div className="motion-preview"><ProgressNarrative events={playgroundEvents} history="hidden" motion={motion} minVisibleMs={120} /></div>
          </article>

          <article className="recipe recipe-history">
            <div className="recipe-meta"><span>03 · Trust</span><small>Details on demand</small></div>
            <div className="history-stage">
              <div className="history-browser"><i /><i /><i /><span>research.app</span></div>
              <ProgressNarrative events={scene.events.slice(0, 4)} history="collapsible" defaultExpanded motion="focus" renderDetail={(event) => event.phase === "complete" ? "Done" : "Now"} />
            </div>
            <div className="recipe-copy"><h3>Progressive disclosure.</h3><p>Lead with the useful summary. Keep the event trail one calm click away for anyone who wants the receipts.</p></div>
          </article>

          <article className="recipe recipe-theme">
            <div className="recipe-meta"><span>04 · Fit</span><small>Your type, radius, color</small></div>
            <div className="theme-stage">
              <div className="theme-toolbar"><span className="swatch is-active" /><span className="swatch" /><span className="swatch" /><i /></div>
              <div className="theme-card"><span className="theme-pulse" /><p>Building your preview</p><small>12 components found</small></div>
              <div className="theme-tokens"><span>--pn-accent</span><span>#B8F56A</span></div>
            </div>
            <div className="recipe-copy"><h3>Belongs in your system.</h3><p>A handful of CSS variables control the whole surface—no wrapper soup or selector archaeology required.</p></div>
          </article>
        </div>
      </section>

      <section className="principles">
        <div className="section-shell principles-grid">
          <div>
            <p className="section-kicker">A tiny design philosophy</p>
            <h2>A spinner says “wait.”<br />A narrative says<br /><em>what’s happening.</em></h2>
          </div>
          <ol>
            <li><span>01</span><div><strong>Name the operation</strong><p>“Comparing 12 options” is more useful than an indeterminate wheel.</p></div></li>
            <li><span>02</span><div><strong>Show only safe detail</strong><p>Operational updates build trust without exposing private model reasoning.</p></div></li>
            <li><span>03</span><div><strong>Respect attention</strong><p>Motion should confirm a change, then get out of the way.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="playground section-shell" id="playground">
        <div className="playground-copy">
          <p className="section-kicker">Try it yourself</p>
          <h2>One event in.<br />One clear sentence out.</h2>
          <p>Choose an operation and motion style. The component handles wording, state, animation, and accessible announcements.</p>
          <div className="control-group">
            <span>Operation</span>
            <div>{(["search", "compare", "verify", "complete"] as ProgressAction[]).map((item) => <button type="button" className={action === item ? "active" : ""} onClick={() => setAction(item)} key={item}>{item}</button>)}</div>
          </div>
          <div className="control-group">
            <span>Motion</span>
            <div>{motionRecipes.map((item) => <button type="button" className={motion === item.motion ? "active" : ""} onClick={() => setMotion(item.motion)} key={item.motion}>{item.label}</button>)}</div>
          </div>
        </div>
        <div className="code-console">
          <div className="console-bar"><span><i /><i /><i /> Preview.tsx</span><CopyButton value={recipeCode} label="Copy code" /></div>
          <pre><code><span className="code-purple">&lt;ProgressNarrative</span>{"\n  "}<span className="code-blue">events</span>={'{events}'}{"\n  "}<span className="code-blue">motion</span>=<span className="code-green">&quot;{motion}&quot;</span>{"\n  "}<span className="code-blue">history</span>=<span className="code-green">&quot;collapsible&quot;</span>{"\n"}<span className="code-purple">/&gt;</span></code></pre>
          <div className="console-output"><span>OUTPUT</span><ProgressNarrative events={playgroundEvents} history="collapsible" motion={motion} /></div>
        </div>
      </section>

      <section className="install-section" id="install">
        <div className="install-orbit" aria-hidden="true"><i /><i /><i /></div>
        <p className="section-kicker">Ready when you are</p>
        <h2>Give the in-between<br />a little <em>life.</em></h2>
        <p>Drop it into any React interface. Bring your events. Keep your users in the loop.</p>
        <div className="install-pill install-pill-large"><code>{installCommand}</code><CopyButton value={installCommand} /></div>
      </section>

      <footer className="footer-shell">
        <a className="brand" href="#top"><span aria-hidden="true"><i /><i /><i /></span>Progress Narrative</a>
        <p>Operational updates, not private reasoning.</p>
        <div><span>MIT License</span><span>React + TypeScript</span><a href="#top">Back to top ↑</a></div>
      </footer>
    </main>
  );
}
