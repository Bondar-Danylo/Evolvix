import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TablePageLayout } from "./TablePageLayout";
import "@testing-library/jest-dom";

vi.mock("@/hooks/useTableSearch", () => ({
  useTableSearch: vi.fn((data) => ({
    searchQuery: "",
    setSearchQuery: vi.fn(),
    filteredData: data,
  })),
}));

vi.mock("@/hooks/useTableNavigation", () => ({
  useTableNavigation: vi.fn(() => ({
    focusedIndex: -1,
    setFocusedIndex: vi.fn(),
  })),
}));

vi.mock("@/components/Search/Search", () => ({
  default: ({ value, onChange }: any) => (
    <input
      data-testid="search-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

vi.mock("@/components/Dropdown/Dropdown", () => ({
  default: ({ options, value, onChange }: any) => (
    <select
      data-testid="dropdown"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All</option>
      {options.map((opt: string) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  ),
}));

describe("TablePageLayout Component", () => {
  const mockData = [
    { id: 1, name: "Item A", category: "IT" },
    { id: 2, name: "Item B", category: "HR" },
  ];

  const mockColumns = [
    { key: "name", header: "Name" },
    { key: "category", header: "Category" },
  ];

  const defaultProps = {
    data: mockData,
    columns: mockColumns as any,
    searchKeys: ["name"] as any,
    dropdownOptions: ["IT", "HR"],
    addButtonText: "Add New",
    onAddClick: vi.fn(),
    onRowClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render search, dropdown and table", () => {
    render(<TablePageLayout {...defaultProps} />);

    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("dropdown")).toBeInTheDocument();
    expect(screen.getByText("Add New")).toBeInTheDocument();
  });

  it("should filter data based on dropdown selection", () => {
    render(<TablePageLayout {...defaultProps} />);

    const dropdown = screen.getByTestId("dropdown");
    fireEvent.change(dropdown, { target: { value: "IT" } });

    expect(screen.getByText("Item A")).toBeInTheDocument();
    expect(screen.queryByText("Item B")).not.toBeInTheDocument();
  });

  it("should show 'No results found' when data is empty", () => {
    render(<TablePageLayout {...defaultProps} data={[]} />);
    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("should call onAddClick when add button is clicked", () => {
    render(<TablePageLayout {...defaultProps} />);
    fireEvent.click(screen.getByText("Add New"));
    expect(defaultProps.onAddClick).toHaveBeenCalledTimes(1);
  });

  it("should hide add button when editable prop is true", () => {
    render(<TablePageLayout {...defaultProps} editable={true} />);
    expect(screen.queryByText("Add New")).not.toBeInTheDocument();
  });

  it("should handle row clicks", () => {
    render(<TablePageLayout {...defaultProps} />);

    fireEvent.click(screen.getByText("Item A"));
    expect(defaultProps.onRowClick).toHaveBeenCalledWith(mockData[0]);
  });
});
