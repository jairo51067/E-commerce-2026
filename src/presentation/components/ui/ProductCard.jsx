// src/presentation/components/ui/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '@presentation/hooks/useCart.js';
import { Notifier } from '@infrastructure/utils/notifier.js';

export const ProductCard = ({ product }) => {
  const { addItem, removeItem, updateItemQuantity, cart } = useCart();

  const cartItem = cart.find(item => item.id === product.id);
  const currentQty = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    addItem(product, 1);
    Notifier.cart(`🛒 ${product.name} agregado`);
  };

  const handleIncrease = () => {
    if (currentQty < product.stock) {
      updateItemQuantity(product.id, currentQty + 1);
    }
  };

  const handleDecrease = () => {
    if (currentQty === 1) {
      removeItem(product.id);
      Notifier.warning(`➖ ${product.name} eliminado`);
    } else {
      updateItemQuantity(product.id, currentQty - 1);
    }
  };

  return (
    <div className="product-card">
      <img
        src={product.image}
        alt={product.name}
        onError={e => {
          e.target.src = 'https://via.placeholder.com/300x200?text=Sin+imagen';
        }}
      />

      <h3>{product.name}</h3>

      <p className="price">
        ${Number(product.price).toFixed(2)}
      </p>

      <p className="stock">
        {product.stock === 0
          ? '❌ Sin stock'
          : product.stock <= 3
            ? `⚠️ Últimas ${product.stock} unidades`
            : `📦 Stock: ${product.stock}`
        }
      </p>

      <div className="quantity-section">
        {currentQty === 0 ? (
          <button
            className="add-to-cart-btn"
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            🛒 Agregar al carrito
          </button>
        ) : (
          <>
            <div className="quantity-control">
              <button
                className="qty-btn"
                onClick={handleDecrease}
              >
                −
              </button>
              <span className="qty-display">{currentQty}</span>
              <button
                className="qty-btn"
                onClick={handleIncrease}
                disabled={currentQty >= product.stock}
              >
                +
              </button>
            </div>
            <p className="subtotal">
              Subtotal: ${(Number(product.price) * currentQty).toFixed(2)}
            </p>
          </>
        )}
      </div>
    </div>
  );
};