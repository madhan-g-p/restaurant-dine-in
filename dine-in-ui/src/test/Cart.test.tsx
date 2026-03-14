import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CartPage from "../pages/CartPage";
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
    quantity: 1,
  },
];

describe("CartPage", () => {
  it("increments quantity and updates total", () => {
    const { store } = renderWithProviders(<CartPage />, {
      preloadedState: {
        cart: { items: mockCartItems as any },
      } as any,
    });

    const incrementBtn = screen.getByText("+");
    fireEvent.click(incrementBtn);

    const state = store.getState();
    expect(state.cart.items[0].quantity).toBe(2);

    // Total calculation: (10 * 2) + 5 delivery = 25
    expect(screen.getByText(/\$25\.00/i)).toBeInTheDocument();
  });

  it("removes the item from the store entirely when decrementing from a quantity of one", () => {
    // 1. Setup with a single item at quantity 1
    const itemToRemove = mockCartItems[0];
    const itemName = itemToRemove.menuItem.name;

    const { store } = renderWithProviders(<CartPage />, {
      preloadedState: {
        cart: {
          items: [{ ...itemToRemove, quantity: 1 }] as any,
        },
      } as any,
    });

    // 2. Action: Click decrement
    const decrementBtn = screen.getByText("−");
    fireEvent.click(decrementBtn);

    // 3. Assertion: The element should NOT be in the DOM
    expect(screen.queryByText(itemName)).not.toBeInTheDocument();

    // 4. Assertion: The store array should be empty
    const finalState = store.getState();
    expect(finalState.cart.items).toHaveLength(0);

    // Checking for non-existence of the specific ID
    const foundItem = finalState.cart.items.find(
      (item: any) => item.menuItem._id === itemToRemove.menuItem._id,
    );
    expect(foundItem).toBeUndefined();
  });
  it("removes item when remove button is clicked", () => {
    const { store } = renderWithProviders(<CartPage />, {
      preloadedState: {
        cart: { items: mockCartItems as any },
      } as any,
    });

    const removeBtn = screen.getByText(/remove/i);
    fireEvent.click(removeBtn);

    const state = store.getState();
    expect(state.cart.items).toHaveLength(0);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });
});
