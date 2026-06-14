import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";

const TRENDS: { label: string; href: string }[] = [
  { label: "Mundial 2026: calendario y grupos", href: "/noticias" },
  { label: "Resultados deportivos de hoy", href: "/noticias" },
  { label: "Lotería y sorteos del día", href: "/loterias/espana" },
  { label: "Horóscopo diario", href: "/horoscopo" },
  { label: "El tiempo por ciudades", href: "/tiempo/madrid" },
  { label: "Lo último en tecnología e IA", href: "/noticias" },
  { label: "Actualidad de España y Latinoamérica", href: "/noticias" },
];

export function TrendingBlock() {
  return (
    <section className="bg-card border-y border-line">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <SectionTitle href="/noticias" cta="Ver noticias">Tendencias del día</SectionTitle>
        <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {TRENDS.map((trend) => (
            <li key={trend.href + trend.label}>
              <Link
                href={trend.href}
                className="flex items-center gap-2 text-sm text-muted hover:text-blue transition-colors"
              >
                <span className="font-bold text-blue" aria-hidden="true">›</span>
                {trend.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
