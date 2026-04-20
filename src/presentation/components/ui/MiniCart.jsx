// src/presentation/components/ui/MiniCart.jsx
import React from 'react';
import { useCart } from '@presentation/hooks/useCart.js';
import { Notifier } from '@infrastructure/utils/notifier.js';

export const MiniCart = ({ isOpen, onClose, onCheckout }) => {
  const {
    cart,
    cartTotal,
    removeItem,
    updateItemQuantity
  } = useCart();

  if (!isOpen) return null;

  const handleRemove = (item) => {
    removeItem(item.id);
    Notifier.warning(`🗑️ ${item.name} eliminado`);
  };

  const handleQuantityChange = (item, newQty) => {
    if (newQty <= 0) {
      removeItem(item.id);
    } else if (newQty <= item.stock) {
      updateItemQuantity(item.id, newQty);
    }
  };

  return (
    <div className="mini-cart-overlay" onClick={onClose}>
      <div className="mini-cart" onClick={e => e.stopPropagation()}>

        {/* HEADER */}
        <div className="mini-cart-header">
          <h3>🛒 Carrito ({cart.length})</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* ITEMS */}
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>🛒 Tu carrito está vacío</p>
              <span>Agrega productos para comenzar</span>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={e => {
                    e.target.src = 'https://via.placeholder.com/55';
                  }}
                />
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <div className="item-controls">
                    <button
                      className="qty-btn small"
                      onClick={() => handleQuantityChange(item, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="qty-btn small"
                      onClick={() => handleQuantityChange(item, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  <p className="item-price">
                    ${Number(item.price).toFixed(2)} × {item.quantity} =
                    <strong> ${(Number(item.price) * item.quantity).toFixed(2)}</strong>
                  </p>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(item)}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>TOTAL:</span>
              <strong>${cartTotal.toFixed(2)}</strong>
            </div>
            <button
              className="checkout-btn"
              onClick={onCheckout}
            >
              💳 Checkout ${cartTotal.toFixed(2)}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};