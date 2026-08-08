# generative-loaders

Sixteen ways to stream AI-generated text, fourteen compact indicators for the moment before words arrive, and nine square-forming image loaders.

```bash
npm install generative-loaders
```

```tsx
import { ImageLoader, InlineLoader, TextLoader } from "generative-loaders";
import "generative-loaders/styles.css";

// `streamedText` is the response accumulated so far.
<TextLoader
  text={streamedText}
  variant="decode"
  color="#111111"
  speed={1}
/>

<span>
  <InlineLoader variant="matrix" /> Thinking through the details…
</span>

<ImageLoader variant="bands" size={160} label="Generating image" />
```

## Variants

`decode`, `typewriter`, `skeleton`, `cascade`, `focus`, `wipe`, `flip`, `redact`, `line`, `terminal`, `wave`, `dissolve`, `slice`, `tracking`, `coalesce`, and `fragments`.

Inline variants: `glyph`, `matrix`, `orbit`, `ripple`, `signal`, `spark`, `rotor`, `pixel-drift`, `chomp`, `snake`, `fold`, `gravity`, `domino`, and `aperture`.

Image variants: `skeleton`, `bands`, `tiles`, `scan`, `pixel-grid`, `resolution`, `focus`, `shutter`, and `contour`.

## Props

| Prop | Type | Default |
| --- | --- | --- |
| `text` | accumulated string | required |
| `variant` | `TextLoaderVariant` | required |
| `color` | CSS color string | `"#111111"` |
| `speed` | positive number | `1` |
| `paused` | boolean | `false` |
| `className` | string | — |
| `aria-label` | string | normalized `text` |

Start with an empty string and append each chunk from your AI response to `text`. The component never predicts, reserves, or renders future words: the existing prefix stays in place and only the newly received suffix animates. It is SSR-safe, exposes the currently received text to assistive technology, and skips entrance motion when reduced motion is requested.

`InlineLoader` accepts `variant`, `size`, `color`, `speed`, `paused`, `className`, and an optional `label`. It is hidden from assistive technology by default when the adjacent status copy already communicates the activity.

`ImageLoader` accepts `variant`, `size`, `color`, `radius`, `speed`, `paused`, `className`, and `label`. It reserves a square frame and announces “Generating image” by default.
