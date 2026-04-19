// src/presentation/components/features/OrderPanel.jsx
import React, { useState } from 'react';
import { useAuth } from '@presentation/hooks/useAuth.js';
import { useStore } from '@presentation/store/index.js';

export const OrderPanel = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useStore();
  const [filter, setFilter] = useState('all');

  if (!isOpen) return null;

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FF9500',
      paid: '#007AFF',
      shipped: '#34C759',
      cancelled: '#FF3B30'
    };
    return colors[status] || '#666';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: '⏳ Pendiente',
      paid: '✅ Pagado',
      shipped: '🚚 Despachado',
      cancelled: '❌ Cancelado'
    };
    return labels[status] || status;
  };

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="order-panel" onClick={e => e.stopPropagation()}>

        {/* HEADER */}
        <div className="panel-header">
          <div>
            <h2>📋 Panel de Pedidos</h2>
            <span className="panel-user">👤 {user?.name} | {user?.role}</span>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* STATS */}
        <div className="order-stats">
          <div className="stat-card">
            <span>{orders.length}</span>
            <p>Total</p>
          </div>
          <div className="stat-card pending">
            <span>{orders.filter(o => o.status === 'pending').length}</span>
            <p>Pendientes</p>
          </div>
          <div className="stat-card paid">
            <span>{orders.filter(o => o.status === 'paid').length}</span>
            <p>Pagados</p>
          </div>
          <div className="stat-card shipped">
            <span>{orders.filter(o => o.status === 'shipped').length}</span>
            <p>Despachados</p>
          </div>
        </div>

        {/* FILTROS */}
        <div className="order-filters">
          {['all', 'pending', 'paid', 'shipped', 'cancelled'].map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Todos' : getStatusLabel(f)}
            </button>
          ))}
        </div>

        {/* LISTA PEDIDOS */}
        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="empty-orders">
              <p>📭 No hay pedidos {filter !== 'all' ? `con estado "${filter}"` : ''}</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <strong>#{order.id}</strong>
                  <span
                    className="status-badge"
                    style={{ background: getStatusColor(order.status) }}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="order-card-body">
                  <p>👤 {order.customer?.name}</p>
                  <p>📞 {order.customer?.phone}</p>
                  <p>
                    {order.customer?.deliveryType === 'delivery'
                      ? `🚚 Delivery: ${order.customer?.address}`
                      : '🏪 Retiro en tienda'
                    }
                  </p>
                  <p>🛒 {order.items?.length} artículos</p>
                  <p>💰 Total: <strong>${order.total?.toFixed(2)}</strong></p>
                  <p>⏰ {new Date(order.createdAt).toLocaleString('es-VE')}</p>
                </div>

                {/* ACCIONES SEGÚN ROL */}
                <div className="order-actions">
                  {order.status === 'pending' && (
                    <>
                      <button
                        className="btn-paid"
                        onClick={() => updateOrderStatus(order.id, 'paid')}
                      >
                        ✅ Marcar Pagado
                      </button>
                      {user?.role === 'GERENTE' && (
                        <button
                          className="btn-cancel"
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        >
                          ❌ Cancelar
                        </button>
                      )}
                    </>
                  )}
                  {order.status === 'paid' && (
                    <button
                      className="btn-ship"
                      onClick={() => updateOrderStatus(order.id, 'shipped')}
                    >
                      🚚 Despachar
                    </button>
                  )}
                  {order.status === 'shipped' && (
                    <span className="shipped-label">
                      ✅ Pedido Despachado
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};