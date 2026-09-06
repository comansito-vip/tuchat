import Link from "next/link";
import type { Team } from "@/lib/teams";

export function TeamCard({ team }: { team: Team }) {
  const content = (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-card p-3 hover:border-blue transition-colors">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={team.badge}
        alt={`Escudo del ${team.name}`}
        width={40}
        height={40}
        loading="lazy"
        className="h-10 w-10 shrink-0 object-contain"
      />
      <span className="text-sm font-semibold text-ink leading-tight">{team.name}</span>
    </div>
  );

  if (team.slug) {
    return <Link href={`/chat/${team.slug}`}>{content}</Link>;
  }
  return <div>{content}</div>;
}
