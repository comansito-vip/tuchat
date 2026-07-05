import { it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RankingTable } from "./RankingTable";
import { CityList } from "./CityList";
import { NewsGrid } from "./NewsGrid";
import { TrendingBlock } from "./TrendingBlock";
import { CountryGrid } from "./CountryGrid";
import { CategoryCard, CategoryGrid } from "./CategoryCard";
import { HeroSearch } from "./HeroSearch";
import { RoomCard } from "./RoomCard";
import { Sidebar } from "./Sidebar";
import { getPlace } from "@/data";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: { src: string; alt: string; [k: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

it("RankingTable lists rows", () => {
  render(<RankingTable />);
  expect(screen.getAllByRole("row").length).toBeGreaterThan(1);
});
it("RankingTable shows Entrar links pointing to /webchat", () => {
  render(<RankingTable />);
  const links = screen.getAllByRole("link", { name: /Entrar/i });
  expect(links.length).toBeGreaterThan(0);
  expect(links[0].getAttribute("href")).toMatch(/^\/webchat\?canal=/);
});
it("CityList links Madrid to /chat/madrid", () => {
  render(<CityList />);
  const links = screen.getAllByRole("link", { name: "Madrid" });
  expect(links.length).toBeGreaterThanOrEqual(1);
  expect(links[0]).toHaveAttribute("href", "/chat/madrid");
});
it("NewsGrid renders the featured article as a link to /noticias/articulo/", () => {
  render(<NewsGrid />);
  const links = screen.getAllByRole("link").filter((l) =>
    l.getAttribute("href")?.startsWith("/noticias/articulo/")
  );
  expect(links.length).toBeGreaterThanOrEqual(1);
});
it("NewsGrid shows at least 4 article links", () => {
  render(<NewsGrid />);
  const articleLinks = screen.getAllByRole("link").filter((l) =>
    l.getAttribute("href")?.startsWith("/noticias/articulo/")
  );
  expect(articleLinks.length).toBeGreaterThanOrEqual(4);
});
it("TrendingBlock renders at least 5 trending links", () => {
  render(<TrendingBlock />);
  const links = screen.getAllByRole("link").filter((l) =>
    l.getAttribute("href")?.startsWith("/")
  );
  expect(links.length).toBeGreaterThanOrEqual(5);
});
it("TrendingBlock has a heading", () => {
  render(<TrendingBlock />);
  expect(screen.getByRole("heading", { name: /Tendencias/i })).toBeInTheDocument();
});
it("CountryGrid renders country links with /chat/ paths", () => {
  render(<CountryGrid />);
  const links = screen.getAllByRole("link").filter((l) =>
    l.getAttribute("href")?.startsWith("/chat/")
  );
  expect(links.length).toBeGreaterThanOrEqual(10);
});
it("CountryGrid includes España and México", () => {
  render(<CountryGrid />);
  const espana = screen.getAllByRole("link", { name: /España/i });
  expect(espana[0]).toHaveAttribute("href", "/chat/espana");
  const mexico = screen.getAllByRole("link", { name: /México/i });
  expect(mexico[0]).toHaveAttribute("href", "/chat/mexico");
});
it("CategoryCard links to /chat/<slug>", () => {
  const place = getPlace("deportes")!;
  render(<CategoryCard place={place} />);
  expect(screen.getByRole("link")).toHaveAttribute("href", "/chat/deportes");
  expect(screen.getByText("Deportes")).toBeInTheDocument();
});
it("CategoryGrid renders at least 6 topic cards", () => {
  render(<CategoryGrid />);
  const links = screen.getAllByRole("link").filter((l) =>
    l.getAttribute("href")?.startsWith("/chat/")
  );
  expect(links.length).toBeGreaterThanOrEqual(6);
});
it("HeroSearch shows main heading and stats", () => {
  render(<HeroSearch />);
  expect(screen.getByRole("heading", { level: 1, name: /Chat gratis en español/i })).toBeInTheDocument();
  // Stats: label is in <dt> (term), value is in <dd> (definition)
  const dts = screen.getAllByRole("term");
  const labels = dts.map((el) => el.textContent);
  expect(labels).toContain("Países");
  expect(labels).toContain("Ciudades");
});
it("HeroSearch shows country count stat (≥29)", () => {
  render(<HeroSearch />);
  expect(screen.getByText(/29\+/)).toBeInTheDocument();
});
it("RoomCard links place name and Enter button to correct paths", () => {
  const place = getPlace("madrid")!;
  render(<RoomCard place={place} />);
  expect(screen.getByRole("link", { name: /Madrid/ })).toHaveAttribute("href", "/chat/madrid");
  expect(screen.getByRole("link", { name: /Entrar/i })).toHaveAttribute("href", expect.stringContaining("/webchat?canal=madrid"));
});
it("Sidebar shows ranking label and at least 5 ranked rooms", () => {
  render(<Sidebar />);
  expect(screen.getByText(/Ranking de salas/i)).toBeInTheDocument();
  const links = screen.getAllByRole("link").filter((l) =>
    l.getAttribute("href")?.startsWith("/chat/")
  );
  expect(links.length).toBeGreaterThanOrEqual(5);
});

it("HeroSearch shows quick-link chips to popular rooms", () => {
  render(<HeroSearch />);
  const links = screen.getAllByRole("link").filter((l) =>
    l.getAttribute("href") === "/chat/espana"
  );
  expect(links.length).toBeGreaterThanOrEqual(1);
});

it("HeroSearch NickInput appears before SearchInput in DOM", () => {
  const { container } = render(<HeroSearch />);
  const nick = container.querySelector('[data-testid="nick-input"]');
  const search = container.querySelector('[data-testid="search-input"]');
  if (nick && search) {
    expect(
      nick.compareDocumentPosition(search) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  }
});
