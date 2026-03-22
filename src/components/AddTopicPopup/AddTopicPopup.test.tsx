import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import AddTopicPopup from "./AddTopicPopup";
import "@testing-library/jest-dom";

describe("AddTopicPopup", () => {
  const mockClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
    vi.stubGlobal("alert", vi.fn());
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => "blob:http://localhost/mock-url"),
      revokeObjectURL: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should render create mode by default", () => {
    render(<AddTopicPopup closePopup={mockClose} onSuccess={mockOnSuccess} />);

    expect(screen.getByText("Create New Topic")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter title/i)).toHaveValue("");
  });

  it("should prefill data in edit mode", () => {
    const editData = {
      id: 1,
      title: "Security Policy",
      department: "IT",
      content: "Important info",
      image_url: "http://example.com/img.jpg",
    };

    render(
      <AddTopicPopup
        closePopup={mockClose}
        onSuccess={mockOnSuccess}
        editData={editData}
      />,
    );

    expect(screen.getByText("Edit Topic")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Security Policy")).toBeInTheDocument();
    expect(screen.getByAltText("Preview")).toHaveAttribute(
      "src",
      editData.image_url,
    );
  });

  it("should show preview when a file is selected", async () => {
    const user = userEvent.setup();
    render(<AddTopicPopup closePopup={mockClose} onSuccess={mockOnSuccess} />);

    const file = new File(["hello"], "hello.png", { type: "image/png" });
    const input = screen.getByLabelText(/Upload Image/i) as HTMLInputElement;

    await user.upload(input, file);

    expect(input.files?.[0]).toBe(file);
    expect(screen.getByAltText("Preview")).toBeInTheDocument();
    expect(URL.createObjectURL).toHaveBeenCalled();
  });

  it("should submit FormData and call onSuccess", async () => {
    const user = userEvent.setup();
    (fetch as any).mockResolvedValue({
      json: async () => ({ success: true }),
    });

    render(<AddTopicPopup closePopup={mockClose} onSuccess={mockOnSuccess} />);

    await user.type(screen.getByPlaceholderText(/Enter title/i), "New Title");
    await user.type(screen.getByPlaceholderText(/Housekeeping/i), "HR");
    await user.type(
      screen.getByPlaceholderText(/Detailed information/i),
      "Some content",
    );

    const file = new File(["test"], "test.png", { type: "image/png" });
    const input = screen.getByLabelText(/Upload Image/i);
    await user.upload(input, file);

    await user.click(screen.getByRole("button", { name: /Create Topic/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("add_topic.php"),
        expect.objectContaining({
          method: "POST",
          body: expect.any(FormData),
        }),
      );
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockClose).toHaveBeenCalled();
    });
  });

  it("should close when cancel button is clicked", async () => {
    const user = userEvent.setup();
    render(<AddTopicPopup closePopup={mockClose} onSuccess={mockOnSuccess} />);

    await user.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mockClose).toHaveBeenCalled();
  });

  it("should prevent scroll on mount and restore it on unmount", () => {
    const { unmount } = render(
      <AddTopicPopup closePopup={mockClose} onSuccess={mockOnSuccess} />,
    );

    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("auto");
  });
});
