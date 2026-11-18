import { planBMarkPath } from './domain/brand';
export default function BrandMark() {
  return (
    <svg
      className="pb-brand-mark"
      width="32"
      height="32"
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path
        d={planBMarkPath}
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="42" r="3" fill="currentColor" />
    </svg>
  );
}
