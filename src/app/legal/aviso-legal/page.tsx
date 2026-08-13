import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { OG_BASE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Aviso legal y condiciones de uso de TuChat. Información sobre el titular del portal, derechos de propiedad intelectual y normas de uso del servicio de chat.",
  alternates: { canonical: "/legal/aviso-legal" },
  openGraph: { ...OG_BASE, url: "/legal/aviso-legal" },
};

const crumbs = [
  { name: "Inicio", url: "/" },
  { name: "Aviso legal", url: "/legal/aviso-legal" },
];

export default function AvisoLegalPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold text-ink">Aviso legal</h1>
      <div className="prose mt-4 space-y-4 text-muted">
        <h2 className="text-lg font-bold text-ink">Titular del sitio</h2>
        <p>
          Este sitio web (tuchat.org) es un portal de salas de chat en español, titularidad de
          J.C.G., con domicilio en A Coruña (España), C.P. 15006. Para cualquier consulta, puedes
          escribir a <a href="mailto:info@chatzona.org" className="text-blue hover:underline">info@chatzona.org</a>.
        </p>
        <h2 className="text-lg font-bold text-ink">Condiciones de uso</h2>
        <p>
          El acceso al chat es gratuito y no requiere registro. El usuario se compromete a hacer un
          uso lícito y respetuoso del servicio, sin difundir contenidos ilegales, ofensivos o que
          vulneren derechos de terceros. El acceso a salas para mayores de edad está restringido a
          personas mayores de 18 años.
        </p>
        <h2 className="text-lg font-bold text-ink">Servicio de chat de terceros</h2>
        <p>
          Las conversaciones se desarrollan a través de un servicio de chat externo embebido. TuChat
          no se responsabiliza de los mensajes publicados por los usuarios ni del contenido
          generado en tiempo real por terceros.
        </p>
        <h2 className="text-lg font-bold text-ink">Propiedad intelectual</h2>
        <p>
          Los textos, el diseño y la estructura del portal son titularidad de TuChat o de quienes
          corresponda, y no pueden reproducirse sin autorización.
        </p>
        <h2 className="text-lg font-bold text-ink">Imágenes</h2>
        <p>
          Las fotografías que ilustran la sección de noticias proceden de Unsplash y se emplean
          conforme a su licencia, que permite el uso comercial sin necesidad de atribución. Las
          banderas de países y comunidades son símbolos oficiales de dominio público.
        </p>
        <p>
          Los escudos de clubes deportivos son marcas registradas de sus respectivos titulares y se
          reproducen a título meramente identificativo, en el contexto de las salas de chat
          dedicadas a cada equipo. TuChat no mantiene relación, patrocinio ni vínculo alguno con
          esos clubes. Si eres titular de alguno de estos signos y no deseas que aparezca aquí,
          escríbenos a{" "}
          <a href="mailto:info@chatzona.org" className="text-blue hover:underline">
            info@chatzona.org
          </a>{" "}
          y lo retiraremos.
        </p>
      </div>
    </main>
  );
}
