import { describe, it, expect } from "vitest";
import { resolveChannels, channelString } from "@/lib/channels";

describe("resolveChannels", () => {
  it("uses the place's defined channels for Madrid", () => {
    expect(resolveChannels("madrid")).toEqual(["madrid", "espana", "amistad", "chatzona"]);
  });
  it("uses México's channels", () => {
    expect(resolveChannels("mexico")).toEqual(["mexico", "amistad", "chatzona"]);
  });
  it("no mete a los países hispanohablantes en #internacional", () => {
    for (const slug of ["espana", "mexico", "argentina", "colombia", "cuba", "guinea-ecuatorial"]) {
      expect(resolveChannels(slug)).not.toContain("internacional");
    }
  });
  it("mantiene #internacional en los países no hispanohablantes", () => {
    expect(resolveChannels("francia")).toContain("internacional");
  });
  it("todas las salas de Estados Unidos entran al canal real #usa", () => {
    for (const slug of ["estados-unidos", "miami", "nueva-york", "los-angeles", "houston"]) {
      expect(resolveChannels(slug)).toContain("usa");
    }
    // Miami además tiene su propio canal real.
    expect(resolveChannels("miami")).toContain("miami");
  });
  it("falls back for an unknown slug to itself + amistad + chatzona", () => {
    expect(resolveChannels("xyz")).toEqual(["xyz", "amistad", "chatzona"]);
  });
  it("formats as #-prefixed comma list", () => {
    expect(channelString(["madrid", "espana"])).toBe("#madrid,#espana");
  });
  it("uses first channel as room channel", () => {
    const ch = resolveChannels("madrid");
    expect(ch[0]).toBe("madrid");
  });
  it("fallback always adds amistad and chatzona at the end", () => {
    const ch = resolveChannels("unknown-slug-xyz");
    expect(ch).toContain("amistad");
    expect(ch).toContain("chatzona");
    expect(ch[ch.length - 1]).toBe("chatzona");
  });
});
