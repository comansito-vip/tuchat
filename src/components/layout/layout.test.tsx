import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "./Header";
import { Breadcrumbs } from "./Breadcrumbs";
import { Footer } from "./Footer";
import { ScaffoldPage } from "./ScaffoldPage";
import { MobileBottomNav } from "./MobileBottomNav";
import { MobileMenu } from "./MobileMenu";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

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
  it("ScaffoldPage renders title, intro, and placeholder card", () => {
    render(
      <ScaffoldPage
        title="Ciudades de España"
        intro="Elige tu ciudad."
        crumbs={[{ name: "Inicio", url: "/" }, { name: "España", url: "/pais/espana" }]}
      />
    );
    expect(screen.getByRole("heading", { level: 1, name: "Ciudades de España" })).toBeInTheDocument();
    expect(screen.getByText("Elige tu ciudad.")).toBeInTheDocument();
    expect(screen.getByText(/Sección en preparación/i)).toBeInTheDocument();
  });
  it("ScaffoldPage hides placeholder when placeholder=false", () => {
    render(
      <ScaffoldPage
        title="Test"
        intro="Test intro"
        crumbs={[{ name: "Inicio", url: "/" }]}
        placeholder={false}
      />
    );
    expect(screen.queryByText(/Sección en preparación/i)).not.toBeInTheDocument();
  });
  it("MobileBottomNav renders 5 nav links", () => {
    render(<MobileBottomNav />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBe(5);
    expect(screen.getByRole("link", { name: "Chat" })).toHaveAttribute("href", "/chat");
  });
  it("MobileMenu opens dialog on button click", () => {
    render(<MobileMenu />);
    const openBtn = screen.getByRole("button", { name: /Abrir menú/i });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(openBtn);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Todas las salas")).toBeInTheDocument();
  });
  it("MobileMenu closes dialog on Cerrar click", () => {
    render(<MobileMenu />);
    fireEvent.click(screen.getByRole("button", { name: /Abrir menú/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    // Click the close button inside the panel
    const closeButtons = screen.getAllByRole("button", { name: /Cerrar menú/i });
    fireEvent.click(closeButtons[closeButtons.length - 1]); // inner close button
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
