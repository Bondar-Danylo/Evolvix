import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import HomePage from "./HomePage";
import "@testing-library/jest-dom";

vi.stubGlobal("import.meta", { env: { VITE_API_URL: "http://test-api.com" } });

vi.mock("@/components/StatsCards/StatsCards", () => ({
  default: ({ stats }: any) => (
    <div data-testid="stats-cards">{stats?.total}</div>
  ),
}));

vi.mock("@/components/ChartCard/ChartCard", () => ({
  default: ({ children, onPeriodChange }: any) => (
    <div data-testid="chart-card">
      {children}
      <button onClick={() => onPeriodChange(30)}>Change Period</button>
    </div>
  ),
}));

vi.mock("@/components/InfoCard/InfoCard", () => ({
  default: ({ children, data, onItemClick }: any) => (
    <div data-testid="info-card">
      <h3>{children}</h3>
      {data?.map((item: any) => (
        <button key={item.target_id} onClick={() => onItemClick(item)}>
          {item.title}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("@/components/Summary/Summary", () => ({
  default: ({ data }: any) => <div data-testid="summary">{data?.title}</div>,
}));

describe("HomePage Component", () => {
  const mockBaseResponse = {
    success: true,
    stats: { total: 100 },
    summary: { title: "Main Summary" },
    attentionData: [{ target_id: 1, title: "Issue A", type: "user" }],
    insightsData: [{ target_id: 2, title: "Insight B", type: "topic" }],
    onboardingData: [],
    departmentData: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockBaseResponse),
        }),
      ),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render all main sections after data fetch", async () => {
    render(<HomePage />);
    await waitFor(() => {
      expect(screen.getByTestId("stats-cards")).toBeInTheDocument();
      expect(screen.getByTestId("summary")).toBeInTheDocument();
    });
  });

  it("should fetch new data when chart period changes", async () => {
    render(<HomePage />);
    const changeButtons = await screen.findAllByText("Change Period");
    fireEvent.click(changeButtons[0]);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("days=30"));
    });
  });

  it("should open popup details on item click", async () => {
    render(<HomePage />);
    const itemBtn = await screen.findByText("Issue A");

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({ success: true, employee: { name: "John Doe" } }),
    } as Response);

    fireEvent.click(itemBtn);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("get_employee_details.php?id=1"),
      );
    });
  });
});
