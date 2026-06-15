import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";
import { Breadcrumbs } from "./Breadcrumbs";
import { Footer } from "./Footer";

describe("layout", () => {
  it("header shows the brand and the Entrar CTA", () => {
    render(<Header />);
    expect(screen.getByText("Entrar al chat")).toBeInTheDocument();
  });
  it("breadcrumbs render each crumb, last is current", () => {
    render(<Breadcrumbs crumbs={[{ name: "Inicio", url: "/" }, { name: "Madrid", url: "/chat/madrid" }]} />);
    expect(screen.getByText("Madrid")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute("href", "/");
  });
  it("footer has legal links and main navigation", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Aviso legal" })).toHaveAttribute("href", "/legal/aviso-legal");
    expect(screen.getByRole("link", { name: "Privacidad" })).toHaveAttribute("href", "/legal/privacidad");
    expect(screen.getByRole("link", { name: "Cookies" })).toHaveAttribute("href", "/legal/cookies");
    expect(screen.getByRole("link", { name: "Resultados de fútbol" })).toHaveAttribute("href", "/resultados/laliga");
  });
});
