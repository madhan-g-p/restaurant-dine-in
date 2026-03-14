import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { MenuState } from '../../types';
import { getMenuItems } from '../../api/menuApi';

const initialState: MenuState = {
  items: [],
  totalItems: 0,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
};

export const fetchMenuItems = createAsyncThunk(
  'menu/fetchItems',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      return await getMenuItems(page, 10);
    } catch (err) {
      const error = err as Error;
      return rejectWithValue(error.message || 'Failed to fetch menu');
    }
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.total;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default menuSlice.reducer;
