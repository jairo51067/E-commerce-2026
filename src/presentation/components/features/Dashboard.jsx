// src/presentation/components/features/Dashboard.jsx
import React, { useMemo } from 'react';
import { useStore } from '@presentation/store/index.js';
import { Statistics } from '@infrastructure/utils/statistics.js';

export const Dashboard = () => {
  const orders = useStore((state) => state.orders);
  const products = useStore((state) => state.products);

  const stats = useMemo(
    () => Statistics.getGeneralStats(orders),
    [orders]
  );

  const salesByDay = useMemo(
    () => Statistics.getSalesByDay(orders, 7),
    [orders]
  );

  const topProducts = useMemo(
    () => Statistics.getTopProducts(orders, 5),
    [orders]
  );

  const customers = useMemo(
    () => Statistics.getUniqueCustomers(orders),
    [orders]
  );

  const lowStock = useMemo(
    () => Statistics.getLowStock(products, 3),
    [products]
  );

  const outOfStock = useMemo(
    () => Statistics.getOutOfStock(products),
    [products]
  );

  const maxRevenue = Math.max(...salesByDay.map(d => d.revenue), 1);

  return (
    <div className="dashboard">

      {/* ===== KPIs PRINCIPALES ===== */}
      <div className="dashboard-kpis">
        <div className="kpi-card kpi-primary">
          <div className="kpi-icon">💰</div>
          <div className="kpi-content">
            <span className="kpi-label">Ingresos Totales</span>
            <strong className="kpi-value">
              ${stats.totalRevenue.toFixed(2)}
            </strong>
            <span className="kpi-sub">
              {stats.totalOrders} pedidos
            </span>
          </div>
        </div>

        <div className="kpi-card kpi-success">
          <div className="kpi-icon">🛒</div>
          <div className="kpi-content">
            <span className="kpi-label">Ticket Promedio</span>
            <strong className="kpi-value">
              ${stats.avgOrderValue.toFixed(2)}
            </strong>
            <span className="kpi-sub">
              por pedido
            </span>
          </div>
        </div>

        <div className="kpi-card kpi-warning">
          <div className="kpi-icon">📦</div>
          <div className="kpi-content">
            <span className="kpi-label">Productos Vendidos</span>
            <strong className="kpi-value">
              {stats.totalProducts}
            </strong>
            <span className="kpi-sub">
              unidades
            </span>
          </div>
        </div>

        <div className="kpi-card kpi-info">
          <div className="kpi-icon">👥</div>
          <div className="kpi-content">
            <span className="kpi-label">Clientes Únicos</span>
            <strong className="kpi-value">
              {customers.length}
            </strong>
            <span className="kpi-sub">
              {stats.conversionRate}% conversión
            </span>
          </div>
        </div>
      </div>

      {/* ===== ESTADOS DE PEDIDOS ===== */}
      <div className="dashboard-section">
        <h3 className="section-title">📊 Estado de Pedidos</h3>
        <div className="status-cards">
          <div className="status-card status-pending">
            <span className="status-num">{stats.pendingOrders}</span>
            <span className="status-label">⏳ Pendientes</span>
          </div>
          <div className="status-card status-paid">
            <span className="status-num">{stats.paidOrders}</span>
            <span className="status-label">✅ Pagados</span>
          </div>
          <div className="status-card status-shipped">
            <span className="status-num">{stats.shippedOrders}</span>
            <span className="status-label">🚚 Despachados</span>
          </div>
          <div className="status-card status-cancelled">
            <span className="status-num">{stats.cancelledOrders}</span>
            <span className="status-label">❌ Cancelados</span>
          </div>
        </div>
      </div>

      {/* ===== GRÁFICA VENTAS 7 DÍAS ===== */}
      <div className="dashboard-section">
        <h3 className="section-title">📈 Ventas Últimos 7 Días</h3>
        <div className="chart-container">
          {salesByDay.map((day, index) => {
            const heightPct = maxRevenue > 0
              ? (day.revenue / maxRevenue) * 100
              : 0;

            return (
              <div key={index} className="chart-bar-wrap">
                <div className="chart-value">
                  ${day.revenue.toFixed(0)}
                </div>
                <div
                  className="chart-bar"
                  style={{ height: `${heightPct}%` }}
                  title={`${day.fullDate}: $${day.revenue.toFixed(2)} (${day.orders} pedidos)`}
                >
                  {day.orders > 0 && (
                    <span className="chart-orders">{day.orders}</span>
                  )}
                </div>
                <div className="chart-label">{day.date}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== TOP PRODUCTOS ===== */}
      <div className="dashboard-section">
        <h3 className="section-title">🏆 Top 5 Productos Más Vendidos</h3>

        {topProducts.length === 0 ? (
          <div className="empty-section">
            <p>📊 No hay datos de ventas aún</p>
            <span>Los productos más vendidos aparecerán aquí</span>
          </div>
        ) : (
          <div className="top-products">
            {topProducts.map((product, index) => (
              <div key={product.id} className="top-product-row">
                <span className="top-rank">#{index + 1}</span>
                <img
                  src={product.image}
                  alt={product.name}
                  onError={e => {
                    e.target.src = 'https://placehold.co/60';
                  }}
                />
                <div className="top-product-info">
                  <strong>{product.name}</strong>
                  <span>
                    🛒 {product.quantity} vendidos |
                    📋 {product.orders} pedidos
                  </span>
                </div>
                <div className="top-product-revenue">
                  <strong>${product.revenue.toFixed(2)}</strong>
                  <span>ingresos</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== CLIENTES TOP ===== */}
      <div className="dashboard-section">
        <h3 className="section-title">👥 Clientes Frecuentes</h3>

        {customers.length === 0 ? (
          <div className="empty-section">
            <p>👥 No hay clientes aún</p>
            <span>Los clientes aparecerán cuando realicen compras</span>
          </div>
        ) : (
          <div className="customers-list">
            {customers.slice(0, 5).map((customer, index) => (
              <div key={customer.phone} className="customer-row">
                <span className="customer-rank">
                  {index === 0 ? '👑' : `#${index + 1}`}
                </span>
                <div className="customer-info">
                  <strong>{customer.name}</strong>
                  <span>📞 {customer.phone}</span>
                </div>
                <div className="customer-stats">
                  <div>
                    <strong>{customer.totalOrders}</strong>
                    <span>pedidos</span>
                  </div>
                  <div>
                    <strong>${customer.totalSpent.toFixed(2)}</strong>
                    <span>gastado</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== ALERTAS STOCK ===== */}
      <div className="dashboard-section">
        <h3 className="section-title">⚠️ Alertas de Inventario</h3>

        {/* SIN STOCK */}
        {outOfStock.length > 0 && (
          <div className="alert-box alert-danger">
            <div className="alert-header">
              <strong>❌ Productos Agotados ({outOfStock.length})</strong>
            </div>
            <div className="alert-items">
              {outOfStock.map(product => (
                <div key={product.id} className="alert-item">
                  <span>🔴 {product.name}</span>
                  <span className="alert-badge">Stock: 0</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STOCK BAJO */}
        {lowStock.length > 0 && (
          <div className="alert-box alert-warning">
            <div className="alert-header">
              <strong>⚠️ Stock Bajo ({lowStock.length})</strong>
            </div>
            <div className="alert-items">
              {lowStock.map(product => (
                <div key={product.id} className="alert-item">
                  <span>🟡 {product.name}</span>
                  <span className="alert-badge">Stock: {product.stock}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {outOfStock.length === 0 && lowStock.length === 0 && (
          <div className="alert-box alert-success">
            <strong>✅ Todo el inventario está en orden</strong>
            <p>No hay productos con stock bajo o agotados</p>
          </div>
        )}
      </div>

    </div>
  );
};