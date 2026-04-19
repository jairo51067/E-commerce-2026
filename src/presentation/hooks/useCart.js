// src/presentation/hooks/useCart.js - REEMPLAZAR COMPLETO
import { useStore } from '../store/index.js';

export const useCart = () => {
  const cart = useStore((state) => state.cart);
  const addToCart = useStore((state) => state.addToCart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const clearCart = useStore((state) => state.clearCart);

  // CALCULAR AQUÍ DIRECTAMENTE
  const cartTotal = cart.reduce(
    (sum, item) => sum + (item.price * item.quantity), 0
  );
  
  const cartQuantity = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  return {
    cart,
    cartTotal,
    cartQuantity,
    addItem: addToCart,
    removeItem: removeFromCart,
    updateItemQuantity: updateQuantity,
    clearCart,
    isEmpty: cart.length === 0
  };
};