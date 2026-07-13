import type { Metadata } from "next";
import { WebchatShell } from "@/components/webchat/WebchatShell";
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
  // #chatzona va en el iframe (red global) pero no en la etiqueta de la barra:
  // al usuario le importa la sala a la que ha entrado, no el canal de red.
  const label = resolveChannels(canal)
    .filter((c) => c !== "chatzona")
    .map((c) => `#${c}`)
    .join(" · ");

  return (
    // Sin header, footer ni nav global (ver HeaderSlot/FooterSlot/LayoutShell):
    // la barra del propio shell es lo único por encima del iframe.
    <>
      <WebchatShell canal={canal} clientId={clientId} nick={nick} label={label} />
      <CleanWebchatUrl />
    </>
  );
}
