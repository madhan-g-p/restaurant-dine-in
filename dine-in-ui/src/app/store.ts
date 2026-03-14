import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import menuReducer from '../features/menu/menuSlice';
import cartReducer from '../features/cart/cartSlice';
import orderReducer from '../features/order/orderSlice';
// DineIn MVP
import sessionReducer from '../features/dinein/sessionSlice';
import dineInMenuReducer from '../features/dinein/dineInMenuSlice';
import dineInCartReducer from '../features/dinein/dineInCartSlice';
import dineInOrderReducer from '../features/dinein/dineInOrderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    menu: menuReducer,
    cart: cartReducer,
    order: orderReducer,
    // DineIn MVP
    dineInSession: sessionReducer,
    dineInMenu: dineInMenuReducer,
    dineInCart: dineInCartReducer,
    dineInOrder: dineInOrderReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

