const VARIANTS = {
  normal: "bg-blue text-white",
  complementary: "bg-amber-700 text-white",
  reintegro: "bg-purple-600 text-white",
  star: "bg-amber-400 text-ink",
} as const;

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
      {n}
    </span>
  );
}
