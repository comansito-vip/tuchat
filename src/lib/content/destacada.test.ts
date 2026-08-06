import { describe, it, expect } from "vitest";
import { reponerDestacada } from "./destacada";
import { NEWS } from "@/data/news";

// Un news.ts mínimo con el mismo formato que escribe renderFile en generate-news.ts.
const dosNoticias = `import type { NewsItem } from "./types";

export const NEWS: NewsItem[] = [
  {
    slug: "primera",
    title: "Primera",
    category: "Actualidad",
    excerpt: "Resumen de la primera.",
    date: "2026-08-06",
    body: "Cuerpo de la primera.",
  },
  {
    slug: "segunda",
    title: "Segunda",
    category: "Cultura",
    excerpt: "Resumen de la segunda.",
    date: "2026-08-05",
    body: "Cuerpo de la segunda.",
  },
];
`;

describe("reponerDestacada", () => {
  it("marca la primera noticia cuando no queda ninguna destacada", () => {
    const salida = reponerDestacada(dosNoticias);
    expect(salida).not.toBeNull();
    expect(salida!.match(/featured: true/g)).toHaveLength(1);
    // La destacada es la primera del fichero, no la segunda.
    expect(salida!.indexOf("featured: true")).toBeLessThan(salida!.indexOf('slug: "segunda"'));
  });

  it("inserta el campo tras la fecha, respetando el orden con que se escribe el fichero", () => {
    const salida = reponerDestacada(dosNoticias)!;
    expect(salida).toContain('    date: "2026-08-06",\n    featured: true,\n    body:');
  });

  it("no toca el fuente si ya hay una destacada", () => {
    const conDestacada = dosNoticias.replace('    date: "2026-08-06",\n', '    date: "2026-08-06",\n    featured: true,\n');
    expect(reponerDestacada(conDestacada)).toBe(conDestacada);
  });

  it("devuelve null si no encuentra dónde insertarla, en vez de romper el fichero", () => {
    expect(reponerDestacada("export const NEWS: NewsItem[] = [];\n")).toBeNull();
  });

  it("deja el catálogo real cumpliendo la regla de una sola destacada", () => {
    // Cierra el círculo con data.test.ts: lo que esta función garantiza en el
    // fuente es exactamente lo que aquel test exige del catálogo cargado.
    expect(NEWS.filter((n) => n.featured)).toHaveLength(1);
  });
});
