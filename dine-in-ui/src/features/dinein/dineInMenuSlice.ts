import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import dineInApi from '../../api/dinein';

interface DineInMenuState {
  categories: any[];
  heatmap: {
    level: 'LOW' | 'MEDIUM' | 'HIGH';
    occupancyRate: number;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: DineInMenuState = {
  categories: [],
  heatmap: null,
  loading: false,
  error: null,
};

export const fetchDineInMenu = createAsyncThunk(
  'dineInMenu/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dineInApi.getMenu();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load menu');
    }
  }
);

export const fetchHeatmap = createAsyncThunk(
  'dineInMenu/fetchHeatmap',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dineInApi.getHeatmap();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load heatmap');
    }
  }
);

const dineInMenuSlice = createSlice({
  name: 'dineInMenu',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDineInMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDineInMenu.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchDineInMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchHeatmap.fulfilled, (state, action: PayloadAction<any>) => {
        state.heatmap = action.payload;
      });
  },
});

export default dineInMenuSlice.reducer;
