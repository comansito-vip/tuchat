"use client";

import { useEffect, useState } from "react";

type State = { hidden: string[]; noindex: string[] };

async function api(action: string, payload: Record<string, string>) {
  const res = await fetch("/api/admin", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action, ...payload }),
  });
  if (!res.ok) {
    const { error } = (await res.json().catch(() => ({ error: res.statusText }))) as {
      error?: string;
    };
    throw new Error(error || "error desconocido");
  }
}

function SlugList({
  items,
  onRemove,
  busy,
}: {
  items: string[];
  onRemove: (slug: string) => void;
  busy: boolean;
}) {
  if (items.length === 0) return <p className="text-sm text-muted">Ninguna.</p>;
  return (
    <ul className="divide-y divide-line rounded-lg border border-line">
      {items.map((slug) => (
        <li key={slug} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
          <code>/chat/{slug}</code>
          <button
            type="button"
            onClick={() => onRemove(slug)}
            disabled={busy}
            className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
          >
            Quitar
          </button>
        </li>
      ))}
    </ul>
  );
}

function AddForm({
  label,
  placeholder,
  onAdd,
  busy,
}: {
  label: string;
  placeholder: string;
  onAdd: (slug: string) => Promise<void>;
  busy: boolean;
}) {
  const [slug, setSlug] = useState("");

  async function submit() {
    const s = slug.trim().toLowerCase();
    if (!s) return;
    await onAdd(s);
    setSlug("");
  }

  return (
    <div className="flex items-end gap-2">
      <label className="text-sm">
        <span className="block text-xs font-medium text-muted">{label}</span>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && void submit()}
          placeholder={placeholder}
          className="mt-1 w-44 rounded-lg border border-line bg-card px-3 py-1.5 text-base sm:text-sm"
        />
      </label>
      <button
        type="button"
        onClick={() => void submit()}
        disabled={busy || !slug.trim()}
        className="rounded-lg bg-blue px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
      >
        Añadir
      </button>
    </div>
  );
}

export function VisibilityManager() {
  const [state, setState] = useState<State>({ hidden: [], noindex: [] });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/admin");
    if (res.ok) {
      const data = (await res.json()) as Partial<State>;
      setState({ hidden: data.hidden ?? [], noindex: data.noindex ?? [] });
    }
  }

  useEffect(() => {
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

  return (
    <div className="space-y-8">
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Salas ocultas */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-ink">
          Ocultas de listados{" "}
          <span className="font-normal text-muted">({state.hidden.length})</span>
        </h3>
        <p className="text-xs text-muted">
          Estas salas no aparecen en el directorio ni en el sitemap, pero su URL sigue siendo
          accesible directamente.
        </p>
        <SlugList
          items={state.hidden}
          onRemove={(slug) => run(() => api("toggleHidden", { slug }))}
          busy={busy}
        />
        <AddForm
          label="Ocultar sala (slug)"
          placeholder="erotico"
          onAdd={(slug) => run(() => api("toggleHidden", { slug }))}
          busy={busy}
        />
      </div>

      {/* Salas noindex */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-ink">
          Noindex{" "}
          <span className="font-normal text-muted">({state.noindex.length})</span>
        </h3>
        <p className="text-xs text-muted">
          Estas salas siguen apareciendo en el directorio pero llevan{" "}
          <code>robots: noindex</code> para que los buscadores no las indexen.
        </p>
        <SlugList
          items={state.noindex}
          onRemove={(slug) => run(() => api("toggleNoindex", { slug }))}
          busy={busy}
        />
        <AddForm
          label="Slug a marcar noindex"
          placeholder="adultos"
          onAdd={(slug) => run(() => api("toggleNoindex", { slug }))}
          busy={busy}
        />
      </div>
    </div>
  );
}
