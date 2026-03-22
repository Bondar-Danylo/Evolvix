import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import TopicViewPopup from "./TopicViewPopup";
import "@testing-library/jest-dom";

vi.mock("@/components/Button/Button", () => ({
  default: ({ children, onClick }: any) => (
    <button data-testid="custom-button" onClick={onClick}>
      {children}
    </button>
  ),
}));

describe("TopicViewPopup Component", () => {
  const mockClose = vi.fn();

  const mockTopic = {
    title: "React Testing Guide",
    department: "IT",
    content: "Detailed information about Vitest and RTL.",
    image_url: "https://example.com/image.png",
    views_count: 150,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render all topic information correctly", () => {
    render(<TopicViewPopup topic={mockTopic} closePopup={mockClose} />);

    expect(screen.getByText("IT")).toBeInTheDocument();
    expect(screen.getByText("React Testing Guide")).toBeInTheDocument();
    expect(
      screen.getByText("Detailed information about Vitest and RTL."),
    ).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();

    const image = screen.getByAltText("React Testing Guide");
    expect(image).toHaveAttribute("src", mockTopic.image_url);
  });

  it("should not render image section if image_url is missing", () => {
    const topicWithoutImage = { ...mockTopic, image_url: "" };
    render(<TopicViewPopup topic={topicWithoutImage} closePopup={mockClose} />);

    const image = screen.queryByAltText("React Testing Guide");
    expect(image).not.toBeInTheDocument();
  });

  it("should call closePopup when Exit button is clicked", () => {
    render(<TopicViewPopup topic={mockTopic} closePopup={mockClose} />);

    const exitBtn = screen.getByTestId("custom-button");
    fireEvent.click(exitBtn);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("should call closePopup when overlay is clicked", () => {
    const { container } = render(
      <TopicViewPopup topic={mockTopic} closePopup={mockClose} />,
    );

    const overlay = container.firstChild as HTMLElement;
    fireEvent.click(overlay);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("should stop propagation when popup content is clicked", () => {
    render(<TopicViewPopup topic={mockTopic} closePopup={mockClose} />);

    const content = screen.getByText(mockTopic.content);
    fireEvent.click(content);

    expect(mockClose).not.toHaveBeenCalled();
  });

  it("should call closePopup when header close button is clicked", () => {
    render(<TopicViewPopup topic={mockTopic} closePopup={mockClose} />);

    const closeBtn = screen.getByAltText("close").parentElement;
    if (closeBtn) fireEvent.click(closeBtn);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
