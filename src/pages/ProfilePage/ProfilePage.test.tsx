import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProfilePage from "./ProfilePage";
import "@testing-library/jest-dom";

vi.stubGlobal("import.meta", { env: { VITE_API_URL: "http://test-api.com" } });

describe("ProfilePage Component", () => {
  const mockNotes = [
    { id: 1, name: "Test Note 1", priority: "High" },
    { id: 2, name: "Test Note 2", priority: "Low" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("sessionStorage", {
      getItem: vi.fn().mockReturnValue("user-123"),
    });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url) => {
        if (url.includes("get_notes.php")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ success: true, notes: mockNotes }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      }),
    );
  });

  it("should fetch and display notes on mount", async () => {
    render(<ProfilePage />);
    expect(await screen.findByText("Test Note 1")).toBeInTheDocument();
  });

  it("should open ViewNotePopup when a row is clicked", async () => {
    render(<ProfilePage />);

    const noteRow = await screen.findByText("Test Note 1");

    fireEvent.click(noteRow);

    const noteTitles = screen.getAllByText("Test Note 1");
    expect(noteTitles.length).toBeGreaterThan(1);

    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("should handle API error during fetch", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("API Error")));

    render(<ProfilePage />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
