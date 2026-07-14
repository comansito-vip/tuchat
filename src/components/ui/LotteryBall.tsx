const VARIANTS = {
  normal: "bg-blue text-white",
  complementary: "bg-amber-700 text-white",
  reintegro: "bg-purple-600 text-white",
  star: "bg-amber-400 text-ink",
} as const;

// El color de la bola es lo único que distingue un complementario de un
// reintegro o de una estrella: quien no ve la pantalla (o no distingue el ámbar
// del amarillo) oye una ristra de números sueltos. Cada variante dice lo que es.
const ETIQUETA: Record<keyof typeof VARIANTS, string> = {
  normal: "",
  complementary: "Complementario: ",
  reintegro: "Reintegro: ",
  star: "Estrella: ",
};

export function LotteryBall({
  n,
  variant = "normal",
}: {
  n: number;
  variant?: keyof typeof VARIANTS;
}) {
  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${VARIANTS[variant]}`}
    >
      {ETIQUETA[variant] && <span className="sr-only">{ETIQUETA[variant]}</span>}
      {n}
    </span>
  );
}
