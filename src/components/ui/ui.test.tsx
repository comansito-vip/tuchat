import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { NickInput } from "./NickInput";
import { EnterButton } from "./EnterButton";
import { Flag, emojiToCountryCode } from "./Flag";
import { Card } from "./Card";
import { SectionTitle } from "./SectionTitle";
import { SearchInput } from "./SearchInput";
import { saveNick } from "@/lib/nick-storage";
import { RegionGroupedGrid } from "./RegionGroupedGrid";
import type { Place } from "@/data";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: mockPush }) }));
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [k: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

describe("ui primitives", () => {
  beforeEach(() => {
    localStorage.clear();
  });

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
  it("NickInput falls back to a unique Invitado-NNNN when nick is empty", () => {
    mockPush.mockClear();
    render(<NickInput canal="barcelona" />);
    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));
    // Nick único, no "Invitado" a secas: ese ya está cogido en el IRC y el
    // widget rebota al formulario de login.
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringMatching(/^\/webchat\?canal=barcelona&nick=Invitado-\d{4}$/),
    );
  });
  it("NickInput navigates on Enter key press", () => {
    mockPush.mockClear();
    render(<NickInput canal="amor" />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "MiNick" } });
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    expect(mockPush).toHaveBeenCalledWith("/webchat?canal=amor&nick=MiNick");
  });
});

describe("EnterButton", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("links to /webchat without a nick param when none is saved", () => {
    render(<EnterButton canal="madrid">Entrar</EnterButton>);
    expect(screen.getByRole("link", { name: "Entrar" })).toHaveAttribute(
      "href",
      "/webchat?canal=madrid",
    );
  });
  it("appends the nick saved from any NickInput on the page", () => {
    saveNick("Pepito");
    render(<EnterButton canal="madrid">Entrar</EnterButton>);
    expect(screen.getByRole("link", { name: "Entrar" })).toHaveAttribute(
      "href",
      "/webchat?canal=madrid&nick=Pepito",
    );
  });
  it("ignores a saved nick that is only whitespace", () => {
    saveNick("   ");
    render(<EnterButton canal="madrid">Entrar</EnterButton>);
    expect(screen.getByRole("link", { name: "Entrar" })).toHaveAttribute(
      "href",
      "/webchat?canal=madrid",
    );
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
  it("Flag prefers flagSrc over the emoji for regional flags", () => {
    render(<Flag emoji="🪭" flagSrc="/flags/regiones/andalucia.png" name="Andalucía" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", expect.stringContaining("andalucia.png"));
    expect(img).toHaveAttribute("alt", "Bandera de Andalucía");
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
    // role="combobox" (no "textbox"): permite anunciar las sugerencias en vivo.
    expect(screen.getByRole("combobox", { name: /Buscar/i })).toBeInTheDocument();
  });
  it("form has role=search landmark", () => {
    render(<SearchInput />);
    expect(screen.getByRole("search")).toBeInTheDocument();
  });
  it("submitting with no matching room falls back to /chat?q=<query>", () => {
    mockPush.mockClear();
    render(<SearchInput />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Madrid" } });
    fireEvent.submit(screen.getByRole("button", { name: /Buscar/i }).closest("form")!);
    expect(mockPush).toHaveBeenCalledWith("/chat?q=Madrid");
  });
  it("shows live suggestions from the search index and submitting goes to the top match", async () => {
    mockPush.mockClear();
    // El catálogo no viaja por prop: se descarga de /api/search-index al enfocar.
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        json: async () => [
          { s: "madrid", n: "Madrid", i: "🇪🇸", fn: "España", u: 842 },
          { s: "barcelona", n: "Barcelona", i: "🇪🇸", fn: "España", u: 710 },
        ],
      })),
    );
    render(<SearchInput />);
    fireEvent.focus(screen.getByRole("combobox"));
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Madrid" } });

    // La sugerencia es un role="option", no un <a>: un option con un elemento
    // interactivo dentro rompe el contrato del patrón combobox. Se navega con
    // router.push, igual por teclado que por ratón.
    const option = await screen.findByRole("option", { name: /Madrid/i });
    expect(option.querySelector("a")).toBeNull();

    fireEvent.click(option);
    expect(mockPush).toHaveBeenCalledWith("/chat/madrid");

    mockPush.mockClear();
    fireEvent.submit(screen.getByRole("button", { name: /Buscar/i }).closest("form")!);
    expect(mockPush).toHaveBeenCalledWith("/chat/madrid");
    vi.unstubAllGlobals();
  });
});

describe("RegionGroupedGrid", () => {
  const ciudad = (slug: string, regionSlug?: string): Place => ({
    slug, name: slug, kind: "ciudad", icon: "🏙️", users: 10, votes: 10,
    activity: "Baja", channels: ["chatzona"], related: [], intro: "x",
    ...(regionSlug ? { regionSlug } : {}),
  });

  it("funde en un solo grupo las regiones sin sala", () => {
    // jalisco tiene sala; michoacan y nayarit no, y sin fundirlos darían dos
    // secciones tituladas ambas "Otras ciudades".
    render(
      <RegionGroupedGrid
        cities={[
          ciudad("guadalajara", "jalisco"),
          ciudad("morelia", "michoacan"),
          ciudad("tepic", "nayarit"),
          ciudad("suelta"),
        ]}
      />
    );
    expect(screen.getAllByText("Otras ciudades")).toHaveLength(1);
  });

  it("deja «Otras ciudades» al final aunque sea el grupo más grande", () => {
    render(
      <RegionGroupedGrid
        cities={[
          ciudad("guadalajara", "jalisco"),
          ciudad("morelia", "michoacan"),
          ciudad("tepic", "nayarit"),
          ciudad("colima-ciudad", "colima"),
        ]}
      />
    );
    const titulos = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(titulos[titulos.length - 1]).toContain("Otras ciudades");
  });

  it("subdivide por provincia el cajón de sobras cuando es grande", () => {
    // En México caen ahí 228 de 292 ciudades: en una lista plana con "ver más"
    // se navega peor que en el agrupado por provincia que tenían antes.
    const sobras = Array.from({ length: 40 }, (_, i) => ({
      ...ciudad(`pueblo-${i}`, "michoacan"),
      provincia: i < 20 ? "Michoacán" : "Nayarit",
    }));
    render(<RegionGroupedGrid cities={[ciudad("guadalajara", "jalisco"), ...sobras]} />);
    expect(screen.getByText("Michoacán")).toBeDefined();
    expect(screen.getByText("Nayarit")).toBeDefined();
  });
});
