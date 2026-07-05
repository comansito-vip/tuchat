import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "./Header";
import { Breadcrumbs } from "./Breadcrumbs";
import { Footer } from "./Footer";
import { ScaffoldPage } from "./ScaffoldPage";
import { MobileBottomNav } from "./MobileBottomNav";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import { JsonLd } from "@/lib/seo";

const mockPathname = vi.fn(() => "/");
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => mockPathname(),
}));

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
        crumbs={[{ name: "Inicio", url: "/" }, { name: "España", url: "/chat/espana" }]}
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
  it("MobileBottomNav marks Inicio as active on /", () => {
    mockPathname.mockReturnValue("/");
    render(<MobileBottomNav />);
    expect(screen.getByRole("link", { name: "Inicio" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Chat" })).not.toHaveAttribute("aria-current");
  });
  it("MobileBottomNav marks Chat as active on /chat/madrid", () => {
    mockPathname.mockReturnValue("/chat/madrid");
    render(<MobileBottomNav />);
    expect(screen.getByRole("link", { name: "Chat" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Inicio" })).not.toHaveAttribute("aria-current");
  });
  it("MobileBottomNav marks Noticias as active on /noticias/deportes", () => {
    mockPathname.mockReturnValue("/noticias/deportes");
    render(<MobileBottomNav />);
    expect(screen.getByRole("link", { name: "Noticias" })).toHaveAttribute("aria-current", "page");
  });
  it("NavLinks marks Deportes as active on /deportes", () => {
    mockPathname.mockReturnValue("/deportes");
    render(<NavLinks />);
    expect(screen.getByRole("link", { name: "Deportes" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Chat" })).not.toHaveAttribute("aria-current");
  });
  it("NavLinks marks Noticias as active on /noticias/articulo/x", () => {
    mockPathname.mockReturnValue("/noticias/articulo/algo");
    render(<NavLinks />);
    expect(screen.getByRole("link", { name: "Noticias" })).toHaveAttribute("aria-current", "page");
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

describe("JsonLd", () => {
  it("renders a script tag with type application/ld+json", () => {
    const { container } = render(<JsonLd data={{ "@type": "WebSite", name: "TuChat" }} />);
    const script = container.querySelector("script[type='application/ld+json']");
    expect(script).toBeInTheDocument();
  });

  it("serializes the data object as JSON in the script innerHTML", () => {
    const data = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [] };
    const { container } = render(<JsonLd data={data} />);
    const script = container.querySelector("script[type='application/ld+json']")!;
    const parsed = JSON.parse(script.innerHTML);
    expect(parsed["@type"]).toBe("FAQPage");
    expect(parsed["@context"]).toBe("https://schema.org");
  });

  it("Breadcrumbs embeds JSON-LD script with BreadcrumbList type", () => {
    const { container } = render(
      <Breadcrumbs crumbs={[{ name: "Inicio", url: "/" }, { name: "Chat", url: "/chat" }]} />
    );
    const script = container.querySelector("script[type='application/ld+json']")!;
    const parsed = JSON.parse(script.innerHTML);
    expect(parsed["@type"]).toBe("BreadcrumbList");
    expect(parsed.itemListElement).toHaveLength(2);
  });
});
