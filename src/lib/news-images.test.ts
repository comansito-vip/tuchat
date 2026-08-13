import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { getNewsImage } from "@/lib/news-images";
import { getNews } from "@/data";

const publico = (ruta: string) => join(process.cwd(), "public", ruta);

describe("getNewsImage", () => {
  it("devuelve una ruta propia, nunca un host ajeno", () => {
    const categories = [
      "Actualidad", "Deportes", "Tecnología", "IA",
      "Cultura", "Viajes", "Salud", "Economía", "Entretenimiento",
      "Anime", "Esoterismo", "Psicología",
    ];
    for (const cat of categories) {
      const url = getNewsImage(cat, "test-slug");
      expect(url).toMatch(/^\/img\/noticias\/[a-z]+-[12]\.jpg$/);
    }
  });

  it("usa la foto de actualidad para una categoría desconocida", () => {
    expect(getNewsImage("XYZ", "some-slug")).toMatch(/^\/img\/noticias\/actualidad-[12]\.jpg$/);
  });

  it("es determinista — el mismo slug devuelve siempre la misma foto", () => {
    const a = getNewsImage("Deportes", "real-madrid-champions-2026");
    const b = getNewsImage("Deportes", "real-madrid-champions-2026");
    expect(a).toBe(b);
  });

  it("cada categoría reparte entre sus dos fotos", () => {
    const vistas = new Set(
      ["a", "b", "c", "d", "e", "f"].map((s) => getNewsImage("Deportes", s)),
    );
    expect(vistas.size).toBe(2);
  });
});

// El fallo que motivó esto: `anime-2` apuntaba a una foto que Unsplash había
// borrado y llevaba meses dando 404 en producción. Una imagen rota no rompe el
// build ni ningún test de contenido; solo se ve mirando la página. Con las fotos
// en `public/` sí se puede comprobar, así que se comprueba.
describe("las fotos existen en disco", () => {
  it("todas las que puede devolver getNewsImage", () => {
    const rutas = new Set<string>();
    for (const cat of ["actualidad", "deportes", "tecnologia", "ia", "cultura", "viajes",
                       "salud", "economia", "entretenimiento", "anime", "esoterismo", "psicologia"]) {
      rutas.add(getNewsImage(cat, "a"));
      rutas.add(getNewsImage(cat, "b"));
    }
    const faltan = [...rutas].filter((r) => !existsSync(publico(r)));
    expect(faltan).toEqual([]);
  });

  it("todas las declaradas en los artículos publicados", () => {
    const faltan = getNews()
      .map((n) => n.image)
      .filter((img): img is string => Boolean(img))
      .filter((img) => !existsSync(publico(img)));
    expect(faltan).toEqual([]);
  });

  it("ningún artículo apunta a un dominio ajeno", () => {
    const fuera = getNews().filter((n) => n.image && !n.image.startsWith("/"));
    expect(fuera.map((n) => n.slug)).toEqual([]);
  });
});
