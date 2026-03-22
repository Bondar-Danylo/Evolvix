import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import AddTrainingPopup from "./AddTrainingPopup";
import "@testing-library/jest-dom";

describe("AddTrainingPopup", () => {
  const mockClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
    vi.stubGlobal("alert", vi.fn());
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => "blob:mock-url"),
      revokeObjectURL: vi.fn(),
    });
  });

  it("should render correctly in create mode", () => {
    render(
      <AddTrainingPopup closePopup={mockClose} onSuccess={mockOnSuccess} />,
    );
    expect(screen.getByText("New Training & Quiz")).toBeInTheDocument();
  });

  it("should add a new question manually", async () => {
    const user = userEvent.setup();
    render(
      <AddTrainingPopup closePopup={mockClose} onSuccess={mockOnSuccess} />,
    );

    const addBtn = screen.getByText("+ Add Question Manually");
    await user.click(addBtn);

    expect(screen.getByPlaceholderText("Question #1")).toBeInTheDocument();
  });

  it("should add and remove answers within a question", async () => {
    const user = userEvent.setup();
    render(
      <AddTrainingPopup closePopup={mockClose} onSuccess={mockOnSuccess} />,
    );

    await user.click(screen.getByText("+ Add Question Manually"));

    const addOptionBtn = screen.getByText("+ Add option");
    await user.click(addOptionBtn);

    const options = screen.getAllByPlaceholderText("Option text...");
    expect(options).toHaveLength(2);

    const removeBtns = screen.getAllByText("✕");
    await user.click(removeBtns[removeBtns.length - 1]);

    expect(screen.getAllByPlaceholderText("Option text...")).toHaveLength(1);
  });

  it("should generate questions using AI when material is provided", async () => {
    const user = userEvent.setup();
    const mockAiResponse = {
      success: true,
      questions: [
        {
          question_text: "AI Question?",
          answers: [{ answer_text: "AI Answer", is_correct: 1 }],
        },
      ],
    };

    (fetch as any).mockResolvedValue({
      json: async () => mockAiResponse,
    });

    render(
      <AddTrainingPopup closePopup={mockClose} onSuccess={mockOnSuccess} />,
    );

    const textarea = screen.getByPlaceholderText(/Paste or write/i);
    await user.type(
      textarea,
      "This is a long enough description to trigger AI generation logic.",
    );

    const aiBtn = screen.getByText(/Generate by AI/i);
    await user.click(aiBtn);

    await waitFor(() => {
      expect(screen.getByDisplayValue("AI Question?")).toBeInTheDocument();
    });
  });

  it("should alert if AI is triggered without enough content", async () => {
    const user = userEvent.setup();
    render(
      <AddTrainingPopup closePopup={mockClose} onSuccess={mockOnSuccess} />,
    );

    const aiBtn = screen.getByText(/Generate by AI/i);
    await user.click(aiBtn);

    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining("training material first"),
    );
  });

  it("should submit full training data via FormData", async () => {
    const user = userEvent.setup();
    (fetch as any).mockResolvedValue({
      json: async () => ({ success: true }),
    });

    render(
      <AddTrainingPopup closePopup={mockClose} onSuccess={mockOnSuccess} />,
    );

    await user.type(
      screen.getByPlaceholderText(/Health & Safety/i),
      "Fire Safety",
    );
    await user.type(screen.getByPlaceholderText(/e.g. Kitchen/i), "General");
    await user.type(
      screen.getByPlaceholderText(/Paste or write/i),
      "Learn how to use fire extinguishers.",
    );

    await user.click(screen.getByText("+ Add Question Manually"));
    await user.type(
      screen.getByPlaceholderText("Question #1"),
      "Is water for oil fires?",
    );
    await user.type(screen.getByPlaceholderText("Option text..."), "No");

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    const saveBtn = screen.getByText("Save Training");
    await user.click(saveBtn);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("save_training.php"),
        expect.objectContaining({
          method: "POST",
          body: expect.any(FormData),
        }),
      );
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it("should close the popup when close button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <AddTrainingPopup closePopup={mockClose} onSuccess={mockOnSuccess} />,
    );

    const closeBtn = screen.getByAltText("close").parentElement;
    if (closeBtn) await user.click(closeBtn);

    expect(mockClose).toHaveBeenCalled();
  });
});
