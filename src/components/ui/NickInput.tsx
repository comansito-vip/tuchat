"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

type Variant = "default" | "onColor";

export function NickInput({
  canal,
  variant = "default",
  placeholder = "Tu nick...",
  className,
}: {
  canal: string;
  variant?: Variant;
  placeholder?: string;
  className?: string;
}) {
  const [nick, setNick] = useState("");
  const router = useRouter();

  const enter = () => {
    const n = nick.trim() || "Invitado";
    router.push(`/webchat?canal=${canal}&nick=${encodeURIComponent(n)}`);
  };

  return (
    <div className={clsx("flex gap-2", className)}>
      <input
        type="text"
        value={nick}
        onChange={(e) => setNick(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && enter()}
        aria-label={placeholder}
        placeholder={placeholder}
        maxLength={20}
        className={clsx(
          "min-w-0 flex-1 rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2",
          variant === "onColor"
            ? "border-white/30 bg-white/15 text-white placeholder:text-white/60 backdrop-blur-sm focus:ring-white/40"
            : "border-line bg-card text-ink placeholder:text-muted focus:ring-blue/40",
        )}
      />
      <button
        type="button"
        onClick={enter}
        className="shrink-0 rounded-xl bg-cta px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-cta-dark active:scale-[.98]"
      >
        💬 Entrar
      </button>
    </div>
  );
}
