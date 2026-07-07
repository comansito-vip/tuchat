"use client";

import { usePathname } from "next/navigation";
import { buttonClasses } from "@/components/ui/Button";
import { EnterButton } from "@/components/ui/EnterButton";
import { ChatIcon } from "@/components/ui/icons";

// Secciones de nivel superior que son, ellas mismas, una sala de chat válida.
const SECTION_CANAL: Record<string, string> = {
  anime: "anime",
  tarot: "tarot",
  deportes: "deportes",
  horoscopo: "horoscopo",
};

function canalForPath(pathname: string): string {
  const [, first, second] = pathname.split("/");
  if (first === "chat" && second) return second;
  return SECTION_CANAL[first] ?? "espana";
}

/**
 * CTA del header: entra a la sala de la página actual en vez de siempre a
 * España, para que el botón más visible del sitio lleve donde el usuario
 * ya estaba mirando.
 */
export function HeaderCTA() {
  const pathname = usePathname();
  const canal = canalForPath(pathname);

  return (
    <EnterButton
      canal={canal}
      icon={<ChatIcon className="hidden sm:block" />}
      className={buttonClasses("cta", "md", "px-3 text-xs lg:px-4 lg:text-sm")}
    >
      Entrar al chat
    </EnterButton>
  );
}
