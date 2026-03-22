import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import ChartPie from "./ChartPie";
import "@testing-library/jest-dom";

vi.mock("recharts", () => {
  return {
    PieChart: ({ children }: any) => (
      <div data-testid="pie-chart">{children}</div>
    ),
    Pie: ({ children, data, dataKey, nameKey }: any) => (
      <div
        data-testid="pie-element"
        data-data={JSON.stringify(data)}
        data-datakey={dataKey}
        data-namekey={nameKey}
      >
        {children}
      </div>
    ),
    Cell: ({ fill }: any) => <div data-testid="pie-cell" data-fill={fill} />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: ({ formatter }: any) => {
      const formatted = formatter
        ? formatter("TestValue", { color: "red" })
        : null;
      return <div data-testid="legend">{formatted}</div>;
    },
  };
});

describe("ChartPie Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null if data is empty", () => {
    const { container } = render(<ChartPie data={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render PieChart and Pie with correct data", () => {
    const mockData = [{ department: "IT", percent: 40 }];
    render(<ChartPie data={mockData} />);

    const pie = screen.getByTestId("pie-element");
    expect(pie).toBeInTheDocument();

    const passedData = JSON.parse(pie.getAttribute("data-data") || "[]");
    expect(passedData).toEqual(mockData);
  });

  it("should correctly identify dynamic keys (nameKey and dataKey)", () => {
    const customData = [{ category: "Sales", value: 500 }] as any;
    render(<ChartPie data={customData} />);

    const pie = screen.getByTestId("pie-element");
    expect(pie.getAttribute("data-namekey")).toBe("category");
    expect(pie.getAttribute("data-datakey")).toBe("value");
  });

  it("should render the correct number of Cells with colors from the palette", () => {
    const mockData = [
      { name: "A", val: 10 },
      { name: "B", val: 20 },
      { name: "C", val: 30 },
    ] as any;

    render(<ChartPie data={mockData} />);

    const cells = screen.getAllByTestId("pie-cell");
    expect(cells).toHaveLength(3);
    expect(cells[0].getAttribute("data-fill")).toBe("#001067");
    expect(cells[1].getAttribute("data-fill")).toBe("#2ecc71");
  });

  it("should render Tooltip and Legend", () => {
    const mockData = [{ name: "A", val: 10 }] as any;
    render(<ChartPie data={mockData} />);

    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
    const legend = screen.getByTestId("legend");
    expect(legend).toBeInTheDocument();
    expect(legend.textContent).toBe("TestValue");
  });

  it("should apply colors cyclically if data length exceeds COLORS length", () => {
    const longData = Array(7).fill({ name: "X", val: 1 }) as any;
    render(<ChartPie data={longData} />);

    const cells = screen.getAllByTestId("pie-cell");

    expect(cells[6].getAttribute("data-fill")).toBe(
      cells[0].getAttribute("data-fill"),
    );
  });
});
