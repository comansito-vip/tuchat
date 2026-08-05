import Link from "next/link";

const COLUMNS = [
  {
    heading: "TuChat",
    links: [
      { label: "Inicio", href: "/" },
      { label: "Salas de chat gratis", href: "/chat" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
  {
    heading: "Salas por país",
    links: [
      { label: "España", href: "/chat/espana" },
      { label: "México", href: "/chat/mexico" },
      { label: "Argentina", href: "/chat/argentina" },
      { label: "Colombia", href: "/chat/colombia" },
    ],
  },
  {
    heading: "Salas por ciudad",
    links: [
      { label: "Madrid", href: "/chat/madrid" },
      { label: "Barcelona", href: "/chat/barcelona" },
      { label: "Valencia", href: "/chat/valencia" },
      { label: "Buenos Aires", href: "/chat/buenos-aires" },
    ],
  },
  {
    heading: "Temáticas",
    links: [
      { label: "Chat para ligar gratis", href: "/chat/ligar" },
      { label: "Buscar pareja", href: "/chat/amor" },
      { label: "Hacer amigos", href: "/chat/amistad" },
      { label: "Chat de deportes", href: "/chat/deportes" },
      { label: "Chat de música", href: "/chat/musica" },
    ],
  },
  {
    heading: "Secciones",
    links: [
      { label: "Hub de deportes", href: "/deportes" },
      { label: "Resultados de fútbol", href: "/resultados/laliga" },
      { label: "Tarot online gratis", href: "/tarot" },
      { label: "Chat de anime", href: "/anime" },
      { label: "Ranking de salas", href: "/ranking" },
    ],
  },
  {
    heading: "Servicios",
    links: [
      { label: "Noticias en español", href: "/noticias" },
      { label: "Horóscopo de hoy", href: "/horoscopo" },
      { label: "El tiempo por ciudades", href: "/tiempo" },
      { label: "Loterías y sorteos", href: "/loterias" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Cómo funciona el chat", href: "/como-funciona" },
      { label: "Aviso legal", href: "/legal/aviso-legal" },
      { label: "Privacidad", href: "/legal/privacidad" },
      { label: "Cookies", href: "/legal/cookies" },
    ],
  },
];

export function Footer() {
  return (
    // pb extra + safe-area: la nav inferior fija en móvil (MobileBottomNav)
    // taparía si no, las últimas filas de enlaces y el copyright.
    <footer className="bg-card border-t border-line mt-12 pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-0">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {COLUMNS.map((col) => (
            // Cada columna es una región de navegación con nombre, y su título
            // NO es un encabezado.
            //
            // Con <h3> rompía la jerarquía (h1→h3) en las páginas cuyo cuerpo
            // solo tiene un h1, como /contacto o la 404. Pasarlo a <h2> arreglaba
            // eso pero creaba algo peor: siete <h2> genéricos —"Legal",
            // "Servicios", "TuChat"…— repetidos en las 4.946 páginas del sitio,
            // que eran los siete encabezados más frecuentes del dominio por
            // delante de cualquier h2 de contenido real.
            //
            // Los títulos de un menú no describen secciones del documento, así
            // que la etiqueta correcta no es un encabezado: es un <nav> con
            // aria-label, que los lectores de pantalla siguen anunciando y
            // listando en su rotor de regiones.
            <nav key={col.heading} aria-label={col.heading}>
              <p className="text-sm font-bold text-ink mb-3">{col.heading}</p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={`${col.heading}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-blue transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-line">
          <p className="text-xs text-muted text-center">
            © 2026 TuChat · Chat en español
          </p>
        </div>
      </div>
    </footer>
  );
}
