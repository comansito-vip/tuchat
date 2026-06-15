import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RankingTable } from "./RankingTable";
import { CityList } from "./CityList";
import { NewsGrid } from "./NewsGrid";

it("RankingTable lists rows", () => {
  render(<RankingTable />);
  expect(screen.getAllByRole("row").length).toBeGreaterThan(1);
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
