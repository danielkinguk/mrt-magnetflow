import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 7h2a5 5 0 0 1 0 10h-2" />
      <path d="M9 17H7A5 5 0 0 1 7 7h2" />
      <path d="M8 12h8" />
    </svg>
  );
}

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 36"
      fill="currentColor"
      {...props}
    >
      <rect width="100" height="36" fill="hsl(var(--muted))" />
    </svg>
  )
}
