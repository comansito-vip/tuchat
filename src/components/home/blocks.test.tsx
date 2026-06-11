import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RankingTable } from "./RankingTable";
import { CityList } from "./CityList";

it("RankingTable lists rows", () => {
  render(<RankingTable />);
  expect(screen.getAllByRole("row").length).toBeGreaterThan(1);
});
it("CityList links Madrid to /chat/madrid", () => {
  render(<CityList />);
  expect(screen.getByRole("link", { name: "Madrid" })).toHaveAttribute("href", "/chat/madrid");
});
