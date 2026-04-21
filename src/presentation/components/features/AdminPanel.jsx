// src/presentation/components/features/AdminPanel.jsx
import React, { useState } from 'react';
import { useStore } from '@presentation/store/index.js';
import { useAuth } from '@presentation/hooks/useAuth.js';
import { Notifier } from '@infrastructure/utils/notifier.js';
import { Exporter } from '@infrastructure/utils/exporter.js';
import { Dashboard } from './Dashboard.jsx';

const EMPTY_PRODUCT = {
  name: '',
  price: '',
  originalPrice: '',
  stock: '',
  image: '',
  category: 'electronics',
  isNew: false,
  isOffer: false
};

const CATEGORIES = [
  { value: 'electronics',  label: '📱 Electrónicos' },
  { value: 'accessories',  label: '🎧 Accesorios' },
  { value: 'clothing',     label: '👕 Ropa' },
  { value: 'food',         label: '🍕 Comida' },
  { value: 'other',        label: '📦 Otros' }
];

export const AdminPanel = ({ isOpen, onClose, onSignOut }) => {
  const { user } = useAuth();
  const { products, addProduct, editProduct, deleteProduct } = useStore();

  const [view, setView] = useState('dashboard');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setForm({
      ...product,
      originalPrice: product.originalPrice || '',
      isNew: product.isNew || false,
      isOffer: product.isOffer || false
    });
    setView('edit');
  };

  const handleDelete = (productId) => {
    if (window.confirm('¿Eliminar este producto?')) {
      deleteProduct(productId);
      Notifier.error('🗑️ Producto eliminado');
    }
  };

  const handleSave = () => {
    if (!form.name || !form.price || !form.stock) {
      Notifier.warning('⚠️ Completa nombre, precio y stock');
      return;
    }

    const productData = {
      ...form,
      price: parseFloat(form.price),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
      stock: parseInt(form.stock),
      id: view === 'edit' ? selectedProduct.id : `prod_${Date.now()}`
    };

    if (view === 'edit') {
      editProduct(productData);
      Notifier.success('✅ Producto actualizado!');
    } else {
      addProduct(productData);
      Notifier.success('✅ Producto agregado!');
    }

    setView('list');
    setForm(EMPTY_PRODUCT);
  };

  const handleExport = () => {
    try {
      Exporter.productsToCSV(products);
      Notifier.success('📊 Productos exportados a CSV!');
    } catch (error) {
      Notifier.error(error.message);
    }
  };

  const handleCancel = () => {
    setView('list');
    setForm(EMPTY_PRODUCT);
    setSelectedProduct(null);
  };

  return (
    <div className="fullscreen-panel">

      {/* ===== HEADER ===== */}
      <div className="fullscreen-header">
        <div className="fullscreen-header-left">
          <h2>⚙️ Panel Administrador</h2>
          <span className="panel-user">
            👤 {user?.name} | {user?.role}
          </span>
        </div>

        <div className="fullscreen-header-actions">
          <button className="export-btn" onClick={handleExport}>
            📊 Exportar Informe CSV
          </button>
          <button className="store-btn" onClick={onClose}>
            🏪 Ir a la Tienda
          </button>
          <button className="logout-btn-panel" onClick={onSignOut}>
            🚪 Cerrar Sesión
          </button>
          <button
            className="close-fullscreen-btn"
            onClick={onClose}
            title="Cerrar panel (ESC)"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ===== TABS ===== */}
      <div className="panel-tabs">
        <button
          className={`tab ${view === 'dashboard' ? 'active' : ''}`}
          onClick={() => setView('dashboard')}
        >
          📊 Dashboard
        </button>
        <button
          className={`tab ${view === 'list' ? 'active' : ''}`}
          onClick={() => setView('list')}
        >
          📦 Productos ({products.length})
        </button>
        <button
          className={`tab ${view === 'add' ? 'active' : ''}`}
          onClick={() => { setForm(EMPTY_PRODUCT); setView('add'); }}
        >
          ➕ Nuevo Producto
        </button>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="fullscreen-content">

        {/* DASHBOARD */}
        {view === 'dashboard' && <Dashboard />}

        {/* LISTA */}
        {view === 'list' && (
          <div className="admin-list">
            <input
              className="search-input"
              placeholder="🔍 Buscar producto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <div className="products-admin-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <div key={product.id} className="product-row">
                    <img
                      src={product.image || 'https://placehold.co/60'}
                      alt={product.name}
                      onError={e => {
                        e.target.src = 'https://placehold.co/60';
                      }}
                    />
                    <div className="product-row-info">
                      <strong>{product.name}</strong>
                      <span>
                        💰 ${product.price}
                        {product.originalPrice && (
                          <> <s>${product.originalPrice}</s></>
                        )}
                        {' | '}
                        📦 {product.stock}
                        {' | '}
                        🏷️ {product.category}
                        {product.isNew && ' | ✨ NUEVO'}
                        {product.isOffer && ' | 🔥 OFERTA'}
                      </span>
                    </div>
                    <div className="product-row-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(product)}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(product.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-orders">
                  <p>📭 No hay productos</p>
                  <span>Agrega tu primer producto</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* FORM ADD/EDIT */}
        {(view === 'add' || view === 'edit') && (
          <div className="product-form">
            <h3>
              {view === 'add' ? '➕ Nuevo Producto' : '✏️ Editar Producto'}
            </h3>

            <div className="form-grid">
              <input
                placeholder="Nombre del producto *"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
              />
              <input
                type="number"
                placeholder="Precio * (ej: 99.99)"
                value={form.price}
                onChange={e => setForm({...form, price: e.target.value})}
              />
              <input
                type="number"
                placeholder="Precio original (opcional)"
                value={form.originalPrice}
                onChange={e => setForm({...form, originalPrice: e.target.value})}
              />
              <input
                type="number"
                placeholder="Stock disponible *"
                value={form.stock}
                onChange={e => setForm({...form, stock: e.target.value})}
              />
              <select
                value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <input
                placeholder="🖼️ URL de imagen"
                value={form.image}
                onChange={e => setForm({...form, image: e.target.value})}
              />
            </div>

            <div className="form-checkboxes">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={form.isNew}
                  onChange={e => setForm({...form, isNew: e.target.checked})}
                />
                <span>✨ Marcar como NUEVO</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={form.isOffer}
                  onChange={e => setForm({...form, isOffer: e.target.checked})}
                />
                <span>🔥 Marcar como OFERTA</span>
              </label>
            </div>

            {form.image && (
              <div className="image-preview">
                <img
                  src={form.image}
                  alt="Preview"
                  onError={e => {
                    e.target.src = 'https://placehold.co/100?text=Error';
                  }}
                />
                <span>Preview imagen</span>
              </div>
            )}

            <div className="form-actions">
              <button className="btn-cancel" onClick={handleCancel}>
                ✕ Cancelar
              </button>
              <button className="btn-save" onClick={handleSave}>
                {view === 'add' ? '➕ Agregar Producto' : '💾 Guardar Cambios'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};