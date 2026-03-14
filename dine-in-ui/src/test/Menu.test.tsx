import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MenuItem from "../components/menu/MenuItem";
import { renderWithProviders } from "./test-utils";

const mockItem = {
  _id: "123",
  name: "Pizza",
  price: 15.99,
  description: "Cheesy pizza",
  image: "pizza.jpg",
  category: "Italian",
};

describe("MenuItem Component", () => {
  it("dispatches addToCart action when button is clicked", () => {
    const { store } = renderWithProviders(<MenuItem item={mockItem as any} />);

    const addButton = screen.getByRole("button", { name: /\+ add to cart/i });
    fireEvent.click(addButton);

    // Check if store updated
    const state = store.getState();
    expect(state.cart.items).toHaveLength(1);
    expect(state.cart.items[0].menuItem._id).toBe("123");
    expect(state.cart.items[0].quantity).toBe(1);
  });

  it("shows success state after adding to cart", () => {
    renderWithProviders(<MenuItem item={mockItem as any} />);

    const addButton = screen.getByRole("button", { name: /\+ add to cart/i });
    fireEvent.click(addButton);

    expect(screen.getByText(/✓ added/i)).toBeInTheDocument();
  });
});
