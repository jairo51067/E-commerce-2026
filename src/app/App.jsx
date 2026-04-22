// src/app/App.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { useStore } from '@presentation/store/index.js';
import { useAuth } from '@presentation/hooks/useAuth.js';
import { useSecretLogin } from '@presentation/hooks/useSecretLogin.js';
import { STORE_CONFIG } from '@config/store.config.js';

import { WelcomeModal } from '@presentation/components/ui/WelcomeModal.jsx';
import { LoginModal } from '@presentation/components/ui/LoginModal.jsx';
import { ProductCard } from '@presentation/components/ui/ProductCard.jsx';
import { MiniCart } from '@presentation/components/ui/MiniCart.jsx';
import { CartBadge } from '@presentation/components/ui/CartBadge.jsx';
import { SearchBar } from '@presentation/components/ui/SearchBar.jsx';
import { CategoriesBar } from '@presentation/components/ui/CategoriesBar.jsx';
import { ProfileModal } from '@presentation/components/ui/ProfileModal.jsx';
import { BottomNav } from '@presentation/components/layout/BottomNav.jsx';
import { Checkout } from '@presentation/components/features/Checkout.jsx';
import { AdminPanel } from '@presentation/components/features/AdminPanel.jsx';
import { OrderPanel } from '@presentation/components/features/OrderPanel.jsx';

import '../styles/index.css';

function App() {
  const { user, signOut } = useAuth();
  const { products } = useStore();

  const [showWelcome,  setShowWelcome]  = useState(true);
  const [showLogin,    setShowLogin]    = useState(false);
  const [showCart,     setShowCart]     = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showAdmin,    setShowAdmin]    = useState(false);
  const [showOrders,   setShowOrders]   = useState(false);
  const [showSearch,   setShowSearch]   = useState(false);
  const [showProfile,  setShowProfile]  = useState(false);

  const [searchQuery,    setSearchQuery]    = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab,      setActiveTab]      = useState('home');

  const isInternalUser = user && (
    user.role === 'ADMIN' ||
    user.role === 'GERENTE' ||
    user.role === 'SUPERUSER'
  );

  const isPanelOpen = showAdmin || showOrders;

  const handleSecretActivate = useCallback(() => {
    setShowLogin(true);
  }, []);

  const { handleLogoClick, clickCount } = useSecretLogin(handleSecretActivate);

  useEffect(() => {
    if (user) setShowWelcome(false);
  }, [user]);

  // ===== HANDLERS =====
  const goToStore = useCallback(() => {
    setShowAdmin(false);
    setShowOrders(false);
    setShowCart(false);
    setShowCheckout(false);
    setShowSearch(false);
    setShowProfile(false);
    setActiveTab('home');
    setSearchQuery('');
    setActiveCategory('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openAdminPanel = useCallback(() => {
    setShowOrders(false);
    setShowCart(false);
    setShowSearch(false);
    setShowProfile(false);
    setShowAdmin(true);
    setActiveTab('admin');
  }, []);

  const openOrdersPanel = useCallback(() => {
    setShowAdmin(false);
    setShowCart(false);
    setShowSearch(false);
    setShowProfile(false);
    setShowOrders(true);
    setActiveTab('orders');
  }, []);

  const openProfile = useCallback(() => {
    setShowProfile(true);
  }, []);

  const handleSignOut = useCallback(() => {
    signOut();
    goToStore();
  }, [signOut, goToStore]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isPanelOpen) {
        goToStore();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPanelOpen, goToStore]);

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

      {showWelcome && !user && (
        <WelcomeModal onClose={() => setShowWelcome(false)} />
      )}

      {showSearch && !isPanelOpen && (
        <SearchBar
          onSearch={setSearchQuery}
          onClose={() => setShowSearch(false)}
        />
      )}

      {/* HEADER (oculto en panel) */}
      {!isPanelOpen && (
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
                  <button className="panel-btn admin" onClick={openAdminPanel}>
                    ⚙️ Admin
                  </button>
                )}
                {isInternalUser && (
                  <button className="panel-btn orders" onClick={openOrdersPanel}>
                    📋 Pedidos
                  </button>
                )}
                {!isInternalUser && (
                  <CartBadge onClick={() => setShowCart(true)} />
                )}
                <button className="logout-btn" onClick={handleSignOut}>
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
              onClick={() => setShowSearch(true)}
            >
              🔍
            </button>
          </div>
        </header>
      )}

      {/* MAIN */}
      {!isPanelOpen && (
        <main className="app-main">
          <div className="hero">
            <h2>📦 {STORE_CONFIG.name}</h2>
            <p>{STORE_CONFIG.tagline}</p>
          </div>

          <CategoriesBar
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />

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

          {searchQuery && (
            <p className="search-results">
              🔍 {filteredProducts.length} resultado(s) para
              " <strong>{searchQuery}</strong> "
            </p>
          )}

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
      )}

      {!isPanelOpen && (
        <footer className="app-footer">
          <p>© 2026 {STORE_CONFIG.name} | {STORE_CONFIG.location}</p>
        </footer>
      )}

      {/* ===== BOTTOM NAV ===== */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onGoHome={goToStore}
        onOpenCart={() => setShowCart(true)}
        onOpenSearch={() => setShowSearch(true)}
        onOpenOrders={openOrdersPanel}
        onOpenAdmin={openAdminPanel}
        onOpenProfile={openProfile}
      />

      {/* MODALES */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
      />

      <MiniCart
        isOpen={showCart && !isPanelOpen}
        onClose={() => setShowCart(false)}
        onCheckout={() => {
          setShowCart(false);
          setShowCheckout(true);
        }}
      />

      <Checkout
        isOpen={showCheckout && !isPanelOpen}
        onClose={() => setShowCheckout(false)}
      />

      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={user}
        onSignOut={handleSignOut}
        onOpenLogin={() => setShowLogin(true)}
      />

      {showAdmin && (
        <AdminPanel
          isOpen={showAdmin}
          onClose={goToStore}
          onSignOut={handleSignOut}
        />
      )}

      {showOrders && (
        <OrderPanel
          isOpen={showOrders}
          onClose={goToStore}
          onSignOut={handleSignOut}
        />
      )}
    </div>
  );
}

export default App; 