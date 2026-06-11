import Link from "next/link";
import { clsx } from "clsx";

type Variant = "primary" | "secondary" | "ghost";
const styles: Record<Variant, string> = {
  primary: "bg-blue text-white hover:bg-blue-dark",
  secondary: "bg-card text-blue-dark border border-line hover:border-blue",
  ghost: "text-blue-dark hover:bg-bg",
};

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  href?: string;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, variant = "primary", href, className, ...rest }: Props) {
  const cls = clsx(
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors",
    styles[variant],
    className,
  );
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button className={cls} {...rest}>{children}</button>;
}
