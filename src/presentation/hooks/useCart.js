// src/presentation/hooks/useCart.js - SIMPLE
import { useStore } from '../store/index.js';

export const useCart = () => {
  const store = useStore();

  return {
    cart: store.cart,
    cartTotal: store.cartTotal(),  // ← CALL FUNCTION
    cartQuantity: store.cartQuantity(), // ← CALL FUNCTION
    products: store.products,
    addItem: store.addToCart,
    removeItem: store.removeFromCart,
    updateItemQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    isEmpty: store.cart.length === 0
  };
};