import type { Metadata } from "next";
import Link from "next/link";
import { WebchatFrame } from "@/components/webchat/WebchatFrame";
import { CleanWebchatUrl } from "@/components/webchat/CleanWebchatUrl";
import { resolveChannels } from "@/lib/channels";

export const metadata: Metadata = {
  title: "Webchat",
  robots: { index: false, follow: true },
};

export default async function WebchatPage({
  searchParams,
}: {
  searchParams: Promise<{ canal?: string; nick?: string }>;
}) {
  const { canal = "espana", nick } = await searchParams;
  const clientId = process.env.NEXT_PUBLIC_WEBCHAT_CLIENT_ID ?? "af9476269cf237c0196b";
  const channels = resolveChannels(canal).filter((c) => c !== "chatzona");

  return (
    // Sin header global (ver HeaderSlot): esta barra es lo único por encima
    // del iframe, igual que trivialchat.org/webchat — solo logo y canal.
    <div className="flex h-dvh flex-col overflow-hidden">
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-slate-900 px-4">
        <Link href="/" className="shrink-0 text-sm font-extrabold text-white" aria-label="TuChat — Inicio">
          Tu<span className="text-blue">Chat</span>
        </Link>
        <span className="truncate text-sm font-bold text-white">
          {channels.map((c) => `#${c}`).join(" · ")}
        </span>
        <Link href="/" className="ml-auto shrink-0 text-xs text-slate-400 hover:text-white">
          ✕ Salir
        </Link>
      </div>
      <div className="min-h-0 flex-1">
        <WebchatFrame
          canal={canal}
          clientId={clientId}
          nick={nick}
          className="h-full w-full border-0"
        />
      </div>
      <CleanWebchatUrl />
    </div>
  );
}
