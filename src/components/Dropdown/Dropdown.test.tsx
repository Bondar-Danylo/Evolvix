import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Dropdown from "./Dropdown";
import "@testing-library/jest-dom";

vi.mock("@/assets/chevron_icon.svg?react", () => ({
  default: () => <div data-testid="chevron-icon" />,
}));

describe("Dropdown Component", () => {
  const mockOptions = ["Kitchen", "Delivery"];
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render correctly with default 'All' value", () => {
    render(<Dropdown options={mockOptions} value="" onChange={mockOnChange} />);

    const elements = screen.getAllByText(/All/i);
    expect(elements.length).toBeGreaterThan(0);
    expect(elements[0]).toBeInTheDocument();
  });

  it("should toggle open state on click", () => {
    const { container } = render(
      <Dropdown options={mockOptions} value="" onChange={mockOnChange} />,
    );

    const topElement = container.querySelector('div[class*="dropdown__top"]');
    const body = container.querySelector('div[class*="dropdown__body"]');

    if (!topElement) throw new Error("Dropdown top not found");

    fireEvent.click(topElement);
    expect(body?.className).toMatch(/active/);

    fireEvent.click(topElement);
    expect(body?.className).not.toMatch(/active/);
  });

  it("should call onChange and close when an item is selected", () => {
    render(<Dropdown options={mockOptions} value="" onChange={mockOnChange} />);

    const displayedValue = screen.getAllByText(/All/i)[0];
    fireEvent.click(displayedValue);

    const option = screen.getAllByText("Kitchen")[0];
    fireEvent.click(option);

    expect(mockOnChange).toHaveBeenCalledWith("Kitchen");
  });

  it("should close on Escape key", () => {
    const { container } = render(
      <Dropdown options={mockOptions} value="" onChange={mockOnChange} />,
    );

    const wrapper = container.firstChild as HTMLElement;
    const body = container.querySelector('div[class*="dropdown__body"]');

    fireEvent.click(screen.getAllByText(/All/i)[0]);
    expect(body?.className).toMatch(/active/);

    fireEvent.keyDown(wrapper, { key: "Escape" });
    expect(body?.className).not.toMatch(/active/);
  });

  it("should close on blur", () => {
    const { container } = render(
      <Dropdown options={mockOptions} value="" onChange={mockOnChange} />,
    );

    const wrapper = container.firstChild as HTMLElement;
    const body = container.querySelector('div[class*="dropdown__body"]');

    fireEvent.click(screen.getAllByText(/All/i)[0]);
    fireEvent.blur(wrapper);

    expect(body?.className).not.toMatch(/active/);
  });
});
