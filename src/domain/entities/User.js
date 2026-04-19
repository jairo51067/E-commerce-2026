// src/domain/entities/User.js
import { ROLES } from '../rbac/permissions.js';

export class User {
  constructor({
    id,
    name,
    email,
    role = ROLES.VISITANTE,
    phone = '',
    createdAt = new Date().toISOString()
  }) {
    this.id = id || `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.name = name;
    this.email = email;
    this.role = role;
    this.phone = phone;
    this.createdAt = createdAt;
    this.lastLogin = null;
  }

  isAuthenticated() {
    return this.role !== ROLES.VISITANTE;
  }

  isGerente() {
    return this.role === ROLES.GERENTE;
  }

  isAdmin() {
    return this.role === ROLES.ADMIN;
  }

  isSuperUser() {
    return this.role === ROLES.SUPERUSER;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      phone: this.phone,
      createdAt: this.createdAt,
      lastLogin: this.lastLogin
    };
  }

  static fromJSON(data) {
    return new User(data);
  }

  // Usuarios de prueba
  static getDemoUsers() {
    return [
      new User({
        id: 'gerente1',
        name: 'Gerente López',
        email: 'gerente@tienda.com',
        role: ROLES.GERENTE,
        phone: '+1234567890'
      }),
      new User({
        id: 'admin1', 
        name: 'Admin García',
        email: 'admin@tienda.com',
        role: ROLES.ADMIN,
        phone: '+1234567891'
      }),
      new User({
        id: 'super1',
        name: 'Super User',
        email: 'super@tienda.com',
        role: ROLES.SUPERUSER,
        phone: '+1234567892'
      })
    ];
  }
}