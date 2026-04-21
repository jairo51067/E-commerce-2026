// src/infrastructure/utils/statistics.js
export class Statistics {

  /**
   * Obtiene estadísticas generales de ventas
   */
  static getGeneralStats(orders) {
    const validOrders = orders.filter(o => o.status !== 'cancelled');

    const totalRevenue = validOrders.reduce(
      (sum, o) => sum + Number(o.total), 0
    );

    const totalOrders = validOrders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const totalProducts = validOrders.reduce(
      (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0
    );

    const shippedOrders = orders.filter(o => o.status === 'shipped').length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const paidOrders = orders.filter(o => o.status === 'paid').length;
    const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

    // Tasa conversión
    const conversionRate = totalOrders > 0
      ? ((shippedOrders / totalOrders) * 100).toFixed(1)
      : 0;

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      totalProducts,
      shippedOrders,
      pendingOrders,
      paidOrders,
      cancelledOrders,
      conversionRate
    };
  }

  /**
   * Ventas por día (últimos 7 días)
   */
  static getSalesByDay(orders, days = 7) {
    const today = new Date();
    const result = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const dayOrders = orders.filter(o => {
        if (o.status === 'cancelled') return false;
        const orderDate = new Date(o.createdAt);
        return orderDate >= dayStart && orderDate <= dayEnd;
      });

      const dayRevenue = dayOrders.reduce(
        (sum, o) => sum + Number(o.total), 0
      );

      result.push({
        date: date.toLocaleDateString('es-VE', { weekday: 'short', day: 'numeric' }),
        fullDate: date.toLocaleDateString('es-VE'),
        orders: dayOrders.length,
        revenue: dayRevenue
      });
    }

    return result;
  }

  /**
   * Top productos más vendidos
   */
  static getTopProducts(orders, limit = 5) {
    const productMap = {};

    orders
      .filter(o => o.status !== 'cancelled')
      .forEach(order => {
        order.items.forEach(item => {
          if (!productMap[item.id]) {
            productMap[item.id] = {
              id: item.id,
              name: item.name,
              image: item.image,
              quantity: 0,
              revenue: 0,
              orders: 0
            };
          }
          productMap[item.id].quantity += Number(item.quantity);
          productMap[item.id].revenue += Number(item.price) * Number(item.quantity);
          productMap[item.id].orders += 1;
        });
      });

    return Object.values(productMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit);
  }

  /**
   * Clientes únicos
   */
  static getUniqueCustomers(orders) {
    const customers = {};

    orders
      .filter(o => o.status !== 'cancelled')
      .forEach(order => {
        const phone = order.customer?.phone;
        if (!phone) return;

        if (!customers[phone]) {
          customers[phone] = {
            name: order.customer.name,
            phone,
            totalOrders: 0,
            totalSpent: 0,
            lastOrder: order.createdAt
          };
        }

        customers[phone].totalOrders += 1;
        customers[phone].totalSpent += Number(order.total);

        if (new Date(order.createdAt) > new Date(customers[phone].lastOrder)) {
          customers[phone].lastOrder = order.createdAt;
        }
      });

    return Object.values(customers).sort((a, b) => b.totalSpent - a.totalSpent);
  }

  /**
   * Productos con stock bajo
   */
  static getLowStock(products, threshold = 3) {
    return products
      .filter(p => p.stock > 0 && p.stock <= threshold)
      .sort((a, b) => a.stock - b.stock);
  }

  /**
   * Productos sin stock
   */
  static getOutOfStock(products) {
    return products.filter(p => p.stock === 0);
  }

  /**
   * Ventas por categoría
   */
  static getSalesByCategory(orders, products) {
    const categoryMap = {};

    orders
      .filter(o => o.status !== 'cancelled')
      .forEach(order => {
        order.items.forEach(item => {
          const product = products.find(p => p.id === item.id);
          const category = product?.category || 'other';

          if (!categoryMap[category]) {
            categoryMap[category] = {
              category,
              quantity: 0,
              revenue: 0
            };
          }

          categoryMap[category].quantity += Number(item.quantity);
          categoryMap[category].revenue += Number(item.price) * Number(item.quantity);
        });
      });

    return Object.values(categoryMap).sort((a, b) => b.revenue - a.revenue);
  }
}