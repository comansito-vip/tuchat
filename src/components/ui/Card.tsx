import { clsx } from "clsx";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** "interactive" añade elevación y borde de marca al hover. */
  variant?: "base" | "interactive";
};

export function Card({ children, className, variant = "base" }: Props) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-line bg-card shadow-card",
        variant === "interactive" &&
          "transition-all duration-200 hover:-translate-y-0.5 hover:border-blue/40 hover:shadow-card-hover",
        className,
      )}
    >
      {children}
    </div>
  );
}
