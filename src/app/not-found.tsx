import type { Metadata } from "next";
import Link from "next/link";
import { NickInput } from "@/components/ui/NickInput";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

const LINKS = [
  { href: "/chat", label: "Todas las salas" },
  { href: "/chat/espana", label: "Chat España" },
  { href: "/chat/amor", label: "Chat Amor" },
  { href: "/chat/ligar", label: "Chat Ligar" },
  { href: "/deportes", label: "Deportes" },
  { href: "/noticias", label: "Noticias" },
];

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-20 text-center">
      <p className="text-6xl font-extrabold text-blue">404</p>
      <h1 className="mt-4 text-2xl font-extrabold text-ink">Esta página no existe</h1>
      <p className="mt-2 text-muted">
        La dirección que buscas no está disponible. Prueba con una de las salas más populares.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-full border border-line bg-card px-4 py-1.5 text-sm font-medium text-ink hover:border-blue hover:text-blue transition-colors"
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div className="mt-8 max-w-sm mx-auto">
        <p className="mb-3 text-sm text-muted font-medium">O entra directamente al chat:</p>
        <NickInput canal="espana" placeholder="Tu nick para entrar..." />
      </div>
    </main>
  );
}
