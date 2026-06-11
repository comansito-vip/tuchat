import { clsx } from "clsx";
import type { RoomTag } from "@/data";

const map: Record<RoomTag, string> = {
  Popular: "bg-blue/10 text-blue",
  Nueva: "bg-active/10 text-active",
  Tendencia: "bg-amber-100 text-amber-700",
};

export function Badge({ tag }: { tag: RoomTag }) {
  return (
    <span className={clsx("rounded-full px-2 py-0.5 text-[11px] font-semibold", map[tag])}>
      {tag}
    </span>
  );
}
