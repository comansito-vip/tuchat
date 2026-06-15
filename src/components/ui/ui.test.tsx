import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { NickInput } from "./NickInput";
import { Flag, emojiToCountryCode } from "./Flag";
import { Card } from "./Card";
import { SectionTitle } from "./SectionTitle";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [k: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

describe("ui primitives", () => {
  it("renders a primary button with its label", () => {
    render(<Button>Entrar al chat</Button>);
    expect(screen.getByText("Entrar al chat")).toBeInTheDocument();
  });
  it("renders a button as a link when href is given", () => {
    render(<Button href="/webchat">Entrar</Button>);
    expect(screen.getByRole("link", { name: "Entrar" })).toHaveAttribute("href", "/webchat");
  });
  it("renders a tag badge", () => {
    render(<Badge tag="Popular" />);
    expect(screen.getByText("Popular")).toBeInTheDocument();
  });
  it("NickInput renders with placeholder and Entrar button", () => {
    render(<NickInput canal="madrid" placeholder="Tu nick aquí..." />);
    expect(screen.getByPlaceholderText("Tu nick aquí...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Entrar/i })).toBeInTheDocument();
  });
  it("NickInput input has maxLength 20", () => {
    render(<NickInput canal="espana" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("maxLength", "20");
  });
});

describe("Flag", () => {
  it("emojiToCountryCode converts 🇪🇸 to 'es'", () => {
    expect(emojiToCountryCode("🇪🇸")).toBe("es");
  });
  it("emojiToCountryCode converts 🇲🇽 to 'mx'", () => {
    expect(emojiToCountryCode("🇲🇽")).toBe("mx");
  });
  it("emojiToCountryCode returns null for non-flag emoji", () => {
    expect(emojiToCountryCode("💬")).toBeNull();
    expect(emojiToCountryCode("")).toBeNull();
  });
  it("Flag renders an img with flagcdn src for flag emoji", () => {
    render(<Flag emoji="🇪🇸" name="España" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", expect.stringContaining("flagcdn.com"));
    expect(img).toHaveAttribute("alt", "Bandera de España");
  });
  it("Flag renders a span fallback for non-flag emoji", () => {
    const { container } = render(<Flag emoji="💬" />);
    expect(container.querySelector("span")).toBeInTheDocument();
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });
});

describe("Card and SectionTitle", () => {
  it("Card renders children inside a div", () => {
    render(<Card>Contenido</Card>);
    expect(screen.getByText("Contenido")).toBeInTheDocument();
  });
  it("SectionTitle renders heading and optional CTA link", () => {
    render(<SectionTitle href="/noticias" cta="Ver noticias">Tendencias</SectionTitle>);
    expect(screen.getByRole("heading", { name: "Tendencias" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Ver noticias/ })).toHaveAttribute("href", "/noticias");
  });
  it("SectionTitle renders eyebrow and description", () => {
    render(<SectionTitle eyebrow="EN VIVO" description="Última hora">Noticias</SectionTitle>);
    expect(screen.getByText("EN VIVO")).toBeInTheDocument();
    expect(screen.getByText("Última hora")).toBeInTheDocument();
  });
});
