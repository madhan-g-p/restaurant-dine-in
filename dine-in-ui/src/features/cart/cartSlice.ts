import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, CartState, MenuItem } from '../../types';

const initialState = {
  items: [] as CartItem[],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<MenuItem>) {
      const existing = state.items.find(
        (item) => item.menuItem._id === action.payload._id
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ _id: action.payload._id, menuItem: action.payload, quantity: 1 });
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (item) => item.menuItem._id !== action.payload
      );
    },
    updateQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) {
      const item = state.items.find(
        (item) => item.menuItem._id === action.payload.id
      );
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            (i) => i.menuItem._id !== action.payload.id
          );
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

// ─── Selectors ──────────────────────────────────────────────
export const selectCartSubtotal = (state: { cart: CartState }) =>
  state.cart.items.reduce(
    (sum: number, item: CartItem) => sum + item.menuItem.price * item.quantity,
    0
  );

export const selectCartTotalQuantity = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
