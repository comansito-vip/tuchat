import { it, expect, describe } from "vitest";
import { buildRoomCrumbs, buildFaq, aboutLead, roomBullets } from "@/app/chat/[slug]/copy";
import { getPlace, getNews } from "@/data";

describe("chat room copy", () => {
  it("builds breadcrumbs Inicio > España > Madrid for a city", () => {
    const crumbs = buildRoomCrumbs(getPlace("madrid")!);
    expect(crumbs.map((c) => c.name)).toEqual(["Inicio", "España", "Madrid"]);
  });

  it("builds breadcrumbs Inicio > España for a country room", () => {
    const crumbs = buildRoomCrumbs(getPlace("espana")!);
    expect(crumbs.map((c) => c.name)).toEqual(["Inicio", "España"]);
  });

  it("builds breadcrumbs Inicio > Anime > Naruto for a sub-topic", () => {
    const crumbs = buildRoomCrumbs(getPlace("naruto")!);
    expect(crumbs.map((c) => c.name)).toEqual(["Inicio", "Anime", "Naruto"]);
    // Parent is a topic (tematica), so URL should be /chat/anime
    expect(crumbs[1].url).toBe("/chat/anime");
  });

  it("builds a FAQ of 4 items for Madrid", () => {
    expect(buildFaq(getPlace("madrid")!)).toHaveLength(4);
  });

  it("buildFaq personalizes questions with the place name", () => {
    const faq = buildFaq(getPlace("madrid")!);
    expect(faq[0].q).toContain("Madrid");
    expect(faq[1].q).toContain("Madrid");
    expect(faq[2].q).toContain("Madrid");
  });

  it("buildFaq falls back to intro when about is absent", () => {
    const place = { ...getPlace("amor")!, about: undefined };
    const faq = buildFaq(place);
    expect(faq[2].a).toBe(place.intro);
  });

  it("aboutLead returns a non-empty string for each kind", () => {
    expect(aboutLead(getPlace("madrid")!).length).toBeGreaterThan(40);
    expect(aboutLead(getPlace("espana")!).length).toBeGreaterThan(40);
    expect(aboutLead(getPlace("amor")!).length).toBeGreaterThan(40);
  });

  it("roomBullets returns 4 items for each kind", () => {
    expect(roomBullets(getPlace("madrid")!)).toHaveLength(4);
    expect(roomBullets(getPlace("espana")!)).toHaveLength(4);
    expect(roomBullets(getPlace("amor")!)).toHaveLength(4);
  });
});

describe("getNews ordering", () => {
  it("returns articles sorted newest first", () => {
    const articles = getNews();
    for (let i = 1; i < articles.length; i++) {
      expect(articles[i].date <= articles[i - 1].date).toBe(true);
    }
  });
});
