"use client";

import { usePathname } from "next/navigation";

// El webchat es una vista de pantalla completa: el footer empujaría el iframe
// y obligaría a hacer scroll para ver el cuadro de mensajes. Mismo criterio que
// MobileBottomNav, que ya se oculta en esa ruta.
export function FooterSlot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/webchat")) return null;
  return <>{children}</>;
}
