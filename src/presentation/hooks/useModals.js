// src/presentation/hooks/useModals.js
import { create } from 'zustand';

export const useModalsStore = create((set) => ({
  showLogin: false,
  showCart: false,
  showCheckout: false,
  
  openLogin: () => set({ showLogin: true }),
  closeLogin: () => set({ showLogin: false }),
  
  openCart: () => set({ showCart: true }),
  closeCart: () => set({ showCart: false }),
  
  openCheckout: () => set({ showCheckout: true }),
  closeCheckout: () => set({ showCheckout: false }),
}));