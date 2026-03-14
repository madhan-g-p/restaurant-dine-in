import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@features/auth/authSlice';
import tablesReducer from '@features/tables/tablesSlice';
import menuReducer from '@features/menu/menuSlice';
import ordersReducer from '@features/orders/ordersSlice';

import { apiSlice } from '@api/apiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tables: tablesReducer,
    menu: menuReducer,
    orders: ordersReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
