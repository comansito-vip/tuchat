import Link from "next/link";

const COLUMNS = [
  {
    heading: "TuChat",
    links: [
      { label: "Sobre TuChat", href: "/" },
      { label: "Cómo funciona", href: "/" },
      { label: "Contacto", href: "/" },
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
      { label: "Amor", href: "/chat/amor" },
      { label: "Amistad", href: "/chat/amistad" },
      { label: "Deportes", href: "/chat/deportes" },
      { label: "Música", href: "/chat/musica" },
    ],
  },
  {
    heading: "Secciones",
    links: [
      { label: "Deportes", href: "/deportes" },
      { label: "Resultados", href: "/resultados" },
      { label: "Tarot", href: "/tarot" },
      { label: "Anime", href: "/anime" },
      { label: "Ranking", href: "/ranking" },
    ],
  },
  {
    heading: "Servicios",
    links: [
      { label: "Noticias", href: "/noticias" },
      { label: "Horóscopo", href: "/horoscopo/aries" },
      { label: "El tiempo", href: "/tiempo/madrid" },
      { label: "Loterías", href: "/loterias/espana" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Aviso legal", href: "/" },
      { label: "Privacidad", href: "/" },
      { label: "Cookies", href: "/" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-card border-t border-line mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-bold text-ink mb-3">{col.heading}</h3>
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
            </div>
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
