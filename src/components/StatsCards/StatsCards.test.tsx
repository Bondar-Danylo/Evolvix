import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StatsCards from "./StatsCards";
import "@testing-library/jest-dom";

describe("StatsCards Component", () => {
  const mockStats = {
    total: 150,
    onboarding: 12,
    rate: "88%",
    overdue: 5,
  };

  it("should render all four statistics cards with correct values", () => {
    render(<StatsCards stats={mockStats} />);

    expect(screen.getByText("Total Employees")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();

    expect(screen.getByText("In Onboarding")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();

    expect(screen.getByText("Completion Rate")).toBeInTheDocument();
    expect(screen.getByText("88%")).toBeInTheDocument();

    expect(screen.getByText("Overdue Trainings")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should display icons with correct alt text", () => {
    render(<StatsCards stats={mockStats} />);

    expect(screen.getByAltText("Total Employees")).toBeInTheDocument();
    expect(screen.getByAltText("In Onboarding")).toBeInTheDocument();
    expect(screen.getByAltText("Completion Rate")).toBeInTheDocument();
    expect(screen.getByAltText("Overdue Trainings")).toBeInTheDocument();
  });

  it("should apply correct color classes to list items", () => {
    const { container } = render(<StatsCards stats={mockStats} />);
    const listItems = container.querySelectorAll("li");

    expect(listItems[0].className).toMatch(/blue/);
    expect(listItems[1].className).toMatch(/yellow/);
    expect(listItems[2].className).toMatch(/green/);
    expect(listItems[3].className).toMatch(/red/);
  });

  it("should render a list (ul) as the main container", () => {
    render(<StatsCards stats={mockStats} />);
    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
  });
});
