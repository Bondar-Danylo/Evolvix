import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Summary from "./Summary";
import "@testing-library/jest-dom";

vi.mock("@/components/Button/Button", () => ({
  default: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

describe("Summary Component", () => {
  const mockData = {
    successRate: "92%",
    trainingsCount: 45,
    mostActiveDept: "Sales",
    topicsCount: 120,
    targetPercent: 75,
    acceleration: "1.5 times",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render all statistics from data correctly", () => {
    render(<Summary data={mockData} />);

    expect(screen.getByText("92%")).toBeInTheDocument();
    expect(screen.getByText("Quiz Success Rate")).toBeInTheDocument();

    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("Trainings")).toBeInTheDocument();

    expect(screen.getByText("Sales")).toBeInTheDocument();
    expect(screen.getByText("Most Active Dept")).toBeInTheDocument();

    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.getByText("Topics")).toBeInTheDocument();
  });

  it("should render progress bar with correct width", () => {
    const { container } = render(<Summary data={mockData} />);
    const progressBar = container.querySelector('span[class*="progress__bar"]');
    const style = window.getComputedStyle(progressBar as Element);

    expect(style.getPropertyValue("--progress-width")).toBe("75%");
    expect(screen.getByText("75% of Target")).toBeInTheDocument();
  });

  it("should display acceleration text with provided data", () => {
    render(<Summary data={mockData} />);
    expect(screen.getByText(/1.5 times/i)).toBeInTheDocument();
  });

  it("should show default acceleration if data field is missing", () => {
    const partialData = { ...mockData, acceleration: "" };
    render(<Summary data={partialData} />);
    expect(screen.getByText(/1.0 times/i)).toBeInTheDocument();
  });

  it("should handle download report button click", () => {
    const originalEnv = import.meta.env.VITE_API_URL;
    import.meta.env.VITE_API_URL = "http://test-api.com";

    const createElementSpy = vi.spyOn(document, "createElement");
    vi.spyOn(document.body, "appendChild");
    vi.spyOn(document.body, "removeChild");

    render(<Summary data={mockData} />);

    const downloadBtn = screen.getByText(/Download Report/i);
    fireEvent.click(downloadBtn);

    expect(createElementSpy).toHaveBeenCalledWith("a");

    import.meta.env.VITE_API_URL = originalEnv;
    vi.restoreAllMocks();
  });

  it("should render empty list if data is null", () => {
    const { container } = render(<Summary data={null} />);
    const listItems = container.querySelectorAll("li");
    expect(listItems.length).toBe(0);
    expect(screen.getByText("0% of Target")).toBeInTheDocument();
  });
});
