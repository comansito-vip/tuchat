export function SEOTextBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="mb-2 text-lg font-bold text-ink">{title}</h2>
      <div className="max-w-3xl space-y-3 leading-relaxed text-muted">{children}</div>
    </section>
  );
}
