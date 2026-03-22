import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LoginInput from "./LoginInput";
import "@testing-library/jest-dom";

describe("LoginInput Component", () => {
  const mockRegister = {
    onChange: vi.fn(),
    onBlur: vi.fn(),
    name: "email",
    ref: vi.fn(),
  };

  const defaultProps = {
    icon: "email-icon.svg",
    text: "Enter your email",
    type: "email" as const,
    register: mockRegister as any,
    required: true,
  };

  it("should render input with correct placeholder and type", () => {
    render(<LoginInput {...defaultProps} />);

    const input = screen.getByPlaceholderText("Enter your email");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "email");
    expect(input).toBeRequired();
  });

  it("should render the icon with correct alt text", () => {
    render(<LoginInput {...defaultProps} />);

    const icon = screen.getByAltText("Enter your email Icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("src", "email-icon.svg");
  });

  it("should display error message and apply error class when error prop is provided", () => {
    const errorMessage = "Invalid email address";
    render(<LoginInput {...defaultProps} error={errorMessage} />);

    const errorSpan = screen.getByRole("alert");
    expect(errorSpan).toBeInTheDocument();
    expect(errorSpan).toHaveTextContent(errorMessage);

    const input = screen.getByPlaceholderText("Enter your email");
    expect(input.className).toMatch(/error/);
  });

  it("should not display error message when error prop is undefined", () => {
    render(<LoginInput {...defaultProps} error={undefined} />);

    const errorSpan = screen.queryByRole("alert");
    expect(errorSpan).not.toBeInTheDocument();
  });

  it("should apply 'required' attribute based on prop", () => {
    const { rerender } = render(
      <LoginInput {...defaultProps} required={true} />,
    );
    expect(screen.getByPlaceholderText("Enter your email")).toBeRequired();

    rerender(<LoginInput {...defaultProps} required={false} />);
    expect(screen.getByPlaceholderText("Enter your email")).not.toBeRequired();
  });
});
