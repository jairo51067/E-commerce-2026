// src/app/App.jsx - VERSIÓN FINAL CORREGIDA
import React, { useState } from 'react';
import { useAuth } from '@presentation/hooks/useAuth.js';
import { usePermissions } from '@presentation/hooks/usePermissions.js';
import { useCart } from '@presentation/hooks/useCart.js';
import { useStore } from '@presentation/store/index.js';
import { LoginModal } from '@presentation/components/ui/LoginModal.jsx';
import { ProductCard } from '@presentation/components/ui/ProductCard.jsx';
import { MiniCart } from '@presentation/components/ui/MiniCart.jsx';
import { CartBadge } from '@presentation/components/ui/CartBadge.jsx';
import { Checkout } from '@presentation/components/features/Checkout.jsx';
import { AdminPanel } from '@presentation/components/features/AdminPanel.jsx';
import { OrderPanel } from '@presentation/components/features/OrderPanel.jsx';
import './App.css';

function App() {
  // ✅ Hooks (sin duplicados)
  const { user, signOut } = useAuth();
  const { canManageProducts, canViewOrders, userRole } = usePermissions();
  const { cart, cartTotal } = useCart();
  const { products } = useStore();

  // ✅ Estados modales (todos juntos)
  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>🛍️ E-COMMERCE 2026</h1>
        </div>

        <div className="header-right">
          {user ? (
            <>
              <span>👋 {user.name}</span>
              <span className={`role-badge ${user.role.toLowerCase()}`}>
                {user.role}
              </span>

              {/* ✅ Botón Admin (solo ADMIN/SUPERUSER) */}
              {canManageProducts && (
                <button
                  className="panel-btn admin"
                  onClick={() => setShowAdmin(true)}
                >
                  ⚙️ Admin
                </button>
              )}

              {/* ✅ Botón Pedidos (GERENTE/ADMIN/SUPERUSER) */}
              {canViewOrders && (
                <button
                  className="panel-btn orders"
                  onClick={() => setShowOrders(true)}
                >
                  📋 Pedidos
                </button>
              )}

              <CartBadge onClick={() => setShowCart(true)} />
              <button onClick={signOut}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => setShowLogin(true)}>Login</button>
              <CartBadge onClick={() => setShowCart(true)} />
            </>
          )}
        </div>
      </header>

      <main className="app-main">
        <div className="hero">
          <h2>📦 Catálogo de Productos</h2>
          <p>Login como Admin para más opciones</p>
        </div>

        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      {/* ✅ MODALS - Todos correctos */}
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

      <AdminPanel
        isOpen={showAdmin}
        onClose={() => setShowAdmin(false)}
      />

      <OrderPanel
        isOpen={showOrders}
        onClose={() => setShowOrders(false)}
      />
    </div>
  );
}

export default App;