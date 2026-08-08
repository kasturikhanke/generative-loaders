# Generative Loaders

A focused React collection with sixteen ways to animate newly received AI text and fourteen compact activity marks for the moment before words arrive.

```bash
npm install generative-loaders
```

```tsx
import { InlineLoader, TextLoader } from "generative-loaders";
import "generative-loaders/styles.css";

<TextLoader text="Language takes shape." variant="decode" />

<span><InlineLoader variant="matrix" /> Thinking…</span>
```

## Development

```bash
npm install
npm run dev
```

The publishable package is in `packages/generative-loaders`. Publication is intentionally separate from deployment of the gallery.
