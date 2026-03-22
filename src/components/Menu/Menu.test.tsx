import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Menu from "./Menu";
import "@testing-library/jest-dom";

vi.mock("@/assets/dahboard_icon.svg?react", () => ({
  default: () => <svg data-testid="icon-dashboard" />,
}));
vi.mock("@/assets/list_icon.svg?react", () => ({
  default: () => <svg data-testid="icon-list" />,
}));
vi.mock("@/assets/trainings_icon.svg?react", () => ({
  default: () => <svg data-testid="icon-trainings" />,
}));
vi.mock("@/assets/topics_icon.svg?react", () => ({
  default: () => <svg data-testid="icon-topics" />,
}));
vi.mock("@/assets/profile_icon.svg?react", () => ({
  default: () => <svg data-testid="icon-profile" />,
}));

describe("Menu Component", () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderMenu = (role: "admin" | "user", initialEntries = ["/"]) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Menu role={role} onClickHandler={mockOnClick} />
      </MemoryRouter>,
    );
  };

  it("should render full menu for Admin role", () => {
    renderMenu("admin");

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Employee List")).toBeInTheDocument();
    expect(screen.getByText("Trainings")).toBeInTheDocument();
    expect(screen.getByText("Topics")).toBeInTheDocument();

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(5);
  });

  it("should render restricted menu for User role", () => {
    renderMenu("user");

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Trainings")).toBeInTheDocument();
    expect(screen.getByText("Topics")).toBeInTheDocument();

    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    expect(screen.queryByText("Employee List")).not.toBeInTheDocument();

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
  });

  it("should apply active class to the current NavLink", () => {
    renderMenu("admin", ["/trainings"]);
    const activeLink = screen.getByRole("link", { name: /trainings/i });

    expect(activeLink.className).toMatch(/active/);

    const inactiveLink = screen.getByRole("link", { name: /profile/i });
    expect(inactiveLink.className).not.toMatch(/active/);
  });

  it("should call onClickHandler when a menu item is clicked", () => {
    renderMenu("user");

    const menuItem = screen.getByText("Profile").closest("li");
    if (menuItem) fireEvent.click(menuItem);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should have correct 'to' attributes on links", () => {
    renderMenu("admin");

    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute(
      "href",
      "/dashboard",
    );
    expect(
      screen.getByRole("link", { name: /employee list/i }),
    ).toHaveAttribute("href", "/employee-list");
  });
});
