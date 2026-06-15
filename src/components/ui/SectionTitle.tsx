import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons";

export function SectionTitle({
  children,
  href,
  cta,
  eyebrow,
  description,
  icon,
}: {
  children: React.ReactNode;
  href?: string;
  cta?: string;
  /** Micro-rótulo sobre el título (ej. "EN VIVO"). */
  eyebrow?: string;
  /** Línea descriptiva bajo el título. */
  description?: string;
  /** Icono opcional junto al título. */
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-1 text-xs font-bold uppercase tracking-widest text-blue">
            {eyebrow}
          </div>
        )}
        <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight text-ink">
          {icon && <span className="text-blue">{icon}</span>}
          {children}
        </h2>
        {description && (
          <p className="mt-1 max-w-xl text-sm text-muted">{description}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-blue hover:text-blue-dark"
        >
          {cta ?? "Ver todo"}
          <ArrowRightIcon
            width={15}
            height={15}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}
