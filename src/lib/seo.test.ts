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
