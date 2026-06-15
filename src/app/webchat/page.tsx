import type { Metadata } from "next";
import { WebchatFrame } from "@/components/webchat/WebchatFrame";
import { getPlace } from "@/data";
import { resolveChannels } from "@/lib/channels";
import { LiveDot } from "@/components/ui/icons";

export const metadata: Metadata = { title: "Webchat", robots: { index: false } };

export default async function WebchatPage({
  searchParams,
}: {
  searchParams: Promise<{ canal?: string; nick?: string }>;
}) {
  const { canal = "espana", nick } = await searchParams;
  const place = getPlace(canal);
  const clientId = process.env.NEXT_PUBLIC_WEBCHAT_CLIENT_ID ?? "af9476269cf237c0196b";
  const channels = resolveChannels(canal);

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: "calc(100dvh - 3.5rem)" }}>
      {/* Barra de canal */}
      <div className="flex shrink-0 items-center gap-3 bg-slate-900 px-4 py-2.5">
        <span className="text-green-400">
          <LiveDot />
        </span>
        <span className="text-sm text-slate-400">Estás en</span>
        <span className="truncate text-sm font-bold text-white">
          {channels.map((c) => `#${c}`).join(" · ")}
        </span>
        {place && (
          <span className="ml-auto shrink-0 text-xs text-slate-500">
            {place.name} · {place.users.toLocaleString("es")} online
          </span>
        )}
      </div>
      {/* Iframe del chat */}
      <div className="min-h-0 flex-1">
        <WebchatFrame
          canal={canal}
          clientId={clientId}
          nick={nick}
          className="h-full w-full border-0"
        />
      </div>
    </div>
  );
}
