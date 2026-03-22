import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PageTitle from "./PageTitle";
import "@testing-library/jest-dom";

describe("PageTitle Component", () => {
  it("should render the title text correctly", () => {
    const testTitle = "Dashboard Overview";
    render(<PageTitle>{testTitle}</PageTitle>);

    const titleElement = screen.getByRole("heading", { level: 1 });

    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent(testTitle);
  });

  it("should have the correct CSS class", () => {
    render(<PageTitle>Test Title</PageTitle>);

    const titleElement = screen.getByRole("heading", { level: 1 });
    expect(titleElement.className).toMatch(/title/);
  });
});
