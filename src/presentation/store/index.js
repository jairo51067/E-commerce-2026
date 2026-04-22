// src/presentation/store/index.js - REEMPLAZAR COMPLETO
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuditLogger } from '@infrastructure/utils/auditLogger.js';

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
    stock: 6,
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
      login: (userData) => {
        const entry = AuditLogger.createEntry('LOGIN', userData);
        set(state => ({
          user: userData,
          auditLog: [entry, ...state.auditLog]
        }));
      },
      logout: () => {
        const user = get().user;
        if (user) {
          const entry = AuditLogger.createEntry('LOGOUT', user);
          set(state => ({
            user: null,
            auditLog: [entry, ...state.auditLog]
          }));
        } else {
          set({ user: null });
        }
      },

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

      addProduct: (product) => set((state) => {
        const entry = AuditLogger.createEntry(
          'PRODUCT_ADDED',
          state.user,
          { productId: product.id, productName: product.name, price: product.price }
        );
        return {
          products: [...state.products, product],
          auditLog: [entry, ...state.auditLog]
        };
      }),

      editProduct: (updatedProduct) => set((state) => {
        const entry = AuditLogger.createEntry(
          'PRODUCT_EDITED',
          state.user,
          { productId: updatedProduct.id, productName: updatedProduct.name }
        );
        return {
          products: state.products.map(p =>
            p.id === updatedProduct.id ? updatedProduct : p
          ),
          auditLog: [entry, ...state.auditLog]
        };
      }),

      deleteProduct: (productId) => set((state) => {
        const product = state.products.find(p => p.id === productId);
        const entry = AuditLogger.createEntry(
          'PRODUCT_DELETED',
          state.user,
          { productId, productName: product?.name }
        );
        return {
          products: state.products.filter(p => p.id !== productId),
          auditLog: [entry, ...state.auditLog]
        };
      }),

      resetProducts: () => set({ products: INITIAL_PRODUCTS }),

      // ===== ORDERS =====
      orders: [],

      addOrder: (order) => set((state) => {
        const entry = AuditLogger.createEntry(
          'ORDER_CREATED',
          { id: 'client', name: order.customer.name, role: 'CLIENT', email: '' },
          { orderId: order.id, total: order.total, items: order.items.length }
        );

        const updatedProducts = state.products.map(product => {
          const soldItem = order.items.find(item => item.id === product.id);
          if (soldItem) {
            return {
              ...product,
              stock: Math.max(0, product.stock - soldItem.quantity)
            };
          }
          return product;
        });

        // ✅ Orden incluye historial de auditoría
        const orderWithAudit = {
          ...order,
          auditHistory: [entry]
        };

        return {
          orders: [orderWithAudit, ...state.orders],
          products: updatedProducts,
          auditLog: [entry, ...state.auditLog]
        };
      }),

            updateOrderStatus: (orderId, status) => set((state) => {
        const order = state.orders.find(o => o.id === orderId);
        if (!order) return state;

        const actionMap = {
          'paid':      'ORDER_PAID',
          'shipped':   'ORDER_SHIPPED',
          'cancelled': 'ORDER_CANCELLED'
        };

        const action = actionMap[status];
        const entry = AuditLogger.createEntry(
          action,
          state.user,
          {
            orderId,
            previousStatus: order.status,
            newStatus: status,
            total: order.total,
            customer: order.customer?.name
          }
        );

        // ✅ Si se cancela → restaurar stock
        let updatedProducts = state.products;
        if (status === 'cancelled' && order.status !== 'cancelled') {
          updatedProducts = state.products.map(product => {
            const item = order.items.find(i => i.id === product.id);
            if (item) {
              return {
                ...product,
                stock: product.stock + item.quantity
              };
            }
            return product;
          });
        }

        return {
          orders: state.orders.map(o =>
            o.id === orderId
              ? {
                  ...o,
                  status,
                  updatedAt: new Date().toISOString(),
                  auditHistory: [...(o.auditHistory || []), entry]
                }
              : o
          ),
          products: updatedProducts,
          auditLog: [entry, ...state.auditLog]
        };
      }),

      // ===== AUDIT LOG =====
      auditLog: [],

      clearAuditLog: () => set({ auditLog: [] })

    }),
    {
      name: 'ecommerce-store-v7',
      partialize: (state) => ({
        user: state.user,
        cart: state.cart,
        orders: state.orders,
        products: state.products,
        auditLog: state.auditLog
      })
    }
  )
);