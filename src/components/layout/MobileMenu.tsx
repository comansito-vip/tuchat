"use client";

import { useState } from "react";
import Link from "next/link";

const GROUPS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Explorar",
    links: [
      { label: "Todas las salas", href: "/chat" },
      { label: "Países", href: "/pais/espana" },
      { label: "Ciudades", href: "/chat/madrid" },
      { label: "Temáticas", href: "/chat/amor" },
      { label: "Ranking", href: "/ranking" },
    ],
  },
  {
    heading: "Secciones",
    links: [
      { label: "Deportes", href: "/deportes" },
      { label: "Resultados", href: "/resultados" },
      { label: "Tarot", href: "/tarot" },
      { label: "Anime", href: "/anime" },
    ],
  },
  {
    heading: "Servicios",
    links: [
      { label: "Noticias", href: "/noticias" },
      { label: "Horóscopo", href: "/horoscopo/aries" },
      { label: "El tiempo", href: "/tiempo/madrid" },
      { label: "Loterías", href: "/loterias/espana" },
    ],
  },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="lg:hidden p-1.5 text-muted hover:text-ink"
        aria-label="Abrir menú"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[80%] overflow-y-auto bg-card p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-blue-dark font-extrabold text-lg">
                Tu<span className="text-blue">Chat</span>
              </span>
              <button
                type="button"
                aria-label="Cerrar menú"
                className="p-1 text-muted hover:text-ink"
                onClick={() => setOpen(false)}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            {GROUPS.map((g) => (
              <div key={g.heading} className="mb-5">
                <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">{g.heading}</h2>
                <ul className="space-y-1">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="block rounded-md px-2 py-1.5 text-sm text-ink hover:bg-bg"
                        onClick={() => setOpen(false)}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
