import { products } from '../mock/data';

type Currency = 'USD' | 'UAH';
type DateFormat = 'short' | 'long';

export const getOrderProducts = (orderId: number) => {
  return products.filter((p) => p.orderId === orderId);
};

export const getOrderTotalPrice = (orderId: number, currency: Currency) => {
  const orderProducts = getOrderProducts(orderId);

  if (currency === 'USD') {
    return orderProducts.reduce((sum, p) => sum + p.priceUSD, 0);
  } else if (currency === 'UAH') {
    return orderProducts.reduce((sum, p) => sum + p.priceUAH, 0);
  }
  return 0;
};

export const formatDate = (isoString: string, format: DateFormat = 'short') => {
  const date = new Date(isoString);
  if (format === 'short') {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } else if (format === 'long') {
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }
  return date.toLocaleDateString();
};
