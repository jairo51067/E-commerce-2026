// src/infrastructure/utils/exporter.js
import { AuditLogger } from './auditLogger.js';

export class Exporter {

  /**
   * Descargar archivo CSV
   */
  static download(content, filename) {
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Escapar valores CSV
   */
  static escapeCSV(value) {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  /**
   * Exportar productos a CSV
   */
  static productsToCSV(products) {
    if (!products || products.length === 0) {
      throw new Error('No hay productos para exportar');
    }

    const headers = [
      'ID',
      'Nombre',
      'Categoría',
      'Precio',
      'Precio Original',
      'Descuento %',
      'Stock',
      'Es Nuevo',
      'En Oferta',
      'Imagen'
    ];

    const rows = products.map(p => [
      this.escapeCSV(p.id),
      this.escapeCSV(p.name),
      this.escapeCSV(p.category),
      this.escapeCSV(p.price),
      this.escapeCSV(p.originalPrice || ''),
      this.escapeCSV(p.discount || 0),
      this.escapeCSV(p.stock),
      this.escapeCSV(p.isNew ? 'Sí' : 'No'),
      this.escapeCSV(p.isOffer ? 'Sí' : 'No'),
      this.escapeCSV(p.image)
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const filename = `productos_${new Date().toISOString().split('T')[0]}.csv`;
    this.download(csv, filename);

    return { count: products.length, filename };
  }

  /**
   * ✅ Exportar pedidos con AUDITORÍA COMPLETA
   */
  static ordersToCSV(orders) {
    if (!orders || orders.length === 0) {
      throw new Error('No hay pedidos para exportar');
    }

    const headers = [
      'ID Pedido',
      'Fecha Creación',
      'Cliente',
      'Teléfono',
      'Tipo Entrega',
      'Dirección',
      'Productos',
      'Cantidad Items',
      'Subtotal',
      'Delivery',
      'Total',
      'Estado Actual',
      'Creado Por',
      'Pagado Por',
      'Pagado Fecha',
      'Despachado Por',
      'Despachado Fecha',
      'Cancelado Por',
      'Cancelado Fecha',
      'Historial Completo'
    ];

    const rows = orders.map(order => {
      const history = order.auditHistory || [];

      // Extraer acciones de auditoría
      const created   = history.find(h => h.action === 'ORDER_CREATED');
      const paid      = history.find(h => h.action === 'ORDER_PAID');
      const shipped   = history.find(h => h.action === 'ORDER_SHIPPED');
      const cancelled = history.find(h => h.action === 'ORDER_CANCELLED');

      const formatUser = (entry) => {
        if (!entry) return '';
        return `${entry.user.name} (${entry.user.role})`;
      };

      const formatDate = (entry) => {
        if (!entry) return '';
        return new Date(entry.timestamp).toLocaleString('es-VE');
      };

      // Formato historial completo
      const historyText = history
        .map(h => {
          const date = new Date(h.timestamp).toLocaleString('es-VE');
          return `[${date}] ${AuditLogger.getActionLabel(h.action)} por ${h.user.name} (${h.user.role})`;
        })
        .join(' | ');

      // Productos
      const productsText = order.items
        .map(i => `${i.name} x${i.quantity}`)
        .join('; ');

      const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);

      return [
        this.escapeCSV(order.id),
        this.escapeCSV(new Date(order.createdAt).toLocaleString('es-VE')),
        this.escapeCSV(order.customer?.name),
        this.escapeCSV(order.customer?.phone),
        this.escapeCSV(order.customer?.deliveryType === 'delivery' ? 'Delivery' : 'Retiro'),
        this.escapeCSV(order.customer?.address || 'N/A'),
        this.escapeCSV(productsText),
        this.escapeCSV(totalItems),
        this.escapeCSV(Number(order.subtotal).toFixed(2)),
        this.escapeCSV(Number(order.deliveryCost).toFixed(2)),
        this.escapeCSV(Number(order.total).toFixed(2)),
        this.escapeCSV(order.status),
        this.escapeCSV(formatUser(created)),
        this.escapeCSV(formatUser(paid)),
        this.escapeCSV(formatDate(paid)),
        this.escapeCSV(formatUser(shipped)),
        this.escapeCSV(formatDate(shipped)),
        this.escapeCSV(formatUser(cancelled)),
        this.escapeCSV(formatDate(cancelled)),
        this.escapeCSV(historyText)
      ];
    });

    const csv = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const filename = `pedidos_auditoria_${new Date().toISOString().split('T')[0]}.csv`;
    this.download(csv, filename);

    return { count: orders.length, filename };
  }

  /**
   * ✅ NUEVO: Exportar log de auditoría completo
   */
  static auditLogToCSV(auditLog) {
    if (!auditLog || auditLog.length === 0) {
      throw new Error('No hay registros de auditoría');
    }

    const headers = [
      'Fecha',
      'Hora',
      'Acción',
      'Usuario',
      'Rol',
      'Email',
      'Detalles'
    ];

    const rows = auditLog.map(entry => {
      const date = new Date(entry.timestamp);
      return [
        this.escapeCSV(date.toLocaleDateString('es-VE')),
        this.escapeCSV(date.toLocaleTimeString('es-VE')),
        this.escapeCSV(AuditLogger.getActionLabel(entry.action)),
        this.escapeCSV(entry.user.name),
        this.escapeCSV(entry.user.role),
        this.escapeCSV(entry.user.email || ''),
        this.escapeCSV(JSON.stringify(entry.details))
      ];
    });

    const csv = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const filename = `auditoria_${new Date().toISOString().split('T')[0]}.csv`;
    this.download(csv, filename);

    return { count: auditLog.length, filename };
  }
}