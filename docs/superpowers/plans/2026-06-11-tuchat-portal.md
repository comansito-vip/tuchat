# TuChat.org Portal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Spanish-language SEO chat portal (TuChat.org) with a functional Home, a model chat-room page (`/chat/madrid`), a working `/webchat`, and scaffolded routes — all on reusable components and mock data ready for real data.

**Architecture:** Next.js 15 App Router + TypeScript. Tailwind CSS with design tokens. Mock data behind getter functions (`src/data/*`) so real data can replace them without touching components. SEO via per-route `generateMetadata` + Schema.org JSON-LD. Mobile-first responsive with a fixed bottom nav.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, `next/font` (Inter), `next-sitemap`, Vitest + React Testing Library.

**Testing approach:** TDD for logic (`src/lib/*`, data getters) — real failing test first. Visual components verified by a render smoke test (mounts without crashing, key text present) plus `npm run build` passing. Do not over-test markup.

**Reference spec:** `docs/superpowers/specs/2026-06-11-tuchat-portal-design.md`

---

## Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `.gitignore`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

- [ ] **Step 1: Create the app non-interactively**

Run from `/home/javier/tuchat`:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack --use-npm
```
If it refuses because the directory is not empty (the PDF/spec exist), answer yes to proceed, or move the PDF aside first:
```bash
mkdir -p _brief && mv "TuChat Portal.pdf" "TuChat Portal.pdf:Zone.Identifier" _brief/ 2>/dev/null || true
```

- [ ] **Step 2: Verify dev server boots**

Run:
```bash
npm run dev
```
Expected: "Ready" on http://localhost:3000. Stop it with Ctrl-C.

- [ ] **Step 3: Initialize git and commit scaffold**

```bash
git init && git add -A && git commit -m "chore: scaffold Next.js + Tailwind app"
```

---

## Task 2: Design tokens + Inter font + base layout shell

**Files:**
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.ts`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Define color tokens in `src/app/globals.css`**

Replace the file body (keep `@tailwind` directives at top) with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #F8FAFC;
  --card: #FFFFFF;
  --blue: #2563EB;
  --blue-dark: #1E3A8A;
  --text: #475569;
  --ink: #0F172A;
  --border: #E2E8F0;
  --green: #22C55E;
}

html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--text); -webkit-font-smoothing: antialiased; }
```

- [ ] **Step 2: Map tokens in `tailwind.config.ts`**

In `theme.extend.colors` add:
```ts
colors: {
  bg: "var(--bg)",
  card: "var(--card)",
  blue: { DEFAULT: "var(--blue)", dark: "var(--blue-dark)" },
  ink: "var(--ink)",
  muted: "var(--text)",
  line: "var(--border)",
  active: "var(--green)",
},
```
Ensure `content` includes `"./src/**/*.{ts,tsx}"`.

- [ ] **Step 3: Load Inter in `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://tuchat.org"),
  title: { default: "TuChat — Chat gratis en español", template: "%s · TuChat" },
  description: "Salas de chat por países, ciudades y temas. Conoce gente y conversa en tiempo real.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```
Add to `tailwind.config.ts` `theme.extend.fontFamily`: `sans: ["var(--font-inter)", "system-ui", "sans-serif"]`.

- [ ] **Step 4: Verify build and commit**

```bash
npm run build && git add -A && git commit -m "feat: design tokens, Inter font, layout shell"
```
Expected: build succeeds.

---

## Task 3: Set up Vitest

**Files:**
- Create: `vitest.config.ts`, `src/test/setup.ts`
- Modify: `package.json`

- [ ] **Step 1: Install deps**

```bash
npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", setupFiles: ["./src/test/setup.ts"], globals: true },
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
```

- [ ] **Step 3: Create `src/test/setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Add scripts to `package.json`**

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Verify and commit**

```bash
npx vitest run --passWithNoTests && git add -A && git commit -m "chore: add vitest"
```

---

## Task 4: Domain types + mock data getters

**Files:**
- Create: `src/data/types.ts`, `src/data/countries.ts`, `src/data/cities.ts`, `src/data/topics.ts`, `src/data/rooms.ts`, `src/data/news.ts`, `src/data/index.ts`
- Test: `src/data/data.test.ts`

- [ ] **Step 1: Write `src/data/types.ts`**

```ts
export type RoomKind = "pais" | "ciudad" | "tematica";
export type RoomTag = "Popular" | "Nueva" | "Tendencia";

export interface Place {
  slug: string;          // "madrid"
  name: string;          // "Madrid"
  kind: RoomKind;
  icon: string;          // emoji flag/icon
  users: number;         // approx connected
  votes: number;
  tag?: RoomTag;
  activity: "Alta" | "Media" | "Baja";
  parentName?: string;   // "España" (for cities)
  parentSlug?: string;   // "espana"
  channels: string[];    // ["madrid","espana","amistad","chatzona"]
  related: string[];     // related slugs
  intro: string;         // human, location-specific paragraph
  about?: string;        // longer SEO block (cities)
}

export interface NewsItem {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;          // ISO
  featured?: boolean;
}

export interface TrendItem { label: string; href: string; }
```

- [ ] **Step 2: Write the failing test `src/data/data.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { getPlace, getRooms, getCities, getTopics, getNews } from "@/data";

describe("data getters", () => {
  it("returns the Madrid model room with channels and related", () => {
    const madrid = getPlace("madrid");
    expect(madrid?.name).toBe("Madrid");
    expect(madrid?.kind).toBe("ciudad");
    expect(madrid?.channels).toEqual(["madrid", "espana", "amistad", "chatzona"]);
    expect(madrid?.related).toContain("barcelona");
    expect(madrid?.intro.length).toBeGreaterThan(40);
  });
  it("lists active rooms, cities, topics and news", () => {
    expect(getRooms().length).toBeGreaterThanOrEqual(6);
    expect(getCities().some((c) => c.slug === "barcelona")).toBe(true);
    expect(getTopics().some((t) => t.slug === "amor")).toBe(true);
    expect(getNews().some((n) => n.featured)).toBe(true);
  });
});
```

- [ ] **Step 3: Run it, expect failure**

Run: `npx vitest run src/data/data.test.ts`
Expected: FAIL (module `@/data` not found).

- [ ] **Step 4: Write the mock data**

`src/data/cities.ts` — export `CITIES: Place[]`. Madrid is the model and must be detailed:
```ts
import type { Place } from "./types";

