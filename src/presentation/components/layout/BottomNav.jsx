// src/presentation/components/layout/BottomNav.jsx
import React from 'react';
import { useCart } from '@presentation/hooks/useCart.js';
import { useAuth } from '@presentation/hooks/useAuth.js';

export const BottomNav = ({
  onOpenCart,
  onOpenSearch,
  onOpenLogin,
  onOpenOrders
}) => {
  const { cartQuantity } = useCart();
  const { user } = useAuth();

  const isInternal = user && (
    user.role === 'ADMIN' ||
    user.role === 'GERENTE' ||
    user.role === 'SUPERUSER'
  );

  return (
    <nav className="bottom-nav">

      <button className="bottom-nav-item active">
        <span>🏠</span>
        <span>Inicio</span>
      </button>

      <button
        className="bottom-nav-item"
        onClick={onOpenSearch}
      >
        <span>🔍</span>
        <span>Buscar</span>
      </button>

      {!isInternal && (
        <button
          className="bottom-nav-item cart-nav"
          onClick={onOpenCart}
        >
          <span className="nav-icon-wrap">
            🛒
            {cartQuantity > 0 && (
              <span className="nav-badge">{cartQuantity}</span>
            )}
          </span>
          <span>Carrito</span>
        </button>
      )}

      {isInternal && (
        <button
          className="bottom-nav-item"
          onClick={onOpenOrders}
        >
          <span>📋</span>
          <span>Pedidos</span>
        </button>
      )}

      <button
        className="bottom-nav-item"
        onClick={user ? null : onOpenLogin}
      >
        <span>{user ? '👤' : '🔐'}</span>
        <span>{user ? user.name.split(' ')[0] : 'Entrar'}</span>
      </button>

    </nav>
  );
};