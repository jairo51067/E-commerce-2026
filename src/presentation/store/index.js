// src/presentation/store/index.js - REEMPLAZAR COMPLETO
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      // AUTH
      user: null,
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),

      // CART
      cart: [],
      addToCart: (product, quantity = 1) => set((state) => {
        const existing = state.cart.find(item => item.id === product.id);
        
        if (existing) {
          return {
            cart: state.cart.map(item =>
              item.id === product.id
                ? { ...item, quantity: Math.max(0, item.quantity + quantity) }
                : item
            ).filter(item => item.quantity > 0)
          };
        }
        
        return {
          cart: [...state.cart, {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            stock: product.stock,
            quantity: Math.max(1, quantity)
          }]
        };
      }),

      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item.id !== productId)
      })),

      updateQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map(item =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        ).filter(item => item.quantity > 0)
      })),

      clearCart: () => set({ cart: [] }),

      // PRODUCTS CRUD
addProduct: (product) => set((state) => ({
  products: [...state.products, product]
})),

editProduct: (updatedProduct) => set((state) => ({
  products: state.products.map(p =>
    p.id === updatedProduct.id ? updatedProduct : p
  )
})),

deleteProduct: (productId) => set((state) => ({
  products: state.products.filter(p => p.id !== productId)
})),

// ORDERS
orders: [],
addOrder: (order) => set((state) => ({
  orders: [order, ...state.orders]
})),

updateOrderStatus: (orderId, status) => set((state) => ({
  orders: state.orders.map(o =>
    o.id === orderId
      ? { ...o, status, updatedAt: new Date().toISOString() }
      : o
  )
})),

      // PRODUCTS
      products: [
        {
          id: '1',
          name: 'iPhone 15 Pro',
          price: 999,
          image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
          stock: 10,
          category: 'electronics'
        },
        {
          id: '2',
          name: 'MacBook Pro M3',
          price: 1999,
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
          stock: 5,
          category: 'electronics'
        },
        {
          id: '3',
          name: 'AirPods Pro',
          price: 249,
          image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400',
          stock: 20,
          category: 'accessories'
        },
        {
          id: '4',
          name: 'iPad Pro',
          price: 799,
          image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
          stock: 8,
          category: 'electronics'
        }
      ]
    }),
    {
      name: 'ecommerce-blackbox-v2',
      partialize: (state) => ({
        user: state.user,
        cart: state.cart
      })
    }
  )
);