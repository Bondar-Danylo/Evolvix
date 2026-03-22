import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import HorizontalLogo from "./HorizontalLogo";
import "@testing-library/jest-dom";

vi.mock("@/assets/menu_icon.svg?react", () => ({
  default: ({ className, onClick }: any) => (
    <div data-testid="menu-icon" className={className} onClick={onClick} />
  ),
}));

describe("HorizontalLogo Component", () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (status: boolean = false) => {
    return render(
      <MemoryRouter>
        <HorizontalLogo status={status} onClickHandler={mockOnClick} />
      </MemoryRouter>,
    );
  };

  it("should render the logo image and text", () => {
    renderComponent();

    expect(screen.getByAltText("Logo Icon")).toBeInTheDocument();
    expect(screen.getByText("Evolvix")).toBeInTheDocument();
  });

  it("should have a link to the dashboard", () => {
    renderComponent();

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/dashboard");
  });

  it("should call onClickHandler when menu icon is clicked", () => {
    renderComponent();

    const menuIcon = screen.getByTestId("menu-icon");
    fireEvent.click(menuIcon);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should apply rotate class when status is true", () => {
    const { rerender } = render(
      <MemoryRouter>
        <HorizontalLogo status={true} onClickHandler={mockOnClick} />
      </MemoryRouter>,
    );

    const menuIcon = screen.getByTestId("menu-icon");
    expect(menuIcon.className).toMatch(/rotate/);

    rerender(
      <MemoryRouter>
        <HorizontalLogo status={false} onClickHandler={mockOnClick} />
      </MemoryRouter>,
    );
    expect(menuIcon.className).not.toMatch(/rotate/);
  });

  it("should apply base menu class always", () => {
    renderComponent();
    const menuIcon = screen.getByTestId("menu-icon");
    expect(menuIcon.className).toMatch(/menu/);
  });
});
