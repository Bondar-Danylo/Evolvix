import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Search from "./Search";
import "@testing-library/jest-dom";

vi.mock("@/assets/search_icon.svg?react", () => ({
  default: () => <div data-testid="search-icon" />,
}));

describe("Search Component", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render correctly with initial value", () => {
    render(<Search value="Initial search" onChange={mockOnChange} />);

    const input = screen.getByLabelText(/Search/i);

    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("Initial search");
    expect(input).toHaveAttribute("placeholder", "Search...");
  });

  it("should call onChange when the user types", () => {
    render(<Search value="" onChange={mockOnChange} />);

    const input = screen.getByLabelText(/Search/i);

    fireEvent.change(input, { target: { value: "React" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith("React");
  });

  it("should have autoComplete turned off", () => {
    render(<Search value="" onChange={mockOnChange} />);
    const input = screen.getByLabelText(/Search/i);

    expect(input).toHaveAttribute("autoComplete", "off");
  });

  it("should render the search icon", () => {
    render(<Search value="" onChange={mockOnChange} />);

    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
  });

  it("should have the correct CSS class for the wrapper", () => {
    const { container } = render(<Search value="" onChange={mockOnChange} />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toMatch(/search/);
  });
});
