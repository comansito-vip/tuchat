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

  it("builds a FAQ of 4 items for Madrid", () => {
    expect(buildFaq(getPlace("madrid")!)).toHaveLength(4);
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
