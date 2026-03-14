import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CheckoutPage from "../pages/CheckoutPage";
import { renderWithProviders } from "./test-utils";

const mockCartItems = [
  {
    menuItem: {
      _id: "1",
      name: "Burger",
      price: 10,
      image: "",
      description: "Tasty burger",
      category: "Main",
    },
    quantity: 2,
  },
];

describe("CheckoutPage", () => {
  it("renders checkout form", () => {
    renderWithProviders(<CheckoutPage />, {
      preloadedState: {
        cart: { items: mockCartItems as any },
      } as any,
    });
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/delivery address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
  });

  it("validates required fields on submit", () => {
    renderWithProviders(<CheckoutPage />, {
      preloadedState: {
        cart: { items: mockCartItems as any },
      } as any,
    });

    const submitBtn = screen.getByRole("button", { name: /confirm order/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/address is required/i)).toBeInTheDocument();
    expect(screen.getByText(/phone number is required/i)).toBeInTheDocument();
  });

  it("shows error for short address", () => {
    renderWithProviders(<CheckoutPage />, {
      preloadedState: {
        cart: { items: mockCartItems as any },
      } as any,
    });

    const addressInput = screen.getByLabelText(/delivery address/i);
    fireEvent.change(addressInput, { target: { value: "Short" } });

    const submitBtn = screen.getByRole("button", { name: /confirm order/i });
    fireEvent.click(submitBtn);

    expect(
      screen.getByText(/please enter a complete address/i),
    ).toBeInTheDocument();
  });
});
