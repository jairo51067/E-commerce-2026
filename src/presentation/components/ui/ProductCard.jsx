// src/presentation/components/ui/ProductCard.jsx - ACTUALIZAR
import React, { useState } from 'react';
import { useCart } from '@presentation/hooks/useCart.js';
import { Notifier } from '@infrastructure/utils/notifier.js';

export const ProductCard = ({ product }) => {
  const { addItem, cart } = useCart();
  const cartItem = cart.find(item => item.id === product.id);
  const [localQuantity, setLocalQuantity] = useState(cartItem?.quantity || 0);

  const handleAddToCart = async () => {
    await addItem(product, 1);
    setLocalQuantity(prev => prev + 1);
    Notifier.cart(`🛒 ${product.name} agregado al carrito`);
  };

  const handleQuantityChange = async (qty) => {
    const delta = qty - localQuantity;
    if (delta !== 0 && qty >= 0 && qty <= product.stock) {
      await addItem(product, delta);
      setLocalQuantity(qty);
      if (delta > 0) {
        Notifier.cart(`➕ ${product.name} x${qty}`);
      } else {
        Notifier.warning(`➖ ${product.name} x${qty}`);
      }
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">${Number(product.price).toFixed(2)}</p>
      <p className="stock">
        {product.stock > 0
          ? `📦 Stock: ${product.stock}`
          : '❌ Sin stock'
        }
      </p>

      <div className="quantity-section">
        {localQuantity === 0 ? (
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            🛒 Agregar al carrito
          </button>
        ) : (
          <div className="quantity-control">
            <button
              className="qty-btn"
              onClick={() => handleQuantityChange(localQuantity - 1)}
            >
              -
            </button>
            <span className="qty-display">{localQuantity}</span>
            <button
              className="qty-btn"
              onClick={() => handleQuantityChange(localQuantity + 1)}
              disabled={localQuantity >= product.stock}
            >
              +
            </button>
          </div>
        )}
      </div>

      {localQuantity > 0 && (
        <p className="subtotal">
          Subtotal: ${(Number(product.price) * localQuantity).toFixed(2)}
        </p>
      )}
    </div>
  );
};