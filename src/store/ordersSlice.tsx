import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '../types';
import { fetchOrders as fetchOrdersApi, deleteOrder as deleteOrderApi } from '../services/api';

interface OrdersState {
  list: Order[];
  loading: boolean;
  error: string | null;
}

export const loadOrders = createAsyncThunk<Order[]>('orders/load', async () => {
  const data = await fetchOrdersApi();
  return data;
});

export const removeOrder = createAsyncThunk<number, number>('orders/remove', async (orderId) => {
  await deleteOrderApi(orderId);
  return orderId;
});

const initialState: OrdersState = {
  list: [],
  loading: false,
  error: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(loadOrders.pending, (state) => {
          state.loading = true;
        })
        .addCase(loadOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.list = action.payload;
        })
        .addCase(loadOrders.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Ошибка загрузки';
        })
        .addCase(removeOrder.fulfilled, (state, action: PayloadAction<number>) => {
          state.list = state.list.filter(order => order.id !== action.payload);
        });
  }
});

export default ordersSlice.reducer;