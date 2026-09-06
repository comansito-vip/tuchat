"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// La elección se guarda aquí y la lee el script de consent-default del layout
// (antes de cargar GA) para restaurar 'granted' en visitas posteriores sin
// volver a mostrar el banner.
const STORAGE_KEY = "cookie-consent";

// localStorage no cambia por su cuenta mientras el banner está en pantalla (solo
// lo escribe este componente, y al hacerlo ya re-renderiza por su propio estado),
// así que no hay a qué suscribirse.
const sinSuscripcion = () => () => {};

function hayEleccionGuardada(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    // Sin acceso a localStorage (modo privado estricto): tratamos la visita como
    // no decidida y mostramos el banner para recoger el consentimiento de la sesión.
    return false;
  }
}

// En SSR no hay localStorage y el banner no debe formar parte del HTML servido:
// se decide en el cliente, que es donde vive la elección.
const enServidor = () => true;

declare global {
  interface Window {
    // gtag se define en el <script> inline de consent-default (layout.tsx),
    // que se ejecuta antes que la librería de Google Analytics.
    gtag?: (...args: unknown[]) => void;
  }
}

export function CookieBanner() {
  // useSyncExternalStore y no un useEffect que llame a setState: el efecto provoca
  // un render en cascada (lo marca react-hooks/set-state-in-effect) y aquí no hace
  // falta, porque solo se está leyendo un valor externo con su equivalente en SSR.
  const yaDecidido = useSyncExternalStore(sinSuscripcion, hayEleccionGuardada, enServidor);
  // La decisión tomada en esta misma visita: se fija desde el handler del botón,
  // así que no necesita pasar por localStorage para ocultar el banner al instante.
  const [decididoAhora, setDecididoAhora] = useState(false);
  const visible = !yaDecidido && !decididoAhora;

  function choose(granted: boolean) {
    try {
      localStorage.setItem(STORAGE_KEY, granted ? "granted" : "denied");
    } catch {
      // Si no se puede persistir, la decisión vale al menos para esta sesión.
    }
    window.gtag?.("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
    });
    setDecididoAhora(true);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentimiento de cookies"
      // z-50 para quedar por encima de la nav inferior móvil (z-40); en móvil se
      // eleva 64px + safe-area para no taparla, en desktop (nav oculta) va abajo.
      className="fixed inset-x-0 z-50 px-3 bottom-[calc(64px+env(safe-area-inset-bottom))] lg:bottom-4"
    >
      <div className="mx-auto max-w-2xl rounded-2xl border border-line bg-card p-4 shadow-card sm:flex sm:items-center sm:gap-4">
        <p className="text-sm text-muted">
          Usamos cookies analíticas para entender cómo se usa el sitio. Puedes
          aceptarlas o rechazarlas.{" "}
          <Link href="/legal/cookies" className="text-blue hover:underline">
            Más información sobre cookies
          </Link>
          .
        </p>
        <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
          <Button variant="secondary" size="sm" onClick={() => choose(false)}>
            Rechazar
          </Button>
          <Button variant="primary" size="sm" onClick={() => choose(true)}>
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
}
