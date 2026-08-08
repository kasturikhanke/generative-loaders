export function BrandMark() {
  return (
    <svg aria-hidden="true" className="brand-mark" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
      <rect className="brand-mark-frame" x="1" y="1" width="26" height="26" rx="8" />
      <circle className="brand-mark-stage brand-mark-stage-one" cx="8" cy="9" r="1.75" />
      <rect className="brand-mark-stage brand-mark-stage-two" x="11" y="7" width="5" height="5" rx="1.5" />
      <path className="brand-mark-stage brand-mark-stage-three" d="M13.5 15.5a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3v-3Z" />
    </svg>
  );
}
