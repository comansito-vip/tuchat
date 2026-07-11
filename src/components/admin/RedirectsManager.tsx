"use client";

import { useEffect, useState } from "react";

type Redirects = Record<string, string>;

async function api(action: string, payload: Record<string, string>) {
  const res = await fetch("/api/admin", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action, ...payload }),
  });
  if (!res.ok) {
    const { error } = (await res.json().catch(() => ({ error: res.statusText }))) as { error?: string };
    throw new Error(error || "error desconocido");
  }
}

export function RedirectsManager() {
  const [redirects, setRedirects] = useState<Redirects>({});
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin");
    if (res.ok) setRedirects(((await res.json()) as { redirects?: Redirects }).redirects ?? {});
  }
  useEffect(() => {
    // Carga inicial desde el API (sincronización con sistema externo).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await fn();
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const add = () =>
    run(async () => {
      const f = from.trim().toLowerCase();
      const t = to.trim().toLowerCase();
      if (!f || !t) throw new Error("Indica el slug de origen y el de destino");
      if (f === t) throw new Error("Origen y destino no pueden ser iguales");
      await api("setRedirect", { from: f, to: t });
      setFrom("");
      setTo("");
    });

  const remove = (f: string) => run(() => api("removeRedirect", { from: f }));

  const entries = Object.entries(redirects);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-2">
        <label className="text-sm">
          <span className="block text-xs font-medium text-muted">Slug antiguo (origen)</span>
          <input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="mexicanos"
            className="mt-1 w-44 rounded-lg border border-line bg-card px-3 py-1.5 text-base sm:text-sm"
          />
        </label>
        <span aria-hidden="true" className="pb-2 text-muted">→</span>
        <label className="text-sm">
          <span className="block text-xs font-medium text-muted">Slug destino (canónico)</span>
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="mexico"
            className="mt-1 w-44 rounded-lg border border-line bg-card px-3 py-1.5 text-base sm:text-sm"
          />
        </label>
        <button
          type="button"
          onClick={add}
          disabled={busy}
          className="rounded-lg bg-blue px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          Añadir 301
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {entries.length === 0 ? (
        <p className="text-sm text-muted">No hay redirecciones configuradas.</p>
      ) : (
        <ul className="divide-y divide-line rounded-lg border border-line">
          {entries.map(([f, t]) => (
            <li key={f} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
              <span>
                <code>/chat/{f}</code> → <code>/chat/{t}</code>
              </span>
              <button
                type="button"
                onClick={() => remove(f)}
                disabled={busy}
                className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
