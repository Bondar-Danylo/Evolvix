import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TrainingViewPopup from "./TrainingViewPopup";
import "@testing-library/jest-dom";

const mockTraining = {
  id: 1,
  name: "Safety Training",
  department: "Security",
  description: "Basic safety rules.",
  image_url: "safety.png",
  questions: [
    {
      id: 101,
      question_text: "Is fire hot?",
      answers: [
        { id: 1, answer_text: "Yes", is_correct: "1" },
        { id: 2, answer_text: "No", is_correct: "0" },
      ],
    },
  ],
};

describe("TrainingViewPopup Component", () => {
  const mockClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.stubGlobal("sessionStorage", {
      getItem: vi.fn().mockReturnValue("user_123"),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        Promise.resolve({
          json: () => Promise.resolve({ success: true, attempts: [] }),
        }),
      ),
    );
  });

  it("should render training information and questions", async () => {
    render(
      <TrainingViewPopup
        training={mockTraining as any}
        closePopup={mockClose}
      />,
    );

    expect(screen.getByText("Security")).toBeInTheDocument();
    expect(screen.getByText("Safety Training")).toBeInTheDocument();
    expect(screen.getByText("Basic safety rules.")).toBeInTheDocument();
    expect(screen.getByText(/Is fire hot?/i)).toBeInTheDocument();
  });

  it("should allow selecting an answer", () => {
    render(
      <TrainingViewPopup
        training={mockTraining as any}
        closePopup={mockClose}
      />,
    );

    const answer = screen.getByText("Yes");
    fireEvent.click(answer);

    const checkbox = answer.previousSibling;
    expect(checkbox?.firstChild).toBeInTheDocument();
  });

  it("should show success banner when quiz is passed", async () => {
    render(
      <TrainingViewPopup
        training={mockTraining as any}
        closePopup={mockClose}
      />,
    );

    const answer = screen.getByText("Yes");
    fireEvent.click(answer);

    const finishBtn = screen.getByText(/Finish & Check/i);
    fireEvent.click(finishBtn);

    await waitFor(() => {
      expect(screen.getByText(/Well done!/i)).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("save_attempt.php"),
      expect.any(Object),
    );
  });

  it("should show fail banner when score is below 80%", async () => {
    const multiQuestionTraining = {
      ...mockTraining,
      questions: [
        {
          id: 1,
          question_text: "Q1",
          answers: [{ id: 1, is_correct: "1", answer_text: "A" }],
        },
        {
          id: 2,
          question_text: "Q2",
          answers: [{ id: 2, is_correct: "1", answer_text: "B" }],
        },
      ],
    };

    render(
      <TrainingViewPopup
        training={multiQuestionTraining as any}
        closePopup={mockClose}
      />,
    );

    fireEvent.click(screen.getByText("A"));
    fireEvent.click(screen.getByText(/Finish & Check/i));

    await waitFor(() => {
      expect(screen.getByText(/Not enough points/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/50%/)).toBeInTheDocument();
  });

  it("should disable interactions if training was already passed", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              success: true,
              attempts: [{ status: "passed" }],
            }),
        }),
      ),
    );

    render(
      <TrainingViewPopup
        training={mockTraining as any}
        closePopup={mockClose}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("PASSED")).toBeInTheDocument();
    });

    const answer = screen.getByText("Yes");
    fireEvent.click(answer);

    expect(screen.queryByText(/Finish & Check/i)).not.toBeInTheDocument();
  });

  it("should call closePopup when clicking close icon", () => {
    render(
      <TrainingViewPopup
        training={mockTraining as any}
        closePopup={mockClose}
      />,
    );

    const closeBtn = screen.getByAltText("close");
    fireEvent.click(closeBtn);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("should reset quiz state when 'Try Again' is clicked", async () => {
    render(
      <TrainingViewPopup
        training={mockTraining as any}
        closePopup={mockClose}
      />,
    );

    fireEvent.click(screen.getByText("No"));
    fireEvent.click(screen.getByText(/Finish & Check/i));

    const tryAgainBtn = await screen.findByRole("button", {
      name: /try again/i,
    });

    fireEvent.click(tryAgainBtn);

    expect(screen.queryByText(/Not enough points/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Finish & Check/i)).toBeInTheDocument();
  });
});
