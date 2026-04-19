// src/app/App.jsx - VERSIÓN SIMPLE useState
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
import './App.css';

function App() {
  // Hooks
  const { user, signOut } = useAuth();
  const { canManageProducts, userRole } = usePermissions();
  const { cartQuantity } = useCart();
  const { products } = useStore();
  
  // Estados modales
  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

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

      {/* MODALS */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />

      <MiniCart 
  isOpen={showCart} 
  onClose={() => setShowCart(false)}
  onCheckout={() => {
    setShowCart(false);
    setShowCheckout(true);
    <div>DEBUG: Total ${cartTotal} | Items: {cart.length}</div>
  }}
/>
      <Checkout isOpen={showCheckout} onClose={() => setShowCheckout(false)} />
    </div>
  );
}

export default App; 