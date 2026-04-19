// src/presentation/components/ui/MiniCart.jsx - FINAL
import React from 'react';
import { useCart } from '@presentation/hooks/useCart.js';

export const MiniCart = ({ isOpen, onClose, onCheckout }) => {
  const { cart, cartTotal, removeItem, updateItemQuantity } = useCart();

  const handleQuantityChange = (itemId, qty) => {
    updateItemQuantity(itemId, qty);
  };

  if (!isOpen || cart.length === 0) return null;

  return (
    <div className="mini-cart-overlay" onClick={onClose}>
      <div className="mini-cart" onClick={e => e.stopPropagation()}>
        <div className="mini-cart-header">
          <h3>🛒 Carrito ({cart.length} artículos)</h3>
          <button onClick={onClose}>✕</button>
        </div>
        
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="item-info">
                <h4>{item.name}</h4>
                <div className="item-controls">
                  <button 
                    className="qty-btn small"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  >-</button>
                  <span>{item.quantity}</span>
                  <button 
                    className="qty-btn small"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >+</button>
                </div>
                <p className="item-price">
                  ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
              <button 
                onClick={() => removeItem(item.id)}
                className="remove-btn"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
        
        <div className="cart-footer">
          <div className="cart-total">
            <strong>TOTAL: ${cartTotal.toFixed(2)}</strong>
          </div>
          <button 
            className="checkout-btn"
            onClick={onCheckout}
            disabled={cartTotal === 0}
          >
            💳 Checkout (${cartTotal.toFixed(0)})
          </button>
        </div>
      </div>
    </div>
  );
};