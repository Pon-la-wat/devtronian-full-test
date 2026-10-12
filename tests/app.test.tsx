import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { App } from "../src/App";

it("renders the starter heading", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: "App" })).toBeTruthy();
});
