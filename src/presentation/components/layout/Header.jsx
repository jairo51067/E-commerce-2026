// src/presentation/components/layout/Header.jsx - NUEVO COMPONENTE
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

  return (
    <header className="app-header">
      {/* LEFT: Logo */}
      <div className="header-left">
        <h1>🛍️ <span>E-COMMERCE</span></h1>
      </div>

      {/* RIGHT DESKTOP */}
      <div className="header-right desktop-nav">
        {user ? (
          <>
            <span className="user-name">👋 {user.name}</span>
            <span className={`role-badge ${user.role.toLowerCase()}`}>
              {user.role}
            </span>
            {canManageProducts && (
              <button className="panel-btn admin" onClick={onOpenAdmin}>
                ⚙️ Admin
              </button>
            )}
            {canViewOrders && (
              <button className="panel-btn orders" onClick={onOpenOrders}>
                📋 Pedidos
              </button>
            )}
            <CartBadge onClick={onOpenCart} />
            <button className="logout-btn" onClick={signOut}>
              Salir
            </button>
          </>
        ) : (
          <>
            <button className="login-header-btn" onClick={onOpenLogin}>
              🔐 Login
            </button>
            <CartBadge onClick={onOpenCart} />
          </>
        )}
      </div>

      {/* RIGHT MOBILE */}
      <div className="header-right mobile-nav">
        <CartBadge onClick={onOpenCart} />
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
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
                  ⚙️ Panel Admin
                </button>
              )}
              {canViewOrders && (
                <button
                  className="mobile-menu-item"
                  onClick={onOpenOrders}
                >
                  📋 Panel Pedidos
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
            <button
              className="mobile-menu-item login"
              onClick={onOpenLogin}
            >
              🔐 Iniciar Sesión
            </button>
          )}
        </div>
      )}
    </header>
  );
};