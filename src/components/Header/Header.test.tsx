import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter, useLocation } from "react-router-dom";
import Header from "./Header";
import "@testing-library/jest-dom";

vi.mock("@/assets/chatbot_icon.svg?react", () => ({
  default: ({ onClick }: any) => (
    <div data-testid="chatbot-icon" onClick={onClick} />
  ),
}));

vi.mock("@/assets/logout_icon.svg?react", () => ({
  default: ({ onClick }: any) => (
    <div data-testid="logout-icon" onClick={onClick} />
  ),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: vi.fn(),
  };
});

describe("Header Component", () => {
  const mockTogglePopup = vi.fn();
  const mockOpenChatbot = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderHeader = () => {
    return render(
      <MemoryRouter>
        <Header togglePopup={mockTogglePopup} openChatbot={mockOpenChatbot} />
      </MemoryRouter>,
    );
  };

  it("should render capitalized breadcrumbs correctly for 'trainings' path", () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: "/trainings" } as any);
    renderHeader();

    expect(screen.getByText("Trainings")).toBeInTheDocument();
  });

  it("should render capitalized breadcrumbs correctly for 'dashboard' path", () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: "/dashboard" } as any);
    renderHeader();

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("should handle empty path (home)", () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: "/" } as any);
    renderHeader();

    const breadcrumbs = screen.getByText("", { selector: "span" });
    expect(breadcrumbs).toBeInTheDocument();
  });

  it("should call openChatbot when chatbot icon is clicked", () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: "/any" } as any);
    renderHeader();

    const chatbotBtn = screen.getByTestId("chatbot-icon");
    fireEvent.click(chatbotBtn);

    expect(mockOpenChatbot).toHaveBeenCalledTimes(1);
  });

  it("should call togglePopup when logout icon is clicked", () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: "/any" } as any);
    renderHeader();

    const logoutBtn = screen.getByTestId("logout-icon");
    fireEvent.click(logoutBtn);

    expect(mockTogglePopup).toHaveBeenCalledTimes(1);
  });
});
