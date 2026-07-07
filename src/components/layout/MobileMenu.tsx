"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { MenuIcon, CloseIcon } from "@/components/ui/icons";

const GROUPS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Explorar",
    links: [
      { label: "Todas las salas", href: "/chat" },
      { label: "Países", href: "/chat/espana" },
      { label: "Ciudades", href: "/chat/madrid" },
      { label: "Temáticas", href: "/chat/amor" },
      { label: "Ranking", href: "/ranking" },
    ],
  },
  {
    heading: "Secciones",
    links: [
      { label: "Deportes", href: "/deportes" },
      { label: "Resultados", href: "/resultados/laliga" },
      { label: "Tarot", href: "/tarot" },
      { label: "Anime", href: "/anime" },
    ],
  },
  {
    heading: "Servicios",
    links: [
      { label: "Noticias", href: "/noticias" },
      { label: "Horóscopo", href: "/horoscopo" },
      { label: "El tiempo", href: "/tiempo/madrid" },
      { label: "Loterías", href: "/loterias/espana" },
    ],
  },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Bloquea el scroll del body mientras el menú está abierto (evita scroll-bleed).
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Accesibilidad del diálogo: foco inicial dentro del panel, cierre con Escape,
  // trampa de foco (Tab cíclico) y retorno del foco al disparador al cerrar.
  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const focusables = () =>
      panelRef.current
        ? Array.from(
            panelRef.current.querySelectorAll<HTMLElement>(
              'a[href], button:not([disabled])',
            ),
          )
        : [];
    focusables()[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "Tab") {
        const els = focusables();
        if (els.length === 0) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="lg:hidden grid h-11 w-11 place-items-center -mr-2 text-muted hover:text-ink"
        aria-label="Abrir menú"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <MenuIcon size={20} />
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú principal">
            <button
              type="button"
              aria-label="Cerrar menú"
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />
            <div ref={panelRef} className="absolute inset-y-0 left-0 w-72 max-w-[80%] overflow-y-auto bg-card p-5 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-blue-dark font-extrabold text-lg">
                  Tu<span className="text-blue">Chat</span>
                </span>
                <button
                  type="button"
                  aria-label="Cerrar menú"
                  className="grid h-11 w-11 place-items-center -mr-2 text-muted hover:text-ink"
                  onClick={() => setOpen(false)}
                >
                  <CloseIcon size={20} />
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
                          className="block rounded-md px-2 py-2.5 text-sm text-ink hover:bg-bg"
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
          </div>,
          document.body,
        )}
    </>
  );
}
