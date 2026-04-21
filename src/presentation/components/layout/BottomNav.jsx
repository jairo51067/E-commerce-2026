import React from 'react';
import { useStore } from '@presentation/store/index.js';
import { useAuth } from '@presentation/hooks/useAuth.js';

export const BottomNav = ({
  onOpenCart,
  onOpenSearch,
  onOpenOrders,
  onOpenAdmin,
  activeTab,
  setActiveTab
}) => {
  const cart = useStore((state) => state.cart);
  const { user } = useAuth();

  const cartQty = cart.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0), 0
  );

  const isInternal = user && (
    user.role === 'ADMIN' ||
    user.role === 'GERENTE' ||
    user.role === 'SUPERUSER'
  );

  return (
    <nav className="bottom-nav">

      {/* INICIO */}
      <button
        className={`bottom-nav-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => setActiveTab('home')}
      >
        <span>🏠</span>
        <span>Inicio</span>
      </button>

      {/* BUSCAR */}
      <button
        className={`bottom-nav-item ${activeTab === 'search' ? 'active' : ''}`}
        onClick={() => {
          setActiveTab('search');
          onOpenSearch();
        }}
      >
        <span>🔍</span>
        <span>Buscar</span>
      </button>

      {/* CARRITO - Solo clientes */}
      {!isInternal && (
        <button
          className={`bottom-nav-item ${activeTab === 'cart' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('cart');
            onOpenCart();
          }}
        >
          <span className="nav-icon-wrap">
            🛒
            {cartQty > 0 && (
              <span className="nav-badge">{cartQty}</span>
            )}
          </span>
          <span>Carrito</span>
        </button>
      )}

      {/* PEDIDOS - Solo internos */}
      {isInternal && (
        <button
          className={`bottom-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('orders');
            onOpenOrders();
          }}
        >
          <span>📋</span>
          <span>Pedidos</span>
        </button>
      )}

      {/* ADMIN - Solo admin/super */}
      {(user?.role === 'ADMIN' || user?.role === 'SUPERUSER') && (
        <button
          className={`bottom-nav-item ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('admin');
            onOpenAdmin();
          }}
        >
          <span>⚙️</span>
          <span>Admin</span>
        </button>
      )}

      {/* PERFIL */}
      <button
        className={`bottom-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => setActiveTab('profile')}
      >
        <span>{user ? '👤' : '👤'}</span>
        <span>{user ? user.name.split(' ')[0] : 'Perfil'}</span>
      </button>

    </nav>
  );
};