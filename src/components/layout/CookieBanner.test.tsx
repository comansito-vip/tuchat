import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { CookieBanner } from "./CookieBanner";

const STORAGE_KEY = "cookie-consent";

describe("CookieBanner", () => {
  beforeEach(() => {
    localStorage.clear();
    window.gtag = vi.fn();
  });
  afterEach(cleanup);

  it("se muestra cuando no hay elección previa", () => {
    render(<CookieBanner />);
    expect(screen.getByRole("dialog", { name: "Consentimiento de cookies" })).toBeInTheDocument();
  });

  it("no se muestra si ya se decidió en una visita anterior", () => {
    localStorage.setItem(STORAGE_KEY, "denied");
    render(<CookieBanner />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("aceptar guarda el consentimiento, avisa a gtag y oculta el banner", () => {
    render(<CookieBanner />);
    fireEvent.click(screen.getByRole("button", { name: "Aceptar" }));

    expect(localStorage.getItem(STORAGE_KEY)).toBe("granted");
    expect(window.gtag).toHaveBeenCalledWith("consent", "update", { analytics_storage: "granted" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("rechazar deniega el consentimiento y también oculta el banner", () => {
    render(<CookieBanner />);
    fireEvent.click(screen.getByRole("button", { name: "Rechazar" }));

    expect(localStorage.getItem(STORAGE_KEY)).toBe("denied");
    expect(window.gtag).toHaveBeenCalledWith("consent", "update", { analytics_storage: "denied" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("se muestra igualmente si localStorage no es accesible (modo privado estricto)", () => {
    const getItem = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    render(<CookieBanner />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    getItem.mockRestore();
  });

  it("sigue ocultándose al elegir aunque no se pueda persistir la decisión", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    render(<CookieBanner />);
    fireEvent.click(screen.getByRole("button", { name: "Aceptar" }));

    expect(window.gtag).toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    setItem.mockRestore();
  });
});
