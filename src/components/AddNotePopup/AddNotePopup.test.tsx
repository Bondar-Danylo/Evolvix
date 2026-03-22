import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import AddNotePopup from "./AddNotePopup";
import "@testing-library/jest-dom";

describe("AddNotePopup", () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();
  const priorityOptions = ["Low", "Medium", "High"];

  it("should not render anything when isOpen is false", () => {
    const { container } = render(
      <AddNotePopup
        isOpen={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        priorityOptions={priorityOptions}
      />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render with default values for a new note", () => {
    render(
      <AddNotePopup
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        priorityOptions={priorityOptions}
      />,
    );

    expect(screen.getAllByText(/Add New Note/i)[0]).toBeInTheDocument();
    expect(screen.getByLabelText(/Note Description/i)).toHaveValue("");
    expect(screen.getByLabelText(/Priority Level/i)).toHaveValue("Low");
  });

  it("should prefill data when initialData is provided", () => {
    const initialData = { name: "Existing Note", priority: "High" };
    render(
      <AddNotePopup
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        priorityOptions={priorityOptions}
        initialData={initialData}
      />,
    );

    expect(screen.getAllByText(/Edit Note/i)[0]).toBeInTheDocument();
    expect(screen.getByLabelText(/Note Description/i)).toHaveValue(
      "Existing Note",
    );
    expect(screen.getByLabelText(/Priority Level/i)).toHaveValue("High");
  });

  it("should call onConfirm with correct data when form is submitted", async () => {
    const user = userEvent.setup();
    render(
      <AddNotePopup
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        priorityOptions={priorityOptions}
      />,
    );

    await user.type(screen.getByLabelText(/Note Description/i), "My new note");
    await user.selectOptions(
      screen.getByLabelText(/Priority Level/i),
      "Medium",
    );

    const submitBtn = screen.getByRole("button", { name: /Add New Note/i });
    await user.click(submitBtn);

    expect(mockOnConfirm).toHaveBeenCalledWith({
      name: "My new note",
      priority: "Medium",
    });
  });

  it("should call onClose when Cancel button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <AddNotePopup
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        priorityOptions={priorityOptions}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should call onClose when overlay is clicked", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <AddNotePopup
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        priorityOptions={priorityOptions}
      />,
    );

    const overlay = container.firstElementChild;
    if (overlay instanceof HTMLElement) {
      await user.click(overlay);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });
});