export const CITIES: Place[] = [
  {
    slug: "madrid", name: "Madrid", kind: "ciudad", icon: "🏙️",
    users: 842, votes: 1320, tag: "Popular", activity: "Alta",
    parentName: "España", parentSlug: "espana",
    channels: ["madrid", "espana", "amistad", "chatzona"],
    related: ["barcelona", "valencia", "sevilla", "bilbao", "malaga", "espana", "amistad", "amor"],
    intro: "Entra en la sala de chat de Madrid para conocer gente, hablar en directo y participar en conversaciones con usuarios de la ciudad y de toda España.",
    about: "El chat de Madrid reúne a gente de los barrios de toda la ciudad: de Malasaña a Vallecas, de Chamberí a Carabanchel. Se habla de quedadas, de planes de fin de semana, del Metro a las tantas y de dónde tomar algo sin gastarse el sueldo. Una sala con ritmo de capital: activa casi a cualquier hora.",
  },
  // Barcelona, Valencia, Sevilla, Bilbao, Málaga, A Coruña, Vigo, Zaragoza, Alicante,
  // Buenos Aires, Ciudad de México, Bogotá, Lima, Santiago de Chile, Montevideo.
  // Each: realistic users/votes, a SHORT human intro with a local detail (no copy-paste
  // template). Cities outside Spain set parentName/parentSlug to their country.
];
```
Provide all 16 cities. Each `intro` must mention something concrete and local (a neighborhood, a habit, a landmark) — never an identical sentence.

`src/data/countries.ts` — export `COUNTRIES: Place[]` (España, México, Argentina, Colombia as full rooms; plus a `CONTINENTS` grouping for the CountryGrid):
```ts
import type { Place } from "./types";

export const COUNTRIES: Place[] = [
  { slug: "espana", name: "España", kind: "pais", icon: "🇪🇸", users: 842, votes: 2100, tag: "Popular", activity: "Alta",
    channels: ["espana", "internacional", "amistad", "chatzona"],
    related: ["mexico", "argentina", "madrid", "barcelona", "amistad", "amor"],
    intro: "La sala de España junta a usuarios de todas las comunidades: aquí se cruzan acentos de Galicia, Andalucía, Cataluña y Canarias en la misma conversación." },
  { slug: "mexico", name: "México", kind: "pais", icon: "🇲🇽", users: 631, votes: 1740, tag: "Tendencia", activity: "Alta",
    channels: ["mexico", "internacional", "amistad", "chatzona"],
    related: ["espana", "argentina", "colombia", "amistad", "amor"],
    intro: "El chat de México va de norte a sur: del bajío al DF, banda conectada a todas horas para platicar de todo." },
  { slug: "argentina", name: "Argentina", kind: "pais", icon: "🇦🇷", users: 540, votes: 1290, activity: "Alta",
    channels: ["argentina", "internacional", "amistad", "chatzona"],
    related: ["espana", "mexico", "amistad", "amor"],
    intro: "En la sala de Argentina se charla de fútbol, mates y de la vida, con la sobremesa larga de siempre." },
  { slug: "colombia", name: "Colombia", kind: "pais", icon: "🇨🇴", users: 388, votes: 910, tag: "Nueva", activity: "Media",
    channels: ["colombia", "internacional", "amistad", "chatzona"],
    related: ["mexico", "espana", "amistad", "amor"],
    intro: "El chat de Colombia reúne parceros de Bogotá, Medellín, Cali y la costa para hablar sin pena." },
];

export const CONTINENTS: { title: string; places: { name: string; slug: string }[] }[] = [
  { title: "España", places: [{ name: "España", slug: "espana" }] },
  { title: "Latinoamérica", places: [
    { name: "México", slug: "mexico" }, { name: "Argentina", slug: "argentina" },
    { name: "Colombia", slug: "colombia" }, { name: "Chile", slug: "chile" },
    { name: "Perú", slug: "peru" }, { name: "Uruguay", slug: "uruguay" } ] },
  { title: "Centroamérica", places: [
    { name: "Guatemala", slug: "guatemala" }, { name: "Costa Rica", slug: "costa-rica" },
    { name: "Panamá", slug: "panama" } ] },
  { title: "Norteamérica", places: [
    { name: "Estados Unidos", slug: "estados-unidos" }, { name: "Canadá", slug: "canada" } ] },
  { title: "Europa", places: [
    { name: "Francia", slug: "francia" }, { name: "Italia", slug: "italia" },
    { name: "Portugal", slug: "portugal" }, { name: "Alemania", slug: "alemania" } ] },
  { title: "África", places: [
    { name: "Marruecos", slug: "marruecos" }, { name: "Guinea Ecuatorial", slug: "guinea-ecuatorial" } ] },
  { title: "Mundo", places: [{ name: "Internacional", slug: "internacional" }] },
];
```

`src/data/topics.ts` — export `TOPICS: Place[]` with the 15 themes (Amor, Amistad, LGTBI, Deportes, Música, Cine, Videojuegos, Filosofía, Tecnología, Bolsa, Viajes, Cocina, Salud, Tarot, Horóscopo). Each `kind: "tematica"`, channels like `["amor","amistad","chatzona"]`, an icon emoji, and a short human intro. Example:
```ts
{ slug: "amor", name: "Amor", kind: "tematica", icon: "❤️", users: 410, votes: 980, tag: "Nueva", activity: "Alta",
  channels: ["amor", "amistad", "chatzona"], related: ["amistad", "lgtbi", "madrid", "espana"],
  intro: "La sala de Amor es para quien busca conocer a alguien con calma, sin postureo: se habla, se conecta y se ve qué surge." },
```

`src/data/news.ts` — export `NEWS: NewsItem[]`: 1 featured + at least 4 small, across categories (Actualidad, Deportes, Tecnología, IA, Cultura, Viajes, Salud, Economía, Entretenimiento). Real-sounding Spanish headlines and excerpts, dates around 2026-06.

`src/data/index.ts` — getters:
```ts
import { CITIES } from "./cities";
import { COUNTRIES } from "./countries";
import { TOPICS } from "./topics";
import { NEWS } from "./news";
import type { Place } from "./types";

const ALL: Place[] = [...COUNTRIES, ...CITIES, ...TOPICS];

