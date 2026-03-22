import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import VerticalLogo from "./VerticalLogo";
import "@testing-library/jest-dom";

describe("VerticalLogo Component", () => {
  it("should render the logo image with correct attributes", () => {
    render(<VerticalLogo />);

    const logoImg = screen.getByAltText("Logo");

    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveAttribute("src", "/logo.png");
    expect(logoImg.className).toMatch(/logo__icon/);
  });

  it("should render the brand name text", () => {
    render(<VerticalLogo />);

    const brandName = screen.getByText("Evolvix");

    expect(brandName).toBeInTheDocument();
    expect(brandName.tagName).toBe("P");
    expect(brandName.className).toMatch(/logo__text/);
  });

  it("should have a container with the correct class", () => {
    const { container } = render(<VerticalLogo />);
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper.className).toMatch(/logo/);
  });
});
