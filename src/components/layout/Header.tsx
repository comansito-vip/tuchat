import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ChatIcon } from "@/components/ui/icons";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { NavLinks } from "@/components/layout/NavLinks";

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
          <NavLinks />
        </nav>

        {/* CTA */}
        <div className="ml-auto shrink-0">
          <Button
            href="/webchat?canal=espana"
            variant="cta"
            icon={<ChatIcon className="hidden sm:block" />}
            className="px-3 text-xs lg:px-4 lg:text-sm"
          >
            Entrar al chat
          </Button>
        </div>
      </div>
    </header>
  );
}
