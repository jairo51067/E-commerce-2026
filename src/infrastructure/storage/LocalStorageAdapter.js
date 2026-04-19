// src/infrastructure/storage/LocalStorageAdapter.js
import { Product } from '../../domain/entities/Product.js';

export class LocalStorageAdapter {
  constructor() {
    this.PRODUCTS_KEY = 'ecommerce:products';
    this.CART_KEY = 'ecommerce:cart';
    this.USERS_KEY = 'ecommerce:users';
    this.ORDERS_KEY = 'ecommerce:orders';
  }

  // PRODUCTS
  async saveProducts(products) {
    try {
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
      return true;
    } catch (error) {
      console.error('Error saving products:', error);
      return false;
    }
  }

  async getProducts() {
    try {
      const data = localStorage.getItem(this.PRODUCTS_KEY);
      if (!data) return [];
      
      return JSON.parse(data).map(productData => 
        Product.fromJSON(productData)
      );
    } catch (error) {
      console.error('Error loading products:', error);
      return [];
    }
  }

  // CART
  async saveCart(cart) {
    try {
      localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
      return true;
    } catch (error) {
      console.error('Error saving cart:', error);
      return false;
    }
  }

  async getCart() {
    try {
      const data = localStorage.getItem(this.CART_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  }

  // USERS
  async saveUser(user) {
    try {
      const users = await this.getUsers();
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex > -1) {
        users[userIndex] = user;
      } else {
        users.push(user);
      }
      
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error saving user:', error);
      return false;
    }
  }

  async getUsers() {
    try {
      const data = localStorage.getItem(this.USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }

  // ORDERS
  async saveOrder(order) {
    try {
      const orders = await this.getOrders();
      orders.unshift(order); // Nuevo order al inicio
      localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
      return true;
    } catch (error) {
      console.error('Error saving order:', error);
      return false;
    }
  }

  async getOrders() {
    try {
      const data = localStorage.getItem(this.ORDERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }

  async saveOrders(orders) {
  try {
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
    return true;
  } catch (error) {
    console.error('Error saving orders:', error);
    return false;
  }
}

  clearAll() {
    localStorage.removeItem(this.PRODUCTS_KEY);
    localStorage.removeItem(this.CART_KEY);
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.ORDERS_KEY);
  }
}