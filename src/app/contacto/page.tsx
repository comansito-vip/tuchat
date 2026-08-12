import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { OG_BASE } from "@/lib/seo";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacta con TuChat para sugerencias, incidencias técnicas o reportar un abuso en el chat. Respondemos a todas las consultas por correo electrónico.",
  alternates: { canonical: "/contacto" },
  openGraph: { ...OG_BASE, url: "/contacto" },
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
        Hay una sola dirección para todo —sugerencias, fallos y denuncias— y la lee una persona.
        Abajo está qué conviene contar en cada caso para que el correo sirva de algo.
      </p>
      <div className="mt-6 rounded-xl border border-line bg-card p-5">
        <p className="text-sm text-muted">Correo de contacto</p>
        <a
          href="mailto:info@chatzona.org"
          className="mt-1 inline-block text-lg font-semibold text-blue hover:underline"
        >
          info@chatzona.org
        </a>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-ink">Alguien se está portando mal en una sala</h2>
        <div className="mt-2 space-y-3 leading-relaxed text-muted">
          <p>
            Si está pasando ahora mismo, lo rápido no es el correo: en el propio chat hay operadores
            conectados que pueden expulsar en el momento. Escribe en la sala pidiendo un operador, o
            usa el comando <code className="rounded bg-line/40 px-1 text-ink">/msg</code> con el nick
            de quien lleve el símbolo <strong>@</strong> delante en la lista de usuarios.
          </p>
          <p>
            Para que quede constancia, escríbenos también. Sirve de poco un correo que dice «hay un
            pesado en el chat»: hacen falta el <strong>nick exacto</strong> de la persona, la{" "}
            <strong>sala</strong> en la que ocurrió, la <strong>hora aproximada</strong> y, si
            puedes, una captura. Con eso se puede rastrear la conexión; sin eso, no.
          </p>
          <p>
            Si lo que has visto es contenido sexual con menores, amenazas o cualquier otro delito,
            denúncialo además a la Policía Nacional o a la Guardia Civil. Nosotros conservamos y
            entregamos lo que nos pidan por vía judicial, pero la denuncia tiene que existir.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-ink">Algo no funciona</h2>
        <div className="mt-2 space-y-3 leading-relaxed text-muted">
          <p>
            La mayoría de los fallos que nos llegan son de conexión al chat y casi siempre vienen del
            mismo sitio: una red que bloquea los puertos del servidor (habitual en wifis de oficina,
            hospitales y universidades) o una VPN que la red del chat tiene vetada. Probar desde los
            datos del móvil descarta las dos en diez segundos.
          </p>
          <p>
            Si no es eso, cuéntanos qué navegador y qué dispositivo usas, en qué sala entrabas y qué
            viste exactamente —si la pantalla se quedó en blanco, si salió un mensaje de error, si te
            expulsó al entrar—. Un «no me deja entrar» a secas no da por dónde empezar a mirar.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-ink">Falta tu ciudad, o sobra algo de la tuya</h2>
        <div className="mt-2 space-y-3 leading-relaxed text-muted">
          <p>
            Las salas de localidad se van abriendo poco a poco y el mapa todavía tiene huecos. Si
            falta la tuya, dinos el municipio y la provincia. Y si en la sala de tu pueblo hay algo
            mal contado —un dato que no es, una fiesta que no se celebra ese día, un nombre mal
            escrito—, avisa: eso lo corregimos casi siempre el mismo día.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold text-ink">Datos personales</h2>
        <div className="mt-2 space-y-3 leading-relaxed text-muted">
          <p>
            Para chatear no pedimos correo, teléfono ni nombre real, así que normalmente no hay nada
            tuyo que borrar. Si aun así quieres ejercer tus derechos de acceso, rectificación o
            supresión, escribe a la misma dirección: el detalle está en la{" "}
            <Link href="/legal/privacidad" className="font-semibold text-blue hover:underline">
              política de privacidad
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
