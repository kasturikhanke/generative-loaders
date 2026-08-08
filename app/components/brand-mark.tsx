export function BrandMark() {
  return (
    <svg aria-hidden="true" className="brand-mark" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="brand-orb" cx="0" cy="0" r="1" gradientTransform="translate(14 14) rotate(90) scale(12)">
          <stop offset="0" stopColor="#24271f" />
          <stop offset=".33" stopColor="#555b48" />
          <stop offset=".67" stopColor="#c4c9a1" />
          <stop offset=".86" stopColor="#7b8269" />
          <stop offset="1" stopColor="#22251e" />
        </radialGradient>
        <radialGradient id="brand-bloom" cx="0" cy="0" r="1" gradientTransform="translate(14 14) rotate(90) scale(11)">
          <stop offset="0" stopColor="#eff3cf" stopOpacity="0" />
          <stop offset=".5" stopColor="#eff3cf" stopOpacity=".2" />
          <stop offset=".78" stopColor="#f4f7dc" stopOpacity=".68" />
          <stop offset="1" stopColor="#f4f7dc" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className="brand-mark-orb">
        <circle className="brand-mark-disc" cx="14" cy="14" r="11.5" fill="url(#brand-orb)" />
        <circle className="brand-mark-bloom" cx="14" cy="14" r="11.5" fill="url(#brand-bloom)" />
      </g>
    </svg>
  );
}
