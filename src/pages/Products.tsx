import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../graphql/queries';
import ProductCard from '../components/ProductCard';
import ProductTypeFilter from '../components/ProductTypeFilter';
import { useProductFilterWorker } from '../hooks/useProductFilterWorker';
import { Product } from '../types';

function Products() {
  const { loading, error, data } = useQuery(GET_PRODUCTS);
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { list: productsList } = data?.products || { list: [] };

  // Получаем уникальные типы
  const productTypes = useMemo(() => {
    if (!productsList) return [];
    const types = new Set(productsList.map((p: Product) => p.type));
    return Array.from(types);
  }, [productsList]);

  // Используем Web Worker для фильтрации
  const { filteredProducts, isFiltering, filterTime } = useProductFilterWorker({
    products: productsList || [],
    filterType: selectedType,
    searchTerm
  });

  const getOrderName = (orderId: number) => {
    // TODO: подтянуть из глобального store или отдельного запроса
    return `Order #${orderId}`;
  };

  if (loading) return <div className="p-4">Загрузка продуктов...</div>;
  if (error) return <div className="p-4 text-danger">Ошибка: {error.message}</div>;

  return (
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h3 mb-0">
            Продукты / {filteredProducts.length}
            {isFiltering && <span className="ms-2 spinner-border spinner-border-sm" />}
          </h2>
          <button className="btn btn-outline-primary btn-sm">+ Добавить продукт</button>
        </div>

        {filterTime && (
            <div className="alert alert-info alert-sm py-1 px-2 mb-2" style={{ fontSize: '12px' }}>
              ⚡ Фильтрация заняла {filterTime.toFixed(2)} мс (Web Worker)
            </div>
        )}

        <div className="row mb-3">
          <div className="col-md-4">
            <ProductTypeFilter
                types={productTypes as string[]}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
            />
          </div>
          <div className="col-md-4">
            <input
                type="text"
                className="form-control"
                placeholder="🔍 Поиск по названию или SN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
            <div className="alert alert-info">
              Нет продуктов по выбранным критериям
            </div>
        ) : (
            filteredProducts.map((product: Product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    orderName={getOrderName(product.orderId)}
                />
            ))
        )}
      </div>
  );
}

export default Products;