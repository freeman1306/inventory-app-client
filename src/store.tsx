import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from './store/ordersSlice';
import productsReducer from './store/productsSlice';

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    products: productsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;