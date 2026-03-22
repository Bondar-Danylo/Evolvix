import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ViewNotePopup from "./ViewNotePopup";
import "@testing-library/jest-dom";

vi.mock("../Button/Button", () => ({
  default: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

vi.mock("@/assets/close_icon.svg?react", () => ({
  default: () => <svg data-testid="close-icon" />,
}));

describe("ViewNotePopup Component", () => {
  const mockClose = vi.fn();
  const mockNote = {
    id: 1,
    name: "Complete the monthly report",
    priority: "High",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null if isOpen is false", () => {
    const { container } = render(
      <ViewNotePopup
        isOpen={false}
        onClose={mockClose}
        note={mockNote as any}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("should return null if note is null", () => {
    const { container } = render(
      <ViewNotePopup isOpen={true} onClose={mockClose} note={null} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render note details correctly", () => {
    render(
      <ViewNotePopup
        isOpen={true}
        onClose={mockClose}
        note={mockNote as any}
      />,
    );

    expect(screen.getByText("Note Details")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(screen.getByText("Complete the monthly report")).toBeInTheDocument();
  });

  it("should apply correct priority class based on note priority", () => {
    const { container } = render(
      <ViewNotePopup
        isOpen={true}
        onClose={mockClose}
        note={mockNote as any}
      />,
    );

    const badge = container.querySelector('[class*="priority_high"]');
    expect(badge).toBeInTheDocument();
  });

  it("should call onClose when clicking the close button", () => {
    render(
      <ViewNotePopup
        isOpen={true}
        onClose={mockClose}
        note={mockNote as any}
      />,
    );

    const closeBtn = screen.getByRole("button", { name: "" });
    fireEvent.click(closeBtn);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when clicking the footer Close button", () => {
    render(
      <ViewNotePopup
        isOpen={true}
        onClose={mockClose}
        note={mockNote as any}
      />,
    );

    const footerBtn = screen.getByText("Close");
    fireEvent.click(footerBtn);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when clicking the overlay", () => {
    const { container } = render(
      <ViewNotePopup
        isOpen={true}
        onClose={mockClose}
        note={mockNote as any}
      />,
    );

    const overlay = container.firstChild as HTMLElement;
    fireEvent.click(overlay);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("should not call onClose when clicking the popup content", () => {
    render(
      <ViewNotePopup
        isOpen={true}
        onClose={mockClose}
        note={mockNote as any}
      />,
    );

    const popupContent = screen.getByText("Note Details");
    fireEvent.click(popupContent);

    expect(mockClose).not.toHaveBeenCalled();
  });
});
