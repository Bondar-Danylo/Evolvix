import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import InfoCard from "./InfoCard";
import "@testing-library/jest-dom";
import type { InfoItem } from "./IInfoCardProps.types";

vi.mock("@/assets/arrow_icon.svg?react", () => ({
  default: () => <div data-testid="arrow-icon" />,
}));

describe("InfoCard Component", () => {
  const mockOnItemClick = vi.fn();

  const mockData: InfoItem[] = [
    { id: 1, title: "Active Training" },
    { id: 0, title: "No Data Found" },
    { id: "3", title: "User Profile" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render correctly with title (children) and data", () => {
    render(
      <InfoCard data={mockData} onItemClick={mockOnItemClick}>
        Recent Activities
      </InfoCard>,
    );

    expect(screen.getByText("Recent Activities")).toBeInTheDocument();
    expect(screen.getByText("Active Training")).toBeInTheDocument();
    expect(screen.getByText("No Data Found")).toBeInTheDocument();
  });

  it("should display ArrowIcon only for non-placeholder items", () => {
    render(
      <InfoCard data={mockData} onItemClick={mockOnItemClick}>
        Title
      </InfoCard>,
    );

    const arrows = screen.getAllByTestId("arrow-icon");

    expect(arrows).toHaveLength(2);
  });

  it("should apply disabled class for placeholder items (id: 0)", () => {
    const { container } = render(
      <InfoCard data={mockData} onItemClick={mockOnItemClick}>
        Title
      </InfoCard>,
    );

    const listItems = container.querySelectorAll("li");

    expect(listItems[1].className).toMatch(/item_disabled/);
    expect(listItems[0].className).not.toMatch(/item_disabled/);
  });

  it("should call onItemClick when a valid item is clicked", () => {
    render(
      <InfoCard data={mockData} onItemClick={mockOnItemClick}>
        Title
      </InfoCard>,
    );

    const activeItem = screen.getByText("Active Training");
    fireEvent.click(activeItem);

    expect(mockOnItemClick).toHaveBeenCalledTimes(1);
    expect(mockOnItemClick).toHaveBeenCalledWith(mockData[0]);
  });

  it("should NOT call onItemClick when a placeholder item is clicked", () => {
    render(
      <InfoCard data={mockData} onItemClick={mockOnItemClick}>
        Title
      </InfoCard>,
    );

    const placeholderItem = screen.getByText("No Data Found");
    fireEvent.click(placeholderItem);

    expect(mockOnItemClick).not.toHaveBeenCalled();
  });

  it("should handle id as string '0' for placeholders", () => {
    const stringPlaceholder: InfoItem[] = [{ id: "0", title: "String Zero" }];
    const { container } = render(
      <InfoCard data={stringPlaceholder} onItemClick={mockOnItemClick}>
        Title
      </InfoCard>,
    );

    const listItem = container.querySelector("li");
    expect(listItem?.className).toMatch(/item_disabled/);
    expect(screen.queryByTestId("arrow-icon")).not.toBeInTheDocument();
  });
});
