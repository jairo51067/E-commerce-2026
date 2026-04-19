// src/presentation/hooks/usePermissions.js
import { useAuth } from './useAuth.js';
import { can } from '@domain/rbac/permissions.js';

export const usePermissions = () => {
  const { user } = useAuth();

  const check = (permission) => {
    return user && can(user.role, permission);
  };

  return {
    canViewOrders: check('view_orders'),
    canManageProducts: check('manage_products'),
    canManageUsers: check('manage_users'),
    canExport: check('export_orders') || check('export_products'),
    canAdminPanel: check('manage_products') || check('verify_payments'),
    userRole: user?.role || 'VISITANTE'
  };
};