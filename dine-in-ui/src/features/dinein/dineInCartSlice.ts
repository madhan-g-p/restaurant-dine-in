import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface DineInCartState {
  items: CartItem[];
}

const CART_STORAGE_KEY = 'dinein_cart';

const loadCart = (): CartItem[] => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const initialState: DineInCartState = {
  items: loadCart(),
};

const dineInCartSlice = createSlice({
  name: 'dineInCart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((i) => i.menuItemId === action.payload.menuItemId);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.menuItemId !== action.payload);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    },
    updateQuantity: (state, action: PayloadAction<{ menuItemId: string; quantity: number }>) => {
      const item = state.items.find((i) => i.menuItemId === action.payload.menuItemId);
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.menuItemId !== action.payload.menuItemId);
        }
      }
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem(CART_STORAGE_KEY);
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = dineInCartSlice.actions;
export default dineInCartSlice.reducer;
