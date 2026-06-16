"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const NAV_ITEMS = [
  {
    label: "Inicio",
    href: "/",
    activeOn: "exact" as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M7 18v-5h6v5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Chat",
    href: "/chat",
    activeOn: "/chat" as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M2 5a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H6l-4 3V5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Países",
    href: "/pais/espana",
    activeOn: "/pais" as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M2.5 10h15M10 2.5c-2 2-3 4.5-3 7.5s1 5.5 3 7.5M10 2.5c2 2 3 4.5 3 7.5s-1 5.5-3 7.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    label: "Noticias",
    href: "/noticias",
    activeOn: "/noticias" as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2.5" y="3.5" width="15" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M6 7.5h8M6 10.5h8M6 13.5h5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Más",
    href: "/ranking",
    activeOn: "exact" as const,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <rect x="2.5" y="2.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11.5" y="2.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="2.5" y="11.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11.5" y="11.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

function isActive(pathname: string, activeOn: string): boolean {
  if (activeOn === "exact") return false;
  if (activeOn === pathname) return true;
  return pathname.startsWith(activeOn + "/") || pathname.startsWith(activeOn + "?");
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 border-t border-line bg-card lg:hidden"
      aria-label="Navegación inferior"
    >
      <div className="flex justify-around">
        {NAV_ITEMS.map((item) => {
          const active = item.activeOn === "exact"
            ? (item.href === "/" ? isHome : pathname === item.href)
            : isActive(pathname, item.activeOn);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex flex-col items-center gap-0.5 py-2 text-[11px] min-w-0 flex-1 transition-colors",
                active ? "text-blue font-semibold" : "text-muted hover:text-ink",
              )}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
