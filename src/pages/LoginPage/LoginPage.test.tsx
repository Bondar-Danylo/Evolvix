import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginPage from "./LoginPage";
import "@testing-library/jest-dom";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.stubGlobal("import.meta", { env: { VITE_API_URL: "http://test-api.com" } });
vi.stubGlobal("alert", vi.fn());

describe("LoginPage Component", () => {
  const mockSetRole = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              user: { id: "1", role: "admin" },
            }),
        }),
      ),
    );
  });

  it("should render login form with inputs and button", () => {
    render(<LoginPage role="user" setRole={mockSetRole} />);

    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /LOGIN/i })).toBeInTheDocument();
  });

  it("should handle successful admin login", async () => {
    render(<LoginPage role="user" setRole={mockSetRole} />);

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "admin@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /LOGIN/i }));

    await waitFor(() => {
      expect(sessionStorage.getItem("userRole")).toBe("admin");
      expect(mockSetRole).toHaveBeenCalledWith("admin");
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("should handle failed login attempt", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({ success: false, message: "Invalid credentials" }),
      }),
    );

    render(<LoginPage role="user" setRole={mockSetRole} />);

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "wrong@test.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /LOGIN/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Invalid credentials");
    });
  });

  it("should call reset password API when email is valid", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, newPassword: "new123" }),
      }),
    );

    render(<LoginPage role="user" setRole={mockSetRole} />);

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.click(screen.getByText(/Forgot password\?/i));

    const confirmBtn = screen.getByText(/Confirm/i);
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("reset-password.php"),
        expect.any(Object),
      );
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining("new123"),
      );
    });
  });
});
