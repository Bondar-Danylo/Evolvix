import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect, beforeEach } from "vitest";
import AddEmployeePopup from "./AddEmployeePopup";
import "@testing-library/jest-dom";

describe("AddEmployeePopup", () => {
  const mockClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
    vi.stubGlobal("alert", vi.fn());
  });

  it("should render 'Add' mode correctly with password field", () => {
    render(
      <AddEmployeePopup closePopup={mockClose} onSuccess={mockOnSuccess} />,
    );

    expect(screen.getByText("Add New Employee")).toBeInTheDocument();
    expect(screen.getByText(/Initial Password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Create Employee/i }),
    ).toBeInTheDocument();
  });

  it("should render 'Edit' mode with prefilled data and no password field", () => {
    const editData = {
      id: "1",
      first_name: "John",
      last_name: "Doe",
      email: "john@test.com",
      phone: "12345678",
      department: "IT",
      position: "Dev",
      start_date: "2024-01-01",
      role: "user",
    };

    render(
      <AddEmployeePopup
        closePopup={mockClose}
        onSuccess={mockOnSuccess}
        editData={editData}
      />,
    );

    expect(screen.getByText("Edit Employee")).toBeInTheDocument();
    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@test.com")).toBeInTheDocument();
    expect(screen.queryByText(/Initial Password/i)).not.toBeInTheDocument();
  });

  it("should show validation errors when fields are empty and submitted", async () => {
    const user = userEvent.setup();
    render(
      <AddEmployeePopup closePopup={mockClose} onSuccess={mockOnSuccess} />,
    );

    await user.click(screen.getByRole("button", { name: /Create Employee/i }));

    const errorMessages = await screen.findAllByText("Required");
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  it("should show specific error for invalid email format", async () => {
    const user = userEvent.setup();
    render(
      <AddEmployeePopup closePopup={mockClose} onSuccess={mockOnSuccess} />,
    );

    const emailInput = screen.getByPlaceholderText("john@evolvix.com");
    await user.type(emailInput, "invalid-email");

    await user.click(screen.getByRole("button", { name: /Create Employee/i }));

    expect(await screen.findByText("Invalid email")).toBeInTheDocument();
  });

  it("should call API and onSuccess when form is valid and submitted", async () => {
    const user = userEvent.setup();
    (fetch as any).mockResolvedValue({
      json: async () => ({ success: true }),
    });

    const { container } = render(
      <AddEmployeePopup closePopup={mockClose} onSuccess={mockOnSuccess} />,
    );

    await user.type(screen.getByPlaceholderText("John"), "Alice");
    await user.type(screen.getByPlaceholderText("Doe"), "Smith");
    await user.type(screen.getByPlaceholderText("Housekeeping"), "HR");
    await user.type(screen.getByPlaceholderText("Manager"), "Recruiter");
    await user.type(
      screen.getByPlaceholderText("john@evolvix.com"),
      "alice@test.com",
    );
    await user.type(screen.getByPlaceholderText("+1 234 567"), "123456789");
    await user.type(screen.getByPlaceholderText("Secret123"), "Password123");

    const dateInput = container.querySelector('input[type="date"]');
    if (dateInput) {
      await user.type(dateInput, "2024-03-22");
    }

    await user.click(screen.getByRole("button", { name: /Create Employee/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("add_user.php"),
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"firstName":"Alice"'),
        }),
      );
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockClose).toHaveBeenCalled();
    });
  });

  it("should close popup when Cancel button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <AddEmployeePopup closePopup={mockClose} onSuccess={mockOnSuccess} />,
    );

    await user.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("should close popup when clicking on the overlay", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <AddEmployeePopup closePopup={mockClose} onSuccess={mockOnSuccess} />,
    );

    const overlay = container.firstElementChild;

    if (overlay instanceof HTMLElement) {
      await user.click(overlay);
      expect(mockClose).toHaveBeenCalled();
    } else {
      throw new Error("Overlay element not found");
    }
  });
});
