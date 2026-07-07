import Link from "next/link";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { NavLinks } from "@/components/layout/NavLinks";
import { HeaderCTA } from "@/components/layout/HeaderCTA";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-card/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Menú móvil funcional */}
        <MobileMenu />

        {/* Brand: logo TC + wordmark */}
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="TuChat — Inicio">
          <svg
            width="28"
            height="28"
            viewBox="0 0 512 512"
            className="shrink-0"
            aria-hidden="true"
          >
            <rect width="512" height="512" rx="112" fill="#4f46e5" />
            <g fill="#ffffff">
              <rect x="86" y="180" width="170" height="46" rx="10" />
              <rect x="148" y="180" width="46" height="172" rx="10" />
              <path d="M404 214a92 92 0 1 0 0 124l-34 -30a48 48 0 1 1 0 -64z" />
            </g>
          </svg>
          <span className="text-blue-dark font-extrabold text-lg">
            Tu<span className="text-blue">Chat</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-4 text-sm text-muted" aria-label="Navegación principal">
          <NavLinks />
        </nav>

        {/* CTA */}
        <div className="ml-auto shrink-0">
          <HeaderCTA />
        </div>
      </div>
    </header>
  );
}
