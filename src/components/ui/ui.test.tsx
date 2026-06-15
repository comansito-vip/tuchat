import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { NickInput } from "./NickInput";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

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
