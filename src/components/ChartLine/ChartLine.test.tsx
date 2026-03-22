import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import ChartLine from "./ChartLine";
import "@testing-library/jest-dom";

vi.mock("recharts", () => {
  return {
    ResponsiveContainer: ({ children }: any) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    LineChart: ({ children, data }: any) => (
      <div data-testid="line-chart" data-data={JSON.stringify(data)}>
        {children}
      </div>
    ),
    Line: ({ dataKey }: any) => (
      <div data-testid="chart-line-element" data-key={dataKey} />
    ),
    XAxis: ({ dataKey }: any) => (
      <div data-testid="x-axis" data-key={dataKey} />
    ),
    YAxis: ({ domain }: any) => (
      <div data-testid="y-axis" data-domain={JSON.stringify(domain)} />
    ),
    CartesianGrid: ({ strokeDasharray }: any) => (
      <div data-testid="cartesian-grid" data-stroke={strokeDasharray} />
    ),
    Tooltip: () => <div data-testid="tooltip" />,
  };
});

describe("ChartLine Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null if data is empty", () => {
    const { container } = render(<ChartLine data={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("should return null if data is undefined", () => {
    // @ts-ignore
    const { container } = render(<ChartLine data={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render LineChart with correct data", () => {
    const mockData = [{ date: "2024-01-01", percent: 75 }];
    render(<ChartLine data={mockData} />);

    const chart = screen.getByTestId("line-chart");
    expect(chart).toBeInTheDocument();

    const passedData = JSON.parse(chart.getAttribute("data-data") || "[]");
    expect(passedData).toEqual(mockData);
  });

  it("should dynamically identify keys for XAxis and Line", () => {
    const customData = [{ timestamp: "12:00", value: 100 }] as any;
    render(<ChartLine data={customData} />);

    const xAxis = screen.getByTestId("x-axis");
    expect(xAxis.getAttribute("data-key")).toBe("timestamp");

    const line = screen.getByTestId("chart-line-element");
    expect(line.getAttribute("data-key")).toBe("value");
  });

  it("should render all chart sub-components (Grid, YAxis, Tooltip)", () => {
    const mockData = [{ date: "2024-01-01", percent: 50 }];
    render(<ChartLine data={mockData} />);

    expect(screen.getByTestId("cartesian-grid")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();

    const yAxis = screen.getByTestId("y-axis");
    expect(yAxis).toBeInTheDocument();

    expect(yAxis.getAttribute("data-domain")).toBe("[0,100]");
  });

  it("should apply correct styles to the Line element", () => {
    const mockData = [{ date: "2024-01-01", percent: 50 }];
    render(<ChartLine data={mockData} />);

    const line = screen.getByTestId("chart-line-element");
    expect(line).toBeInTheDocument();
    expect(line.getAttribute("data-key")).toBe("percent");
  });
});
