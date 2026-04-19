// src/presentation/components/ui/CartBadge.jsx - REEMPLAZAR
import React from 'react';
import { useStore } from '@presentation/store/index.js';

export const CartBadge = ({ onClick }) => {
  // ✅ Selector directo al store
  const cart = useStore((state) => state.cart);
  const cartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button
      className="cart-toggle"
      onClick={onClick}
    >
      🛒 {cartQuantity > 0 && (
        <span className="cart-count">{cartQuantity}</span>
      )}
    </button>
  );
};