import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import "@testing-library/jest-dom";

vi.mock("@/components/Aside/Aside", () => ({
  default: () => <aside data-testid="aside" />,
}));
vi.mock("@/components/Header/Header", () => ({
  default: ({ togglePopup, openChatbot }: any) => (
    <header>
      <button onClick={togglePopup}>Trigger Popup</button>
      <button onClick={openChatbot}>Open Chatbot</button>
    </header>
  ),
}));
vi.mock("@/components/ChatBot/ChatBot", () => ({
  default: ({ closeChatbot }: any) => (
    <div data-testid="chatbot">
      <button onClick={closeChatbot}>Close Chatbot</button>
    </div>
  ),
}));
vi.mock("@/components/SmallPopup/SmallPopup", () => ({
  default: ({ onConfirm, closePopup }: any) => (
    <div data-testid="popup">
      <button onClick={onConfirm}>Confirm Logout</button>
      <button onClick={closePopup}>Cancel</button>
    </div>
  ),
}));

describe("DashboardLayout Component", () => {
  const assignMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    const location = new URL("http://localhost");

    try {
      // @ts-ignore
      delete window.location;
    } catch (e) {}

    window.location = {
      ...location,
      assign: assignMock,
      replace: vi.fn(),
      reload: vi.fn(),
    } as any;

    Object.defineProperty(window.location, "href", {
      set: assignMock,
      configurable: true,
    });
  });

  it("should render core layout elements", () => {
    render(
      <MemoryRouter>
        <DashboardLayout role="admin" />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("aside")).toBeInTheDocument();
    expect(
      screen.getByText("The Park Tower Knightsbridge"),
    ).toBeInTheDocument();
  });

  it("should toggle Chatbot visibility", () => {
    render(
      <MemoryRouter>
        <DashboardLayout role="admin" />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId("chatbot")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Open Chatbot"));
    expect(screen.getByTestId("chatbot")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close Chatbot"));
    expect(screen.queryByTestId("chatbot")).not.toBeInTheDocument();
  });

  it("should toggle Logout Popup visibility", () => {
    render(
      <MemoryRouter>
        <DashboardLayout role="admin" />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId("popup")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Trigger Popup"));
    expect(screen.getByTestId("popup")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByTestId("popup")).not.toBeInTheDocument();
  });

  it("should clear localStorage and redirect on logout confirm", () => {
    const clearSpy = vi.spyOn(Storage.prototype, "clear");

    render(
      <MemoryRouter>
        <DashboardLayout role="admin" />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Trigger Popup"));
    fireEvent.click(screen.getByText("Confirm Logout"));

    expect(clearSpy).toHaveBeenCalled();
    expect(assignMock).toHaveBeenCalledWith("/login");
  });
});
