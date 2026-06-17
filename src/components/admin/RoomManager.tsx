"use client";

import { useEffect, useState } from "react";
import type { Place } from "@/data/types";
import type { AdminState } from "@/lib/admin-store";

// ── helpers ──────────────────────────────────────────────────────────────────

async function apiPost(body: Record<string, unknown>) {
  const res = await fetch("/api/admin", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(data.error || res.statusText);
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-muted">{label}</span>
      {hint && <span className="block text-[11px] text-muted/70">{hint}</span>}
      {children}
    </label>
  );
}

const inputCls =
  "mt-1 w-full rounded-lg border border-line bg-card px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue";

// ── Override editor ───────────────────────────────────────────────────────────

type Patch = Partial<Pick<Place, "intro" | "about" | "icon" | "tag" | "activity" | "users" | "votes" | "channels" | "related">>;

function emptyPatch(): Patch {
  return { intro: "", about: "", icon: "", tag: undefined, activity: undefined, users: undefined, votes: undefined, channels: [], related: [] };
}

function RoomOverrideEditor({ overrides }: { overrides: Record<string, Partial<Place>> }) {
  const [slug, setSlug] = useState("");
  const [patch, setPatch] = useState<Patch>(emptyPatch());
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  function load() {
    const s = slug.trim().toLowerCase();
    if (!s) return;
    const existing = overrides[s] ?? {};
    setPatch({
      intro: (existing.intro as string) ?? "",
      about: (existing.about as string) ?? "",
      icon: (existing.icon as string) ?? "",
      tag: existing.tag,
      activity: existing.activity,
      users: existing.users,
      votes: existing.votes,
      channels: existing.channels ?? [],
      related: existing.related ?? [],
    });
    setLoaded(true);
    setError(null);
    setOk(false);
  }

  async function save() {
    setBusy(true);
    setError(null);
    setOk(false);
    try {
      const clean: Partial<Place> = {};
      if (patch.intro?.trim()) clean.intro = patch.intro.trim();
      if (patch.about?.trim()) clean.about = patch.about.trim();
      if (patch.icon?.trim()) clean.icon = patch.icon.trim();
      if (patch.tag) clean.tag = patch.tag;
      if (patch.activity) clean.activity = patch.activity;
      if (patch.users !== undefined && patch.users !== null) clean.users = Number(patch.users);
      if (patch.votes !== undefined && patch.votes !== null) clean.votes = Number(patch.votes);
      if (patch.channels && patch.channels.length > 0) clean.channels = patch.channels;
      if (patch.related && patch.related.length > 0) clean.related = patch.related;
      await apiPost({ action: "saveRoom", slug: slug.trim().toLowerCase(), patch: clean });
      setOk(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted">
        Escribe el slug de una sala existente para sobreescribir sus campos. Los campos vacíos
        mantienen el valor original de los datos estáticos.
      </p>
      <div className="flex items-end gap-2">
        <Field label="Slug de la sala">
          <input
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setLoaded(false); }}
            onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="madrid"
            className="mt-1 w-44 rounded-lg border border-line bg-card px-3 py-1.5 text-sm"
          />
        </Field>
        <button
          type="button"
          onClick={load}
          className="rounded-lg border border-line bg-card px-3 py-1.5 text-sm hover:bg-surface"
        >
          Cargar
        </button>
      </div>

      {loaded && (
        <div className="space-y-3 rounded-lg border border-line p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Icono (emoji)">
              <input value={patch.icon ?? ""} onChange={(e) => setPatch((p) => ({ ...p, icon: e.target.value }))} placeholder="🏙️" className={inputCls} />
            </Field>
            <Field label="Tag">
              <select value={patch.tag ?? ""} onChange={(e) => setPatch((p) => ({ ...p, tag: (e.target.value || undefined) as Place["tag"] }))} className={inputCls}>
                <option value="">— sin cambiar —</option>
                <option value="Popular">Popular</option>
                <option value="Nueva">Nueva</option>
                <option value="Tendencia">Tendencia</option>
              </select>
            </Field>
            <Field label="Actividad">
              <select value={patch.activity ?? ""} onChange={(e) => setPatch((p) => ({ ...p, activity: (e.target.value || undefined) as Place["activity"] }))} className={inputCls}>
                <option value="">— sin cambiar —</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Usuarios">
                <input type="number" min={0} value={patch.users ?? ""} onChange={(e) => setPatch((p) => ({ ...p, users: e.target.value === "" ? undefined : Number(e.target.value) }))} className={inputCls} />
              </Field>
              <Field label="Votos">
                <input type="number" min={0} value={patch.votes ?? ""} onChange={(e) => setPatch((p) => ({ ...p, votes: e.target.value === "" ? undefined : Number(e.target.value) }))} className={inputCls} />
              </Field>
            </div>
          </div>
          <Field label="Intro" hint="Párrafo corto visible en la card.">
            <textarea rows={2} value={patch.intro ?? ""} onChange={(e) => setPatch((p) => ({ ...p, intro: e.target.value }))} className={inputCls} />
          </Field>
          <Field label="About" hint="Bloque SEO más largo (opcional).">
            <textarea rows={4} value={patch.about ?? ""} onChange={(e) => setPatch((p) => ({ ...p, about: e.target.value }))} className={inputCls} />
          </Field>
          <Field label="Canales IRC" hint="Separados por coma: madrid,espana,chatzona">
            <input
              value={(patch.channels ?? []).join(",")}
              onChange={(e) => setPatch((p) => ({ ...p, channels: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))}
              className={inputCls}
            />
          </Field>
          <Field label="Relacionadas" hint="Slugs separados por coma: barcelona,valencia">
            <input
              value={(patch.related ?? []).join(",")}
              onChange={(e) => setPatch((p) => ({ ...p, related: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))}
              className={inputCls}
            />
          </Field>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {ok && <p className="text-sm text-green-600">Guardado correctamente.</p>}

          <button
            type="button"
            onClick={() => void save()}
            disabled={busy}
            className="rounded-lg bg-blue px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy ? "Guardando…" : "Guardar override"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── New room creator ──────────────────────────────────────────────────────────

function defaultNewRoom(): Omit<Place, "votes"> & { votes: number } {
  return {
    slug: "",
    name: "",
    kind: "tematica",
    icon: "",
    users: 0,
    votes: 0,
    activity: "Baja",
    channels: [],
    related: [],
    intro: "",
  };
}

function NewRoomsManager({ newRooms, onRefresh }: { newRooms: Place[]; onRefresh: () => Promise<void> }) {
  const [form, setForm] = useState(defaultNewRoom);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function create() {
    setBusy(true);
    setError(null);
    setOk(false);
    try {
      if (!form.slug.trim() || !form.name.trim() || !form.intro.trim()) {
        throw new Error("Slug, nombre e intro son obligatorios");
      }
      const room: Place = {
        ...form,
        slug: form.slug.trim().toLowerCase(),
        name: form.name.trim(),
        intro: form.intro.trim(),
        about: form.about?.trim() || undefined,
        icon: form.icon.trim() || "💬",
        parentSlug: form.parentSlug?.trim() || undefined,
        parentName: form.parentName?.trim() || undefined,
      };
      await apiPost({ action: "createRoom", room });
      setForm(defaultNewRoom());
      setOk(true);
      await onRefresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(slug: string) {
    setBusy(true);
    try {
      await apiPost({ action: "deleteRoom", slug });
      await onRefresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Lista de salas creadas */}
      {newRooms.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Salas creadas ({newRooms.length})
          </h4>
          <ul className="divide-y divide-line rounded-lg border border-line">
            {newRooms.map((r) => (
              <li key={r.slug} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
                <span>
                  {r.icon} <strong>{r.name}</strong>{" "}
                  <code className="text-xs text-muted">/{r.slug}</code>
                </span>
                <button
                  type="button"
                  onClick={() => void remove(r.slug)}
                  disabled={busy}
                  className="text-xs font-semibold text-red-600 hover:underline disabled:opacity-50"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Formulario de creación */}
      <div className="space-y-3 rounded-lg border border-line p-4">
        <h4 className="text-sm font-semibold text-ink">Nueva sala</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Slug *" hint="único, sin espacios: mi-sala">
            <input value={form.slug} onChange={(e) => set("slug", e.target.value.toLowerCase())} placeholder="mi-sala" className={inputCls} />
          </Field>
          <Field label="Nombre *">
            <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Mi Sala" className={inputCls} />
          </Field>
          <Field label="Tipo">
            <select value={form.kind} onChange={(e) => set("kind", e.target.value as Place["kind"])} className={inputCls}>
              <option value="tematica">Temática</option>
              <option value="pais">País</option>
              <option value="ciudad">Ciudad</option>
            </select>
          </Field>
          <Field label="Icono (emoji)">
            <input value={form.icon} onChange={(e) => set("icon", e.target.value)} placeholder="💬" className={inputCls} />
          </Field>
          <Field label="Tag">
            <select value={form.tag ?? ""} onChange={(e) => set("tag", (e.target.value || undefined) as Place["tag"])} className={inputCls}>
              <option value="">Ninguno</option>
              <option value="Popular">Popular</option>
              <option value="Nueva">Nueva</option>
              <option value="Tendencia">Tendencia</option>
            </select>
          </Field>
          <Field label="Actividad">
            <select value={form.activity} onChange={(e) => set("activity", e.target.value as Place["activity"])} className={inputCls}>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </Field>
          <Field label="Usuarios estimados">
            <input type="number" min={0} value={form.users} onChange={(e) => set("users", Number(e.target.value))} className={inputCls} />
          </Field>
          <Field label="Votos iniciales">
            <input type="number" min={0} value={form.votes} onChange={(e) => set("votes", Number(e.target.value))} className={inputCls} />
          </Field>
          <Field label="Slug padre" hint="Solo si es ciudad o sub-temática">
            <input value={form.parentSlug ?? ""} onChange={(e) => set("parentSlug", e.target.value || undefined)} placeholder="espana" className={inputCls} />
          </Field>
          <Field label="Nombre del padre">
            <input value={form.parentName ?? ""} onChange={(e) => set("parentName", e.target.value || undefined)} placeholder="España" className={inputCls} />
          </Field>
        </div>
        <Field label="Intro * (párrafo corto)">
          <textarea rows={2} value={form.intro} onChange={(e) => set("intro", e.target.value)} className={inputCls} />
        </Field>
        <Field label="About (bloque SEO opcional)">
          <textarea rows={3} value={form.about ?? ""} onChange={(e) => set("about", e.target.value || undefined)} className={inputCls} />
        </Field>
        <Field label="Canales IRC" hint="Separados por coma">
          <input
            value={form.channels.join(",")}
            onChange={(e) => set("channels", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            className={inputCls}
          />
        </Field>
        <Field label="Relacionadas (slugs)">
          <input
            value={form.related.join(",")}
            onChange={(e) => set("related", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            className={inputCls}
          />
        </Field>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {ok && <p className="text-sm text-green-600">Sala creada correctamente.</p>}

        <button
          type="button"
          onClick={() => void create()}
          disabled={busy}
          className="rounded-lg bg-blue px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Creando…" : "Crear sala"}
        </button>
      </div>
    </div>
  );
}

// ── Root component ────────────────────────────────────────────────────────────

export function RoomManager() {
  const [state, setState] = useState<Pick<AdminState, "overrides" | "newRooms">>({
    overrides: {},
    newRooms: [],
  });

  async function load() {
    const res = await fetch("/api/admin");
    if (res.ok) {
      const data = (await res.json()) as Partial<AdminState>;
      setState({ overrides: data.overrides ?? {}, newRooms: data.newRooms ?? [] });
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, []);

  return (
    <div className="space-y-10">
      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Editar sala existente</h3>
        <RoomOverrideEditor overrides={state.overrides} />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink">Crear sala nueva</h3>
        <NewRoomsManager newRooms={state.newRooms} onRefresh={load} />
      </div>
    </div>
  );
}
