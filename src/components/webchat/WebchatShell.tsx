"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { WebchatFrame } from "./WebchatFrame";

/**
 * Vista de chat a pantalla completa (barra + iframe), calcada de
 * trivialchat.org/webchat.
 *
 * En iOS, 100dvh sigue midiendo con la barra de herramientas retraída y, al
 * abrir el teclado, el cuadro de mensajes del iframe queda por debajo del área
 * visible. La única medida fiable es visualViewport, así que barra e iframe van
 * en position:fixed y se reajustan a mano en cada resize/scroll del viewport
 * visual (el CSS de abajo es solo el fallback antes de que corra el efecto).
 */
export function WebchatShell({
  canal,
  clientId,
  nick,
  label,
}: {
  canal: string;
  clientId: string;
  nick?: string;
  label: string;
}) {
  const barRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    const frame = frameRef.current;
    if (!bar || !frame) return;

    const fit = () => {
      const vv = window.visualViewport;
      const barH = bar.getBoundingClientRect().height;
      const vh = vv?.height ?? window.innerHeight;
      const vw = vv?.width ?? window.innerWidth;
      const top = vv?.offsetTop ?? 0;
      const left = vv?.offsetLeft ?? 0;

      bar.style.top = `${top}px`;
      bar.style.left = `${left}px`;
      bar.style.width = `${vw}px`;
      frame.style.top = `${top + barH}px`;
      frame.style.left = `${left}px`;
      frame.style.width = `${vw}px`;
      frame.style.height = `${Math.max(0, vh - barH)}px`;
    };

    fit();
    window.addEventListener("resize", fit);
    window.addEventListener("orientationchange", fit);
    window.visualViewport?.addEventListener("resize", fit);
    window.visualViewport?.addEventListener("scroll", fit);
    return () => {
      window.removeEventListener("resize", fit);
      window.removeEventListener("orientationchange", fit);
      window.visualViewport?.removeEventListener("resize", fit);
      window.visualViewport?.removeEventListener("scroll", fit);
    };
  }, []);

  // Sin esto el <body> conserva su scroll y en móvil se puede arrastrar la
  // página entera por debajo del iframe fijo.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <>
      <h1 className="sr-only">Chat de {label} — TuChat</h1>
      <header
        ref={barRef}
        className="fixed inset-x-0 top-0 z-50 flex h-[calc(3rem+env(safe-area-inset-top))] items-center gap-2 bg-slate-900 px-3 pt-[env(safe-area-inset-top)]"
      >
        <Link
          href="/"
          className="shrink-0 text-sm font-extrabold text-white"
          aria-label="TuChat — Inicio"
        >
          {/* text-blue sobre slate-900 se queda en 2.8:1: el logotipo está exento
              de 1.4.3, pero aquí simplemente no se leía. */}
          Tu<span className="text-indigo-300">Chat</span>
        </Link>
        <span className="mr-auto flex min-w-0 items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white">
          <span
            className="size-2 shrink-0 rounded-full bg-emerald-400 motion-safe:animate-pulse"
            aria-hidden="true"
          />
          <span className="truncate">{label}</span>
        </span>
        <Link
          href="/"
          className="inline-flex min-h-[44px] shrink-0 items-center rounded-full bg-black/25 px-3.5 text-xs font-bold text-white hover:bg-black/40"
        >
          <span aria-hidden="true" className="mr-1">✕</span> Salir del chat
        </Link>
      </header>
      {/* El iframe es el 100% del contenido de la página y esta ruta no monta el
          <main> global (HeaderSlot/FooterSlot lo suprimen): sin este landmark
          queda huérfano y no hay a dónde saltar. */}
      <main>
        <WebchatFrame
          ref={frameRef}
          canal={canal}
          clientId={clientId}
          nick={nick}
          className="fixed left-0 top-[calc(3rem+env(safe-area-inset-top))] block h-[calc(100dvh-3rem-env(safe-area-inset-top))] w-full border-0"
        />
      </main>
    </>
  );
}
