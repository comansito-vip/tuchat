import Link from "next/link";

export function SectionTitle({
  children,
  href,
  cta,
}: {
  children: React.ReactNode;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <h2 className="text-xl font-bold text-ink">{children}</h2>
      {href && (
        <Link href={href} className="text-sm font-semibold text-blue hover:underline">
          {cta ?? "Ver todo"}
        </Link>
      )}
    </div>
  );
}
