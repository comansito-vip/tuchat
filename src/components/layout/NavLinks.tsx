"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const NAV_ITEMS = [
  { label: "Chat", href: "/chat", activeOn: "/chat" },
  // Al índice de países, no a la sala de España: con "Países" → /chat/espana
  // cada página del sitio pasaba ese texto de ancla a una sala concreta y quien
  // buscaba México o Argentina aterrizaba en España.
  { label: "Países", href: "/chat#paises", activeOn: "/chat#paises" },
  { label: "Deportes", href: "/deportes", activeOn: "/deportes" },
  { label: "Tarot", href: "/tarot", activeOn: "/tarot" },
  { label: "Anime", href: "/anime", activeOn: "/anime" },
  { label: "Noticias", href: "/noticias", activeOn: "/noticias" },
  { label: "Ranking", href: "/ranking", activeOn: "/ranking" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {NAV_ITEMS.map((item) => {
        const active =
          pathname === item.activeOn ||
          pathname.startsWith(item.activeOn + "/") ||
          pathname.startsWith(item.activeOn + "?");

        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "transition-colors",
              active ? "font-semibold text-ink" : "hover:text-ink",
            )}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
