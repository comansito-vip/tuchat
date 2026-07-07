import { describe, it, expect, beforeEach } from "vitest";
import { getSavedNick, saveNick, subscribeNick } from "@/lib/nick-storage";

describe("nick-storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("getSavedNick returns empty string when nothing stored", () => {
    expect(getSavedNick()).toBe("");
  });

  it("saveNick persists the nick and getSavedNick reads it back", () => {
    saveNick("Pepito");
    expect(getSavedNick()).toBe("Pepito");
  });

  it("saveNick with empty string removes the stored nick", () => {
    saveNick("Pepito");
    saveNick("");
    expect(getSavedNick()).toBe("");
  });

  it("subscribeNick notifies listeners on saveNick", () => {
    let notified = 0;
    const unsubscribe = subscribeNick(() => notified++);
    saveNick("Ana");
    expect(notified).toBe(1);
    unsubscribe();
  });

  it("unsubscribe stops further notifications", () => {
    let notified = 0;
    const unsubscribe = subscribeNick(() => notified++);
    unsubscribe();
    saveNick("Luis");
    expect(notified).toBe(0);
  });
});
