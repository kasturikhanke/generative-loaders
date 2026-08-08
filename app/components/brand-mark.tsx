export function BrandMark() {
  return (
    <svg aria-hidden="true" className="brand-mark" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
      <g className="brand-mark-bloom">
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <path
            className="brand-mark-petal"
            d="M14 13.2C11.6 10.4 11.7 5.7 14 3c2.3 2.7 2.4 7.4 0 10.2Z"
            key={angle}
            style={{ "--brand-angle": `${angle}deg` } as React.CSSProperties}
          />
        ))}
        <circle className="brand-mark-center" cx="14" cy="14" r="1.8" />
      </g>
    </svg>
  );
}
