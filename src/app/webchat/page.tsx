import type { Metadata } from "next";
import { WebchatFrame } from "@/components/webchat/WebchatFrame";
import { RelatedRooms } from "@/components/room/RelatedRooms";
import { getPlace } from "@/data";

export const metadata: Metadata = { title: "Webchat", robots: { index: false } };

export default async function WebchatPage({ searchParams }: { searchParams: Promise<{ canal?: string }> }) {
  const { canal = "espana" } = await searchParams;
  const place = getPlace(canal);
  const clientId = process.env.NEXT_PUBLIC_WEBCHAT_CLIENT_ID ?? "af9476269cf237c0196b";

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-1 text-xl font-bold text-ink">Chat de {place?.name ?? canal}</h1>
      <p className="mb-4 text-sm text-muted">Estás entrando como invitado. Sé respetuoso y no compartas datos personales.</p>
      <WebchatFrame canal={canal} clientId={clientId} />
      {place && (
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-bold text-ink">Salas relacionadas</h2>
          <RelatedRooms slugs={place.related} />
        </section>
      )}
      <section className="mt-6 text-sm text-muted">
        <h2 className="mb-2 text-sm font-bold text-ink">Normas básicas</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Respeto: nada de insultos ni acoso.</li>
          <li>No compartas datos personales (teléfono, dirección, contraseñas).</li>
          <li>Prohibido el spam y la publicidad.</li>
          <li>Algunas salas son solo para mayores de edad.</li>
        </ul>
      </section>
    </main>
  );
}
