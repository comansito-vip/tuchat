import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "@/components/layout/MobileMenu";

const NAV_ITEMS = [
  { label: "Chat", href: "/chat" },
  { label: "Países", href: "/pais/espana" },
  { label: "Ciudades", href: "/chat/madrid" },
  { label: "Temáticas", href: "/chat/amor" },
  { label: "Deportes", href: "/deportes" },
  { label: "Tarot", href: "/tarot" },
  { label: "Anime", href: "/anime" },
  { label: "Noticias", href: "/noticias" },
  { label: "Ranking", href: "/ranking" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-card/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Menú móvil funcional */}
        <MobileMenu />

        {/* Brand */}
        <Link href="/" className="text-blue-dark font-extrabold text-lg shrink-0">
          Tu<span className="text-blue">Chat</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-4 text-sm text-muted" aria-label="Navegación principal">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-ink transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="ml-auto shrink-0">
          <Button href="/webchat?canal=espana" className="text-xs lg:text-sm px-3 lg:px-4">
            Entrar al chat
          </Button>
        </div>
      </div>
    </header>
  );
}
