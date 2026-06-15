import { it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RoomInfoPanel } from "./RoomInfoPanel";
import { RelatedRooms } from "./RelatedRooms";
import { FAQBlock } from "./FAQBlock";
import { SEOTextBlock } from "./SEOTextBlock";
import { VoteButton } from "./VoteButton";
import { RoomHero } from "./RoomHero";
import { getPlace } from "@/data";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

global.fetch = vi.fn().mockResolvedValue({ ok: false } as Response);

it("info panel shows channel and activity", () => {
  render(<RoomInfoPanel place={getPlace("madrid")!} />);
  expect(screen.getByText(/#madrid/)).toBeInTheDocument();
  expect(screen.getByText(/Alta/)).toBeInTheDocument();
});
it("related rooms link to chat pages", () => {
  render(<RelatedRooms slugs={["barcelona", "valencia"]} />);
  expect(screen.getByRole("link", { name: /Barcelona/ })).toHaveAttribute("href", "/chat/barcelona");
});
it("FAQBlock renders all questions and answers", () => {
  const items = [
    { q: "¿Es gratis?", a: "Sí, totalmente gratis." },
    { q: "¿Necesito registro?", a: "No, sin registro." },
  ];
  render(<FAQBlock items={items} />);
  expect(screen.getByText("¿Es gratis?")).toBeInTheDocument();
  expect(screen.getByText("Sí, totalmente gratis.")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /Preguntas frecuentes/i })).toBeInTheDocument();
});
it("SEOTextBlock renders title and children", () => {
  render(<SEOTextBlock title="Sobre el chat"><p>Texto SEO de prueba.</p></SEOTextBlock>);
  expect(screen.getByRole("heading", { name: "Sobre el chat" })).toBeInTheDocument();
  expect(screen.getByText("Texto SEO de prueba.")).toBeInTheDocument();
});
it("VoteButton renders vote count and a button", () => {
  render(<VoteButton slug="madrid" votes={42} />);
  expect(screen.getByRole("button")).toBeInTheDocument();
  expect(screen.getByText("42")).toBeInTheDocument();
});
it("VoteButton button is not disabled initially", () => {
  render(<VoteButton slug="test-room" votes={0} />);
  const btn = screen.getByRole("button");
  expect(btn).not.toBeDisabled();
});
it("RoomHero renders h1 with room name and a NickInput", () => {
  const place = getPlace("madrid")!;
  render(<RoomHero place={place} />);
  expect(screen.getByRole("heading", { level: 1, name: /Madrid/i })).toBeInTheDocument();
  expect(screen.getByRole("textbox")).toBeInTheDocument();
});
