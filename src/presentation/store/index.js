// src/presentation/store/index.js - VERSIÓN DEBUG
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),

      cart: [],
      addToCart: (product, quantity) => set((state) => {
        const existing = state.cart.find(item => item.id === product.id);
        let newCart;
        
        if (existing) {
          newCart = state.cart.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newCart = [...state.cart, { ...product, quantity }];
        }
        
        console.log('🛒 CART UPDATE:', newCart); // DEBUG
        return { cart: newCart };
      }),

      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item.id !== productId)
      })),

      updateQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map(item =>
          item.id === productId ? { ...item, quantity } : item
        ).filter(item => item.quantity > 0)
      })),

      clearCart: () => set({ cart: [] }),

      // GETTERS - SIN PERSISTIR
      cartTotal: () => {
        const total = get().cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        console.log('💰 TOTAL CALC:', total); // DEBUG
        return total;
      },

      cartQuantity: () => {
        return get().cart.reduce((sum, item) => sum + item.quantity, 0);
      },

      products: [  // Mock data
        {
          id: '1',
          name: 'iPhone 15 Pro',
          price: 999,
          image: 'https://via.placeholder.com/300x300/007AFF/FFFFFF?text=iPhone',
          stock: 10
        },
        {
          id: '2',
          name: 'MacBook Pro',
          price: 1999,
          image: 'https://via.placeholder.com/300x300/000000/FFFFFF?text=MacBook',
          stock: 5
        },
        {
          id: '3',
          name: 'AirPods Pro',
          price: 249,
          image: 'https://via.placeholder.com/300x300/FFFFFF/000000?text=AirPods',
          stock: 20
        }
      ]
    }),
    {
      name: 'ecommerce-cart',
      partialize: (state) => ({ user: state.user, cart: state.cart })
    }
  )
);