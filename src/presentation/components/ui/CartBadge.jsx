// src/presentation/components/ui/CartBadge.jsx
import React from 'react';
import { useCart } from '@presentation/hooks/useCart.js';

export const CartBadge = ({ onClick }) => {
  const { cartQuantity } = useCart();

  return (
    <button 
      className="cart-toggle"
      onClick={onClick}
    >
      🛒 {cartQuantity > 0 ? cartQuantity : ''}
    </button>
  );
};