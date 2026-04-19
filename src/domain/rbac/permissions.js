// src/domain/rbac/permissions.js
export const ROLES = {
  GERENTE: 'GERENTE',
  ADMIN: 'ADMIN',
  SUPERUSER: 'SUPERUSER',
  VISITANTE: 'VISITANTE'
};

export const PERMISSIONS = {
  // GERENTE (Nivel 1)
  GERENTE: [
    'view_orders',
    'audit_orders', 
    'cancel_unpaid_orders',
    'export_orders'
  ],
  
  // ADMIN (Nivel 2)
  ADMIN: [
    'manage_products',
    'verify_payments',
    'reset_orders',
    'view_orders',
    'audit_orders',
    'export_orders',
    'export_products'
  ],
  
  // SUPERUSER (Nivel 3)
  SUPERUSER: [
    'manage_users',
    'all_permissions'
  ]
};

/**
 * Verifica si un rol tiene un permiso específico
 */
export const can = (role, permission) => {
  if (role === ROLES.SUPERUSER) return true;
  
  const userPermissions = PERMISSIONS[role] || [];
  return userPermissions.includes(permission) || 
         userPermissions.includes('all_permissions');
};

/**
 * Obtiene todos los permisos de un rol
 */
export const getPermissionsForRole = (role) => {
  return PERMISSIONS[role] || [];
};

/**
 * Verifica si el usuario puede acceder a un panel
 */
export const canAccessPanel = (role, panel) => {
  const panelPermissions = {
    orderPanel: ['view_orders'],
    adminPanel: ['manage_products', 'verify_payments'],
    superPanel: ['manage_users']
  };
  
  return panelPermissions[panel]?.some(p => can(role, p)) || false;
};