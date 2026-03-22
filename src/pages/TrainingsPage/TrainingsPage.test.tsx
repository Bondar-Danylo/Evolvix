import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TrainingPage from "./TrainingsPage";
import "@testing-library/jest-dom";

vi.stubGlobal("import.meta", { env: { VITE_API_URL: "http://test-api.com" } });

describe("TrainingPage Component", () => {
  const mockTrainings = [
    {
      id: 1,
      name: "Safety First",
      department: "Production",
      passed_users_count: 5,
      total_users_count: 10,
    },
    {
      id: 2,
      name: "Cybersecurity",
      department: "IT",
      passed_users_count: 2,
      total_users_count: 2,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url) => {
        if (url.includes("get_trainings.php")) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                success: true,
                trainings: mockTrainings,
                training: mockTrainings[0],
              }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        });
      }),
    );
  });

  it("should open ViewPopup when row is clicked", async () => {
    render(<TrainingPage />);
    const row = await screen.findByText("Safety First");
    fireEvent.click(row);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("id=1"));
    });
  });

  it("should handle edit click by fetching specific training data", async () => {
    render(<TrainingPage />);
    await screen.findByText("Safety First");

    const allButtons = screen.getAllByRole("button");
    const editBtn =
      allButtons.find(
        (btn) =>
          btn.className.toLowerCase().includes("edit") ||
          btn.innerHTML.toLowerCase().includes("edit"),
      ) || allButtons[1];

    fireEvent.click(editBtn);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("get_trainings.php?id=1"),
      );
    });
  });

  it("should handle delete process", async () => {
    render(<TrainingPage />);
    await screen.findByText("Safety First");

    const allButtons = screen.getAllByRole("button");
    const deleteBtn =
      allButtons.find(
        (btn) =>
          btn.className.toLowerCase().includes("delete") ||
          btn.innerHTML.toLowerCase().includes("delete"),
      ) || allButtons[allButtons.length - 1];

    fireEvent.click(deleteBtn);

    const modalTitle = await screen.findByText(/Delete Training/i);
    expect(modalTitle).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", {
      name: /confirm|yes|delete/i,
    });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("delete_training.php"),
        expect.any(Object),
      );
    });
  });
});
