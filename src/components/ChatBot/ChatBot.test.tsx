import { render, screen, fireEvent, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import ChatBot from "./ChatBot";
import "@testing-library/jest-dom";

describe("ChatBot Component", () => {
  const mockClose = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render initial welcome message", () => {
    render(<ChatBot closeChatbot={mockClose} />);
    expect(
      screen.getByText(/Hello! How can I help you today?/i),
    ).toBeInTheDocument();
  });

  it("should update input value when typing", async () => {
    render(<ChatBot closeChatbot={mockClose} />);
    const input = screen.getByPlaceholderText(
      /Ask a question.../i,
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "Hello" } });
    expect(input.value).toBe("Hello");
  });

  it("should add user message and then bot response after delay", async () => {
    render(<ChatBot closeChatbot={mockClose} />);
    const input = screen.getByPlaceholderText(/Ask a question.../i);
    const sendBtn = screen.getByRole("button", { name: /Send/i });

    fireEvent.change(input, { target: { value: "password" } });
    fireEvent.click(sendBtn);

    expect(screen.getByText("password")).toBeInTheDocument();
    expect(input).toHaveValue("");

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(screen.getByText(/Forgotten your password\?/i)).toBeInTheDocument();
  });

  it("should handle Enter key to send message", () => {
    render(<ChatBot closeChatbot={mockClose} />);
    const input = screen.getByPlaceholderText(/Ask a question.../i);

    fireEvent.change(input, { target: { value: "hi" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(screen.getByText("hi")).toBeInTheDocument();
  });

  it("should not send empty or whitespace messages", () => {
    const { container } = render(<ChatBot closeChatbot={mockClose} />);
    const sendBtn = screen.getByRole("button", { name: /Send/i });
    const input = screen.getByPlaceholderText(/Ask a question.../i);

    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.click(sendBtn);

    const messages = container.querySelectorAll('[class*="messageRow"]');

    expect(messages).toHaveLength(1);
  });

  it("should call closeChatbot when close button is clicked", () => {
    render(<ChatBot closeChatbot={mockClose} />);
    const closeBtn = screen.getByRole("button", { name: /Close Icon/i });

    fireEvent.click(closeBtn);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("should call closeChatbot when overlay is clicked", () => {
    const { container } = render(<ChatBot closeChatbot={mockClose} />);
    const wrapper = container.firstChild;

    if (wrapper) fireEvent.click(wrapper);

    expect(mockClose).toHaveBeenCalled();
  });

  it("should stop propagation on chatbot window click", () => {
    render(<ChatBot closeChatbot={mockClose} />);

    const chatbotContainer =
      screen.getByText("Support Assistant").parentElement?.parentElement;
    if (chatbotContainer) fireEvent.click(chatbotContainer);

    expect(mockClose).not.toHaveBeenCalled();
  });
});
