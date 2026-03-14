import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import dineInApi from '../../api/dinein';

interface OrderState {
  orderId: string | null;
  status: string | null;
  items: any[];
  createdAt: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orderId: null,
  status: null,
  items: [],
  createdAt: null,
  loading: false,
  error: null,
};

export const placeDineInOrder = createAsyncThunk(
  'dineInOrder/place',
  async (items: { menuItemId: string; quantity: number }[], { rejectWithValue }) => {
    try {
      const response = await dineInApi.placeOrder(items);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to place order');
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  'dineInOrder/fetchDetails',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await dineInApi.getOrder(orderId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load order');
    }
  }
);

const dineInOrderSlice = createSlice({
  name: 'dineInOrder',
  initialState,
  reducers: {
    updateLocalOrderStatus: (state, action: PayloadAction<any>) => {
      if (action.payload.status) state.status = action.payload.status;
      if (action.payload.items) state.items = action.payload.items;
    },
    resetOrderState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeDineInOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeDineInOrder.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.orderId = action.payload.order._id;
        state.status = action.payload.order.status;
        state.items = action.payload.items;
        state.createdAt = action.payload.order.createdAt;
      })
      .addCase(placeDineInOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action: PayloadAction<any>) => {
        state.orderId = action.payload.order._id;
        state.status = action.payload.order.status;
        state.items = action.payload.items;
        state.createdAt = action.payload.order.createdAt;
      });
  },
});

export const { updateLocalOrderStatus, resetOrderState } = dineInOrderSlice.actions;
export default dineInOrderSlice.reducer;
