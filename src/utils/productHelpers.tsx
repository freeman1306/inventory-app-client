export const formatWarrantyDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const getWarrantyPeriod = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffYears = end.getFullYear() - start.getFullYear();
  
  if (diffYears === 2) return '2 года';
  if (diffYears === 1) return '1 год';
  return `${diffYears} лет`;
};