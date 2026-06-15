import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { breadcrumbJsonLd, JsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Política de privacidad de TuChat: sin registro ni email para chatear. Tus derechos RGPD explicados y cómo protegemos tus datos personales.",
  alternates: { canonical: "/legal/privacidad" },
};

const crumbs = [
  { name: "Inicio", url: "/" },
  { name: "Privacidad", url: "/legal/privacidad" },
];

export default function PrivacidadPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold text-ink">Política de privacidad</h1>
      <div className="prose mt-4 space-y-4 text-muted">
        <h2 className="text-lg font-bold text-ink">Datos que tratamos</h2>
        <p>
          TuChat está diseñado para minimizar la recogida de datos: el acceso al chat es sin
          registro y mediante un nick de invitado. No solicitamos nombre real, correo ni teléfono
          para chatear. Los votos de salas se guardan de forma anónima y agregada.
        </p>
        <h2 className="text-lg font-bold text-ink">Finalidad</h2>
        <p>
          Los datos técnicos estrictamente necesarios (por ejemplo, para el funcionamiento del chat
          embebido) se usan solo para prestar el servicio y elaborar estadísticas agregadas de uso,
          sin identificar a personas concretas.
        </p>
        <h2 className="text-lg font-bold text-ink">Terceros</h2>
        <p>
          El chat se presta a través de un proveedor externo. Las funciones de noticias y datos
          deportivos pueden obtener información de APIs de terceros. Estos servicios tratan los
          datos conforme a sus propias políticas.
        </p>
        <h2 className="text-lg font-bold text-ink">Derechos</h2>
        <p>
          Puedes ejercer tus derechos de acceso, rectificación, supresión y oposición a través de la
          página de <a href="/contacto" className="text-blue hover:underline">contacto</a>.
        </p>
      </div>
    </main>
  );
}
