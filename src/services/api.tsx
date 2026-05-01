import { orders, products } from '../mock/data';

// имитация задержки сети
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchOrders = async () => {
  await delay(300);
  return [...orders];
};

export const fetchProducts = async () => {
  await delay(300);
  return [...products];
};

export const deleteOrder = async (orderId: number) => {
  await delay(500);

  console.log(`deleting order ${orderId}`);
  return true;
};
