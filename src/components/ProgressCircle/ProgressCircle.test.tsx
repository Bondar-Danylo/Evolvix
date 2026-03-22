import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProgressCircle from "./ProgressCircle";
import "@testing-library/jest-dom";

describe("ProgressCircle Component", () => {
  it("should render an SVG with the correct size", () => {
    const size = 50;
    const { container } = render(<ProgressCircle value={50} size={size} />);

    const svg = container.querySelector("svg");
    const wrapper = container.firstChild as HTMLElement;

    expect(svg).toHaveAttribute("width", size.toString());
    expect(svg).toHaveAttribute("height", size.toString());
    expect(wrapper.style.width).toBe(`${size}px`);
  });

  it("should calculate the correct circumference and offset for 50% progress", () => {
    const size = 100;
    const strokeWidth = 10;
    const value = 50;
    const { container } = render(
      <ProgressCircle value={value} size={size} strokeWidth={strokeWidth} />,
    );
    const progressCircle = container.querySelectorAll("circle")[1];
    const circumference = parseFloat(
      progressCircle.getAttribute("stroke-dasharray") || "0",
    );
    const offset = parseFloat(
      progressCircle.getAttribute("stroke-dashoffset") || "0",
    );

    expect(circumference).toBeCloseTo(282.74, 1);
    expect(offset).toBeCloseTo(141.37, 1);
  });

  it("should have zero offset when progress is 100%", () => {
    const { container } = render(<ProgressCircle value={100} />);
    const progressCircle = container.querySelectorAll("circle")[1];
    const offset = parseFloat(
      progressCircle.getAttribute("stroke-dashoffset") || "1",
    );
    expect(offset).toBe(0);
  });

  it("should have offset equal to circumference when progress is 0%", () => {
    const { container } = render(<ProgressCircle value={0} />);
    const progressCircle = container.querySelectorAll("circle")[1];
    const circumference = progressCircle.getAttribute("stroke-dasharray");
    const offset = progressCircle.getAttribute("stroke-dashoffset");

    expect(offset).toBe(circumference);
  });

  it("should apply rotate transformation to start from the top", () => {
    const size = 32;
    const { container } = render(<ProgressCircle value={25} size={size} />);
    const progressCircle = container.querySelectorAll("circle")[1];

    expect(progressCircle).toHaveAttribute("transform", "rotate(-90 16 16)");
  });
});
