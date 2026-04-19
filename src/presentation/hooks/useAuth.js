// src/presentation/hooks/useAuth.js
import { useStore } from '../store/index.js';
import { AuthService } from '@application/services/AuthService.js';

export const useAuth = () => {
  const { user, login, logout } = useStore();

  const signIn = async (credentials) => {
    try {
      const userData = await AuthService.login(credentials);
      login(userData);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signOut = () => {
    AuthService.logout();
    logout();
  };

  return {
    user,
    isAuthenticated: !!user,
    isGerente: user?.role === 'GERENTE',
    isAdmin: user?.role === 'ADMIN',
    isSuperUser: user?.role === 'SUPERUSER',
    signIn,
    signOut
  };
};