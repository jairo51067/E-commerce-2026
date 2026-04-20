// src/presentation/components/features/OrderPanel.jsx - COMPLETO FINAL
import React, { useState } from 'react';
import { useAuth } from '@presentation/hooks/useAuth.js';
import { useStore } from '@presentation/store/index.js';

export const OrderPanel = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const orders = useStore((state) => state.orders);
  const updateOrderStatus = useStore((state) => state.updateOrderStatus);
  const [filter, setFilter] = useState('all');

  if (!isOpen) return null;

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter);

  const STATUS = {
    pending:   { label: '⏳ Pendiente',  color: '#FF9500' },
    paid:      { label: '✅ Pagado',      color: '#007AFF' },
    shipped:   { label: '🚚 Despachado', color: '#34C759' },
    cancelled: { label: '❌ Cancelado',  color: '#FF3B30' }
  };

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="order-panel" onClick={e => e.stopPropagation()}>

        {/* HEADER */}
        <div className="panel-header">
          <div>
            <h2>📋 Panel de Pedidos</h2>
            <span className="panel-user">
              👤 {user?.name} | {user?.role}
            </span>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* STATS */}
        <div className="order-stats">
          <div className="stat-box">
            <strong>{orders.length}</strong>
            <span>Total Pedidos</span>
          </div>
          <div className="stat-box" style={{background: '#FFF3E0'}}>
            <strong style={{color: '#FF9500'}}>
              {orders.filter(o => o.status === 'pending').length}
            </strong>
            <span>Pendientes</span>
          </div>
          <div className="stat-box" style={{background: '#E3F2FD'}}>
            <strong style={{color: '#007AFF'}}>
              {orders.filter(o => o.status === 'paid').length}
            </strong>
            <span>Pagados</span>
          </div>
          <div className="stat-box" style={{background: '#E8F5E9'}}>
            <strong style={{color: '#34C759'}}>
              {orders.filter(o => o.status === 'shipped').length}
            </strong>
            <span>Despachados</span>
          </div>
          <div className="stat-box" style={{background: '#F3E5F5'}}>
            <strong style={{color: '#764ba2'}}>
              ${totalRevenue.toFixed(2)}
            </strong>
            <span>Ingresos</span>
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
              {f === 'all' ? '📋 Todos' : STATUS[f]?.label}
            </button>
          ))}
        </div>

        {/* LISTA PEDIDOS */}
        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="empty-orders">
              <p>📭 No hay pedidos</p>
              <span>
                {filter !== 'all'
                  ? `con estado "${STATUS[filter]?.label}"`
                  : 'aún'
                }
              </span>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="order-card">

                {/* ORDER HEADER */}
                <div className="order-card-header">
                  <div>
                    <strong>#{order.id}</strong>
                    <span className="order-date">
                      ⏰ {new Date(order.createdAt).toLocaleString('es-VE')}
                    </span>
                  </div>
                  <span
                    className="status-badge"
                    style={{ background: STATUS[order.status]?.color }}
                  >
                    {STATUS[order.status]?.label}
                  </span>
                </div>

                {/* ORDER BODY */}
                <div className="order-card-body">
                  <div className="order-info-grid">
                    <p>👤 <strong>{order.customer?.name}</strong></p>
                    <p>📞 {order.customer?.phone}</p>
                    <p>
                      {order.customer?.deliveryType === 'delivery'
                        ? `🚚 Delivery: ${order.customer?.address}`
                        : '🏪 Retiro en tienda'
                      }
                    </p>
                  </div>

                  {/* ITEMS */}
                  <div className="order-items">
                    {order.items?.map(item => (
                      <div key={item.id} className="order-item-row">
                        <span>{item.name} x{item.quantity}</span>
                        <span>
                          ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* TOTALES */}
                  <div className="order-totals">
                    <div className="order-total-row">
                      <span>Subtotal:</span>
                      <span>${Number(order.subtotal).toFixed(2)}</span>
                    </div>
                    {order.deliveryCost > 0 && (
                      <div className="order-total-row">
                        <span>🚚 Delivery:</span>
                        <span>+${Number(order.deliveryCost).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="order-total-row total">
                      <strong>TOTAL:</strong>
                      <strong style={{color: '#34C759'}}>
                        ${Number(order.total).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* ACCIONES SEGÚN ROL Y STATUS */}
                <div className="order-actions">

                  {/* PENDING → Marcar Pagado o Cancelar */}
                  {order.status === 'pending' && (
                    <>
                      <button
                        className="btn-paid"
                        onClick={() => updateOrderStatus(order.id, 'paid')}
                      >
                        ✅ Marcar Pagado
                      </button>
                      {(user?.role === 'GERENTE' ||
                        user?.role === 'ADMIN' ||
                        user?.role === 'SUPERUSER') && (
                        <button
                          className="btn-cancel-order"
                          onClick={() => {
                            if (window.confirm('¿Cancelar este pedido?')) {
                              updateOrderStatus(order.id, 'cancelled');
                            }
                          }}
                        >
                          ❌ Cancelar
                        </button>
                      )}
                    </>
                  )}

                  {/* PAID → Despachar */}
                  {order.status === 'paid' && (
                    <button
                      className="btn-ship"
                      onClick={() => {
                        if (window.confirm('¿Confirmar despacho?')) {
                          updateOrderStatus(order.id, 'shipped');
                        }
                      }}
                    >
                      🚚 Despachar Pedido
                    </button>
                  )}

                  {/* SHIPPED → Inmutable */}
                  {order.status === 'shipped' && (
                    <div className="shipped-label">
                      ✅ Pedido Despachado - No modificable
                    </div>
                  )}

                  {/* CANCELLED */}
                  {order.status === 'cancelled' && (
                    <div className="cancelled-label">
                      ❌ Pedido Cancelado
                    </div>
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