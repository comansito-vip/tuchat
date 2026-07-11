import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RoomCard } from "./RoomCard";
import { getPlace } from "@/data";

it("RoomCard shows name, users and an entrar link to the room page", () => {
  render(<RoomCard place={getPlace("madrid")!} />);
  expect(screen.getByText("Madrid")).toBeInTheDocument();
  expect(screen.getByText(/842/)).toBeInTheDocument();
  const link = screen.getByRole("link", { name: /entrar/i });
  expect(link).toHaveAttribute("href", "/chat/madrid");
});