export function getPlace(slug: string): Place | undefined {
  return ALL.find((p) => p.slug === slug);
}
export function getCities() { return CITIES; }
export function getCountries() { return COUNTRIES; }
export function getTopics() { return TOPICS; }
export function getNews() { return NEWS; }
export function getRooms(): Place[] {
  // "most active" feed for the home — mix of countries, cities, topics by users
  return [...ALL].sort((a, b) => b.users - a.users).slice(0, 12);
}
export function getRanking(): Place[] {
  return [...ALL].sort((a, b) => b.votes - a.votes).slice(0, 10);
}
export function getRelated(slugs: string[]): Place[] {
  return slugs.map(getPlace).filter((p): p is Place => Boolean(p));
}
export * from "./types";
export { CONTINENTS } from "./countries";
```

- [ ] **Step 5: Run test, expect pass**

Run: `npx vitest run src/data/data.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: domain types and mock data getters"
```

---

## Task 5: `lib/nick.ts` — guest nick generator

**Files:**
- Create: `src/lib/nick.ts`
- Test: `src/lib/nick.test.ts`

- [ ] **Step 1: Write failing test `src/lib/nick.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { generateNick } from "@/lib/nick";

describe("generateNick", () => {
  it("produces Invitado-#### with 4 digits", () => {
    const nick = generateNick();
    expect(nick).toMatch(/^Invitado-\d{4}$/);
  });
  it("varies between calls", () => {
    const set = new Set(Array.from({ length: 20 }, () => generateNick()));
    expect(set.size).toBeGreaterThan(1);
  });
});
```

- [ ] **Step 2: Run, expect fail**

Run: `npx vitest run src/lib/nick.test.ts` → FAIL (module missing).

- [ ] **Step 3: Implement `src/lib/nick.ts`**

```ts
export function generateNick(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `Invitado-${n}`;
}
```

- [ ] **Step 4: Run, expect pass; commit**

```bash
npx vitest run src/lib/nick.test.ts && git add -A && git commit -m "feat: guest nick generator"
```

---

## Task 6: `lib/channels.ts` — channel resolution

**Files:**
- Create: `src/lib/channels.ts`
- Test: `src/lib/channels.test.ts`

- [ ] **Step 1: Write failing test `src/lib/channels.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { resolveChannels, channelString } from "@/lib/channels";

describe("resolveChannels", () => {
  it("uses the place's defined channels for Madrid", () => {
    expect(resolveChannels("madrid")).toEqual(["madrid", "espana", "amistad", "chatzona"]);
  });
  it("uses México's channels", () => {
    expect(resolveChannels("mexico")).toEqual(["mexico", "internacional", "amistad", "chatzona"]);
  });
  it("falls back for an unknown slug to itself + amistad + chatzona", () => {
    expect(resolveChannels("xyz")).toEqual(["xyz", "amistad", "chatzona"]);
  });
  it("formats as #-prefixed comma list", () => {
    expect(channelString(["madrid", "espana"])).toBe("#madrid,#espana");
  });
});
```

- [ ] **Step 2: Run, expect fail**

Run: `npx vitest run src/lib/channels.test.ts` → FAIL.

- [ ] **Step 3: Implement `src/lib/channels.ts`**

```ts
import { getPlace } from "@/data";

export function resolveChannels(slug: string): string[] {
  const place = getPlace(slug);
  if (place) return place.channels;
  return [slug, "amistad", "chatzona"];
}

export function channelString(channels: string[]): string {
  return channels.map((c) => `#${c}`).join(",");
}
```

- [ ] **Step 4: Run, expect pass; commit**

```bash
npx vitest run src/lib/channels.test.ts && git add -A && git commit -m "feat: channel resolution"
```

---

## Task 7: `lib/seo.ts` — metadata + JSON-LD helpers

**Files:**
- Create: `src/lib/seo.ts`
- Test: `src/lib/seo.test.ts`

- [ ] **Step 1: Write failing test `src/lib/seo.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { breadcrumbJsonLd, faqJsonLd, websiteJsonLd } from "@/lib/seo";

describe("seo json-ld", () => {
  it("builds a BreadcrumbList with positions", () => {
    const ld = breadcrumbJsonLd([
      { name: "Inicio", url: "/" },
      { name: "España", url: "/pais/espana" },
      { name: "Madrid", url: "/chat/madrid" },
    ]);
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect(ld.itemListElement).toHaveLength(3);
    expect(ld.itemListElement[2].position).toBe(3);
  });
  it("builds a FAQPage", () => {
    const ld = faqJsonLd([{ q: "¿Es gratis?", a: "Sí." }]);
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity[0].acceptedAnswer.text).toBe("Sí.");
  });
  it("builds a WebSite with SearchAction", () => {
    expect(websiteJsonLd()["@type"]).toBe("WebSite");
  });
});
```

- [ ] **Step 2: Run, expect fail**

Run: `npx vitest run src/lib/seo.test.ts` → FAIL.

- [ ] **Step 3: Implement `src/lib/seo.ts`**

```ts
const SITE = "https://tuchat.org";

