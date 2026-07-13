"use client";
import { useMemo } from "react";
import { resolveChannels, channelString } from "@/lib/channels";
import { generateNick } from "@/lib/nick";

export function WebchatFrame({
  canal,
  clientId,
  nick,
  className,
  ref,
}: {
  canal: string;
  clientId: string;
  nick?: string;
  className?: string;
  ref?: React.Ref<HTMLIFrameElement>;
}) {
  const src = useMemo(() => {
    const resolvedNick = nick ?? generateNick();
    const channels = channelString(resolveChannels(canal));
    const base = "https://chat.chatzona.org/index.html";
    return `${base}?clientId=${clientId}#nick=${resolvedNick}&channel=${channels}&show_password_box=false`;
  }, [canal, clientId, nick]);

  return (
    <iframe
      ref={ref}
      src={src}
      title={`Chat de ${canal}`}
      className={className ?? "h-[78vh] w-full rounded-lg border border-line bg-card lg:h-[600px]"}
      allow="autoplay"
    />
  );
}
