import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import adminApi from '@api/admin';

interface TablesState {
  tables: any[];
  loading: boolean;
  error: string | null;
}

const initialState: TablesState = {
  tables: [],
  loading: false,
  error: null,
};

export const fetchAdminTables = createAsyncThunk('tables/fetchAll', async (floor?: number) => {
  const response = await adminApi.getTables(floor);
  return response.data;
});

const tablesSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminTables.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminTables.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.tables = action.payload;
      })
      .addCase(fetchAdminTables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tables';
      });
  },
});

export default tablesSlice.reducer;
