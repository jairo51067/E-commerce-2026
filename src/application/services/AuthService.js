// src/application/services/AuthService.js
import { LocalStorageAdapter } from '../../infrastructure/storage/LocalStorageAdapter.js';
import { User } from '../../domain/entities/User.js';
import { can, ROLES } from '../../domain/rbac/permissions.js';
import { useStore } from '../../presentation/store/index.js';

const storage = new LocalStorageAdapter();

export class AuthService {
  static async login(credentials) {
    const users = await storage.getUsers();
    const demoUsers = User.getDemoUsers();
    
    // Buscar en usuarios locales o demo
    const userData = [...users, ...demoUsers].find(
      u => u.email === credentials.email
    );

    if (!userData) {
      throw new Error('Usuario no encontrado');
    }

    // Simular validación (en prod sería API)
    if (credentials.password !== '123456') {
      throw new Error('Contraseña incorrecta');
    }

    const user = User.fromJSON(userData.toJSON());
    user.lastLogin = new Date().toISOString();
    
    await storage.saveUser(user);
    useStore.getState().login(user.toJSON());
    
    return user;
  }

  static logout() {
    useStore.getState().logout();
    storage.clearAll(); // Opcional
  }

  static getCurrentUser() {
    return useStore.getState().user;
  }

  static hasPermission(permission) {
    const user = this.getCurrentUser();
    return user && can(user?.role, permission);
  }

  static async register(userData) {
    const user = new User(userData);
    await storage.saveUser(user);
    return user;
  }
}