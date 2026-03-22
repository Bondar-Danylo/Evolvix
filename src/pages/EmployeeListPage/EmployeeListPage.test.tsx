import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EmployeeListPage from "./EmployeeListPage";
import "@testing-library/jest-dom";

vi.mock("@/components/TableAction/TableActions", () => ({
  TableActions: ({ onView, onEdit, onDelete }: any) => (
    <div>
      <button data-testid="view-icon" onClick={onView}>
        View
      </button>
      <button data-testid="edit-icon" onClick={onEdit}>
        Edit
      </button>
      <button data-testid="delete-icon" onClick={onDelete}>
        Delete
      </button>
    </div>
  ),
}));

vi.mock("@/components/AddEmployeePopup/AddEmployeePopup", () => ({
  default: ({ editData, closePopup }: any) => (
    <div data-testid="add-popup">
      <input aria-label="name-input" defaultValue={editData?.name || ""} />
      <button onClick={closePopup}>Close</button>
    </div>
  ),
}));

vi.mock("@/components/SmallPopup/SmallPopup", () => ({
  default: ({ onConfirm, closePopup, subtitle }: any) => (
    <div data-testid="small-popup">
      <span>{subtitle}</span>
      <button onClick={onConfirm}>Confirm</button>
      <button onClick={closePopup}>Cancel</button>
    </div>
  ),
}));

vi.mock("@/components/EmployeeViewPopup/EmployeeViewPopup", () => ({
  default: ({ employee, closePopup }: any) => (
    <div data-testid="view-popup">
      <h2>{employee.name}</h2>
      <button onClick={closePopup}>Close</button>
    </div>
  ),
}));

vi.stubGlobal("import.meta", { env: { VITE_API_URL: "http://test-api.com" } });

describe("EmployeeListPage Component", () => {
  const mockEmployees = {
    success: true,
    users: [
      { id: 1, name: "Alice Smith", position: "Chef", trainingsProgress: 80 },
      { id: 2, name: "Bob Jones", position: "Waiter", trainingsProgress: 40 },
    ],
  };

  const mockPositions = {
    success: true,
    positions: ["Chef", "Waiter"],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("sessionStorage", { getItem: vi.fn().mockReturnValue("1") });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((url) => {
        if (url.includes("get_users.php")) {
          return Promise.resolve({
            json: () => Promise.resolve(mockEmployees),
          });
        }
        if (url.includes("get_positions.php")) {
          return Promise.resolve({
            json: () => Promise.resolve(mockPositions),
          });
        }
        return Promise.resolve({
          json: () => Promise.resolve({ success: true }),
        });
      }),
    );
  });

  it("should fetch and display employees", async () => {
    render(<EmployeeListPage />);
    await waitFor(() => {
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
      expect(screen.getByText("Bob Jones")).toBeInTheDocument();
    });
  });

  it("should open edit modal with pre-filled data", async () => {
    render(<EmployeeListPage />);
    const editBtns = await screen.findAllByTestId("edit-icon");
    fireEvent.click(editBtns[0]);
    const input = screen.getByLabelText("name-input");
    expect(input).toHaveValue("Alice Smith");
  });

  it("should show delete confirmation and call API", async () => {
    render(<EmployeeListPage />);
    const deleteBtns = await screen.findAllByTestId("delete-icon");
    fireEvent.click(deleteBtns[0]);
    expect(
      screen.getByText(/Are you sure you want to delete Alice Smith?/i),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText("Confirm"));
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("delete_user.php"),
        expect.any(Object),
      );
    });
  });

  it("should open view popup", async () => {
    render(<EmployeeListPage />);
    const viewBtns = await screen.findAllByTestId("view-icon");
    fireEvent.click(viewBtns[0]);

    const popup = screen.getByTestId("view-popup");
    expect(popup).toBeInTheDocument();
    expect(within(popup).getByText("Alice Smith")).toBeInTheDocument();
  });

  it("should open add modal when clicking add button", async () => {
    render(<EmployeeListPage />);
    const addBtn = await screen.findByText("Add Employee");
    fireEvent.click(addBtn);
    expect(screen.getByTestId("add-popup")).toBeInTheDocument();
  });
});
