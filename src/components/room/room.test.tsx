import { it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RoomInfoPanel } from "./RoomInfoPanel";
import { RelatedRooms } from "./RelatedRooms";
import { FAQBlock } from "./FAQBlock";
import { SEOTextBlock } from "./SEOTextBlock";
import { getPlace } from "@/data";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

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