export interface Crumb { name: string; url: string; }

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem", position: i + 1, name: c.name, item: `${SITE}${c.url}`,
    })),
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question", name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TuChat",
    url: SITE,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE}/chat?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function collectionJsonLd(name: string, url: string) {
  return { "@context": "https://schema.org", "@type": "CollectionPage", name, url: `${SITE}${url}` };
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
```
Rename the file to `src/lib/seo.tsx` (it returns JSX). Update test import stays `@/lib/seo`.

- [ ] **Step 4: Run, expect pass; commit**

```bash
npx vitest run src/lib/seo.test.ts && git add -A && git commit -m "feat: SEO metadata + JSON-LD helpers"
```

---

## Task 8: UI primitives

**Files:**
- Create: `src/components/ui/Button.tsx`, `Badge.tsx`, `Card.tsx`, `SectionTitle.tsx`, `SearchInput.tsx`
- Test: `src/components/ui/ui.test.tsx`

- [ ] **Step 1: Write smoke test `src/components/ui/ui.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";
import { Badge } from "./Badge";

describe("ui primitives", () => {
  it("renders a primary button with its label", () => {
    render(<Button>Entrar al chat</Button>);
    expect(screen.getByText("Entrar al chat")).toBeInTheDocument();
  });
  it("renders a tag badge", () => {
    render(<Badge tag="Popular" />);
    expect(screen.getByText("Popular")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run, expect fail**

Run: `npx vitest run src/components/ui/ui.test.tsx` → FAIL.

- [ ] **Step 3: Implement primitives**

`Button.tsx` — variants `primary` (bg-blue text-white), `secondary` (white, border-line, text-blue-dark), `ghost`. Supports `as` link via optional `href` rendering `next/link`.
```tsx
import Link from "next/link";
import { clsx } from "clsx"; // run: npm i clsx

type Variant = "primary" | "secondary" | "ghost";
const styles: Record<Variant, string> = {
  primary: "bg-blue text-white hover:bg-blue-dark",
  secondary: "bg-card text-blue-dark border border-line hover:border-blue",
  ghost: "text-blue-dark hover:bg-bg",
};

export function Button({
  children, variant = "primary", href, className, ...rest
}: { children: React.ReactNode; variant?: Variant; href?: string; className?: string } &
   React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const cls = clsx("inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors", styles[variant], className);
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button className={cls} {...rest}>{children}</button>;
}
```

`Badge.tsx` — colored pill by tag: Popular → blue, Nueva → green, Tendencia → amber.
```tsx
import { clsx } from "clsx";
import type { RoomTag } from "@/data";

const map: Record<RoomTag, string> = {
  Popular: "bg-blue/10 text-blue",
  Nueva: "bg-active/10 text-active",
  Tendencia: "bg-amber-100 text-amber-700",
};
export function Badge({ tag }: { tag: RoomTag }) {
  return <span className={clsx("rounded-full px-2 py-0.5 text-[11px] font-semibold", map[tag])}>{tag}</span>;
}
```

`Card.tsx` — white surface with soft border:
```tsx
import { clsx } from "clsx";
export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx("rounded-xl border border-line bg-card", className)}>{children}</div>;
}
```

`SectionTitle.tsx` — heading + optional "see all" link:
```tsx
import Link from "next/link";
export function SectionTitle({ children, href, cta }: { children: React.ReactNode; href?: string; cta?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <h2 className="text-xl font-bold text-ink">{children}</h2>
      {href && <Link href={href} className="text-sm font-semibold text-blue hover:underline">{cta ?? "Ver todo"}</Link>}
    </div>
  );
}
```

`SearchInput.tsx` — client component, large input + submit, navigates to `/chat?q=`:
```tsx
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchInput({ size = "lg" }: { size?: "lg" | "md" }) {
  const [q, setQ] = useState("");
  const router = useRouter();
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); router.push(`/chat?q=${encodeURIComponent(q)}`); }}
      className="flex w-full items-center gap-2 rounded-xl border border-line bg-card p-2 shadow-sm"
    >
      <input
        value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar ciudad, país o temática"
        aria-label="Buscar"
        className={`w-full bg-transparent px-3 text-ink outline-none placeholder:text-slate-400 ${size === "lg" ? "py-2.5 text-base" : "py-1.5 text-sm"}`}
      />
      <button type="submit" className="shrink-0 rounded-lg bg-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-dark">Buscar</button>
    </form>
  );
}
```

- [ ] **Step 4: Run, expect pass; commit**

```bash
npm i clsx && npx vitest run src/components/ui/ui.test.tsx && git add -A && git commit -m "feat: ui primitives"
```

---

## Task 9: Layout components (Header, MobileBottomNav, Footer, Breadcrumbs)

**Files:**
- Create: `src/components/layout/Header.tsx`, `MobileBottomNav.tsx`, `Footer.tsx`, `Breadcrumbs.tsx`
- Modify: `src/app/layout.tsx`
- Test: `src/components/layout/layout.test.tsx`

- [ ] **Step 1: Write smoke test `src/components/layout/layout.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";
import { Breadcrumbs } from "./Breadcrumbs";

describe("layout", () => {
  it("header shows brand and CTA", () => {
    render(<Header />);
    expect(screen.getByText("Chat", { selector: "a" })).toBeInTheDocument();
    expect(screen.getByText("Entrar al chat")).toBeInTheDocument();
  });
  it("breadcrumbs render each crumb", () => {
    render(<Breadcrumbs crumbs={[{ name: "Inicio", url: "/" }, { name: "Madrid", url: "/chat/madrid" }]} />);
    expect(screen.getByText("Madrid")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run, expect fail**

Run: `npx vitest run src/components/layout/layout.test.tsx` → FAIL.

- [ ] **Step 3: Implement components**

`Header.tsx` — sticky, light, white bg, bottom border. Logo "Tu**Chat**" (blue-dark + blue). Desktop nav links: Chat `/chat`, Países `/pais`, Ciudades `/ciudad`, Temáticas `/chat`, Noticias `/noticias`, Tiempo `/tiempo`, Loterías `/loterias`, Horóscopo `/horoscopo`, Ranking `/ranking`. Right: `Button href="/webchat?canal=espana"` "Entrar al chat". On mobile (`md:hidden`) collapse nav to a menu icon; the CTA shows as compact "Entrar". Use `sticky top-0 z-40`.
```tsx
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const NAV = [
  ["Chat", "/chat"], ["Países", "/pais/espana"], ["Ciudades", "/chat/madrid"],
  ["Temáticas", "/chat/amor"], ["Noticias", "/noticias"], ["Tiempo", "/tiempo/madrid"],
  ["Loterías", "/loterias/espana"], ["Horóscopo", "/horoscopo/aries"], ["Ranking", "/ranking"],
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="text-lg font-extrabold text-blue-dark">Tu<span className="text-blue">Chat</span></Link>
        <nav className="hidden items-center gap-4 text-sm text-muted lg:flex">
          {NAV.map(([label, href]) => (
            <Link key={label} href={href} className="hover:text-ink">{label}</Link>
          ))}
        </nav>
        <div className="ml-auto"><Button href="/webchat?canal=espana">Entrar al chat</Button></div>
      </div>
    </header>
  );
}
```

`MobileBottomNav.tsx` — fixed bottom, `lg:hidden`, 5 items (Inicio `/`, Chat `/chat`, Países `/pais/espana`, Noticias `/noticias`, Más `/ranking`) each with an inline SVG/emoji icon and label. `fixed bottom-0 inset-x-0 z-40 border-t border-line bg-card`.

`Footer.tsx` — columns: TuChat (sobre, contacto), Salas por país (España, México, Argentina, Colombia), Salas por ciudad (Madrid, Barcelona, Valencia, Buenos Aires), Temáticas (Amor, Amistad, Deportes, Música), Noticias (categorías), Legal (Aviso legal, Privacidad, Cookies), Contacto. Links use the route patterns. Bottom line: "© 2026 TuChat".

`Breadcrumbs.tsx` — renders crumbs with `/` separators and a `JsonLd` BreadcrumbList from `lib/seo`:
```tsx
import Link from "next/link";
import { breadcrumbJsonLd, JsonLd, type Crumb } from "@/lib/seo";

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Migas de pan" className="text-sm text-muted">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      {crumbs.map((c, i) => (
        <span key={c.url}>
          {i > 0 && <span className="mx-1.5 text-slate-300">›</span>}
          {i < crumbs.length - 1
            ? <Link href={c.url} className="hover:text-blue">{c.name}</Link>
            : <span className="text-ink">{c.name}</span>}
        </span>
      ))}
    </nav>
  );
}
```

- [ ] **Step 4: Wire into `src/app/layout.tsx`**

Wrap children with Header (top) and MobileBottomNav + Footer (bottom). Add `pb-16 lg:pb-0` to body so bottom nav doesn't cover content. Add `<JsonLd data={websiteJsonLd()} />` in `<body>`.

- [ ] **Step 5: Run test + build; commit**

```bash
npx vitest run src/components/layout/layout.test.tsx && npm run build && git add -A && git commit -m "feat: header, bottom nav, footer, breadcrumbs"
```

---

## Task 10: RoomCard + HeroSearch

**Files:**
- Create: `src/components/home/RoomCard.tsx`, `src/components/home/HeroSearch.tsx`
- Test: `src/components/home/roomcard.test.tsx`

- [ ] **Step 1: Write smoke test `src/components/home/roomcard.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RoomCard } from "./RoomCard";
import { getPlace } from "@/data";

