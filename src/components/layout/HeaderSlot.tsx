"use client";

import { usePathname } from "next/navigation";

// El webchat pinta su propia barra (logo + canal) para maximizar el alto del
// iframe: el header global aquí solo restaría espacio. Mismo criterio que
// FooterSlot/MobileBottomNav, que ya se ocultan en esta ruta.
export function HeaderSlot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/webchat")) return null;
  return <>{children}</>;
}
