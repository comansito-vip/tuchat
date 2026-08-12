import { describe, it, expect } from "vitest";
import { dynamicParams, generateStaticParams } from "./[categoria]/page";
import { getNews } from "@/data";
import { slugify } from "@/lib/slug";

describe("/noticias/[categoria]", () => {
  /**
   * Antes de cerrarla, `/noticias/lo-que-sea` devolvía un 200 con título
   * «Noticias de Lo que sea» y canónica autorreferente. Con 5.180 URLs peleando
   * por que Google las rastree, abrir un espacio infinito de páginas indexables
   * que nadie ha escrito es justo lo contrario de lo que hace falta.
   */
  it("no atiende categorías que no existen", () => {
    expect(dynamicParams).toBe(false);
  });

  it("las categorías generadas son exactamente las que tienen noticias", () => {
    const esperadas = [...new Set(getNews().map((n) => slugify(n.category)))].sort();
    const generadas = generateStaticParams().map((p) => p.categoria).sort();
    expect(generadas).toEqual(esperadas);
    expect(generadas.length).toBeGreaterThan(0);
  });
});