it("RoomCard shows name, users and an entrar link to webchat", () => {
  render(<RoomCard place={getPlace("madrid")!} />);
  expect(screen.getByText("Madrid")).toBeInTheDocument();
  expect(screen.getByText(/842/)).toBeInTheDocument();
  const link = screen.getByRole("link", { name: /entrar/i });
  expect(link).toHaveAttribute("href", expect.stringContaining("/webchat?canal=madrid"));
});
```

- [ ] **Step 2: Run, expect fail**

Run: `npx vitest run src/components/home/roomcard.test.tsx` → FAIL.

- [ ] **Step 3: Implement `RoomCard.tsx`**

```tsx
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Place } from "@/data";

export function RoomCard({ place }: { place: Place }) {
  return (
    <Card className="flex flex-col p-3.5">
      <div className="flex items-center gap-2">
        <span className="text-lg" aria-hidden>{place.icon}</span>
        <Link href={`/chat/${place.slug}`} className="font-semibold text-ink hover:text-blue">{place.name}</Link>
        {place.tag && <span className="ml-auto"><Badge tag={place.tag} /></span>}
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
        <span className="inline-block h-2 w-2 rounded-full bg-active" aria-hidden />
        {place.users.toLocaleString("es")} hablando ahora · {place.votes.toLocaleString("es")} votos
      </p>
      <Link
        href={`/webchat?canal=${place.slug}`}
        className="mt-3 rounded-lg bg-blue py-2 text-center text-sm font-semibold text-white hover:bg-blue-dark"
      >Entrar</Link>
    </Card>
  );
}
```

`HeroSearch.tsx` — the approved Direction A hero. Two columns on `lg`, one on mobile. Left: `h1` "Chat gratis en español", subtitle (spec text), `<SearchInput size="lg" />`, two buttons (`Entrar al chat` → `/webchat?canal=espana`, `Ver salas populares` → `#salas`), and a stats row (4 stats from getters: rooms count, cities count, sum of users, "Ranking diario"). Right (`hidden lg:flex` column): 3 `RoomCard`s for top places (`getRooms().slice(0,3)`). Wrap hero in `<section>` with generous padding and whitespace.
```tsx
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/Button";
import { RoomCard } from "./RoomCard";
import { getRooms, getCities, getCountries } from "@/data";

export function HeroSearch() {
  const rooms = getRooms();
  const users = rooms.reduce((s, r) => s + r.users, 0);
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.1fr_.9fr] lg:py-16">
      <div>
        <h1 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl">Chat gratis en español</h1>
        <p className="mt-3 max-w-xl text-muted">Entra en salas de chat por países, ciudades y temas. Conoce gente nueva, conversa en tiempo real y descubre comunidades activas de habla hispana.</p>
        <div className="mt-5"><SearchInput size="lg" /></div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button href="/webchat?canal=espana">Entrar al chat</Button>
          <Button href="#salas" variant="secondary">Ver salas populares</Button>
        </div>
        <dl className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            [getCountries().length + "+", "Salas por países"],
            [getCities().length + "+", "Ciudades disponibles"],
            [users.toLocaleString("es"), "Usuarios conectados"],
            ["Top 10", "Ranking diario"],
          ].map(([n, l]) => (
            <div key={l}><dt className="text-xl font-bold text-ink">{n}</dt><dd className="text-xs text-muted">{l}</dd></div>
          ))}
        </dl>
      </div>
      <div className="hidden flex-col gap-3 lg:flex">
        {rooms.slice(0, 3).map((p) => <RoomCard key={p.slug} place={p} />)}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test + build; commit**

```bash
npx vitest run src/components/home/roomcard.test.tsx && git add -A && git commit -m "feat: RoomCard and HeroSearch"
```

---

## Task 11: Remaining home blocks (CountryGrid, CityList, CategoryCard, TrendingBlock, NewsGrid, RankingTable)

**Files:**
- Create: `src/components/home/CountryGrid.tsx`, `CityList.tsx`, `CategoryCard.tsx`, `TrendingBlock.tsx`, `NewsGrid.tsx`, `RankingTable.tsx`
- Test: `src/components/home/blocks.test.tsx`

- [ ] **Step 1: Write smoke test `src/components/home/blocks.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RankingTable } from "./RankingTable";
import { CityList } from "./CityList";

it("RankingTable lists positions and an entrar link", () => {
  render(<RankingTable />);
  expect(screen.getAllByRole("row").length).toBeGreaterThan(1);
});
it("CityList links each city to /chat/{slug}", () => {
  render(<CityList />);
  const madrid = screen.getByRole("link", { name: "Madrid" });
  expect(madrid).toHaveAttribute("href", "/chat/madrid");
});
```

- [ ] **Step 2: Run, expect fail**

Run: `npx vitest run src/components/home/blocks.test.tsx` → FAIL.

- [ ] **Step 3: Implement blocks**

- `CountryGrid.tsx` — maps `CONTINENTS`; each continent is a `Card` with a title and a list of internal links to `/pais/{slug}`. Responsive grid `sm:grid-cols-2 lg:grid-cols-3`.
- `CityList.tsx` — `getCities()` rendered as a multi-column list (`columns-2 sm:columns-3 lg:columns-4`), each a link to `/chat/{slug}`.
- `CategoryCard.tsx` — single card: icon + name, link to `/chat/{slug}`. Plus a `CategoryGrid` export mapping `getTopics()` into a responsive grid.
- `TrendingBlock.tsx` — editorial list of the day's trends (Mundial 2026, resultados deportivos, loterías, horóscopo, tiempo por ciudades, tecnología, actualidad) as links; data inline array `TRENDS` with `{label, href}` pointing at the scaffolded routes.
- `NewsGrid.tsx` — newspaper layout: featured `NewsItem` large (left/top), 4 small in a column/grid. Uses `getNews()`. Each links to `/noticias/{category-slug}` (or `#` placeholder). Category label, title, excerpt, date.
- `RankingTable.tsx` — semantic `<table>`: columns Posición, Sala, País/Tema, Actividad, ⟶ entrar. Uses `getRanking()`. Row links name to `/chat/{slug}` and an "Entrar" link to `/webchat?canal={slug}`. Top-3 position number highlighted (amber/red accent per spec).

