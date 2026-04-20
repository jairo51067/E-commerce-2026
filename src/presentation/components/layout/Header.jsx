// src/presentation/components/layout/Header.jsx
import React, { useState } from 'react';
import { useAuth } from '@presentation/hooks/useAuth.js';
import { usePermissions } from '@presentation/hooks/usePermissions.js';
import { CartBadge } from '@presentation/components/ui/CartBadge.jsx';

export const Header = ({
  onOpenLogin,
  onOpenCart,
  onOpenAdmin,
  onOpenOrders
}) => {
  const { user, signOut } = useAuth();
  const { canManageProducts, canViewOrders } = usePermissions();
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ Usuario interno = tiene rol de gestión
  const isInternalUser = user && (
    user.role === 'ADMIN' ||
    user.role === 'GERENTE' ||
    user.role === 'SUPERUSER'
  );

  return (
    <header className="app-header">
      {/* LEFT: Logo */}
      <div className="header-left">
        <h1>🛍️ <span>E-COMMERCE 2026</span></h1>
      </div>

      {/* RIGHT DESKTOP */}
      <div className="header-right desktop-nav">
        {user ? (
          <>
            <span className="user-name">👋 {user.name}</span>
            <span className={`role-badge ${user.role.toLowerCase()}`}>
              {user.role}
            </span>

            {/* ✅ Solo usuarios internos ven estos botones */}
            {canManageProducts && (
              <button
                className="panel-btn admin"
                onClick={onOpenAdmin}
              >
                ⚙️ Admin
              </button>
            )}

            {canViewOrders && (
              <button
                className="panel-btn orders"
                onClick={onOpenOrders}
              >
                📋 Pedidos
              </button>
            )}

            {/* ✅ Carrito SOLO para clientes */}
            {!isInternalUser && (
              <CartBadge onClick={onOpenCart} />
            )}

            <button className="logout-btn" onClick={signOut}>
              🚪 Salir
            </button>
          </>
        ) : (
          <>
            <button
              className="login-header-btn"
              onClick={onOpenLogin}
            >
              🔐 Login
            </button>
            {/* ✅ Carrito siempre visible para no logueados */}
            <CartBadge onClick={onOpenCart} />
          </>
        )}
      </div>

      {/* RIGHT MOBILE */}
      <div className="header-right mobile-nav">
        {/* ✅ Carrito mobile SOLO clientes */}
        {!isInternalUser && (
          <CartBadge onClick={onOpenCart} />
        )}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div
          className="mobile-menu"
          onClick={() => setMenuOpen(false)}
        >
          {user ? (
            <>
              <div className="mobile-user-info">
                <span>👋 {user.name}</span>
                <span className={`role-badge ${user.role.toLowerCase()}`}>
                  {user.role}
                </span>
              </div>

              {canManageProducts && (
                <button
                  className="mobile-menu-item"
                  onClick={onOpenAdmin}
                >
                  ⚙️ Panel Administrador
                </button>
              )}

              {canViewOrders && (
                <button
                  className="mobile-menu-item"
                  onClick={onOpenOrders}
                >
                  📋 Panel de Pedidos
                </button>
              )}

              {/* ✅ Carrito mobile solo clientes */}
              {!isInternalUser && (
                <button
                  className="mobile-menu-item"
                  onClick={onOpenCart}
                >
                  🛒 Ver Carrito
                </button>
              )}

              <button
                className="mobile-menu-item logout"
                onClick={signOut}
              >
                🚪 Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <button
                className="mobile-menu-item login"
                onClick={onOpenLogin}
              >
                🔐 Iniciar Sesión
              </button>
              <button
                className="mobile-menu-item"
                onClick={onOpenCart}
              >
                🛒 Ver Carrito
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};