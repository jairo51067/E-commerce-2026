// src/presentation/hooks/useCart.js - REEMPLAZAR COMPLETO
import { useStore } from '../store/index.js';

export const useCart = () => {
  const cart = useStore((state) => state.cart);
  const addToCart = useStore((state) => state.addToCart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const clearCart = useStore((state) => state.clearCart);
  const addOrder = useStore((state) => state.addOrder);

  // ✅ Calcular DIRECTO del cart
  const cartTotal = cart.reduce(
    (sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0
  );

  const cartQuantity = cart.reduce(
    (sum, item) => sum + Number(item.quantity), 0
  );

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