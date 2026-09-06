import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RoomCard } from "./RoomCard";
import { getPlace } from "@/data";
import { conectados, miles } from "@/lib/irc-muestra";

it("RoomCard shows name, real channel count and an entrar link to the room page", () => {
  const madrid = getPlace("madrid")!;
  render(<RoomCard place={madrid} />);
  expect(screen.getByText("Madrid")).toBeInTheDocument();
  // La cifra es la de la muestra IRC (#madrid), no el campo `users` de la ficha.
  const gente = conectados(madrid);
  expect(gente).not.toBeNull();
  expect(screen.getByText(new RegExp(`${miles(gente!)} en el canal (a las|el \\d+ \\w+ a las) \\d{2}:\\d{2}`))).toBeInTheDocument();
  const link = screen.getByRole("link", { name: /entrar/i });
  expect(link).toHaveAttribute("href", "/chat/madrid");
});
