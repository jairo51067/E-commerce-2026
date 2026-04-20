// src/presentation/components/ui/MiniCart.jsx - REEMPLAZAR COMPLETO
import React from 'react';
import { useCart } from '@presentation/hooks/useCart.js';

export const MiniCart = ({ isOpen, onClose, onCheckout }) => {
  const { cart, cartTotal, removeItem, updateItemQuantity } = useCart();

  if (!isOpen) return null;

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
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-info">
                  <h4>{item.name}</h4>

                  {/* +/- Controls */}
                  <div className="item-controls">
                    <button
                      className="qty-btn small"
                      onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="qty-btn small"
                      onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <p className="item-price">
                    ${Number(item.price).toFixed(2)} x {item.quantity} =
                    <strong> ${(Number(item.price) * Number(item.quantity)).toFixed(2)}</strong>
                  </p>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="remove-btn"
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