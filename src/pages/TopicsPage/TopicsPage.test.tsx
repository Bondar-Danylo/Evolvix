import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TopicsPage from "./TopicsPage";
import "@testing-library/jest-dom";

vi.stubGlobal("import.meta", { env: { VITE_API_URL: "http://test-api.com" } });
vi.stubGlobal("alert", vi.fn());

describe("TopicsPage Component", () => {
  const mockTopics = [
    { id: 1, title: "React Basics", department: "IT", views_count: 10 },
  ];

  const mockDepartments = ["IT", "HR"];

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url: string) => {
        if (url.includes("get_topics.php")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true, topics: mockTopics }),
          });
        }
        if (url.includes("get_departments.php")) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({ success: true, departments: mockDepartments }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      }),
    );
  });

  it("should render and load initial data", async () => {
    render(<TopicsPage />);
    expect(await screen.findByText("React Basics")).toBeInTheDocument();
  });

  it("should open AddTopicPopup when clicking add button", async () => {
    render(<TopicsPage />);
    const addButton = screen.getByRole("button", { name: /Add Topics/i });
    fireEvent.click(addButton);

    const titleElements = await screen.findAllByText(/Title/i);
    expect(titleElements.length).toBeGreaterThan(1);

    const input =
      screen.getByPlaceholderText(/Title/i) || screen.getByDisplayValue("");
    expect(input).toBeInTheDocument();
  });

  it("should handle row click and increment views", async () => {
    render(<TopicsPage />);
    const topicRow = await screen.findByText("React Basics");
    fireEvent.click(topicRow);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("increment_views.php"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ id: 1 }),
        }),
      );
    });

    const viewedIds = JSON.parse(
      sessionStorage.getItem("viewed_topics_ids") || "[]",
    );
    expect(viewedIds).toContain(1);
  });

  it("should handle delete process", async () => {
    render(<TopicsPage />);
    await screen.findByText("React Basics");

    const allButtons = screen.getAllByRole("button");
    const deleteBtn =
      allButtons.find(
        (btn) =>
          btn.getAttribute("aria-label")?.toLowerCase().includes("delete") ||
          btn.className.toLowerCase().includes("delete") ||
          btn.innerHTML.toLowerCase().includes("delete"),
      ) || allButtons[allButtons.length - 1];

    fireEvent.click(deleteBtn);

    const modalTitle = await screen.findByText(
      (_, element) => element?.textContent === "Delete Topic",
    );
    expect(modalTitle).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", {
      name: /confirm|yes|delete/i,
    });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("delete_topic.php"),
        expect.any(Object),
      );
    });
  });

  it("should handle fetch error gracefully", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network Error")),
    );

    render(<TopicsPage />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
