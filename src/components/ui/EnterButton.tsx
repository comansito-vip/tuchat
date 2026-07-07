"use client";
import Link from "next/link";
import { useSavedNick } from "@/lib/nick-storage";

/**
 * Link a /webchat que añade el nick ya escrito por el usuario en algún
 * NickInput de la visita, para que no se pierda al entrar desde una tarjeta
 * distinta del input principal.
 */
export function EnterButton({
  canal,
  className,
  icon,
  children,
}: {
  canal: string;
  className?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const nick = useSavedNick().trim();

  const href = nick
    ? `/webchat?canal=${canal}&nick=${encodeURIComponent(nick)}`
    : `/webchat?canal=${canal}`;

  return (
    <Link href={href} className={className}>
      {icon}
      {children}
    </Link>
  );
}
