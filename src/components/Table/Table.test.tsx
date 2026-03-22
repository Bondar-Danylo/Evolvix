import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Table } from "./Table";
import "@testing-library/jest-dom";

vi.mock("./Table.module.scss", () => ({
  default: new Proxy(
    {},
    {
      get: (_, prop) => prop,
    },
  ),
}));

describe("Table Component", () => {
  interface TestData {
    id: number;
    name: string;
    role: string;
  }

  const mockData: TestData[] = [
    { id: 1, name: "Alice", role: "Admin" },
    { id: 2, name: "Bob", role: "User" },
  ];

  const mockColumns = [
    { header: "Name", key: "name" as keyof TestData },
    { header: "Role", key: "role" as keyof TestData },
    {
      header: "Action",
      key: "actions" as any,
      render: (_: any, item: TestData) => <button>Edit {item.name}</button>,
    },
  ];

  it("should render headers and data correctly", () => {
    render(<Table data={mockData} columns={mockColumns} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("should use custom render function when provided", () => {
    render(<Table data={mockData} columns={mockColumns} />);

    expect(screen.getByText("Edit Alice")).toBeInTheDocument();
    expect(screen.getByText("Edit Bob")).toBeInTheDocument();
  });

  it("should call onRowClick when a row is clicked", () => {
    const mockOnRowClick = vi.fn();
    render(
      <Table
        data={mockData}
        columns={mockColumns}
        onRowClick={mockOnRowClick}
      />,
    );

    const row = screen.getByText("Alice").closest("tr");
    if (row) fireEvent.click(row);

    expect(mockOnRowClick).toHaveBeenCalledTimes(1);
    expect(mockOnRowClick).toHaveBeenCalledWith(mockData[0]);
  });

  it("should call onRowMouseEnter when hovering over a row", () => {
    const mockOnMouseEnter = vi.fn();
    render(
      <Table
        data={mockData}
        columns={mockColumns}
        onRowMouseEnter={mockOnMouseEnter}
      />,
    );

    const row = screen.getByText("Bob").closest("tr");
    if (row) fireEvent.mouseEnter(row);

    expect(mockOnMouseEnter).toHaveBeenCalledWith(1); // Индекс Боба — 1
  });

  it("should apply focused class to the correct row", () => {
    const { container } = render(
      <Table data={mockData} columns={mockColumns} focusedIndex={0} />,
    );
    const rows = container.querySelectorAll("tbody tr");

    expect(rows[0].className).toContain("focused");
    expect(rows[1].className).not.toContain("focused");
  });

  it("should render empty table when no data is provided", () => {
    render(<Table data={[]} columns={mockColumns} />);

    const rows = document.querySelectorAll("tbody tr");
    expect(rows.length).toBe(0);
  });
});
