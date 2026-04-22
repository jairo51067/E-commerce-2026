// src/infrastructure/utils/auditLogger.js

export class AuditLogger {

  /**
   * Crea una entrada de auditoría
   */
  static createEntry(action, user, details = {}) {
    return {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      action,
      user: {
        id: user?.id || 'unknown',
        name: user?.name || 'Usuario desconocido',
        role: user?.role || 'GUEST',
        email: user?.email || ''
      },
      timestamp: new Date().toISOString(),
      details
    };
  }

  /**
   * Formatea una entrada para mostrar
   */
  static formatEntry(entry) {
    const date = new Date(entry.timestamp);
    const formatted = date.toLocaleString('es-VE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return {
      ...entry,
      formattedDate: formatted,
      actionLabel: this.getActionLabel(entry.action),
      actionIcon: this.getActionIcon(entry.action)
    };
  }

  /**
   * Etiqueta legible de acciones
   */
  static getActionLabel(action) {
    const labels = {
      'ORDER_CREATED':   'Pedido creado',
      'ORDER_PAID':      'Marcado como pagado',
      'ORDER_SHIPPED':   'Pedido despachado',
      'ORDER_CANCELLED': 'Pedido cancelado',
      'PRODUCT_ADDED':   'Producto agregado',
      'PRODUCT_EDITED':  'Producto editado',
      'PRODUCT_DELETED': 'Producto eliminado',
      'STOCK_UPDATED':   'Stock actualizado',
      'LOGIN':           'Inicio de sesión',
      'LOGOUT':          'Cierre de sesión'
    };
    return labels[action] || action;
  }

  /**
   * Ícono para cada acción
   */
  static getActionIcon(action) {
    const icons = {
      'ORDER_CREATED':   '🆕',
      'ORDER_PAID':      '💰',
      'ORDER_SHIPPED':   '🚚',
      'ORDER_CANCELLED': '❌',
      'PRODUCT_ADDED':   '➕',
      'PRODUCT_EDITED':  '✏️',
      'PRODUCT_DELETED': '🗑️',
      'STOCK_UPDATED':   '📦',
      'LOGIN':           '🔐',
      'LOGOUT':          '🚪'
    };
    return icons[action] || '📝';
  }

  /**
   * Texto completo para CSV
   */
  static toCSVRow(entry) {
    const date = new Date(entry.timestamp);
    return {
      fecha: date.toLocaleString('es-VE'),
      accion: this.getActionLabel(entry.action),
      usuario: entry.user.name,
      rol: entry.user.role,
      email: entry.user.email,
      detalles: JSON.stringify(entry.details)
    };
  }
}