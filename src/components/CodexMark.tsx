import clsx from "clsx";
import { useId } from "react";

export default function CodexMark({
  className,
  fill = "rgb(var(--c-purple)/0.28)",
  strokeWidth = 1.9,
  title,
}: {
  className?: string;
  fill?: string;
  strokeWidth?: number;
  title?: string;
}) {
  const rawId = useId().replace(/:/g, "");
  const outerGradient = `${rawId}-codex-outer`;
  const innerGradient = `${rawId}-codex-inner`;
  const glow = `${rawId}-codex-glow`;

  return (
    <svg
      viewBox="0 0 24 24"
      aria-label={title}
      role={title ? "img" : "presentation"}
      className={clsx("inline-block shrink-0", className)}
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={outerGradient} x1="3" x2="21" y1="4" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgb(var(--c-purple))" />
          <stop offset="0.55" stopColor="#4f8cff" />
          <stop offset="1" stopColor="rgb(var(--c-cyan))" />
        </linearGradient>
        <linearGradient id={innerGradient} x1="7" x2="17" y1="7" y2="17" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6f5bff" stopOpacity="0.72" />
          <stop offset="1" stopColor="#16b8c7" stopOpacity="0.64" />
        </linearGradient>
        <filter id={glow} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M21 16V8l-9-5-9 5v8l9 5 9-5Z"
        fill={`url(#${outerGradient})`}
        stroke="rgba(232,238,255,0.86)"
        strokeWidth={strokeWidth}
        filter={`url(#${glow})`}
      />
      <path
        d="M16.9 14.75v-5.5L12 6.5 7.1 9.25v5.5L12 17.5l4.9-2.75Z"
        fill={`url(#${innerGradient})`}
        stroke="rgba(232,238,255,0.64)"
        strokeWidth={Math.max(1, strokeWidth * 0.72)}
      />
      <path
        d="M12 9.7c.28 1.14.46 1.82 1.6 2.1-1.14.28-1.32.96-1.6 2.1-.28-1.14-.46-1.82-1.6-2.1 1.14-.28 1.32-.96 1.6-2.1Z"
        fill="rgba(255,255,255,0.96)"
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="0.35"
      />
    </svg>
  );
}
