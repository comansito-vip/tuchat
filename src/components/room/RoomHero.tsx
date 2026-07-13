import { cityFlag, type Place } from "@/data";
import { ChatIcon, LiveDot } from "@/components/ui/icons";
import { Flag } from "@/components/ui/Flag";
import { NickInput } from "@/components/ui/NickInput";
import { getAnimeBySlug } from "@/lib/anime-series";

// Los tonos de arranque son 600/700, no 500: con un 500 ni el texto blanco puro
// llega a 3:1 en el borde claro del gradiente (sky-500 daba 2.77:1, amber-500
// 2.15:1), así que la intro de la sala no se leía al sol. Medido, no a ojo.
const GRADIENT_KIND: Record<Place["kind"], string> = {
  pais: "from-blue-600 to-blue-900",
  ciudad: "from-sky-700 to-blue-900",
  tematica: "from-indigo-600 to-blue-900",
};

// Degradados por temática — aportan identidad cromática a cada categoría.
const GRADIENT_SLUG: Record<string, string> = {
  amor: "from-rose-600 to-pink-900",
  amistad: "from-sky-700 to-blue-900",
  lgtbi: "from-pink-600 to-purple-900",
  deportes: "from-emerald-700 to-green-900",
  musica: "from-violet-600 to-purple-900",
  videojuegos: "from-amber-700 to-orange-900",
  anime: "from-fuchsia-700 to-purple-900",
  tarot: "from-indigo-600 to-purple-900",
  horoscopo: "from-indigo-600 to-violet-900",
  esoterismo: "from-purple-600 to-indigo-900",
  videncia: "from-violet-600 to-purple-900",
  astrologia: "from-indigo-600 to-blue-900",
  magia: "from-purple-700 to-indigo-900",
  cine: "from-slate-600 to-gray-900",
  tecnologia: "from-cyan-700 to-blue-900",
  viajes: "from-teal-700 to-cyan-900",
  cocina: "from-orange-700 to-amber-900",
};

const KIND_LABEL: Record<Place["kind"], string> = {
  pais: "Sala de país",
  ciudad: "Sala de ciudad",
  tematica: "Sala temática",
};

// Fallback CJK explícito: sin él, los sistemas sin fuente japonesa por defecto
// (Linux sin paquetes CJK, algunos navegadores) muestran "tofu" (glifos vacíos).
const CJK_FONT_STACK =
  '"Noto Sans JP", "Hiragino Kaku Gothic ProN", "Yu Gothic", Meiryo, sans-serif';

export function RoomHero({ place, h1 }: { place: Place; h1?: string }) {
  // Las salas de series de anime heredan la identidad cromática de su póster.
  const anime = getAnimeBySlug(place.slug);
  const gradient = GRADIENT_SLUG[place.slug] ?? GRADIENT_KIND[place.kind];
  const flag = cityFlag(place);
  return (
    <section
      className={`relative mt-4 overflow-hidden rounded-2xl px-5 py-7 text-white shadow-lg shadow-blue/20 sm:px-8 sm:py-9${
        anime ? "" : ` bg-gradient-to-br ${gradient}`
      }`}
      style={anime ? { background: `linear-gradient(135deg, ${anime.c1}, ${anime.c2})` } : undefined}
    >
      {/* Capa oscurecedora: los colores de anime son dinámicos (c1/c2) y pueden
          ser claros, así que garantizamos el contraste AA del texto blanco. */}
      {anime && <div className="pointer-events-none absolute inset-0 bg-black/25" aria-hidden="true" />}
      {/* Adornos de fondo */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 right-24 h-44 w-44 rounded-full bg-white/5 blur-2xl" />
      {anime ? (
        /* Título japonés como gran marca de agua del póster */
        <span
          className="pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 select-none text-[5rem] font-extrabold leading-none tracking-tighter opacity-15 sm:text-[8rem]"
          style={{ writingMode: "vertical-rl", fontFamily: CJK_FONT_STACK }}
          aria-hidden="true"
        >
          {anime.jp}
        </span>
      ) : (
        <div
          className="pointer-events-none absolute right-3 top-3 opacity-15 select-none"
          aria-hidden="true"
        >
          {/* Misma representación que el icono pequeño de abajo (Flag): evita
              mostrar dos estilos gráficos distintos de la misma bandera. */}
          <Flag emoji={flag.icon} flagSrc={flag.flagSrc} size={130} />
        </div>
      )}

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
        {/* Icono grande */}
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm sm:h-20 sm:w-20">
          <Flag emoji={flag.icon} flagSrc={flag.flagSrc} name={flag.name} size={56} priority />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">
              <span className="text-emerald-300">
                <LiveDot />
              </span>
              {place.users.toLocaleString("es")} hablando ahora
            </span>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90">
              {KIND_LABEL[place.kind]}
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
            {h1 ?? `Chat ${place.name} gratis`}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white sm:text-base">{place.intro}</p>

          <div className="mt-5 flex flex-col gap-3">
            <NickInput
              canal={place.slug}
              variant="onColor"
              placeholder={`Tu nick para entrar a ${place.name}...`}
            />
            <a
              href="#relacionadas"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/90 underline-offset-4 transition-colors hover:underline"
            >
              <ChatIcon />
              Ver salas relacionadas ↓
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
