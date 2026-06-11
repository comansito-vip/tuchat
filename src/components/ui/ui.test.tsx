import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";
import { Badge } from "./Badge";

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
});