Each block wrapped in `<section>` and used with `SectionTitle`.

- [ ] **Step 4: Run test + build; commit**

```bash
npx vitest run src/components/home/blocks.test.tsx && git add -A && git commit -m "feat: home content blocks"
```

---

## Task 12: Assemble the Home page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Compose all blocks**

```tsx
import { HeroSearch } from "@/components/home/HeroSearch";
import { RoomCard } from "@/components/home/RoomCard";
import { CountryGrid } from "@/components/home/CountryGrid";
import { CityList } from "@/components/home/CityList";
import { CategoryGrid } from "@/components/home/CategoryCard";
import { TrendingBlock } from "@/components/home/TrendingBlock";
import { NewsGrid } from "@/components/home/NewsGrid";
import { RankingTable } from "@/components/home/RankingTable";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getRooms } from "@/data";

export default function HomePage() {
  return (
    <main>
      <HeroSearch />
      <section id="salas" className="mx-auto max-w-6xl px-4 py-10">
        <SectionTitle href="/chat" cta="Ver todas">Salas más activas</SectionTitle>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {getRooms().map((p) => <RoomCard key={p.slug} place={p} />)}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-10"><SectionTitle>Explora por país</SectionTitle><CountryGrid /></section>
      <section className="mx-auto max-w-6xl px-4 py-10"><SectionTitle>Ciudades populares</SectionTitle><CityList /></section>
      <section className="mx-auto max-w-6xl px-4 py-10"><SectionTitle>Temáticas</SectionTitle><CategoryGrid /></section>
      <TrendingBlock />
      <section className="mx-auto max-w-6xl px-4 py-10"><SectionTitle href="/noticias">Noticias y contenidos</SectionTitle><NewsGrid /></section>
      <section className="mx-auto max-w-6xl px-4 py-10"><SectionTitle href="/ranking">Ranking de salas</SectionTitle><RankingTable /></section>
    </main>
  );
}
```
Note: "Salas más activas" grid is hidden-redundant with hero on desktop but fine; mobile shows it as the primary discovery. Make the grid horizontally scrollable on mobile if desired (`overflow-x-auto` + `flex` variant) — optional polish.

- [ ] **Step 2: Build + manual check; commit**

```bash
npm run build && git add -A && git commit -m "feat: assemble home page"
```
Then `npm run dev` and verify the home at http://localhost:3000 on desktop and a narrow viewport.

---

## Task 13: Room components (RoomInfoPanel, SEOTextBlock, RelatedRooms, FAQBlock)

**Files:**
- Create: `src/components/room/RoomInfoPanel.tsx`, `SEOTextBlock.tsx`, `RelatedRooms.tsx`, `FAQBlock.tsx`
- Test: `src/components/room/room.test.tsx`

- [ ] **Step 1: Write smoke test `src/components/room/room.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RoomInfoPanel } from "./RoomInfoPanel";
import { RelatedRooms } from "./RelatedRooms";
import { getPlace } from "@/data";

it("info panel shows channel and activity", () => {
  render(<RoomInfoPanel place={getPlace("madrid")!} />);
  expect(screen.getByText(/#madrid/)).toBeInTheDocument();
  expect(screen.getByText(/Alta/)).toBeInTheDocument();
});
it("related rooms link to chat pages", () => {
  render(<RelatedRooms slugs={["barcelona", "valencia"]} />);
  expect(screen.getByRole("link", { name: /Barcelona/ })).toHaveAttribute("href", "/chat/barcelona");
});
```

- [ ] **Step 2: Run, expect fail**

Run: `npx vitest run src/components/room/room.test.tsx` → FAIL.

- [ ] **Step 3: Implement room components**

- `RoomInfoPanel.tsx` — a `Card` with rows: Sala `#{slug}`, País/Categoría (from kind/parentName), Actividad (with green dot), and "También conecta con:" listing the remaining channels as `#x` chips. Accepts `place: Place`.
- `SEOTextBlock.tsx` — generic `{ title: string; children: ReactNode }` rendering an `<section>` with an `h2` and prose. Used for "Sobre el chat de X", "Qué puedes encontrar", "Consejos para chatear con seguridad". Prose styles: `max-w-3xl text-muted leading-relaxed`.
- `RelatedRooms.tsx` — `{ slugs: string[] }`, resolves with `getRelated`, renders a wrap of pill links to `/chat/{slug}`.
- `FAQBlock.tsx` — `{ items: {q:string;a:string}[] }`, renders `<details>`/`<summary>` accordions + a `JsonLd` FAQPage from `lib/seo`.

- [ ] **Step 4: Run test + build; commit**

```bash
npx vitest run src/components/room/room.test.tsx && git add -A && git commit -m "feat: room components"
```

---

## Task 14: Chat room page `/chat/[slug]` (model: Madrid)

**Files:**
- Create: `src/app/chat/[slug]/page.tsx`
- Test: `src/app/chat/chat-page.test.tsx`

- [ ] **Step 1: Write test `src/app/chat/chat-page.test.tsx`** (server component → test the helper that builds content)

Extract a pure helper `buildRoomCopy(place)` in the page file's sibling `src/app/chat/[slug]/copy.ts` and test it:
```ts
import { describe, it, expect } from "vitest";
import { buildRoomCrumbs, buildFaq } from "@/app/chat/[slug]/copy";
import { getPlace } from "@/data";

it("builds breadcrumbs Inicio > España > Madrid for a city", () => {
  const crumbs = buildRoomCrumbs(getPlace("madrid")!);
  expect(crumbs.map((c) => c.name)).toEqual(["Inicio", "España", "Madrid"]);
});
it("builds a non-empty FAQ for a place", () => {
  expect(buildFaq(getPlace("madrid")!).length).toBeGreaterThanOrEqual(3);
});
```

- [ ] **Step 2: Run, expect fail**

Run: `npx vitest run src/app/chat/chat-page.test.tsx` → FAIL.

- [ ] **Step 3: Implement `copy.ts`**

