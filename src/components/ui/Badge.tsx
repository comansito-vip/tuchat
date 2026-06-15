import { clsx } from "clsx";
import { FireIcon, SparkIcon } from "@/components/ui/icons";

export type BadgeTone =
  | "Popular"
  | "Nueva"
  | "Tendencia"
  | "HOT"
  | "NUEVO"
  | "EN VIVO";

const map: Record<BadgeTone, string> = {
  Popular: "bg-blue/10 text-blue",
  Nueva: "bg-active/12 text-active",
  Tendencia: "bg-amber-100 text-amber-700",
  HOT: "bg-live text-white shadow-sm shadow-live/30",
  NUEVO: "bg-active/12 text-active",
  "EN VIVO": "bg-live-soft text-live",
};

export function Badge({ tag }: { tag: BadgeTone }) {
  const icon =
    tag === "HOT" ? (
      <FireIcon className="-ml-0.5" width={12} height={12} />
    ) : tag === "NUEVO" ? (
      <SparkIcon className="-ml-0.5" width={12} height={12} />
    ) : null;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide",
        map[tag],
      )}
    >
      {icon}
      {tag}
    </span>
  );
}
