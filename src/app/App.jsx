// src/app/App.jsx - FINAL COMPLETO
import React, { useState } from 'react';
import { useStore } from '@presentation/store/index.js';
import { Header } from '@presentation/components/layout/Header.jsx';
import { LoginModal } from '@presentation/components/ui/LoginModal.jsx';
import { ProductCard } from '@presentation/components/ui/ProductCard.jsx';
import { MiniCart } from '@presentation/components/ui/MiniCart.jsx';
import { Checkout } from '@presentation/components/features/Checkout.jsx';
import { AdminPanel } from '@presentation/components/features/AdminPanel.jsx';
import { OrderPanel } from '@presentation/components/features/OrderPanel.jsx';
import './App.css';

function App() {
  const { products } = useStore();
  const [showLogin, setShowLogin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  return (
    <div className="app">
      <Header
        onOpenLogin={() => setShowLogin(true)}
        onOpenCart={() => setShowCart(true)}
        onOpenAdmin={() => setShowAdmin(true)}
        onOpenOrders={() => setShowOrders(true)}
      />

      <main className="app-main">
        <div className="hero">
          <h2>📦 Catálogo de Productos</h2>
          <p>Encuentra los mejores productos al mejor precio</p>
        </div>

        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <footer className="app-footer">
        <p>© 2026 E-Commerce Blackbox | Todos los derechos reservados</p>
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