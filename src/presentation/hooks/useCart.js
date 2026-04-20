// src/presentation/hooks/useCart.js
import { useMemo } from 'react';
import { useStore } from '../store/index.js';

export const useCart = () => {
  const cart = useStore((state) => state.cart);
  const addToCart = useStore((state) => state.addToCart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const clearCart = useStore((state) => state.clearCart);
  const addOrder = useStore((state) => state.addOrder);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      return sum + (price * qty);
    }, 0);
  }, [cart]);

  const cartQuantity = useMemo(() => {
    return cart.reduce((sum, item) => {
      return sum + (Number(item.quantity) || 0);
    }, 0);
  }, [cart]);

  return {
    cart,
    cartTotal,
    cartQuantity,
    addOrder,
    addItem: addToCart,
    removeItem: removeFromCart,
    updateItemQuantity: updateQuantity,
    clearCart,
    isEmpty: cart.length === 0
  };
};