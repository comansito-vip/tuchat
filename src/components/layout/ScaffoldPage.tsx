import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card } from "@/components/ui/Card";
import { NickInput } from "@/components/ui/NickInput";
import type { Crumb } from "@/lib/seo";

export function ScaffoldPage({
  title,
  crumbs,
  intro,
  children,
}: {
  title: string;
  crumbs: Crumb[];
  intro: string;
  children?: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="mt-4 text-3xl font-extrabold text-ink">{title}</h1>
      <p className="mt-2 max-w-2xl text-muted">{intro}</p>
      {children}
      <Card className="mt-8 p-5">
        <p className="mb-3 text-sm text-muted">
          <strong className="text-ink">Sección en preparación.</strong> Estamos ampliando esta
          página con contenido actualizado. Mientras tanto, entra al{" "}
          <Link href="/chat" className="text-blue hover:underline">
            chat gratis
          </Link>{" "}
          y habla con la comunidad.
        </p>
        <NickInput canal="espana" placeholder="Tu nick para entrar al chat..." />
      </Card>
    </main>
  );
}
