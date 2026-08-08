export type TextLoaderVariant =
  | "decode"
  | "typewriter"
  | "skeleton"
  | "cascade"
  | "focus"
  | "wipe"
  | "flip"
  | "redact"
  | "line"
  | "terminal"
  | "wave"
  | "dissolve"
  | "slice"
  | "tracking"
  | "coalesce"
  | "fragments";

export interface TextLoaderProps {
  text: string;
  variant: TextLoaderVariant;
  speed?: number;
  color?: string;
  paused?: boolean;
  className?: string;
  "aria-label"?: string;
}

export type InlineLoaderVariant =
  | "glyph"
  | "matrix"
  | "orbit"
  | "ripple"
  | "signal"
  | "spark"
  | "rotor"
  | "pixel-drift"
  | "chomp"
  | "snake"
  | "fold"
  | "gravity"
  | "domino"
  | "aperture";

export interface InlineLoaderProps {
  variant: InlineLoaderVariant;
  size?: number | string;
  speed?: number;
  color?: string;
  paused?: boolean;
  className?: string;
  /** Adds an accessible status label. Omit when adjacent text already names the activity. */
  label?: string;
}

export type ImageLoaderVariant =
  | "skeleton"
  | "bands"
  | "tiles"
  | "scan"
  | "pixel-grid"
  | "resolution"
  | "focus"
  | "shutter"
  | "contour";

export interface ImageLoaderProps {
  variant: ImageLoaderVariant;
  size?: number | string;
  speed?: number;
  color?: string;
  radius?: number | string;
  paused?: boolean;
  className?: string;
  /** Accessible status text for the image-generation activity. */
  label?: string;
}
