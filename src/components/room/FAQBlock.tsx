export function FAQBlock({ items }: { items: { q: string; a: string }[] }) {
  return (
    <section className="mt-8">
      <h2 className="mb-4 text-lg font-bold text-ink">Preguntas frecuentes</h2>
      <div>
        {items.map((item) => (
          <details key={item.q} className="border-b border-line py-3">
            <summary className="cursor-pointer font-medium text-ink">{item.q}</summary>
            <p className="mt-2 text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
