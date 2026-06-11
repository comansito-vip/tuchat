import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Card } from "@/components/ui/Card";
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
      <Card className="mt-8 p-6 text-sm text-muted">
        <p>
          <strong className="text-ink">Sección en preparación.</strong> Estamos ampliando esta
          página con contenido actualizado. Mientras tanto, puedes{" "}
          <a href="/chat" className="text-blue hover:underline">
            explorar las salas de chat
          </a>
          .
        </p>
      </Card>
    </main>
  );
}
