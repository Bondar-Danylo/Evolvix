import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EmployeeTrainingsPage from "./EmployeeTrainingsPage";
import "@testing-library/jest-dom";

vi.stubGlobal("import.meta", { env: { VITE_API_URL: "http://test-api.com" } });

vi.mock("@/components/TrainingViewPopup/TrainingViewPopup", () => ({
  default: ({ training, closePopup }: any) => (
    <div data-testid="training-popup">
      <span>{training.name}</span>
      <button onClick={closePopup}>Close Training</button>
    </div>
  ),
}));

describe("EmployeeTrainingsPage Component", () => {
  const mockTrainings = {
    success: true,
    trainings: [
      { id: 1, name: "Cyber Security", department: "IT", calculated_score: 85 },
      {
        id: 2,
        name: "Health & Safety",
        department: "All",
        calculated_score: 40,
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
        if (url.includes("get_trainings.php?user_id=")) {
          return Promise.resolve({
            json: () => Promise.resolve(mockTrainings),
          });
        }
        if (url.includes("get_trainings.php?id=")) {
          return Promise.resolve({
            json: () =>
              Promise.resolve({
                success: true,
                training: { id: 1, name: "Detailed Training View" },
              }),
          });
        }
        return Promise.resolve({
          json: () => Promise.resolve({ success: true }),
        });
      }),
    );
  });

  it("should render trainings with correct status icons", async () => {
    render(<EmployeeTrainingsPage />);

    const firstRow = await screen.findByText("Cyber Security");
    expect(firstRow).toBeInTheDocument();

    const rows = screen.getAllByRole("row");

    const completedRow = rows.find((r) =>
      within(r).queryByText("Cyber Security"),
    );
    expect(within(completedRow!).getByText("85%")).toBeInTheDocument();

    const failedRow = rows.find((r) =>
      within(r).queryByText("Health & Safety"),
    );
    expect(within(failedRow!).getByText("40%")).toBeInTheDocument();
  });

  it("should open popup when a training is clicked", async () => {
    render(<EmployeeTrainingsPage />);

    const trainingRow = await screen.findByText("Cyber Security");
    fireEvent.click(trainingRow);

    const popup = await screen.findByTestId("training-popup");
    expect(popup).toBeInTheDocument();
    expect(
      within(popup).getByText("Detailed Training View"),
    ).toBeInTheDocument();
  });

  it("should close popup and stay on the page", async () => {
    render(<EmployeeTrainingsPage />);

    const trainingRow = await screen.findByText("Cyber Security");
    fireEvent.click(trainingRow);

    const closeBtn = await screen.findByText("Close Training");
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByTestId("training-popup")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Cyber Security")).toBeInTheDocument();
  });

  it("should show empty state if no trainings", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ success: true, trainings: [] }),
      }),
    );

    render(<EmployeeTrainingsPage />);

    await waitFor(() => {
      expect(screen.getByText(/No results found/i)).toBeInTheDocument();
    });
  });
});
