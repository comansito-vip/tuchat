import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SEOTextBlock } from "@/components/room/SEOTextBlock";
import { FAQBlock } from "@/components/room/FAQBlock";
import { OG_BASE, JsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { getStats } from "@/data";

/**
 * Página de referencia sobre el funcionamiento del chat.
 *
 * Existe para dar un único hogar a todo lo que antes se repetía en cada una de
 * las 2.547 landings de sala: qué es el nick de invitado, por qué no hace falta
 * registro, y los consejos de seguridad. Repetido en 2.547 páginas era ruido
 * duplicado; en una sola es una página con entidad propia, que además compite
 * por consultas informativas ("cómo entrar a un chat sin registrarse",
 * "chatear de forma segura") que las salas nunca iban a ganar.
 */

export const metadata: Metadata = {
  // El template del layout añade " · TuChat": con el título largo se pasaba de
  // los 60 caracteres que se respetan en todo el sitio.
  title: "Cómo funciona el chat: entrar y chatear seguro",
  description:
    "Cómo entrar a las salas de TuChat sin registrarse, qué es el nick de invitado, cómo moverse entre canales y qué precauciones tomar al hablar con desconocidos.",
  alternates: { canonical: "/como-funciona" },
  openGraph: { ...OG_BASE, url: "/como-funciona" },
};

const crumbs = [
  { name: "Inicio", url: "/" },
  { name: "Cómo funciona", url: "/como-funciona" },
];

const FAQ = [
  {
    q: "¿Hay que registrarse para chatear?",
    a: "No. No se pide correo, ni teléfono, ni contraseña. Escribes el nick con el que quieres que te vean, pulsas entrar y ya estás dentro de la sala. Tampoco hay una cuenta que borrar después: al cerrar la pestaña, se acabó.",
  },
  {
    q: "¿El chat es gratis del todo?",
    a: "Sí. No hay versión de pago, ni funciones bloqueadas, ni límite de mensajes. El portal se mantiene con publicidad, no con suscripciones.",
  },
  {
    q: "¿Tengo que instalar algún programa?",
    a: "No. El chat corre dentro del navegador, en el móvil y en el ordenador. No hay aplicación que descargar ni complemento que activar.",
  },
  {
    q: "¿Puedo usar el mismo nick en varias salas?",
    a: "Sí, y es lo normal: el nick te acompaña mientras dure la sesión, así que puedes entrar a la sala de tu ciudad, saltar a una temática y volver sin repetir el proceso.",
  },
  {
    q: "¿Alguien puede ver mi dirección IP o mi ubicación?",
    a: "El servidor la necesita para conectar, como cualquier servicio de internet, pero no se muestra a los demás usuarios. Lo que sí puede identificarte es lo que cuentes tú: el barrio, el centro de trabajo o el instituto.",
  },
  {
    q: "¿Qué hago si alguien me acosa o se comporta mal?",
    a: "Usa el botón de reporte para que los moderadores lo vean. Si la situación es grave o incluye amenazas, guarda una captura antes de salir: sirve como prueba si hay que denunciarlo.",
  },
];

export default function ComoFuncionaPage() {
  const stats = getStats();
  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={faqJsonLd(FAQ)} />
      <Breadcrumbs crumbs={crumbs} />

      <h1 className="mt-4 text-3xl font-extrabold text-ink">Cómo funciona el chat</h1>
      <p className="mt-3 leading-relaxed text-muted">
        TuChat funciona sobre una red de canales de charla en español: {stats.rooms.toLocaleString("es")} salas
        entre países, ciudades y temáticas, todas accesibles desde el navegador y sin crear cuenta.
        Lo que sigue explica el proceso de entrada y las precauciones que conviene tener, que son
        las mismas en cualquier sala.
      </p>

      <SEOTextBlock title="Entrar a una sala, paso a paso">
        <ol className="ml-5 list-decimal space-y-2">
          <li>
            Elige la sala en{" "}
            <Link href="/chat" className="font-semibold text-blue hover:underline">
              el listado completo
            </Link>
            : por ciudad si buscas gente cerca, por temática si te interesa más el tema que la
            geografía.
          </li>
          <li>
            Escribe un nick en el recuadro. Es el nombre con el que te verán los demás; no tiene que
            ser el tuyo y puedes cambiarlo la próxima vez.
          </li>
          <li>
            Pulsa entrar. Se abre el webchat conectado al canal de esa sala y ya puedes escribir.
          </li>
        </ol>
        <p>
          Cada sala indica en su panel lateral a qué canales conecta. Una sala de ciudad suele
          enlazar con el de su provincia y el de su país, de modo que si el canal local está tranquilo
          hay conversación un nivel por encima.
        </p>
      </SEOTextBlock>

      <SEOTextBlock title="El nick de invitado">
        <p>
          El nick es temporal: no queda reservado y otra persona puede usarlo mañana. Esto tiene una
          ventaja evidente —no hay nada que recordar ni que recuperar— y una consecuencia práctica:
          si quieres que te reconozcan, conviene repetir siempre el mismo y no elegir uno demasiado
          común.
        </p>
        <p>
          Evita nicks que contengan tu nombre completo, tu año de nacimiento o el municipio pequeño
          en el que vives. Los tres juntos identifican a una persona con bastante precisión.
        </p>
      </SEOTextBlock>

      <SEOTextBlock title="Chatear con cabeza">
        <p>
          Nunca compartas dirección, teléfono, contraseñas ni datos bancarios con alguien que acabas
          de conocer, por cordial que sea la conversación. Los intentos de estafa en salas de chat
          casi siempre siguen el mismo guion: confianza rápida, una historia personal difícil y una
          petición de dinero o de datos.
        </p>
        <p>
          Desconfía de los enlaces que lleguen por privado, sobre todo acortados: pueden llevar a
          páginas que imitan una pantalla de acceso para quedarse con tus credenciales. Si alguien
          insiste en moverte a otra plataforma nada más empezar, es una señal a tener en cuenta.
        </p>
        <p>
          Si acuerdas quedar con alguien en persona, que sea en un sitio público y con horario
          amplio, y díselo a alguien de confianza. Y si algo incomoda, salir de la sala es
          instantáneo y no requiere dar explicaciones.
        </p>
      </SEOTextBlock>

      <SEOTextBlock title="Menores">
        <p>
          Las salas están pensadas para mayores de edad. Las franjas por edad del portal empiezan en
          los 18 años y no existe ninguna sala dirigida a menores. Si detectas a alguien que dice ser
          menor de edad, o a un adulto intentando contactar con menores, repórtalo: es la única forma
          de que los moderadores puedan intervenir.
        </p>
      </SEOTextBlock>

      <FAQBlock items={FAQ} />

      <p className="mt-8 text-sm text-muted">
        ¿Algo que no queda claro?{" "}
        <Link href="/contacto" className="font-semibold text-blue hover:underline">
          Escríbenos
        </Link>
        . Para las condiciones de uso y el tratamiento de datos están el{" "}
        <Link href="/legal/aviso-legal" className="font-semibold text-blue hover:underline">
          aviso legal
        </Link>{" "}
        y la{" "}
        <Link href="/legal/privacidad" className="font-semibold text-blue hover:underline">
          política de privacidad
        </Link>
        .
      </p>
    </main>
  );
}
