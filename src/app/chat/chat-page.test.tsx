import { it, expect } from "vitest";
import { buildRoomCrumbs, buildFaq } from "@/app/chat/[slug]/copy";
import { getPlace } from "@/data";

it("builds breadcrumbs Inicio > España > Madrid for a city", () => {
  const crumbs = buildRoomCrumbs(getPlace("madrid")!);
  expect(crumbs.map((c) => c.name)).toEqual(["Inicio", "España", "Madrid"]);
});
it("builds a FAQ of at least 3 items", () => {
  expect(buildFaq(getPlace("madrid")!).length).toBeGreaterThanOrEqual(3);
});
