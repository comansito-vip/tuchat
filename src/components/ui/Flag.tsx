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
  /** Nombre del país/ciudad para el alt. */
  name?: string;
  /** Ancho en px (la altura sigue ratio 4:3). */
  size?: number;
  className?: string;
  /** Para banderas grandes por encima del pliegue (evita el lazy-load por defecto). */
  priority?: boolean;
};

/**
 * Bandera SVG real (flagcdn) a partir del emoji de la data. Si el emoji no es una
 * bandera (p. ej. un icono temático), cae al propio emoji para no perder nada.
 */
export function Flag({ emoji, name, size = 22, className, priority }: FlagProps) {
  const code = emojiToCountryCode(emoji);
  const height = Math.round((size * 3) / 4);

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

  // flagcdn solo sirve estos anchos fijos; pedimos el primero que cubra el
  // tamaño mostrado a 2x (pantallas retina) para que no se vea pixelado.
  const srcWidth = [80, 160, 320, 640].find((w) => w >= size * 2) ?? 640;

  return (
    <Image
      src={`https://flagcdn.com/w${srcWidth}/${code}.png`}
      alt={name ? `Bandera de ${name}` : ""}
      width={size}
      height={height}
      priority={priority}
      className={`inline-block shrink-0 rounded-[3px] object-cover ring-1 ring-black/10 ${className ?? ""}`}
    />
  );
}
