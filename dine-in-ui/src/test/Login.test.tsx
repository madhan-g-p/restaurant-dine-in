import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LoginPage from "../pages/LoginPage";
import { renderWithProviders } from "./test-utils";

describe("LoginPage", () => {
  it("renders login form items", () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("shows error messages for empty fields on submit", () => {
    renderWithProviders(<LoginPage />);
    const submitBtn = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it("shows error for invalid email format", () => {
    renderWithProviders(<LoginPage />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@example" } });

    const submitBtn = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Enter a valid email/i)).toBeInTheDocument();
  });

  it("validates password length", () => {
    renderWithProviders(<LoginPage />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "123" } });

    const submitBtn = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitBtn);

    expect(
      screen.getByText(/password must be at least 6 characters/i),
    ).toBeInTheDocument();
  });
});