```ts
import type { Place } from "@/data";
import type { Crumb } from "@/lib/seo";

export function buildRoomCrumbs(place: Place): Crumb[] {
  const crumbs: Crumb[] = [{ name: "Inicio", url: "/" }];
  if (place.parentName && place.parentSlug)
    crumbs.push({ name: place.parentName, url: `/pais/${place.parentSlug}` });
  crumbs.push({ name: place.name, url: `/chat/${place.slug}` });
  return crumbs;
}

export function buildFaq(place: Place): { q: string; a: string }[] {
  return [
    { q: `¿El chat de ${place.name} es gratis?`, a: `Sí. Entras sin registro, eliges un nick de invitado y empiezas a chatear al momento.` },
    { q: `¿Necesito instalar algo?`, a: `No. El chat funciona en el navegador, en móvil y en ordenador.` },
    { q: `¿De qué se habla en la sala de ${place.name}?`, a: place.intro },
    { q: `¿Cómo entro en otras salas relacionadas?`, a: `Desde "Salas relacionadas" puedes saltar a ${place.related.slice(0,3).join(", ")} y más.` },
  ];
}
```

- [ ] **Step 4: Run test, expect pass**

Run: `npx vitest run src/app/chat/chat-page.test.tsx` → PASS.

- [ ] **Step 5: Implement the page `src/app/chat/[slug]/page.tsx`**

Server component:
- `generateStaticParams` from all places (countries+cities+topics).
- `generateMetadata({ params })` → title `Chat {Name} gratis`, description from `place.intro`, canonical `/chat/{slug}`. `notFound()` if missing.
- Render: `Breadcrumbs`, hero (`h1` `Chat {Name} gratis`, `place.intro`, primary button "Entrar al chat de {Name}" → `/webchat?canal={slug}`), two-column body: left `SEOTextBlock`s ("Sobre el chat de {Name}" using `about ?? intro`, "Qué puedes encontrar en esta sala", "Consejos para chatear con seguridad" — generic safety copy), right `RoomInfoPanel`. Then placeholder sections "Noticias de {Name}" and "Tiempo en {Name}" linking to `/noticias` and `/tiempo/{slug}`. Then `RelatedRooms` and `FAQBlock`.
- The three SEO blocks must NOT be identical templates: vary wording for ciudad vs país vs temática (branch on `place.kind`).

- [ ] **Step 6: Build + manual check `/chat/madrid`; commit**

```bash
npm run build && git add -A && git commit -m "feat: chat room page with Madrid model"
```
Verify `/chat/madrid`, `/chat/espana`, `/chat/amor` all render with appropriate, non-identical copy.

---

## Task 15: WebchatFrame + `/webchat` page

**Files:**
- Create: `src/components/webchat/WebchatFrame.tsx`, `src/app/webchat/page.tsx`
- Create: `.env.local` (gitignored), `.env.example`
- Test: `src/components/webchat/webchat.test.tsx`

- [ ] **Step 1: Write test `src/components/webchat/webchat.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { WebchatFrame } from "./WebchatFrame";

it("builds an iframe src with nick, channels and show_password_box=false", () => {
  const { container } = render(<WebchatFrame canal="madrid" clientId="testclient" />);
  const iframe = container.querySelector("iframe")!;
  const src = iframe.getAttribute("src")!;
  expect(src).toContain("clientId=testclient");
  expect(src).toContain("channel=#madrid,#espana,#amistad,#chatzona");
  expect(src).toMatch(/nick=Invitado-\d{4}/);
  expect(src).toContain("show_password_box=false");
});
```

- [ ] **Step 2: Run, expect fail**

Run: `npx vitest run src/components/webchat/webchat.test.tsx` → FAIL.

- [ ] **Step 3: Implement `WebchatFrame.tsx`** (client component)

