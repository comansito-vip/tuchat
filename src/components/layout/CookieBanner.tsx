"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// La elección se guarda aquí y la lee el script de consent-default del layout
// (antes de cargar GA) para restaurar 'granted' en visitas posteriores sin
// volver a mostrar el banner.
const STORAGE_KEY = "cookie-consent";

declare global {
  interface Window {
    // gtag se define en el <script> inline de consent-default (layout.tsx),
    // que se ejecuta antes que la librería de Google Analytics.
    gtag?: (...args: unknown[]) => void;
  }
}

export function CookieBanner() {
  // Arranca oculto: solo se muestra tras comprobar en el cliente que no hay una
  // elección previa. Así no parpadea en quien ya decidió ni se renderiza en SSR.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // Sin acceso a localStorage (modo privado estricto): mostramos el banner
      // igualmente para poder recoger el consentimiento de esta sesión.
      setVisible(true);
    }
  }, []);

  function choose(granted: boolean) {
    try {
      localStorage.setItem(STORAGE_KEY, granted ? "granted" : "denied");
    } catch {
      // Si no se puede persistir, la decisión vale al menos para esta sesión.
    }
    window.gtag?.("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
    });
    setVisible(false);
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
            Más información
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
