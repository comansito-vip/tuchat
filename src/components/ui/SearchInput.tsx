"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchInput({ size = "lg" }: { size?: "lg" | "md" }) {
  const [q, setQ] = useState("");
  const router = useRouter();
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/chat?q=${encodeURIComponent(q)}`);
      }}
      className="flex w-full items-center gap-2 rounded-xl border border-line bg-card p-2 shadow-sm"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar ciudad, país o temática"
        aria-label="Buscar salas por ciudad, país o temática"
        className={`min-h-[44px] w-full bg-transparent px-3 text-ink outline-none placeholder:text-muted ${
          size === "lg" ? "py-2.5 text-base" : "py-1.5 text-base sm:text-sm"
        }`}
      />
      <button
        type="submit"
        className="inline-flex min-h-[44px] shrink-0 items-center rounded-lg bg-cta px-4 text-sm font-semibold text-white hover:bg-cta-dark transition-colors"
      >
        Buscar
      </button>
    </form>
  );
}
