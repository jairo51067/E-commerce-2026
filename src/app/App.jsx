import React, { useState, useCallback } from 'react';
import { useStore } from '@presentation/store/index.js';
import { useAuth } from '@presentation/hooks/useAuth.js';
import { useSecretLogin } from '@presentation/hooks/useSecretLogin.js';
import { STORE_CONFIG } from '@config/store.config.js';

// Components
import { WelcomeModal } from '@presentation/components/ui/WelcomeModal.jsx';
import { LoginModal } from '@presentation/components/ui/LoginModal.jsx';
import { ProductCard } from '@presentation/components/ui/ProductCard.jsx';
import { MiniCart } from '@presentation/components/ui/MiniCart.jsx';
import { CartBadge } from '@presentation/components/ui/CartBadge.jsx';
import { SearchBar } from '@presentation/components/ui/SearchBar.jsx';
import { CategoriesBar } from '@presentation/components/ui/CategoriesBar.jsx';
import { BottomNav } from '@presentation/components/layout/BottomNav.jsx';
import { Checkout } from '@presentation/components/features/Checkout.jsx';
import { AdminPanel } from '@presentation/components/features/AdminPanel.jsx';
import { OrderPanel } from '@presentation/components/features/OrderPanel.jsx';

import '../styles/index.css';

function App() {
  const { user, signOut } = useAuth();
  const { products } = useStore();

  // ✅ MODALES
  const [showWelcome,  setShowWelcome]  = useState(true);
  const [showLogin,    setShowLogin]    = useState(false);
  const [showCart,     setShowCart]     = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAdmin,    setShowAdmin]    = useState(false);
  const [showOrders,   setShowOrders]   = useState(false);
  const [showSearch,   setShowSearch]   = useState(false);

  // ✅ FILTROS
  const [searchQuery,     setSearchQuery]     = useState('');
  const [activeCategory,  setActiveCategory]  = useState('all');
  const [activeTab,       setActiveTab]       = useState('home');

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

  // ✅ FILTRAR PRODUCTOS
  const filteredProducts = products.filter(product => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchCategory =
      activeCategory === 'all'
        ? true
        : activeCategory === 'offers'
          ? product.isOffer === true
          : product.category === activeCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div className="app">

      {/* WELCOME */}
      {showWelcome && !user && (
        <WelcomeModal onClose={() => setShowWelcome(false)} />
      )}

      {/* SEARCH OVERLAY */}
      {showSearch && (
        <SearchBar
          onSearch={setSearchQuery}
          onClose={() => {
            setShowSearch(false);
            setSearchQuery('');
          }}
        />
      )}

      {/* HEADER */}
      <header className="app-header">
        <div className="header-left">
          <h1
            onClick={handleLogoClick}
            style={{ cursor: 'default', userSelect: 'none' }}
          >
            {STORE_CONFIG.logo}
            <span> {STORE_CONFIG.name}</span>
            {clickCount > 0 && (
              <span className="click-indicator">
                {'·'.repeat(clickCount)}
              </span>
            )}
          </h1>
        </div>

        {/* DESKTOP NAV */}
        <div className="header-right desktop-nav">
          {user ? (
            <>
              <span className="user-name">👋 {user.name}</span>
              <span className={`role-badge ${user.role.toLowerCase()}`}>
                {user.role}
              </span>
              {(user.role === 'ADMIN' || user.role === 'SUPERUSER') && (
                <button
                  className="panel-btn admin"
                  onClick={() => setShowAdmin(true)}
                >
                  ⚙️ Admin
                </button>
              )}
              {isInternalUser && (
                <button
                  className="panel-btn orders"
                  onClick={() => setShowOrders(true)}
                >
                  📋 Pedidos
                </button>
              )}
              {!isInternalUser && (
                <CartBadge onClick={() => setShowCart(true)} />
              )}
              <button className="logout-btn" onClick={signOut}>
                🚪 Salir
              </button>
            </>
          ) : (
            <CartBadge onClick={() => setShowCart(true)} />
          )}
        </div>

        {/* MOBILE NAV */}
        <div className="header-right mobile-nav">
          {!isInternalUser && (
            <CartBadge onClick={() => setShowCart(true)} />
          )}
          <button
            className="hamburger"
            onClick={() => setShowSearch(!showSearch)}
          >
            🔍
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="app-main">

        {/* HERO */}
        <div className="hero">
          <h2>📦 {STORE_CONFIG.name}</h2>
          <p>{STORE_CONFIG.tagline}</p>
        </div>

        {/* CATEGORÍAS */}
        <CategoriesBar
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        {/* SEARCH DESKTOP */}
        <div className="search-bar desktop-search">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        {/* RESULTADOS */}
        {searchQuery && (
          <p className="search-results">
            🔍 {filteredProducts.length} resultado(s) para
            "<strong>{searchQuery}</strong>"
          </p>
        )}

              {/* PRODUCTOS */}
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="no-results">
              <p>😕 No se encontraron productos</p>
              <span>Intenta con otra búsqueda o categoría</span>
              <button
                className="btn-primary"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
              >
                🔄 Ver todos los productos
              </button>
            </div>
          )}
        </div>

      </main>

      {/* FOOTER */}
      <footer className="app-footer">
        <p>© 2026 {STORE_CONFIG.name} | {STORE_CONFIG.location}</p>
      </footer>

      {/* BOTTOM NAV MOBILE */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCart={() => setShowCart(true)}
        onOpenSearch={() => setShowSearch(true)}
        onOpenOrders={() => setShowOrders(true)}
        onOpenAdmin={() => setShowAdmin(true)}
      />

      {/* ===== MODALES ===== */}
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
        <AdminPanel
          isOpen={showAdmin}
          onClose={() => {
            setShowAdmin(false);
            setActiveTab('home');
          }}
        />
      )}

      {showOrders && (
        <OrderPanel
          isOpen={showOrders}
          onClose={() => {
            setShowOrders(false);
            setActiveTab('home');
          }}
        />
      )}

    </div>
  );
}

export default App;