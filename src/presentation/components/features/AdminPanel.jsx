// src/presentation/components/features/AdminPanel.jsx
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

export const AdminPanel = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { products, addProduct, editProduct, deleteProduct } = useStore();
  const [view, setView] = useState('list'); // list | add | edit
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_PRODUCT);

  if (!isOpen) return null;

  const handleAdd = () => {
    setForm(EMPTY_PRODUCT);
    setView('add');
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setForm({ ...product });
    setView('edit');
  };

  const handleDelete = (productId) => {
    if (window.confirm('¿Eliminar producto?')) {
      deleteProduct(productId);
    }
  };

  const handleSave = () => {
    if (!form.name || !form.price || !form.stock) {
      alert('Completa todos los campos');
      return;
    }

    const productData = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      id: view === 'edit' ? selectedProduct.id : `prod_${Date.now()}`
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
            <h2>⚙️ Panel Admin</h2>
            <span className="panel-user">👤 {user?.name} | {user?.role}</span>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* TABS */}
        <div className="panel-tabs">
          <button
            className={`tab ${view === 'list' ? 'active' : ''}`}
            onClick={() => setView('list')}
          >
            📦 Productos ({products.length})
          </button>
          <button
            className={`tab ${view === 'add' ? 'active' : ''}`}
            onClick={handleAdd}
          >
            ➕ Nuevo
          </button>
        </div>

        {/* LISTA PRODUCTOS */}
        {view === 'list' && (
          <div className="product-list-admin">
            {products.map(product => (
              <div key={product.id} className="product-row">
                <img src={product.image} alt={product.name} />
                <div className="product-row-info">
                  <strong>{product.name}</strong>
                  <span>${product.price} | Stock: {product.stock}</span>
                </div>
                <div className="product-row-actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(product)}
                  >
                    ✏️
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
            <h3>{view === 'add' ? '➕ Nuevo Producto' : '✏️ Editar Producto'}</h3>

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
            <input
              placeholder="URL Imagen"
              value={form.image}
              onChange={e => setForm({...form, image: e.target.value})}
            />
            <select
              value={form.category}
              onChange={e => setForm({...form, category: e.target.value})}
            >
              <option value="electronics">📱 Electrónicos</option>
              <option value="accessories">🎧 Accesorios</option>
              <option value="clothing">👕 Ropa</option>
              <option value="food">🍕 Comida</option>
              <option value="other">📦 Otros</option>
            </select>

            {form.image && (
              <div className="image-preview">
                <img src={form.image} alt="Preview" />
              </div>
            )}

            <div className="form-actions">
              <button
                className="btn-cancel"
                onClick={() => setView('list')}
              >
                Cancelar
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