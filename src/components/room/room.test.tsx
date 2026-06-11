import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RoomInfoPanel } from "./RoomInfoPanel";
import { RelatedRooms } from "./RelatedRooms";
import { getPlace } from "@/data";

it("info panel shows channel and activity", () => {
  render(<RoomInfoPanel place={getPlace("madrid")!} />);
  expect(screen.getByText(/#madrid/)).toBeInTheDocument();
  expect(screen.getByText(/Alta/)).toBeInTheDocument();
});
it("related rooms link to chat pages", () => {
  render(<RelatedRooms slugs={["barcelona", "valencia"]} />);
  expect(screen.getByRole("link", { name: /Barcelona/ })).toHaveAttribute("href", "/chat/barcelona");
});
