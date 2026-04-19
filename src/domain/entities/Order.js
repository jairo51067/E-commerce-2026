// src/domain/entities/Order.js
export class Order {
  constructor({
    id,
    items,
    customer,
    total,
    status = 'pending',
    paymentMethod = 'cash',
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  }) {
    this.id = id || `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.items = items;
    this.customer = customer;
    this.total = parseFloat(total) || 0;
    this.status = status;
    this.paymentMethod = paymentMethod;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isPending() { return this.status === 'pending'; }
  isPaid() { return this.status === 'paid'; }
  isShipped() { return this.status === 'shipped'; }
  isCancelled() { return this.status === 'cancelled'; }

  canCancel() { return this.isPending(); }
  canPay() { return this.isPending(); }

  toJSON() {
    return { ...this };
  }

  static fromJSON(data) {
    return new Order(data);
  }
}