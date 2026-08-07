# progress-narrative

Readable, animated operational updates for React agent interfaces.

```bash
npm install progress-narrative
```

```tsx
import { ProgressNarrative } from "progress-narrative";
import "progress-narrative/styles.css";

<ProgressNarrative
  motion="cascade"
  events={[
    { id: "search", action: "search", phase: "complete", count: 6, subject: "sources" },
    { id: "compare", action: "compare", phase: "active", count: 3, subject: "results" },
  ]}
/>
```

The component displays operational summaries only. Do not pass private model reasoning or hidden chain-of-thought.

## Exports

- `ProgressNarrative` — live line with optional activity history.
- `NarrativeLine` — the animated current sentence.
- `NarrativeHistory` — a chronological operation list.
- `formatProgressEvent` — the default English formatter.

All components are controlled, SSR-safe, and honor `prefers-reduced-motion`.

## Motion principles

Choose `flow`, `focus`, `cascade`, `flip`, `wipe`, or `snap`. Each variation uses the same accessible sentence and event model; motion is presentational and automatically disabled when reduced motion is requested.
