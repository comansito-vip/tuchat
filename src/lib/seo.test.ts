import { describe, it, expect } from "vitest";
import {
  tituloArticuloSerp,
  breadcrumbJsonLd,
  faqJsonLd,
  websiteJsonLd,
  collectionJsonLd,
  articleJsonLd,
  articleListJsonLd,
  itemListJsonLd,
  organizationJsonLd,
} from "@/lib/seo";

const SITE = "https://www.tuchat.org";

describe("seo json-ld", () => {
  it("builds a BreadcrumbList with positions", () => {
    const ld = breadcrumbJsonLd([
      { name: "Inicio", url: "/" },
      { name: "España", url: "/chat/espana" },
      { name: "Madrid", url: "/chat/madrid" },
    ]);
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect(ld.itemListElement).toHaveLength(3);
    expect(ld.itemListElement[2].position).toBe(3);
    expect(ld.itemListElement[2].item).toBe(`${SITE}/chat/madrid`);
  });

  it("builds a FAQPage", () => {
    const ld = faqJsonLd([{ q: "¿Es gratis?", a: "Sí." }]);
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity[0].acceptedAnswer.text).toBe("Sí.");
  });

  it("builds a WebSite with SearchAction", () => {
    const ld = websiteJsonLd();
    expect(ld["@type"]).toBe("WebSite");
    expect(ld.url).toBe(SITE);
    expect(ld.potentialAction["@type"]).toBe("SearchAction");
  });

  it("builds a CollectionPage", () => {
    const ld = collectionJsonLd("Salas de chat", "/chat");
    expect(ld["@type"]).toBe("CollectionPage");
    expect(ld.url).toBe(`${SITE}/chat`);
    expect(ld.name).toBe("Salas de chat");
  });

  it("builds a NewsArticle with required fields", () => {
    const ld = articleJsonLd({
      title: "Titular de prueba",
      description: "Descripción breve del artículo.",
      date: "2026-06-10",
      category: "Tecnología",
      slug: "titular-de-prueba",
      body: "Texto del artículo con bastante contenido para contar las palabras correctamente.",
    });
    expect(ld["@type"]).toBe("NewsArticle");
    expect(ld.headline).toBe("Titular de prueba");
    expect(ld.datePublished).toBe("2026-06-10T00:00:00Z");
    expect(ld.inLanguage).toBe("es");
    expect(ld.author["@type"]).toBe("Organization");
    expect(ld.publisher.logo["@type"]).toBe("ImageObject");
    expect(typeof ld.wordCount).toBe("number");
    expect(ld.mainEntityOfPage).toBe(`${SITE}/noticias/articulo/titular-de-prueba`);
  });

  it("builds an ItemList for article list", () => {
    const ld = articleListJsonLd([
      { slug: "articulo-uno", title: "Artículo uno", date: "2026-06-01" },
      { slug: "articulo-dos", title: "Artículo dos", date: "2026-06-02" },
    ]);
    expect(ld["@type"]).toBe("ItemList");
    expect(ld.itemListElement).toHaveLength(2);
    expect(ld.itemListElement[0].url).toBe(`${SITE}/noticias/articulo/articulo-uno`);
    expect(ld.itemListElement[1].position).toBe(2);
  });

  it("builds an ItemList for rooms, prepending SITE to relative URLs", () => {
    const ld = itemListJsonLd([
      { url: "/chat/madrid", name: "Chat Madrid" },
      { url: "/chat/barcelona", name: "Chat Barcelona" },
    ]);
    expect(ld["@type"]).toBe("ItemList");
    expect(ld.itemListElement[0].url).toBe(`${SITE}/chat/madrid`);
  });

  it("builds an Organization with contact point", () => {
    const ld = organizationJsonLd();
    expect(ld["@type"]).toBe("Organization");
    expect(ld.name).toBe("TuChat");
    expect(ld.contactPoint.email).toBe("info@chatzona.org");
  });

  it("all JSON-LD objects include @context schema.org", () => {
    const objects = [
      breadcrumbJsonLd([{ name: "Inicio", url: "/" }]),
      faqJsonLd([{ q: "¿?", a: "Sí." }]),
      websiteJsonLd(),
      collectionJsonLd("Test", "/test"),
      articleJsonLd({ title: "T", description: "D", date: "2026-01-01", category: "C", slug: "t", body: "b" }),
      organizationJsonLd(),
      articleListJsonLd([{ slug: "a", title: "A", date: "2026-01-01" }]),
      itemListJsonLd([{ url: "/chat/madrid", name: "Madrid" }]),
    ];
    for (const obj of objects) {
      expect(obj["@context"]).toBe("https://schema.org");
    }
  });

  it("faqJsonLd wraps each item in a Question type", () => {
    const ld = faqJsonLd([{ q: "Q1", a: "A1" }, { q: "Q2", a: "A2" }]);
    expect(ld.mainEntity).toHaveLength(2);
    expect(ld.mainEntity[0]["@type"]).toBe("Question");
    expect(ld.mainEntity[1]["@type"]).toBe("Question");
  });

  it("articleJsonLd sets wordCount based on body", () => {
    const ld = articleJsonLd({
      title: "T", description: "D", date: "2026-01-01", category: "C", slug: "t",
      body: "uno dos tres cuatro cinco",
    });
    expect(ld.wordCount).toBe(5);
  });
});

describe("tituloArticuloSerp", () => {
  it("deja en paz lo que ya cabe", () => {
    expect(tituloArticuloSerp("Un titular corto y normal")).toBe("Un titular corto y normal");
  });

  it("corta por el separador cuando lo que queda dice algo", () => {
    expect(
      tituloArticuloSerp(
        "La paradoja de la plaza pública digital: por qué estar más conectados nos aísla",
      ),
    ).toBe("La paradoja de la plaza pública digital");
  });

  it("no se queda con un enunciado vago: prefiere truncar y conservar el tema", () => {
    // "Más allá del silencio" son 21 caracteres que no dicen de qué va el artículo
    const t = tituloArticuloSerp(
      "Más allá del silencio: el nuevo reto de la moderación en comunidades",
    );
    expect(t).not.toBe("Más allá del silencio");
    expect(t).toContain("moderación");
    expect(t.length).toBeLessThanOrEqual(65);
  });

  it("nunca pasa del límite ni corta a mitad de palabra", () => {
    const casos = [
      "Cultura, flamenco y patrimonio: la hispanidad revisada en un 2026 que discute su propio relato histórico",
      "El sueño como pilar invisible: cómo la calidad del descanso moldea la salud del día siguiente",
      "Palabrasinseparadoresnisespacios".repeat(4),
    ];
    for (const c of casos) {
      const t = tituloArticuloSerp(c);
      expect(t.length, c.slice(0, 30)).toBeLessThanOrEqual(65);
      if (t.endsWith("…")) expect(c.startsWith(t.slice(0, -1).trim())).toBe(true);
    }
  });
});
