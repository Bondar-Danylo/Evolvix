import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import ChartCard from "./ChartCard";
import "@testing-library/jest-dom";

vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
}));

vi.mock("../ChartLine/ChartLine", () => ({
  default: () => <div data-testid="chart-line">Line Chart</div>,
}));

vi.mock("../ChartPie/ChartPie", () => ({
  default: () => <div data-testid="chart-pie">Pie Chart</div>,
}));

describe("ChartCard Component", () => {
  const mockData = [{ date: "2024-01-01", percent: 50 }];
  const mockOnPeriodChange = vi.fn();

  it("should render correctly with title and options", () => {
    render(
      <ChartCard data={mockData} type="line" currentPeriod={7}>
        Analytics Title
      </ChartCard>,
    );

    expect(screen.getByText("Analytics Title")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveValue("7");
    expect(screen.getByText("7 days")).toBeInTheDocument();
  });

  it("should render ChartLine when type is 'line'", () => {
    render(<ChartCard data={mockData} type="line" />);
    expect(screen.getByTestId("chart-line")).toBeInTheDocument();
    expect(screen.queryByTestId("chart-pie")).not.toBeInTheDocument();
  });

  it("should render ChartPie when type is 'pie'", () => {
    render(<ChartCard data={mockData} type="pie" />);
    expect(screen.getByTestId("chart-pie")).toBeInTheDocument();
    expect(screen.queryByTestId("chart-line")).not.toBeInTheDocument();
  });

  it("should call onPeriodChange when select value changes", () => {
    render(
      <ChartCard
        data={mockData}
        type="line"
        onPeriodChange={mockOnPeriodChange}
      />,
    );

    const select = screen.getByRole("combobox");

    fireEvent.change(select, { target: { value: "30" } });

    expect(mockOnPeriodChange).toHaveBeenCalledWith(30);
    expect(mockOnPeriodChange).toHaveBeenCalledTimes(1);
  });

  it("should display the correct initial currentPeriod", () => {
    render(<ChartCard data={mockData} type="line" currentPeriod={14} />);
    expect(screen.getByRole("combobox")).toHaveValue("14");
  });
});
