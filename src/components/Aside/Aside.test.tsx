import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import Aside from "./Aside";
import "@testing-library/jest-dom";

vi.mock("@/components/Menu/Menu", () => ({
  default: ({ role, onClickHandler }: any) => (
    <div data-testid="mock-menu" onClick={onClickHandler}>
      Menu Role: {role}
    </div>
  ),
}));

vi.mock("@/components/UserInfo/UserInfo", () => ({
  default: () => <div data-testid="mock-user-info">UserInfo</div>,
}));

vi.mock("@/components/HorizontalLogo/HorizontalLogo", () => ({
  default: ({ onClickHandler }: any) => (
    <div data-testid="mock-logo" onClick={onClickHandler}>
      Logo
    </div>
  ),
}));

describe("Aside Component", () => {
  it("should render sub-components correctly", () => {
    render(<Aside role="admin" />);

    expect(screen.getByTestId("mock-logo")).toBeInTheDocument();
    expect(screen.getByTestId("mock-user-info")).toBeInTheDocument();
    expect(screen.getByTestId("mock-menu")).toBeInTheDocument();
    expect(screen.getByText(/Menu Role: admin/i)).toBeInTheDocument();
  });

  it("should toggle menu class when logo is clicked", async () => {
    const user = userEvent.setup();
    const { container } = render(<Aside role="user" />);

    const asideElement = container.querySelector("aside");
    const logo = screen.getByTestId("mock-logo");

    expect(asideElement?.className).not.toContain("show");

    await user.click(logo);
    expect(asideElement?.className).toContain("show");

    await user.click(logo);
    expect(asideElement?.className).not.toContain("show");
  });

  it("should close menu when an item inside Menu component is clicked", async () => {
    const user = userEvent.setup();
    const { container } = render(<Aside role="user" />);
    const asideElement = container.querySelector("aside");
    const menu = screen.getByTestId("mock-menu");

    await user.click(screen.getByTestId("mock-logo"));
    expect(asideElement?.className).toContain("show");

    await user.click(menu);
    expect(asideElement?.className).not.toContain("show");
  });
});
