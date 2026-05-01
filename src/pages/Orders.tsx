import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ORDERS, DELETE_ORDER } from '../graphql/queries';
import { Order } from '../types';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import OrdersChart from '../components/OrdersChart';

function Orders() {
  const { loading, error, data, refetch } = useQuery(GET_ORDERS);
  const [deleteOrder] = useMutation(DELETE_ORDER);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, orderId: null as number | null, orderName: '' });
  const [showChart, setShowChart] = useState(false);

  const handleDeleteClick = (orderId: number, orderName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteModal({ show: true, orderId, orderName });
  };

  const confirmDelete = async () => {
    if (deleteModal.orderId) {
      await deleteOrder({ variables: { id: String(deleteModal.orderId) } });
      refetch();
      setDeleteModal({ show: false, orderId: null, orderName: '' });
      if (selectedOrder && selectedOrder.id === deleteModal.orderId) {
        setSelectedOrder(null);
      }
    }
  };

  const closeModal = () => {
    setDeleteModal({ show: false, orderId: null, orderName: '' });
  };

  if (loading) return <div className="p-3">Загрузка приходов...</div>;
  if (error) return <div className="p-3 text-danger">Ошибка: {error.message}</div>;

  const orders = data?.orders || [];

  return (
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h3 mb-0">Приходы / {orders.length}</h2>
          <div>
            <button
                className="btn btn-outline-info btn-sm me-2"
                onClick={() => setShowChart(!showChart)}
            >
              {showChart ? 'Скрыть график' : 'Показать график'}
            </button>
            <button className="btn btn-outline-primary btn-sm">+</button>
          </div>
        </div>

        {showChart && (
            <div className="mb-4 p-3 border rounded bg-light">
              <OrdersChart orders={orders} />
            </div>
        )}

        <div className="row">
          <div className={selectedOrder ? 'col-7' : 'col-12'}>
            {orders.map((order: any) => (
                <div
                    key={order.id}
                    className="card mb-3 shadow-sm"
                    style={{ cursor: 'pointer' }}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1" onClick={() => setSelectedOrder(order)}>
                        <h5 className="card-title mb-2">{order.name}</h5>
                        <div className="row small text-secondary mb-2">
                          <div className="col-md-3">
                            📦 {order.productsCount} Продуктов
                          </div>
                          <div className="col-md-4">
                            📅 {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className="col-md-5">
                            💵 {order.totalUSD.toFixed(2)} $ | {order.totalUAH.toFixed(2)} UAH
                          </div>
                        </div>
                      </div>
                      <button
                          className="btn btn-sm btn-outline-danger ms-3"
                          onClick={(e) => handleDeleteClick(Number(order.id), order.name, e)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
            ))}
          </div>

          {selectedOrder && (
              <div className="col-5">
                <div className="card shadow-sm">
                  <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <strong>Детали прихода</strong>
                    <button
                        className="btn-close"
                        onClick={() => setSelectedOrder(null)}
                    ></button>
                  </div>
                  <div className="card-body">
                    <h6>{selectedOrder.name}</h6>
                    <hr />
                    <div className="small">
                      <div>Создан: {new Date(selectedOrder.createdAt).toLocaleDateString()}</div>
                      <div className="mt-2">
                        <strong>Продукты:</strong>
                        <ul className="list-unstyled mt-1">
                          {selectedOrder.products?.map((p: any) => (
                              <li key={p.id} className="mb-2">
                                {p.name}
                                <br />
                                <span className="text-secondary">SN: {p.sn}</span>
                              </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          )}
        </div>

        <ConfirmDeleteModal
            show={deleteModal.show}
            onClose={closeModal}
            onConfirm={confirmDelete}
            orderName={deleteModal.orderName}
        />
      </div>
  );
}

export default Orders;