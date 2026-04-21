// src/presentation/components/features/OrderPanel.jsx
import React, { useState } from 'react';
import { useAuth } from '@presentation/hooks/useAuth.js';
import { useStore } from '@presentation/store/index.js';
import { Notifier } from '@infrastructure/utils/notifier.js';
import { Exporter } from '@infrastructure/utils/exporter.js';

export const OrderPanel = ({ isOpen, onClose, onGoStore }) => {
  if (!isOpen) return null;
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

  const handleExport = () => {
    try {
      Exporter.ordersToCSV(orders);
      Notifier.success('📊 Pedidos exportados a CSV!');
    } catch (error) {
      Notifier.error(error.message);
    }
  };

  const handleUpdateStatus = (orderId, status, message) => {
    updateOrderStatus(orderId, status);
    Notifier.success(message);
  };

  return (
    // ✅ FULL SCREEN
    <div className="fullscreen-panel">
      <div className="fullscreen-header">
        <div className="fullscreen-header-left">
          <h2>📋 Panel de Pedidos</h2>
        </div>

        <div className="fullscreen-header-actions">
          <button className="export-btn">
            📊 Exportar Informe CSV
          </button>

          <button className="store-btn" onClick={onGoStore}>
            🏪 Ir a la Tienda
          </button>

          <button
            className="close-fullscreen-btn"
            onClick={onClose}
            title="Cerrar panel"
          >
            ✕
          </button>
        </div>
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

      {/* CONTENT */}
      <div className="fullscreen-content">
        <div className="orders-list">

          {filteredOrders.length === 0 ? (
            <div className="empty-orders">
              <p>📭 No hay pedidos</p>
              <span>
                {filter !== 'all'
                  ? `con estado "${STATUS[filter]?.label}"`
                  : 'aún. Los pedidos aparecerán aquí.'
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
                    <p>🛒 {order.items?.length} artículos</p>
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

                {/* ACCIONES */}
                <div className="order-actions">
                  {order.status === 'pending' && (
                    <>
                      <button
                        className="btn-paid"
                        onClick={() => handleUpdateStatus(
                          order.id,
                          'paid',
                          '✅ Pedido marcado como pagado'
                        )}
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
                              handleUpdateStatus(
                                order.id,
                                'cancelled',
                                '❌ Pedido cancelado'
                              );
                            }
                          }}
                        >
                          ❌ Cancelar
                        </button>
                      )}
                    </>
                  )}

                  {order.status === 'paid' && (
                    <button
                      className="btn-ship"
                      onClick={() => {
                        if (window.confirm('¿Confirmar despacho del pedido?')) {
                          handleUpdateStatus(
                            order.id,
                            'shipped',
                            '🚚 Pedido despachado!'
                          );
                        }
                      }}
                    >
                      🚚 Despachar Pedido
                    </button>
                  )}

                  {order.status === 'shipped' && (
                    <div className="shipped-label">
                      ✅ Pedido Despachado - Completado
                    </div>
                  )}

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