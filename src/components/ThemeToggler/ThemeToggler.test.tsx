import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ThemeToggler from "./ThemeToggler";
import "@testing-library/jest-dom";

vi.mock("./ThemeToggler.module.scss", () => ({
  default: {
    toggler: "toggler",
    toggler__dark: "toggler__dark",
    toggler__light: "toggler__light",
    toggler__circle: "toggler__circle",
    toggler__icon: "toggler__icon",
  },
}));

describe("ThemeToggler Component", () => {
  it("should render with dark theme by default", () => {
    render(<ThemeToggler />);

    const button = screen.getByRole("button");
    const icon = screen.getByAltText("Theme Icon");

    expect(button.className).toContain("toggler__dark");
    expect(icon).toHaveAttribute("src", expect.stringContaining("moon_icon"));
  });

  it("should toggle theme and icon on click", () => {
    render(<ThemeToggler />);

    const button = screen.getByRole("button");
    const icon = screen.getByAltText("Theme Icon");

    fireEvent.click(button);
    expect(button.className).toContain("toggler__light");
    expect(icon).toHaveAttribute("src", expect.stringContaining("sun_icon"));

    fireEvent.click(button);
    expect(button.className).toContain("toggler__dark");
    expect(icon).toHaveAttribute("src", expect.stringContaining("moon_icon"));
  });

  it("should apply correct classes to the inner circle", () => {
    const { container } = render(<ThemeToggler />);
    const circle = container.querySelector('div[class*="toggler__circle"]');

    expect(circle?.className).toContain("toggler__light");

    fireEvent.click(screen.getByRole("button"));
    expect(circle?.className).toContain("toggler__dark");
  });
});
