// src/presentation/store/index.js - REEMPLAZAR COMPLETO
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const INITIAL_PRODUCTS = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    price: 899,
    originalPrice: 999,
    discount: 10,
    isNew: false,
    isOffer: true,
    image: 'https://placehold.co/400x300/667eea/white?text=iPhone+15+Pro',
    stock: 10,
    category: 'electronics'
  },
  {
    id: '2',
    name: 'MacBook Pro M3',
    price: 1799,
    originalPrice: 1999,
    discount: 10,
    isNew: true,
    isOffer: true,
    image: 'https://placehold.co/400x300/764ba2/white?text=MacBook+Pro+M3',
    stock: 5,
    category: 'electronics'
  },
  {
    id: '3',
    name: 'AirPods Pro',
    price: 199,
    originalPrice: 249,
    discount: 20,
    isNew: false,
    isOffer: true,
    image: 'https://placehold.co/400x300/34C759/white?text=AirPods+Pro',
    stock: 3,
    category: 'accessories'
  },
  {
    id: '4',
    name: 'iPad Pro',
    price: 799,
    originalPrice: null,
    discount: 0,
    isNew: true,
    isOffer: false,
    image: 'https://placehold.co/400x300/007AFF/white?text=iPad+Pro',
    stock: 8,
    category: 'electronics'
  },
  {
    id: '5',
    name: 'Apple Watch Ultra',
    price: 699,
    originalPrice: 799,
    discount: 12,
    isNew: false,
    isOffer: true,
    image: 'https://placehold.co/400x300/FF9500/white?text=Apple+Watch',
    stock: 0,
    category: 'accessories'
  },
  {
    id: '6',
    name: 'Samsung 4K TV 55"',
    price: 599,
    originalPrice: null,
    discount: 0,
    isNew: true,
    isOffer: false,
    image: 'https://placehold.co/400x300/FF3B30/white?text=Samsung+TV+55',
    stock: 4,
    category: 'electronics'
  }
];

export const useStore = create(
  persist(
    (set, get) => ({

      // ===== AUTH =====
      user: null,
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),

      // ===== CART =====
      cart: [],

      addToCart: (product, quantity = 1) => set((state) => {
        const existing = state.cart.find(item => item.id === product.id);

        if (existing) {
          const newQty = existing.quantity + quantity;
          if (newQty <= 0) {
            return {
              cart: state.cart.filter(item => item.id !== product.id)
            };
          }
          return {
            cart: state.cart.map(item =>
              item.id === product.id
                ? { ...item, quantity: newQty }
                : item
            )
          };
        }

        if (quantity <= 0) return state;

        return {
          cart: [...state.cart, {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            stock: Number(product.stock),
            quantity: Number(quantity)
          }]
        };
      }),

      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item.id !== productId)
      })),

      updateQuantity: (productId, quantity) => set((state) => {
        if (quantity <= 0) {
          return {
            cart: state.cart.filter(item => item.id !== productId)
          };
        }
        return {
          cart: state.cart.map(item =>
            item.id === productId
              ? { ...item, quantity: Number(quantity) }
              : item
          )
        };
      }),

      clearCart: () => set({ cart: [] }),

      // ===== PRODUCTS =====
      products: INITIAL_PRODUCTS,

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

      // ✅ Reset productos a los iniciales
      resetProducts: () => set({ products: INITIAL_PRODUCTS }),

      // ===== ORDERS =====
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
      }))
    }),
    {
      name: 'ecommerce-store-v5',  // ✅ Nueva versión = limpia cache
      partialize: (state) => ({
        user: state.user,
        cart: state.cart,
        orders: state.orders,
        products: state.products
      })
    }
  )
);