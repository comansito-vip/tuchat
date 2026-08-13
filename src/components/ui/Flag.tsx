import Image from "next/image";

/**
 * Convierte un emoji bandera (dos símbolos indicadores regionales) en su código
 * ISO-3166 alpha-2 en minúsculas. Ej: "🇪🇸" → "es". Devuelve null si no aplica.
 */
export function emojiToCountryCode(emoji: string): string | null {
  const chars = Array.from(emoji);
  if (chars.length < 2) return null;
  const A = 0x1f1e6; // 🇦
  const c0 = chars[0].codePointAt(0);
  const c1 = chars[1].codePointAt(0);
  if (c0 == null || c1 == null) return null;
  if (c0 < A || c0 > A + 25 || c1 < A || c1 > A + 25) return null;
  return (
    String.fromCharCode(97 + (c0 - A)) + String.fromCharCode(97 + (c1 - A))
  );
}

type FlagProps = {
  /** Emoji bandera tal como viene en la data (ej. "🇪🇸"). */
  emoji: string;
  /**
   * Ruta a una bandera real local (ej. comunidades autónomas, que no tienen
   * emoji-bandera propio). Si se indica, tiene prioridad sobre el emoji.
   */
  flagSrc?: string;
  /** Nombre del país/ciudad para el alt. */
  name?: string;
  /** Ancho en px (la altura sigue ratio 4:3). */
  size?: number;
  className?: string;
  /** Para banderas grandes por encima del pliegue (evita el lazy-load por defecto). */
  priority?: boolean;
};

/**
 * Bandera real a partir de la data. Prioridad:
 *  1. flagSrc — bandera indicada a mano (regiones/comunidades sin emoji-bandera).
 *  2. emoji de país → PNG propio en `public/flags/paises/`.
 *  3. cualquier otro emoji (icono temático) → se muestra tal cual.
 *
 * Las de país venían de flagcdn.com hasta agosto de 2026. Son 32 códigos en todo
 * el catálogo —144 KB en total—, así que no había razón para que cada visita
 * pidiera a un CDN ajeno una imagen que aparece en casi todas las páginas del
 * sitio: se sirven desde tuchat.org como ya se hacía con las de las comunidades.
 */
export function Flag({ emoji, flagSrc, name, size = 22, className, priority }: FlagProps) {
  const code = emojiToCountryCode(emoji);
  const height = Math.round((size * 3) / 4);

  if (flagSrc) {
    return (
      <Image
        src={flagSrc}
        alt={name ? `Bandera de ${name}` : ""}
        width={size}
        height={height}
        priority={priority}
        className={`inline-block shrink-0 rounded-[3px] object-cover ring-1 ring-black/10 ${className ?? ""}`}
      />
    );
  }

  if (!code) {
    return (
      <span
        aria-hidden="true"
        className={className}
        style={{ fontSize: size, lineHeight: 1 }}
      >
        {emoji}
      </span>
    );
  }

  // Cada bandera se guarda a 320px de ancho, de sobra para el mayor uso (130px
  // en el hero de la sala, 260 en pantalla retina). Del reescalado a los tamaños
  // pequeños ya se encarga el optimizador de Next.
  return (
    <Image
      src={`/flags/paises/${code}.png`}
      alt={name ? `Bandera de ${name}` : ""}
      width={size}
      height={height}
      priority={priority}
      className={`inline-block shrink-0 rounded-[3px] object-cover ring-1 ring-black/10 ${className ?? ""}`}
    />
  );
}
