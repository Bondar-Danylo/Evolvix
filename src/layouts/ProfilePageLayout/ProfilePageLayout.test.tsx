import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ProfilePageLayout from "./ProfilePageLayout";
import "@testing-library/jest-dom";

vi.stubGlobal("import.meta", { env: { VITE_API_URL: "http://test-api.com" } });

vi.mock("@/pages/EmployeeProfilePage/EmployeeProfilePage", () => ({
  default: () => <div data-testid="employee-page" />,
}));
vi.mock("@/pages/ProfilePage/ProfilePage", () => ({
  default: () => <div data-testid="admin-page" />,
}));
vi.mock("@/components/ContactInput/ContactInput", () => ({
  default: ({ value, onBlur, onChange, type }: any) => (
    <input
      data-testid={`input-${type}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    />
  ),
}));

describe("ProfilePageLayout Component", () => {
  const mockUser = {
    success: true,
    user: {
      first_name: "Jane",
      last_name: "Doe",
      position: "Manager",
      start_date: "2024-01-01",
      email: "jane@example.com",
      phone: "123456789",
      avatar: "avatars/jane.png",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("sessionStorage", {
      getItem: vi.fn().mockReturnValue("user_1"),
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: () => Promise.resolve(mockUser),
      }),
    );
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn().mockReturnValue("blob:mock"),
    });
  });

  it("should render and fetch user data", async () => {
    render(<ProfilePageLayout role="admin" />);

    await waitFor(() => {
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    expect(screen.getByText("Manager")).toBeInTheDocument();
    expect(screen.getByText(/Worked from 2024-01-01/)).toBeInTheDocument();
  });

  it("should correctly calculate onboarding status via useMemo", async () => {
    const recentUser = {
      ...mockUser,
      user: { ...mockUser.user, start_date: new Date().toISOString() },
    };
    (fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve(recentUser),
    });

    render(<ProfilePageLayout role="user" />);

    await waitFor(() => {
      expect(screen.getByText("Onboarding")).toBeInTheDocument();
    });
  });

  it("should open file dialog when upload button is clicked", async () => {
    render(<ProfilePageLayout role="admin" />);
    await waitFor(() => screen.getByText("Jane Doe"));

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, "click");

    fireEvent.click(screen.getByText(/Upload Photo/i));
    expect(clickSpy).toHaveBeenCalled();
  });

  it("should show popup when contact info is changed (onBlur)", async () => {
    render(<ProfilePageLayout role="admin" />);
    await waitFor(() => screen.getByText("Jane Doe"));

    const emailInput = screen.getByTestId("input-email");
    fireEvent.change(emailInput, { target: { value: "new@example.com" } });
    fireEvent.blur(emailInput);

    expect(screen.getByText(/Update Email/i)).toBeInTheDocument();
  });

  it("should handle avatar upload", async () => {
    render(<ProfilePageLayout role="admin" />);
    await waitFor(() => screen.getByText("Jane Doe"));

    const file = new File(["(⌐□_□)"], "new-avatar.png", { type: "image/png" });
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    (fetch as any).mockResolvedValueOnce({
      json: () =>
        Promise.resolve({ success: true, avatar_url: "new/path.png" }),
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const img = screen.getByAltText("User avatar");
      expect(img).toHaveAttribute("src", "blob:mock");
    });
  });

  it("should render correct sub-page based on role", async () => {
    const { rerender } = render(<ProfilePageLayout role="user" />);
    expect(screen.getByTestId("employee-page")).toBeInTheDocument();

    rerender(<ProfilePageLayout role="admin" />);
    expect(screen.getByTestId("admin-page")).toBeInTheDocument();
  });
});
