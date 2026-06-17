import { permanentRedirect } from "next/navigation";

export default async function CiudadPage({
  params,
}: {
  params: Promise<{ ciudad: string }>;
}) {
  const { ciudad } = await params;
  permanentRedirect(`/chat/${ciudad}`);
}
