"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchInput({ size = "lg" }: { size?: "lg" | "md" }) {
  const [q, setQ] = useState("");
  const router = useRouter();
  return (
    <form
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
        aria-label="Buscar"
        className={`w-full bg-transparent px-3 text-ink outline-none placeholder:text-slate-400 ${
          size === "lg" ? "py-2.5 text-base" : "py-1.5 text-sm"
        }`}
      />
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark"
      >
        Buscar
      </button>
    </form>
  );
}
