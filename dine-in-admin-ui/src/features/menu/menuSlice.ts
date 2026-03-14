import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import adminApi from '@api/admin';

interface MenuState {
  categories: any[];
  items: any[];
  currentCategory: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  categories: [],
  items: [],
  currentCategory: null,
  loading: false,
  error: null,
};

export const fetchAdminCategories = createAsyncThunk('menu/fetchCategories', async () => {
  const response = await adminApi.getCategories();
  return response.data;
});

export const fetchAdminItems = createAsyncThunk('menu/fetchItems', async (categoryId: string) => {
  const response = await adminApi.getItems(categoryId);
  return response.data;
});

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setCurrentCategory: (state, action: PayloadAction<string | null>) => {
      state.currentCategory = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchAdminItems.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { setCurrentCategory } = menuSlice.actions;
export default menuSlice.reducer;
