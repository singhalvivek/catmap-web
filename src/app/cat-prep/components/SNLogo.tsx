// SNLogo — inline SVG brand logo: two overlapping books in navy/teal
export default function SNLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="3" width="15" height="26" rx="3" fill="#1E3A5F" />
      <rect x="13" y="3" width="15" height="26" rx="3" fill="#14B8A6" />
      <rect x="13" y="3" width="2" height="26" fill="#0F766E" opacity="0.5" />
      <path
        d="M17 10 L24 10"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M17 15 L24 15"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M17 20 L21 20"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}
