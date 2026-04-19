// src/application/services/OrderService.js
import { LocalStorageAdapter } from '@infrastructure/storage/LocalStorageAdapter.js';
import { Order } from '@domain/entities/Order.js';
import { CartService } from './CartService.js';

const storage = new LocalStorageAdapter();

export class OrderService {
  static async createOrder(customerData, paymentMethod = 'cash') {
    const cart = await CartService.getCart();
    
    if (cart.length === 0) {
      throw new Error('Carrito vacío');
    }

    const total = await CartService.getCartTotal();
    const order = new Order({
      items: cart,
      customer: customerData,
      total,
      paymentMethod,
      status: 'pending'
    });

    await storage.saveOrder(order);
    await CartService.clearCart(); // Vaciar carrito

    return order;
  }

  static async getOrders() {
    return await storage.getOrders();
  }

  static async updateOrderStatus(orderId, status) {
    const orders = await storage.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) {
      throw new Error('Pedido no encontrado');
    }

    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();

    // Guardar TODOS los orders
    await storage.saveOrders(orders);
    return orders[orderIndex];
  }
}