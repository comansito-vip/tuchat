import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";
import { Breadcrumbs } from "./Breadcrumbs";

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
});
