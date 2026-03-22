import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, describe, it, expect } from "vitest";
import Button from "./Button";
import styles from "./Button.module.scss";
import "@testing-library/jest-dom";

describe("Button Component", () => {
  it("should render correctly with default props", () => {
    render(<Button type="button">Click Me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass(styles.button);
    expect(button).toHaveClass(styles.blue);
    expect(button).toHaveClass(styles.medium);
    expect(button).toHaveClass(styles.upper);
  });

  it("should apply custom color and size classes", () => {
    const { container } = render(
      <Button type="submit" color="red" size="large" textSize="lower">
        Delete
      </Button>,
    );

    const button = container.querySelector("button");

    // Check if classes exist in the string.
    // This works even if CSS modules are mocked as strings.
    expect(button?.className).toContain("red");
    expect(button?.className).toContain("large");
    expect(button?.className).toContain("lower");
    expect(button?.className).toContain("button");
  });

  it("should call onClick handler when clicked", async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(
      <Button type="button" onClick={mockOnClick}>
        Interactive
      </Button>,
    );

    const button = screen.getByRole("button", { name: /interactive/i });
    await user.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it("should render children correctly (ReactNode)", () => {
    render(
      <Button type="button">
        <span data-testid="icon">🔥</span>
        Icon Button
      </Button>,
    );

    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByText(/icon button/i)).toBeInTheDocument();
  });

  it("should use 'button' as default type if not provided", () => {
    // @ts-ignore
    render(<Button color="light">Fallback Type</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "button");
  });
});
