import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import type { PayloadAction } from '@reduxjs/toolkit';
import adminApi from '@api/admin';

interface OrdersState {
  activeOrders: any[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  activeOrders: [],
  loading: false,
  error: null,
};

export const fetchAdminActiveOrders = createAsyncThunk('orders/fetchActive', async () => {
  const response = await adminApi.getActiveOrders();
  return response.data;
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminActiveOrders.fulfilled, (state, action) => {
        state.activeOrders = action.payload;
      });
  },
});

export default ordersSlice.reducer;
