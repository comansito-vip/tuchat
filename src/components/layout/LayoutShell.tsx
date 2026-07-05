"use client";

import { usePathname } from "next/navigation";

// El webchat es una vista de pantalla completa: no debe llevar el padding
// inferior que reserva espacio para la barra de navegación móvil (que además
// se oculta en esa ruta), o el chat quedaría recortado por abajo.
export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullScreen = pathname.startsWith("/webchat");

  return (
    <div
      id="contenido"
      tabIndex={-1}
      className={
        isFullScreen
          ? "outline-none"
          : "min-h-screen pb-[calc(4rem+env(safe-area-inset-bottom))] outline-none lg:pb-0"
      }
    >
      {children}
    </div>
  );
}
