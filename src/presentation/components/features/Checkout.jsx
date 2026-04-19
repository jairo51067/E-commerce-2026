// src/presentation/components/features/Checkout.jsx - REEMPLAZAR
import React, { useState } from 'react';
import { useCart } from '@presentation/hooks/useCart.js';
import { WhatsAppService } from '@infrastructure/integrations/WhatsAppService.js';

export const Checkout = ({ isOpen, onClose }) => {
  const { cart, cartTotal, clearCart } = useCart();
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Crear order simple
      const order = {
        id: `ORD-${Date.now()}`,
        items: cart,
        customer,
        total: cartTotal,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Enviar WhatsApp
      WhatsAppService.sendOrder(order, customer.phone);

      // Limpiar
      clearCart();
      setCustomer({ name: '', phone: '', address: '' });
      onClose();

    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout" onClick={e => e.stopPropagation()}>
        <div className="checkout-header">
          <h2>💳 Finalizar Compra</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="order-summary">
          <h3>📦 Resumen ({cart.length} artículos)</h3>
          {cart.map(item => (
            <div key={item.id} className="summary-item">
              <span>{item.name} x{item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="total-line">
            <strong>TOTAL:</strong>
            <strong style={{color: '#34C759', fontSize: '1.4rem'}}>
              ${cartTotal.toFixed(2)}
            </strong>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="👤 Nombre completo *"
            value={customer.name}
            onChange={e => setCustomer({...customer, name: e.target.value})}
            required
          />
          <input
            type="tel"
            placeholder="📱 WhatsApp (ej: 573001234567) *"
            value={customer.phone}
            onChange={e => setCustomer({...customer, phone: e.target.value})}
            required
          />
          <textarea
            placeholder="📍 Dirección de entrega"
            value={customer.address}
            onChange={e => setCustomer({...customer, address: e.target.value})}
            rows="3"
          />
          <button
            type="submit"
            disabled={loading || cart.length === 0}
            className="whatsapp-btn"
          >
            {loading ? '⏳ Procesando...' : `📱 PEDIR POR WHATSAPP $${cartTotal.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
};