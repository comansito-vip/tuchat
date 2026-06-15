import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Svg({ children, size = 18, ...props }: IconProps & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Burbuja de chat — para los CTA de "Entrar al chat". */
export function ChatIcon({ className, ...props }: IconProps) {
  return (
    <Svg className={className} {...props}>
      <path
        d="M3 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8l-4 3v-3a2 2 0 0 1-1-1.7V5Z"
        fill="currentColor"
        opacity="0.95"
      />
    </Svg>
  );
}

export function ArrowRightIcon({ className, ...props }: IconProps) {
  return (
    <Svg className={className} {...props}>
      <path
        d="M4 10h11M11 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ChevronIcon({ className, ...props }: IconProps) {
  return (
    <Svg className={className} {...props}>
      <path
        d="M7.5 4.5 13 10l-5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function UsersIcon({ className, ...props }: IconProps) {
  return (
    <Svg size={16} className={className} {...props}>
      <circle cx="7" cy="6.5" r="2.6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2.5 16c0-2.5 2-4.2 4.5-4.2S11.5 13.5 11.5 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M13 4.2A2.6 2.6 0 0 1 13 9.3M14.5 16c0-2-1-3.5-2.6-4.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function SearchIcon({ className, ...props }: IconProps) {
  return (
    <Svg className={className} {...props}>
      <circle cx="9" cy="9" r="5.2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="m13 13 3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Llama — para el tier "HOT / Destacadas". */
export function FireIcon({ className, ...props }: IconProps) {
  return (
    <Svg className={className} {...props}>
      <path
        d="M10 2.5c.5 2.4-1 3.4-2.2 4.8C6.5 8.7 6 9.9 6 11.4 6 14 7.9 16 10 16s4-2 4-4.6c0-1.7-.8-3-1.8-4.2-.3 1-.9 1.5-1.6 1.8.5-2-.1-4.3-.6-6.5Z"
        fill="currentColor"
      />
    </Svg>
  );
}

/** Destello — para "NUEVO / novedad". */
export function SparkIcon({ className, ...props }: IconProps) {
  return (
    <Svg className={className} {...props}>
      <path
        d="M10 2.5 11.4 7 16 8.5 11.4 10 10 14.5 8.6 10 4 8.5 8.6 7 10 2.5Z"
        fill="currentColor"
      />
    </Svg>
  );
}

export function StarIcon({ className, ...props }: IconProps) {
  return (
    <Svg className={className} {...props}>
      <path
        d="m10 2.5 2.2 4.7 5.1.6-3.8 3.5 1 5-4.5-2.5L5.5 16l1-5L2.7 7.8l5.1-.6L10 2.5Z"
        fill="currentColor"
      />
    </Svg>
  );
}

export function TrophyIcon({ className, ...props }: IconProps) {
  return (
    <Svg className={className} {...props}>
      <path
        d="M6 3h8v3a4 4 0 0 1-8 0V3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M6 4H3.5v1A2.5 2.5 0 0 0 6 7.5M14 4h2.5v1A2.5 2.5 0 0 1 14 7.5M10 10v3m-2.5 4h5m-4-4h3l-.5 1h-2l-.5-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function WeatherIcon({ className, ...props }: IconProps) {
  return (
    <Svg className={className} {...props}>
      <circle cx="7" cy="7" r="2.6" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7 1.8v1.2M7 11v1.2M1.8 7h1.2M11 7h1.2M3.3 3.3l.8.8M9.9 9.9l.8.8M10.7 3.3l-.8.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9.5 11.5a3 3 0 0 1 2.9-2.2 3 3 0 0 1 3 2.7 2.3 2.3 0 0 1-.4 4.5H9a2.5 2.5 0 0 1-.5-5Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function GlobeIcon({ className, ...props }: IconProps) {
  return (
    <Svg className={className} {...props}>
      <circle cx="10" cy="10" r="7.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 10h14M10 2.8c2 2 2 12.4 0 14.4M10 2.8c-2 2-2 12.4 0 14.4"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </Svg>
  );
}

export function MenuIcon({ className, ...props }: IconProps) {
  return (
    <Svg className={className} {...props}>
      <path
        d="M3.5 6h13M3.5 10h13M3.5 14h13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function CloseIcon({ className, ...props }: IconProps) {
  return (
    <Svg className={className} {...props}>
      <path
        d="M5 5l10 10M15 5 5 15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** Punto "en vivo" con halo pulsante. */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex h-2.5 w-2.5 ${className ?? ""}`}
      aria-hidden="true"
    >
      <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-current opacity-70" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-current" />
    </span>
  );
}
