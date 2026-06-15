import Link from "next/link";
import { clsx } from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "onColor" | "cta";
type Size = "sm" | "md" | "lg";

const styles: Record<Variant, string> = {
  primary:
    "bg-blue text-white shadow-sm shadow-blue/30 hover:bg-blue-dark hover:shadow-md hover:shadow-blue/30 active:scale-[.98]",
  secondary: "bg-card text-blue-dark border border-line hover:border-blue active:scale-[.98]",
  ghost: "text-blue-dark hover:bg-bg",
  onColor: "bg-white text-blue-dark shadow-md shadow-black/10 hover:bg-white/90 active:scale-[.98]",
  cta: "bg-cta text-white shadow-sm shadow-cta/30 hover:bg-cta-dark active:scale-[.98]",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-lg",
  lg: "px-5 py-3 text-base rounded-xl",
};

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  href?: string;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  href,
  className,
  ...rest
}: Props) {
  const cls = clsx(
    "inline-flex items-center justify-center gap-2 font-semibold transition-all",
    sizes[size],
    styles[variant],
    className,
  );
  const content = (
    <>
      {icon}
      {children}
    </>
  );
  if (href)
    return (
      <Link href={href} className={cls}>
        {content}
      </Link>
    );
  return (
    <button className={cls} {...rest}>
      {content}
    </button>
  );
}
