import { it, expect } from "vitest";
import { render } from "@testing-library/react";
import { WebchatFrame } from "./WebchatFrame";

it("builds an iframe src with nick, channels and show_password_box=false", () => {
  const { container } = render(<WebchatFrame canal="madrid" clientId="testclient" />);
  const iframe = container.querySelector("iframe")!;
  const src = iframe.getAttribute("src")!;
  expect(src).toContain("clientId=testclient");
  expect(src).toContain("channel=#madrid,#espana,#amistad,#chatzona");
  expect(src).toMatch(/nick=Invitado-\d{4}/);
  expect(src).toContain("show_password_box=false");
});
it("falls back for an unknown canal", () => {
  const { container } = render(<WebchatFrame canal="zzz" clientId="c" />);
  const src = container.querySelector("iframe")!.getAttribute("src")!;
  expect(src).toContain("channel=#zzz,#amistad,#chatzona");
});
it("uses provided nick instead of generated one", () => {
  const { container } = render(<WebchatFrame canal="madrid" clientId="c" nick="TestNick" />);
  const src = container.querySelector("iframe")!.getAttribute("src")!;
  expect(src).toContain("nick=TestNick");
});
it("iframe has correct title attribute", () => {
  const { container } = render(<WebchatFrame canal="madrid" clientId="c" />);
  expect(container.querySelector("iframe")!.getAttribute("title")).toBe("Chat de madrid");
});
