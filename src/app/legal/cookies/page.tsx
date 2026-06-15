import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "Uso de cookies y almacenamiento local en TuChat.",
  alternates: { canonical: "/legal/cookies" },
};

const crumbs = [
  { name: "Inicio", url: "/" },
  { name: "Cookies", url: "/legal/cookies" },
];

export default function CookiesPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold text-ink">Política de cookies</h1>
      <div className="prose mt-4 space-y-4 text-muted">
        <h2 className="text-lg font-bold text-ink">Almacenamiento propio</h2>
        <p>
          TuChat usa almacenamiento local del navegador (localStorage) para recordar tu nick de
          invitado y las salas que has votado, evitando votos duplicados. No es una cookie de
          seguimiento ni se comparte con terceros.
        </p>
        <h2 className="text-lg font-bold text-ink">Cookies de terceros</h2>
        <p>
          El chat embebido y los servicios externos (noticias, datos deportivos) pueden establecer
          sus propias cookies técnicas. Puedes gestionarlas y eliminarlas desde la configuración de
          tu navegador en cualquier momento.
        </p>
      </div>
    </main>
  );
}
