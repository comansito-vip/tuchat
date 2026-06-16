import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { NickInput } from "./NickInput";
import { Flag, emojiToCountryCode } from "./Flag";
import { Card } from "./Card";
import { SectionTitle } from "./SectionTitle";
import { SearchInput } from "./SearchInput";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: mockPush }) }));
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
  it("renders all badge variants without error", () => {
    const variants: Array<"Popular" | "Nueva" | "Tendencia" | "HOT" | "NUEVO" | "EN VIVO"> =
      ["Popular", "Nueva", "Tendencia", "HOT", "NUEVO", "EN VIVO"];
    for (const tag of variants) {
      const { unmount } = render(<Badge tag={tag} />);
      expect(screen.getByText(tag)).toBeInTheDocument();
      unmount();
    }
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
  it("NickInput input carries aria-label matching placeholder", () => {
    render(<NickInput canal="madrid" placeholder="Tu nick para Madrid..." />);
    expect(screen.getByRole("textbox", { name: "Tu nick para Madrid..." })).toBeInTheDocument();
  });
  it("NickInput Entrar button has type=button", () => {
    render(<NickInput canal="espana" />);
    expect(screen.getByRole("button", { name: /Entrar/i })).toHaveAttribute("type", "button");
  });
  it("NickInput navigates to /webchat with typed nick on button click", () => {
    mockPush.mockClear();
    render(<NickInput canal="madrid" />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Pepito" } });
    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));
    expect(mockPush).toHaveBeenCalledWith("/webchat?canal=madrid&nick=Pepito");
  });
  it("NickInput falls back to Invitado when nick is empty", () => {
    mockPush.mockClear();
    render(<NickInput canal="barcelona" />);
    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));
    expect(mockPush).toHaveBeenCalledWith("/webchat?canal=barcelona&nick=Invitado");
  });
  it("NickInput navigates on Enter key press", () => {
    mockPush.mockClear();
    render(<NickInput canal="amor" />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "MiNick" } });
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    expect(mockPush).toHaveBeenCalledWith("/webchat?canal=amor&nick=MiNick");
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

describe("SearchInput", () => {
  it("renders a search input with placeholder and submit button", () => {
    render(<SearchInput />);
    expect(screen.getByPlaceholderText(/Buscar ciudad/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Buscar/i })).toBeInTheDocument();
  });
  it("input has aria-label Buscar", () => {
    render(<SearchInput />);
    expect(screen.getByRole("textbox", { name: /Buscar/i })).toBeInTheDocument();
  });
  it("form has role=search landmark", () => {
    render(<SearchInput />);
    expect(screen.getByRole("search")).toBeInTheDocument();
  });
  it("submitting navigates to /chat?q=<query>", () => {
    mockPush.mockClear();
    render(<SearchInput />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Madrid" } });
    fireEvent.submit(screen.getByRole("button", { name: /Buscar/i }).closest("form")!);
    expect(mockPush).toHaveBeenCalledWith("/chat?q=Madrid");
  });
});
