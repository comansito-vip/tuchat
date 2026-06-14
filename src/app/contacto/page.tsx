import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Ponte en contacto con el equipo de TuChat.",
  alternates: { canonical: "/contacto" },
};

const crumbs = [
  { name: "Inicio", url: "/" },
  { name: "Contacto", url: "/contacto" },
];

export default function ContactoPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold text-ink">Contacto</h1>
      <p className="mt-2 text-muted">
        ¿Tienes una sugerencia, una incidencia o quieres reportar un abuso en el chat? Escríbenos y
        te responderemos lo antes posible.
      </p>
      <div className="mt-6 rounded-xl border border-line bg-card p-5">
        <p className="text-sm text-muted">Correo de contacto</p>
        <a
          href="mailto:hola@tuchat.org"
          className="mt-1 inline-block text-lg font-semibold text-blue hover:underline"
        >
          hola@tuchat.org
        </a>
        <p className="mt-4 text-xs text-muted">
          (Sustituye esta dirección por la real del proyecto. Para un formulario con envío, se puede
          añadir una API route cuando haya un servicio de correo configurado.)
        </p>
      </div>
    </main>
  );
}
