import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import ContactInput from "./ContactInput";
import "@testing-library/jest-dom";

describe("ContactInput Component", () => {
  const mockOnChange = vi.fn();
  const mockOnBlur = vi.fn();
  const defaultProps = {
    type: "text" as const,
    icon: "test-icon.svg",
    value: "Initial Value",
    onChange: mockOnChange,
    onBlur: mockOnBlur,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it("should render correctly with initial value and icon", () => {
    render(<ContactInput {...defaultProps} />);

    const input = screen.getByDisplayValue("Initial Value");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("readOnly");
    expect(screen.getByAltText("text Icon")).toHaveAttribute(
      "src",
      "test-icon.svg",
    );
  });

  it("should become editable and focus when edit button is clicked", async () => {
    render(<ContactInput {...defaultProps} />);

    const editButton = screen.getByLabelText("Edit field");
    const input = screen.getByDisplayValue("Initial Value");

    fireEvent.click(editButton);

    vi.runAllTimers();

    expect(input).not.toHaveAttribute("readOnly");
    expect(input).toHaveFocus();
  });

  it("should call onChange when user types", () => {
    render(<ContactInput {...defaultProps} />);

    // 1. Делаем поле редактируемым
    const editButton = screen.getByLabelText("Edit field");
    fireEvent.click(editButton);

    // 2. Прокручиваем таймеры для выполнения setTimeout из handleIconClick
    vi.runAllTimers();

    const input = screen.getByDisplayValue("Initial Value") as HTMLInputElement;

    // 3. Имитируем ввод текста
    fireEvent.change(input, { target: { value: "New Data" } });

    expect(mockOnChange).toHaveBeenCalledWith("New Data");
  });

  it("should toggle password visibility", () => {
    render(<ContactInput {...defaultProps} type="password" />);

    const input = screen.getByDisplayValue("Initial Value");
    expect(input).toHaveAttribute("type", "password");

    const eyeIcon = document.querySelector('svg[class*="actions__view"]');
    if (eyeIcon) fireEvent.click(eyeIcon);

    expect(input).toHaveAttribute("type", "text");

    if (eyeIcon) fireEvent.click(eyeIcon);
    expect(input).toHaveAttribute("type", "password");
  });

  it("should clear value when editing a password field", () => {
    render(<ContactInput {...defaultProps} type="password" />);

    const editButton = screen.getByLabelText("Edit field");
    fireEvent.click(editButton);

    expect(mockOnChange).toHaveBeenCalledWith("");
  });

  it("should return to readOnly state and call onBlur when focus is lost", () => {
    render(<ContactInput {...defaultProps} />);

    const input = screen.getByDisplayValue("Initial Value");

    fireEvent.click(screen.getByLabelText("Edit field"));
    vi.runAllTimers();
    expect(input).not.toHaveAttribute("readOnly");

    fireEvent.blur(input);

    expect(input).toHaveAttribute("readOnly");
    expect(mockOnBlur).toHaveBeenCalled();
  });

  it("should finish editing on Enter key press", () => {
    render(<ContactInput {...defaultProps} />);
    const input = screen.getByDisplayValue("Initial Value");

    fireEvent.click(screen.getByLabelText("Edit field"));
    vi.runAllTimers();

    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(input).toHaveAttribute("readOnly");

    expect(input).not.toHaveFocus();
  });
});
