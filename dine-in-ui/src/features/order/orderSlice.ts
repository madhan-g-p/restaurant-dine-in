import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { OrderState, PlaceOrderPayload } from '../../types';
import { createOrder, getOrders, getOrderStatus } from '../../api/orderApi';

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  totalOrders: 0,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
};

export const placeOrder = createAsyncThunk(
  'order/place',
  async (payload: PlaceOrderPayload, { rejectWithValue }) => {
    try {
      return await createOrder(payload);
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || 'Failed to place order');
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'order/fetchAll',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      return await getOrders(page, 10);
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderStatus = createAsyncThunk(
  'order/fetchStatus',
  async (orderId: string, { rejectWithValue }) => {
    try {
      return await getOrderStatus(orderId);
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || 'Failed to fetch order status');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
    },
    clearOrderError(state) {
      state.error = null;
    },
    updateOrderStatus(state, action: { payload: { orderId: string; status: any } }) {
      if (state.currentOrder && state.currentOrder._id === action.payload.orderId) {
        state.currentOrder.status = action.payload.status;
      }
      const idx = state.orders.findIndex((o) => o._id === action.payload.orderId);
      if (idx !== -1) {
        state.orders[idx].status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    // Place order
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orders = [action.payload, ...state.orders];
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch all orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.items;
        state.totalOrders = action.payload.total;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch single order status
    builder
      .addCase(fetchOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        // Also update in the orders list
        const idx = state.orders.findIndex((o) => o.id === action.payload.id);
        if (idx !== -1) {
          state.orders[idx] = action.payload;
        }
      })
      .addCase(fetchOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentOrder, clearOrderError, updateOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;
