// src/presentation/components/ui/LoginModal.jsx
import React, { useState } from 'react';
import { useAuth } from '@presentation/hooks/useAuth.js';

export const LoginModal = ({ isOpen, onClose }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await signIn(credentials);
    
    if (result.success) {
      onClose();
    } else {
      alert(result.error);
    }
    
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>🔐 Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={credentials.email}
            onChange={(e) => setCredentials({
              ...credentials,
              email: e.target.value
            })}
            required
          />
          <input
            type="password"
            placeholder="Contraseña (123456)"
            value={credentials.password}
            onChange={(e) => setCredentials({
              ...credentials,
              password: e.target.value
            })}
            required
          />
          <div className="demo-users">
            <p><strong>Demo:</strong></p>
            <p>gerente@tienda.com / 123456</p>
            <p>admin@tienda.com / 123456</p>
            <p>super@tienda.com / 123456</p>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};