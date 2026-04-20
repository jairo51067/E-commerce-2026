// src/presentation/components/features/AdminPanel.jsx - REEMPLAZAR
import React, { useState } from 'react';
import { useStore } from '@presentation/store/index.js';
import { useAuth } from '@presentation/hooks/useAuth.js';

const EMPTY_PRODUCT = {
  name: '',
  price: '',
  stock: '',
  image: '',
  category: 'electronics'
};

const CATEGORIES = [
  { value: 'electronics', label: '📱 Electrónicos' },
  { value: 'accessories', label: '🎧 Accesorios' },
  { value: 'clothing', label: '👕 Ropa' },
  { value: 'food', label: '🍕 Comida' },
  { value: 'other', label: '📦 Otros' }
];

export const AdminPanel = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { products, addProduct, editProduct, deleteProduct } = useStore();
  const [view, setView] = useState('list');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setForm({ ...product });
    setView('edit');
  };

  const handleDelete = (productId) => {
    if (window.confirm('¿Eliminar este producto?')) {
      deleteProduct(productId);
    }
  };

  const handleSave = () => {
    if (!form.name || !form.price || !form.stock) {
      alert('⚠️ Completa nombre, precio y stock');
      return;
    }

    const productData = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      id: view === 'edit'
        ? selectedProduct.id
        : `prod_${Date.now()}`
    };

    if (view === 'edit') {
      editProduct(productData);
    } else {
      addProduct(productData);
    }

    setView('list');
    setForm(EMPTY_PRODUCT);
  };

  return (
    <div className="panel-overlay" onClick={onClose}>
      <div className="admin-panel" onClick={e => e.stopPropagation()}>

        {/* HEADER */}
        <div className="panel-header">
          <div>
            <h2>⚙️ Panel Administrador</h2>
            <span className="panel-user">
              👤 {user?.name} | {user?.role}
            </span>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* STATS */}
        <div className="admin-stats">
          <div className="stat-box">
            <strong>{products.length}</strong>
            <span>Productos</span>
          </div>
          <div className="stat-box">
            <strong>{products.filter(p => p.stock > 0).length}</strong>
            <span>Con Stock</span>
          </div>
          <div className="stat-box">
            <strong>{products.filter(p => p.stock === 0).length}</strong>
            <span>Sin Stock</span>
          </div>
          <div className="stat-box">
            <strong>
              ${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toFixed(0)}
            </strong>
            <span>Valor Inventario</span>
          </div>
        </div>

        {/* TABS */}
        <div className="panel-tabs">
          <button
            className={`tab ${view === 'list' ? 'active' : ''}`}
            onClick={() => setView('list')}
          >
            📦 Productos
          </button>
          <button
            className={`tab ${view === 'add' ? 'active' : ''}`}
            onClick={() => { setForm(EMPTY_PRODUCT); setView('add'); }}
          >
            ➕ Nuevo Producto
          </button>
        </div>

        {/* LISTA */}
        {view === 'list' && (
          <div className="admin-list">
            <input
              className="search-input"
              placeholder="🔍 Buscar producto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            {filteredProducts.map(product => (
              <div key={product.id} className="product-row">
                <img
                  src={product.image || 'https://via.placeholder.com/60'}
                  alt={product.name}
                />
                <div className="product-row-info">
                  <strong>{product.name}</strong>
                  <span>
                    💰 ${product.price} |
                    📦 Stock: {product.stock} |
                    🏷️ {product.category}
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
            ))}
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
            </div>

            <input
              placeholder="🖼️ URL de imagen"
              value={form.image}
              onChange={e => setForm({...form, image: e.target.value})}
            />

            {form.image && (
              <div className="image-preview">
                <img src={form.image} alt="Preview" />
                <span>Preview</span>
              </div>
            )}

            <div className="form-actions">
              <button
                className="btn-cancel"
                onClick={() => setView('list')}
              >
                ✕ Cancelar
              </button>
              <button
                className="btn-save"
                onClick={handleSave}
              >
                {view === 'add' ? '➕ Agregar' : '💾 Guardar'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};