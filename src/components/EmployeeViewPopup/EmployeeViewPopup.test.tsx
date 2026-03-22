import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import EmployeeViewPopup from "./EmployeeViewPopup";
import "@testing-library/jest-dom";

vi.mock("@/components/ProgressCircle/ProgressCircle", () => ({
  default: ({ value }: { value: number }) => (
    <div data-testid="mock-progress-circle">{value}%</div>
  ),
}));

vi.mock("@/components/Button/Button", () => ({
  default: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

describe("EmployeeViewPopup Component", () => {
  const mockClose = vi.fn();

  const mockEmployee = {
    first_name: "John",
    last_name: "Doe",
    position: "Frontend Developer",
    department: "IT",
    email: "john@example.com",
    phone: "+123456789",
    start_date: "2023-01-01",
    trainingsProgress: 85,
    photo_url: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-03-22"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render employee information correctly", () => {
    render(
      <EmployeeViewPopup employee={mockEmployee} closePopup={mockClose} />,
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("IT")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("+123456789")).toBeInTheDocument();

    const progressElements = screen.getAllByText(/85%/i);
    expect(progressElements.length).toBeGreaterThanOrEqual(1);
    expect(progressElements[0]).toBeInTheDocument();
  });

  it("should calculate tenure correctly (Senior case)", () => {
    render(
      <EmployeeViewPopup employee={mockEmployee} closePopup={mockClose} />,
    );

    expect(screen.getByText("1y 2m")).toBeInTheDocument();
    expect(screen.getByText("Senior")).toBeInTheDocument();
  });

  it("should show 'Onboarding' status for recent hires", () => {
    const newHire = { ...mockEmployee, start_date: "2024-03-20" };
    render(<EmployeeViewPopup employee={newHire} closePopup={mockClose} />);

    expect(screen.getByText("Onboarding")).toBeInTheDocument();
  });

  it("should show 'New Employee' status for hires within 6 months", () => {
    const newbie = { ...mockEmployee, start_date: "2024-01-01" };
    render(<EmployeeViewPopup employee={newbie} closePopup={mockClose} />);

    expect(screen.getByText("New Employee")).toBeInTheDocument();
  });

  it("should show default avatar when photo_url is missing", () => {
    render(
      <EmployeeViewPopup employee={mockEmployee} closePopup={mockClose} />,
    );
    const img = screen.getByAltText("profile") as HTMLImageElement;

    expect(img.src).toContain("user.png");
  });

  it("should call closePopup when clicking the close button", () => {
    render(
      <EmployeeViewPopup employee={mockEmployee} closePopup={mockClose} />,
    );

    const closeBtn = screen.getByAltText("close").parentElement;
    if (closeBtn) fireEvent.click(closeBtn);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("should call closePopup when clicking the overlay", () => {
    const { container } = render(
      <EmployeeViewPopup employee={mockEmployee} closePopup={mockClose} />,
    );

    const overlay = container.firstChild;
    if (overlay) fireEvent.click(overlay);

    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it("should NOT call closePopup when clicking the popup content", () => {
    render(
      <EmployeeViewPopup employee={mockEmployee} closePopup={mockClose} />,
    );

    const popupContent = screen.getByText("John Doe").closest("div");
    if (popupContent) fireEvent.click(popupContent);

    expect(mockClose).not.toHaveBeenCalled();
  });
});
