// src/application/services/CartService.js
import { LocalStorageAdapter } from '@infrastructure/storage/LocalStorageAdapter.js';
import { Product } from '@domain/entities/Product.js';
import { useStore } from '@presentation/store/index.js';

const storage = new LocalStorageAdapter();

export class CartService {
  static async addItem(productData, quantity = 1) {
  const product = Product.fromJSON(productData);
  
  if (!product.hasStock(quantity)) {
    throw new Error(`Stock insuficiente. Disponible: ${product.stock}`);
  }

  const cart = await storage.getCart();
  const existingItemIndex = cart.findIndex(item => item.id === product.id);

  let updatedCart;
  
  if (existingItemIndex > -1) {
    // INCREMENTAR cantidad existente
    updatedCart = [...cart];
    updatedCart[existingItemIndex].quantity += quantity;
  } else {
    // NUEVO item
    updatedCart = [...cart, { ...product.toJSON(), quantity }];
  }

  await storage.saveCart(updatedCart);
  
  // Actualizar store
  useStore.getState().addToCart(product, quantity);
  
  return updatedCart;
}

  static async removeItem(productId) {
    const cart = await storage.getCart();
    const updatedCart = cart.filter(item => item.id !== productId);
    
    await storage.saveCart(updatedCart);
    useStore.getState().removeFromCart(productId);
    
    return updatedCart;
  }

  static async updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      return this.removeItem(productId);
    }

    const cart = await storage.getCart();
    const updatedCart = cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );

    await storage.saveCart(updatedCart);
    useStore.getState().updateQuantity(productId, quantity);
    
    return updatedCart;
  }

  static async getCart() {
    const cart = await storage.getCart();
    return cart;
  }

  static async clearCart() {
    await storage.saveCart([]);
    useStore.getState().clearCart();
  }

  static async getCartTotal() {
    const cart = await this.getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
}