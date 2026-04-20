// src/app/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '@presentation/store/index.js';
import { useAuth } from '@presentation/hooks/useAuth.js';
import { useSecretLogin } from '@presentation/hooks/useSecretLogin.js';
import { WelcomeModal } from '@presentation/components/ui/WelcomeModal.jsx';
import { LoginModal } from '@presentation/components/ui/LoginModal.jsx';
import { ProductCard } from '@presentation/components/ui/ProductCard.jsx';
import { MiniCart } from '@presentation/components/ui/MiniCart.jsx';
import { CartBadge } from '@presentation/components/ui/CartBadge.jsx';
import { Checkout } from '@presentation/components/features/Checkout.jsx';
import { AdminPanel } from '@presentation/components/features/AdminPanel.jsx';
import { OrderPanel } from '@presentation/components/features/OrderPanel.jsx';
import { STORE_CONFIG } from '@config/store.config.js';
import '../styles/index.css';

function App() {
  const { user, signOut } = useAuth();
  const { products } = useStore();

  // ✅ Modales
  const [showWelcome, setShowWelcome] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  // ✅ Usuario interno
  const isInternalUser = user && (
    user.role === 'ADMIN' ||
    user.role === 'GERENTE' ||
    user.role === 'SUPERUSER'
  );

  // ✅ Secret Login
  const handleSecretActivate = useCallback(() => {
    setShowLogin(true);
  }, []);

  const { handleLogoClick, clickCount } = useSecretLogin(handleSecretActivate);

  // ✅ Auto-cerrar welcome si ya está logueado
  useEffect(() => {
    if (user) setShowWelcome(false);
  }, [user]);

  return (
    <div className="app">

      {/* ✅ WELCOME MODAL */}
      {showWelcome && (
        <WelcomeModal onClose={() => setShowWelcome(false)} />
      )}

      {/* HEADER */}
      <header className="app-header">
        <div className="header-left">
          {/* ✅ Logo clickeable para secret login */}
          <h1
            onClick={handleLogoClick}
            style={{ cursor: 'default', userSelect: 'none' }}
            title=""
          >
            {STORE_CONFIG.logo}
            <span> {STORE_CONFIG.name}</span>
            {/* Indicador sutil de clicks (solo visible al hacer click) */}
            {clickCount > 0 && (
              <span className="click-indicator">
                {'·'.repeat(clickCount)}
              </span>
            )}
          </h1>
        </div>

        <div className="header-right desktop-nav">
          {user ? (
            <>
              <span className="user-name">👋 {user.name}</span>
              <span className={`role-badge ${user.role.toLowerCase()}`}>
                {user.role}
              </span>

              {isInternalUser && (
                <>
                  {(user.role === 'ADMIN' || user.role === 'SUPERUSER') && (
                    <button
                      className="panel-btn admin"
                      onClick={() => setShowAdmin(true)}
                    >
                      ⚙️ Admin
                    </button>
                  )}
                  <button
                    className="panel-btn orders"
                    onClick={() => setShowOrders(true)}
                  >
                    📋 Pedidos
                  </button>
                </>
              )}

              {/* ✅ Carrito solo clientes */}
              {!isInternalUser && (
                <CartBadge onClick={() => setShowCart(true)} />
              )}

              <button className="logout-btn" onClick={signOut}>
                🚪 Salir
              </button>
            </>
          ) : (
            /* ✅ Sin botón Login visible */
            <CartBadge onClick={() => setShowCart(true)} />
          )}
        </div>

        {/* MOBILE NAV */}
        <MobileNav
          user={user}
          isInternalUser={isInternalUser}
          onOpenCart={() => setShowCart(true)}
          onOpenAdmin={() => setShowAdmin(true)}
          onOpenOrders={() => setShowOrders(true)}
          onSignOut={signOut}
        />
      </header>

      {/* MAIN */}
      <main className="app-main">
        <div className="hero">
          <h2>📦 {STORE_CONFIG.name}</h2>
          <p>{STORE_CONFIG.tagline}</p>
        </div>

        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <footer className="app-footer">
        <p>© 2026 {STORE_CONFIG.name} | {STORE_CONFIG.location}</p>
      </footer>

      {/* MODALS */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
      />
      <MiniCart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        onCheckout={() => {
          setShowCart(false);
          setShowCheckout(true);
        }}
      />
      <Checkout
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
      />
      {showAdmin && (
        <AdminPanel onClose={() => setShowAdmin(false)} isOpen={showAdmin} />
      )}
      {showOrders && (
        <OrderPanel onClose={() => setShowOrders(false)} isOpen={showOrders} />
      )}
    </div>
  );
}

// ✅ MOBILE NAV COMPONENT
const MobileNav = ({
  user,
  isInternalUser,
  onOpenCart,
  onOpenAdmin,
  onOpenOrders,
  onSignOut
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="header-right mobile-nav">
      {!isInternalUser && (
        <CartBadge onClick={onOpenCart} />
      )}
      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

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

              {(user.role === 'ADMIN' || user.role === 'SUPERUSER') && (
                <button
                  className="mobile-menu-item"
                  onClick={onOpenAdmin}
                >
                  ⚙️ Panel Administrador
                </button>
              )}

              {isInternalUser && (
                <button
                  className="mobile-menu-item"
                  onClick={onOpenOrders}
                >
                  📋 Panel de Pedidos
                </button>
              )}

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
                onClick={onSignOut}
              >
                🚪 Cerrar Sesión
              </button>
            </>
          ) : (
            <button
              className="mobile-menu-item"
              onClick={onOpenCart}
            >
              🛒 Ver Carrito
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default App;