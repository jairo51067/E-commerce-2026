// src/infrastructure/utils/exporter.js
export class Exporter {
  // Exportar Orders a CSV
  static ordersToCSV(orders) {
    if (!orders || orders.length === 0) {
      throw new Error('No hay pedidos para exportar');
    }

    const headers = [
      'ID Pedido',
      'Fecha',
      'Cliente',
      'Teléfono',
      'Tipo Entrega',
      'Dirección',
      'Productos',
      'Subtotal',
      'Delivery',
      'Total',
      'Estado'
    ];

    const rows = orders.map(order => [
      order.id,
      new Date(order.createdAt).toLocaleString('es-VE'),
      order.customer?.name || '',
      order.customer?.phone || '',
      order.customer?.deliveryType === 'delivery' ? 'Delivery' : 'Retiro',
      order.customer?.address || 'N/A',
      order.items?.map(i => `${i.name}(x${i.quantity})`).join(' | '),
      `$${Number(order.subtotal).toFixed(2)}`,
      `$${Number(order.deliveryCost || 0).toFixed(2)}`,
      `$${Number(order.total).toFixed(2)}`,
      order.status
    ]);

    return this.generateCSV(headers, rows, 'pedidos');
  }

  // Exportar Productos a CSV
  static productsToCSV(products) {
    if (!products || products.length === 0) {
      throw new Error('No hay productos para exportar');
    }

    const headers = [
      'ID',
      'Nombre',
      'Precio',
      'Stock',
      'Categoría',
      'Valor Inventario'
    ];

    const rows = products.map(p => [
      p.id,
      p.name,
      `$${Number(p.price).toFixed(2)}`,
      p.stock,
      p.category,
      `$${(Number(p.price) * Number(p.stock)).toFixed(2)}`
    ]);

    return this.generateCSV(headers, rows, 'productos');
  }

  // Generar y descargar CSV
  static generateCSV(headers, rows, filename) {
    const csvContent = [
      headers.join(','),
      ...rows.map(row =>
        row.map(cell =>
          `"${String(cell).replace(/"/g, '""')}"`
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob(
      ['\uFEFF' + csvContent],
      { type: 'text/csv;charset=utf-8;' }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];

    link.href = url;
    link.download = `${filename}_${date}.csv`;
    link.click();

    URL.revokeObjectURL(url);
    return true;
  }
}