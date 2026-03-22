import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { TableActions } from "./TableActions";
import "@testing-library/jest-dom";

vi.mock("@/components/TableAction/TableActions.module.scss", () => ({
  default: new Proxy({}, { get: (_, prop) => prop.toString() }),
}));

describe("TableActions Component", () => {
  const mockHandlers = {
    onView: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render all action buttons with correct titles", () => {
    render(<TableActions {...mockHandlers} />);

    expect(screen.getByTitle("View")).toBeInTheDocument();
    expect(screen.getByTitle("Edit")).toBeInTheDocument();
    expect(screen.getByTitle("Delete")).toBeInTheDocument();
  });

  it("should call respective handlers when buttons are clicked", () => {
    render(<TableActions {...mockHandlers} />);

    fireEvent.click(screen.getByTitle("View"));
    expect(mockHandlers.onView).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTitle("Edit"));
    expect(mockHandlers.onEdit).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTitle("Delete"));
    expect(mockHandlers.onDelete).toHaveBeenCalledTimes(1);
  });

  it("should stop event propagation when clicked", () => {
    const parentClick = vi.fn();

    render(
      <div onClick={parentClick}>
        <TableActions {...mockHandlers} />
      </div>,
    );

    const actionsWrapper = screen.getByTitle("View").parentElement;
    if (actionsWrapper) fireEvent.click(actionsWrapper);

    expect(parentClick).not.toHaveBeenCalled();
  });

  it("should handle missing handlers gracefully", () => {
    render(<TableActions />);

    const viewBtn = screen.getByTitle("View");

    expect(() => fireEvent.click(viewBtn)).not.toThrow();
  });
});
