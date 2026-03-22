import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import SmallPopup from "./SmallPopup";
import "@testing-library/jest-dom";

describe("SmallPopup Component", () => {
  const mockClose = vi.fn();
  const mockConfirm = vi.fn();
  const defaultProps = {
    icon: "warning-icon.svg",
    title: "Delete Employee",
    subtitle: "Are you sure?",
    text: "This action cannot be undone.",
    closePopup: mockClose,
    onConfirm: mockConfirm,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render all provided texts and icons", () => {
    render(<SmallPopup {...defaultProps} />);

    expect(screen.getByText("Delete Employee")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(
      screen.getByText("This action cannot be undone."),
    ).toBeInTheDocument();

    expect(screen.getByAltText("Popup Icon")).toHaveAttribute(
      "src",
      "warning-icon.svg",
    );
    expect(screen.getByAltText("Close Icon")).toBeInTheDocument();
  });

  it("should call closePopup when Cancel button is clicked", () => {
    render(<SmallPopup {...defaultProps} />);

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancelBtn);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("should call onConfirm when Confirm button is clicked", () => {
    render(<SmallPopup {...defaultProps} />);

    const confirmBtn = screen.getByRole("button", { name: /confirm/i });
    fireEvent.click(confirmBtn);

    expect(mockConfirm).toHaveBeenCalledTimes(1);
  });

  it("should call closePopup when clicking on the overlay (wrapper)", () => {
    const { container } = render(<SmallPopup {...defaultProps} />);

    const overlay = container.firstChild as HTMLElement;
    fireEvent.click(overlay);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("should NOT call closePopup when clicking inside the popup (stopPropagation)", () => {
    render(<SmallPopup {...defaultProps} />);

    const title = screen.getByText("Delete Employee");
    fireEvent.click(title);

    expect(mockClose).not.toHaveBeenCalled();
  });

  it("should call closePopup when clicking the close icon", () => {
    render(<SmallPopup {...defaultProps} />);

    const closeIcon = screen.getByAltText("Close Icon");
    fireEvent.click(closeIcon);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("should not render text paragraph if text prop is missing", () => {
    const { text, ...propsWithoutText } = defaultProps;
    render(<SmallPopup {...propsWithoutText} />);

    expect(
      screen.queryByText("This action cannot be undone."),
    ).not.toBeInTheDocument();
  });
});
