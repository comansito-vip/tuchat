"use client";
import { useMemo } from "react";
import { resolveChannels, channelString } from "@/lib/channels";
import { generateNick } from "@/lib/nick";

export function WebchatFrame({ canal, clientId }: { canal: string; clientId: string }) {
  const src = useMemo(() => {
    const nick = generateNick();
    const channels = channelString(resolveChannels(canal));
    const base = "https://chat.chatzona.org/index.html";
    return `${base}?clientId=${clientId}#nick=${nick}&channel=${channels}&show_password_box=false`;
  }, [canal, clientId]);

  return (
    <iframe
      src={src}
      title={`Chat de ${canal}`}
      className="h-[78vh] w-full rounded-lg border border-line bg-card lg:h-[600px]"
      allow="autoplay"
    />
  );
}
