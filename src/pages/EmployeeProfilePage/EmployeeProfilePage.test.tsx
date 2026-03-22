import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EmployeeProfilePage from "./EmployeeProfilePage";
import "@testing-library/jest-dom";

vi.stubGlobal("import.meta", { env: { VITE_API_URL: "http://test-api.com" } });

vi.mock("@/components/InfoCard/InfoCard", () => ({
  default: ({ children, data, onItemClick }: any) => (
    <div data-testid="info-card">
      <h3>{children}</h3>
      {data.map((item: any) => (
        <button key={item.id} onClick={() => onItemClick(item)}>
          {item.title}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("@/components/TopicViewPopup/TopicViewPopup", () => ({
  default: ({ topic, closePopup }: any) => (
    <div data-testid="topic-popup">
      <span>{topic.title}</span>
      <button onClick={closePopup}>Close Topic</button>
    </div>
  ),
}));

vi.mock("@/components/TrainingViewPopup/TrainingViewPopup", () => ({
  default: ({ training, closePopup }: any) => (
    <div data-testid="training-popup">
      <span>{training.name}</span>
      <button onClick={closePopup}>Close Training</button>
    </div>
  ),
}));

describe("EmployeeProfilePage Component", () => {
  const mockTrainings = {
    success: true,
    trainings: [
      { id: 101, name: "Safety First", calculated_score: 90 },
      { id: 102, name: "Customer Service", calculated_score: 50 },
    ],
  };

  const mockTopics = {
    success: true,
    topics: [
      { id: 1, title: "Company Vision", is_saved: true, is_viewed: true },
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
        if (url.includes("get_trainings.php")) {
          return Promise.resolve({
            json: () => Promise.resolve(mockTrainings),
          });
        }
        if (url.includes("get_topics.php")) {
          return Promise.resolve({ json: () => Promise.resolve(mockTopics) });
        }
        if (url.includes("get_training_details.php")) {
          return Promise.resolve({
            json: () =>
              Promise.resolve({
                success: true,
                training: { id: 102, name: "Detailed Training" },
              }),
          });
        }
        return Promise.resolve({
          json: () => Promise.resolve({ success: true }),
        });
      }),
    );
  });

  it("should fetch data and calculate progress correctly", async () => {
    render(<EmployeeProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("50% Complete")).toBeInTheDocument();
    });

    expect(screen.getByText("1/2")).toBeInTheDocument();
    expect(screen.getByText("1/1")).toBeInTheDocument();
  });

  it("should close popups and refresh data when training popup is closed", async () => {
    render(<EmployeeProfilePage />);

    const trainingBtn = await screen.findByText("Customer Service");
    fireEvent.click(trainingBtn);

    const closeBtn = await screen.findByText("Close Training");
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId("training-popup")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(5);
    });
  });

  it("should handle empty data states", async () => {
    (fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, trainings: [] }),
    });
    (fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, topics: [] }),
    });

    render(<EmployeeProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("No saved topics yet")).toBeInTheDocument();
      expect(
        screen.getByText("All trainings completed! 🎉"),
      ).toBeInTheDocument();
    });
  });
});
