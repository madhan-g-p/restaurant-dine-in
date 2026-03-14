import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getBrowserFingerprint } from '../../utils/fingerprint';
import dineInApi from '../../api/dinein';

interface SessionState {
  sessionId: string | null;
  tableId: string | null;
  tableNumber: string | null;
  seatCount: number | null;
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
}

const initialState: SessionState = {
  sessionId: null,
  tableId: null,
  tableNumber: null,
  seatCount: null,
  status: 'idle',
  error: null,
};

export const initDineInSession = createAsyncThunk(
  'session/init',
  async (tableNumber: string, { rejectWithValue }) => {
    try {
      const fingerprint = await getBrowserFingerprint();
      const response = await dineInApi.initSession(tableNumber, fingerprint);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to initialize session');
    }
  }
);

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    clearSession: (state) => {
      state.sessionId = null;
      state.tableId = null;
      state.tableNumber = null;
      state.seatCount = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('dinein_table_number');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initDineInSession.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(initDineInSession.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'ready';
        state.sessionId = action.payload.sessionId;
        state.tableId = action.payload.tableId;
        state.tableNumber = action.payload.tableNumber;
        state.seatCount = action.payload.seatCount;
        localStorage.setItem('dinein_table_number', action.payload.tableNumber);
      })
      .addCase(initDineInSession.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload as string;
      });
  },
});

export const { clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
