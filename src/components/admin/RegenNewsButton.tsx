"use client";

import { useEffect, useState } from "react";
import type { RegenStatus } from "@/app/api/admin/route";

function fmt(iso: string) {
  return new Date(iso).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" });
}

export function RegenNewsButton() {
  const [busy, setBusy] = useState(false);
  const [last, setLast] = useState<RegenStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/admin")
      .then((r) => r.json())
      .then((d: { lastRegen?: RegenStatus | null }) => {
        if (d.lastRegen) setLast(d.lastRegen);
      })
      .catch(() => undefined);
  }, []);

  async function run() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "regenNews" }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; lastRegen?: RegenStatus };
      if (!res.ok) throw new Error(data.error || "error desconocido");
      if (data.lastRegen) setLast(data.lastRegen);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Ejecuta el pipeline <code>generate:news</code> en el servidor para actualizar{" "}
        <code>src/data/news.ts</code>. Solo disponible en entornos con acceso a disco y claves de
        API configuradas. Tras completar, el sitio necesita un rebuild para servir el nuevo
        contenido.
      </p>

      <button
        type="button"
        onClick={() => void run()}
        disabled={busy}
        className="rounded-lg bg-blue px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {busy ? "Ejecutando pipeline…" : "Regenerar noticias"}
      </button>

      {busy && (
        <p className="text-sm text-muted animate-pulse">
          Llamando a los LLMs y escribiendo el fichero de noticias. Puede tardar 30–60 s…
        </p>
      )}

      {error && <p className="text-sm text-red-600">Error: {error}</p>}

      {last && !busy && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            last.status === "ok"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {last.status === "ok" ? (
            <>
              Completado en <strong>{last.duration}s</strong> · {fmt(last.finishedAt!)}
            </>
          ) : (
            <>
              <strong>Error</strong> · {fmt(last.finishedAt!)}
              <pre className="mt-1 max-h-32 overflow-auto whitespace-pre-wrap text-xs opacity-80">
                {last.error}
              </pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}
