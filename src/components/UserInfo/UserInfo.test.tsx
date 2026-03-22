import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UserInfo from "./UserInfo";
import "@testing-library/jest-dom";

vi.mock("@/config", () => ({
  VITE_API_URL: "http://test-api.com",
}));

vi.stubGlobal("import.meta", {
  env: { VITE_API_URL: "http://test-api.com" },
});

describe("UserInfo Component", () => {
  const mockApiUrl = "http://test-api.com";

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("sessionStorage", {
      getItem: vi.fn().mockReturnValue("user_99"),
    });
    vi.stubGlobal("fetch", vi.fn());
  });

  it("should show initial loading state", () => {
    (fetch as any).mockReturnValue(new Promise(() => {}));
    render(<UserInfo />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should use default image and fallbacks if user data is partial", async () => {
    const mockUserMinimal = {
      success: true,
      user: {
        first_name: "",
        last_name: "",
        position: "",
        avatar: null,
      },
    };

    (fetch as any).mockResolvedValue({
      json: () => Promise.resolve(mockUserMinimal),
    });

    render(<UserInfo />);

    await screen.findByText("User");
    expect(screen.getByText("Employee")).toBeInTheDocument();

    const img = screen.getByAltText("User");
    expect(img.getAttribute("src")).not.toContain(mockApiUrl);
  });
});
