import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EmployeeTopicsPage from "./EmployeeTopicsPage";
import "@testing-library/jest-dom";

vi.stubGlobal("import.meta", { env: { VITE_API_URL: "http://test-api.com" } });

vi.mock("@/assets/star_icon.svg?react", () => ({
  default: ({ className }: any) => (
    <svg data-testid="star-icon" className={className} />
  ),
}));

vi.mock("@/components/TopicViewPopup/TopicViewPopup", () => ({
  default: ({ topic, closePopup }: any) => (
    <div data-testid="topic-popup">
      <span>{topic.name}</span>
      <button onClick={closePopup}>Close</button>
    </div>
  ),
}));

describe("EmployeeTopicsPage Component", () => {
  const mockTopics = {
    success: true,
    topics: [
      {
        id: 1,
        title: "Health & Safety",
        content: "Be safe.",
        image_url: "safe.png",
        department: "All",
        status: "New",
        is_saved: 0,
        views_count: 5,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("sessionStorage", {
      getItem: vi.fn().mockReturnValue("user_123"),
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url) => {
        if (url.includes("get_topics.php")) {
          return Promise.resolve({ json: () => Promise.resolve(mockTopics) });
        }
        return Promise.resolve({
          json: () => Promise.resolve({ success: true }),
        });
      }),
    );
  });

  it("should fetch and display topics on mount", async () => {
    render(<EmployeeTopicsPage />);

    await waitFor(() => {
      expect(screen.getByText("Health & Safety")).toBeInTheDocument();
    });

    const rows = screen.getAllByRole("row");
    const dataRow = rows[1];

    expect(within(dataRow).getByText("All")).toBeInTheDocument();
    expect(within(dataRow).getByText("New")).toBeInTheDocument();
  });

  it("should handle toggling save status", async () => {
    render(<EmployeeTopicsPage />);
    const starBtn = await screen.findByTestId("star-icon");

    fireEvent.click(starBtn.parentElement!);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("toggle_save.php"),
        expect.objectContaining({ method: "POST" }),
      );
      expect(screen.getByText("Saved")).toBeInTheDocument();
    });
  });

  it("should open popup and increment views when a new topic is clicked", async () => {
    render(<EmployeeTopicsPage />);
    const topicName = await screen.findByText("Health & Safety");

    fireEvent.click(topicName);

    expect(screen.getByTestId("topic-popup")).toBeInTheDocument();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("increment_views.php"),
        expect.any(Object),
      );
      expect(screen.getByText("Viewed")).toBeInTheDocument();
    });
  });

  it("should close the topic popup", async () => {
    render(<EmployeeTopicsPage />);
    const topicName = await screen.findByText("Health & Safety");

    fireEvent.click(topicName);
    const closeBtn = screen.getByText("Close");
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId("topic-popup")).not.toBeInTheDocument();
  });
});
