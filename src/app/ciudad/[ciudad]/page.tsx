import { redirect } from "next/navigation";

export default async function CiudadPage({
  params,
}: {
  params: Promise<{ ciudad: string }>;
}) {
  const { ciudad } = await params;
  redirect(`/chat/${ciudad}`);
}
