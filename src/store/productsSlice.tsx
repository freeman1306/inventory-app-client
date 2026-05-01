import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchProducts as fetchProductsApi } from '../services/api';
import { Product } from '../types';

interface ProductsState {
  list: Product[];
  loading: boolean;
  error: string | null;
}

export const loadProducts = createAsyncThunk('products/load', async () => {
  const data = await fetchProductsApi();
  return data;
});

const initialState: ProductsState = {
  list: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    removeProductsByOrder: (state, action: PayloadAction<number>) => {
      const orderId = action.payload;
      state.list = state.list.filter((p) => p.orderId !== orderId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load products';
      });
  },
});

export const { removeProductsByOrder } = productsSlice.actions;
export default productsSlice.reducer;