```tsx
"use client";
import { useMemo } from "react";
import { resolveChannels, channelString } from "@/lib/channels";
import { generateNick } from "@/lib/nick";

export function WebchatFrame({ canal, clientId }: { canal: string; clientId: string }) {
  const src = useMemo(() => {
    const nick = generateNick();
    const channels = channelString(resolveChannels(canal));
    const base = "https://chat.chatzona.org/index.html";
    return `${base}?clientId=${clientId}#nick=${nick}&channel=${channels}&show_password_box=false`;
  }, [canal, clientId]);
  return (
    <iframe
      src={src}
      title={`Chat de ${canal}`}
      className="h-[70vh] w-full rounded-lg border border-line lg:h-[600px]"
      // width/height kept via classes; border attr per spec not needed with CSS
    />
  );
}
```
Note: `useMemo` with no random-free deps still re-randomizes per mount only (fine). Because `generateNick` uses `Math.random`, render the frame in a client boundary so SSR/CSR nick mismatch doesn't warn — the whole component is `"use client"`, good.

- [ ] **Step 4: Implement `/webchat` page `src/app/webchat/page.tsx`**

- Reads `searchParams.canal` (default `"espana"`).
- Minimal header is the global Header; below it: room name `h1` "Chat de {Name}" (resolve via `getPlace`), the `WebchatFrame` large, then `RelatedRooms` and a short "Normas básicas" list (respeto, no spam, no datos personales, +18 donde aplique).
- `clientId` from `process.env.NEXT_PUBLIC_WEBCHAT_CLIENT_ID ?? "af9476269cf237c0196b"`.
- `export const metadata` with `robots: { index: false }` (webchat app page shouldn't be indexed; the SEO lives on `/chat/*`).

```tsx
import { WebchatFrame } from "@/components/webchat/WebchatFrame";
import { RelatedRooms } from "@/components/room/RelatedRooms";
import { getPlace } from "@/data";

export const metadata = { title: "Webchat", robots: { index: false } };

export default async function WebchatPage({ searchParams }: { searchParams: Promise<{ canal?: string }> }) {
  const { canal = "espana" } = await searchParams;
  const place = getPlace(canal);
  const clientId = process.env.NEXT_PUBLIC_WEBCHAT_CLIENT_ID ?? "af9476269cf237c0196b";
  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-3 text-xl font-bold text-ink">Chat de {place?.name ?? canal}</h1>
      <WebchatFrame canal={canal} clientId={clientId} />
      {place && (
        <div className="mt-6">
          <h2 className="mb-2 text-sm font-bold text-ink">Salas relacionadas</h2>
          <RelatedRooms slugs={place.related} />
        </div>
      )}
      <div className="mt-6 text-sm text-muted">
        <h2 className="mb-2 text-sm font-bold text-ink">Normas básicas</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Respeto: nada de insultos ni acoso.</li>
          <li>No compartas datos personales (teléfono, dirección).</li>
          <li>Prohibido el spam y la publicidad.</li>
          <li>Algunas salas son solo para mayores de edad.</li>
        </ul>
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Env files**

`.env.example`:
```
NEXT_PUBLIC_WEBCHAT_CLIENT_ID=af9476269cf237c0196b
```
Add `.env.local` to `.gitignore` (create-next-app already does).

- [ ] **Step 6: Run test + build; manual check; commit**

```bash
npx vitest run src/components/webchat/webchat.test.tsx && npm run build && git add -A && git commit -m "feat: webchat frame and page"
```
Verify `/webchat?canal=madrid` loads the iframe; check the src in devtools matches the spec.

---

## Task 16: Scaffolded routes

**Files:**
- Create: `src/app/chat/page.tsx`, `src/app/pais/[pais]/page.tsx`, `src/app/ciudad/[ciudad]/page.tsx`, `src/app/noticias/page.tsx`, `src/app/noticias/[categoria]/page.tsx`, `src/app/tiempo/[ciudad]/page.tsx`, `src/app/horoscopo/[signo]/page.tsx`, `src/app/loterias/[pais]/page.tsx`, `src/app/ranking/page.tsx`
- Create: `src/components/layout/ScaffoldPage.tsx`

- [ ] **Step 1: Create a shared `ScaffoldPage` component**

`{ title: string; crumbs: Crumb[]; intro: string; children?: ReactNode }` — renders Breadcrumbs, an `h1`, an intro paragraph, and a "Contenido en preparación" note styled as a soft Card. Keeps scaffolded pages consistent and SEO-ready (real `h1` + metadata).

- [ ] **Step 2: Implement each route using real data where available**

- `/chat` — index of all rooms via `RoomCard` grid + optional `?q=` filter on name (client-side filter is fine; or simple server filter on `searchParams.q`). Real, functional.
- `/ranking` — full `RankingTable` (reuse component, show all from `getRanking`). Real, functional.
- `/pais/[pais]` — if `getPlace` is a país, show its rooms (cities under it + related) using `ScaffoldPage` + a `CityList`/`RoomCard` grid; `generateMetadata`. Functional-ish.
- `/ciudad/[ciudad]` — redirect-style: render `ScaffoldPage` linking to `/chat/{ciudad}` (canonical chat page), or `redirect()` to `/chat/{ciudad}`. Choose redirect to avoid duplicate content.
- `/noticias` + `/noticias/[categoria]` — `NewsGrid` filtered by category; `ScaffoldPage` wrapper.
- `/tiempo/[ciudad]`, `/horoscopo/[signo]`, `/loterias/[pais]` — `ScaffoldPage` with tailored intro per param and `generateMetadata`; content "en preparación".

Each page MUST export `generateMetadata` (title + description) so SEO is wired even while scaffolded.

- [ ] **Step 3: Build; commit**

```bash
npm run build && git add -A && git commit -m "feat: scaffolded routes with SEO metadata"
```
Verify each route returns 200 (no crashes) for a sample param.

---

## Task 17: SEO infrastructure (sitemap, robots, llms.txt, JSON-LD on home)

**Files:**
- Create: `next-sitemap.config.js`, `public/llms.txt`
- Modify: `package.json` (postbuild), `src/app/page.tsx` (Collection/WebSite JSON-LD already in layout)
- Create: `src/app/chat/[slug]/` JSON-LD already via Breadcrumbs

- [ ] **Step 1: Install + configure next-sitemap**

```bash
npm i next-sitemap
```
`next-sitemap.config.js`:
```js
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://tuchat.org",
  generateRobotsTxt: true,
  exclude: ["/webchat"],
  robotsTxtOptions: { policies: [{ userAgent: "*", allow: "/" }] },
};
```
Add to `package.json`: `"postbuild": "next-sitemap"`.

- [ ] **Step 2: Add `public/llms.txt`**

```
# TuChat.org
TuChat es un portal de salas de chat en español: por países, ciudades y temáticas,
con acceso a un webchat en tiempo real, además de noticias, tiempo, loterías y horóscopo.

## Secciones
- /chat/{ciudad|pais|tematica}: salas de chat (ej. /chat/madrid, /chat/mexico, /chat/amor)
- /noticias: actualidad, deportes, tecnología, IA, cultura
- /ranking: salas más activas
- /webchat: acceso al chat en directo
```

- [ ] **Step 3: Verify CollectionPage JSON-LD on index pages**

Add `<JsonLd data={collectionJsonLd("Salas de chat", "/chat")} />` to `/chat` and `<JsonLd data={collectionJsonLd("Noticias", "/noticias")} />` to `/noticias`.

- [ ] **Step 4: Build (runs postbuild sitemap); commit**

```bash
npm run build && git add -A && git commit -m "feat: sitemap, robots, llms.txt, collection json-ld"
```
Verify `public/sitemap.xml` and `public/robots.txt` are generated.

---

## Task 18: Mobile polish + final verification

**Files:**
- Modify: home blocks for mobile carousels; verify bottom nav spacing.

- [ ] **Step 1: Mobile carousels**

For "Salas más activas" and "Temáticas" on mobile, switch the grid to a horizontal scroll: `flex gap-3 overflow-x-auto snap-x [&>*]:min-w-[160px] sm:grid sm:overflow-visible`. Keep desktop as grid.

- [ ] **Step 2: Verify whole test suite**

Run: `npm run test`
Expected: all tests PASS.

- [ ] **Step 3: Production build + lint**

Run: `npm run build && npm run lint`
Expected: build succeeds, no lint errors.

- [ ] **Step 4: Manual responsive pass**

`npm run dev`, then check at 375px and 1280px widths:
- Home: hero single column on mobile, "Entrar" visible without scroll, bottom nav present, carousels scroll.
- `/chat/madrid`: breadcrumb, hero, info panel, SEO blocks, related, FAQ.
- `/webchat?canal=madrid`: iframe large, related + normas below.

- [ ] **Step 5: Final commit**

```bash
git add -A && git commit -m "feat: mobile polish and final verification"
```

---

## Self-Review notes

- **Spec coverage:** Home 10 blocks (Tasks 10–12), room page + 6 SEO blocks + FAQ (13–14), webchat with exact iframe contract (15), all 15 components + primitives (8–13), mobile bottom nav + carousels (9, 18), all routes scaffolded with metadata (16), Schema.org WebSite/BreadcrumbList/CollectionPage/Article/FAQPage (7, 9, 14, 17), tokens/colors/Inter (2), anti-AI human copy baked into data (4) — covered.
- **Article JSON-LD:** add to `/noticias/[categoria]` detail when real articles exist; for v1 the NewsItem list uses CollectionPage. Noted as future in spec §10.
- **Channels contract** verified by test in Task 15 against the spec examples (Madrid, and fallback). México/Amor covered by data + channels test (Task 6).
