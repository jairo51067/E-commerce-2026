// src/presentation/components/features/Checkout.jsx
import React, { useState } from 'react';
import { useCart } from '@presentation/hooks/useCart.js';
import { OrderService } from '@application/services/OrderService.js';
import { WhatsAppService } from '@infrastructure/integrations/WhatsAppService.js';

export const Checkout = ({ isOpen, onClose }) => {  // ← isOpen PRIMERO
  const { cart, cartTotal, clearCart } = useCart();
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    // Crear order
    const order = await OrderService.createOrder(customer);
    
    // Abrir WhatsApp
    const whatsappUrl = WhatsAppService.sendOrder(order, customer.phone);
    console.log('WhatsApp:', whatsappUrl); // Debug
    
    // Limpiar
    await clearCart();
    setCustomer({ name: '', phone: '', address: '' });
    onClose();
    
    alert(`✅ Pedido #${order.id} enviado!\nWhatsApp abierto.`);
  } catch (error) {
    console.error('Checkout ERROR:', error);
    alert('Error: ' + error.message);
  } finally {
    setLoading(false);
  }
};
  // CERRAR con ESC o click fuera
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;  // ← CRÍTICO

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout" onClick={e => e.stopPropagation()}>
        <div className="checkout-header">
          <h2>💳 Finalizar Compra</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="order-summary">
          <h3>Resumen ({cart.length} artículos)</h3>
          {cart.map(item => (
            <div key={item.id} className="summary-item">
              <span>{item.name} (x{item.quantity})</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="total-line">
            <strong>TOTAL:</strong>
            <strong>${cartTotal.toFixed(2)}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Nombre completo *"
            value={customer.name}
            onChange={e => setCustomer({...customer, name: e.target.value})}
            required
          />
          <input
            type="tel"
            placeholder="Teléfono WhatsApp * (ej: 573001234567)"
            value={customer.phone}
            onChange={e => setCustomer({...customer, phone: e.target.value})}
            required
          />
          <textarea
            placeholder="Dirección de entrega"
            value={customer.address}
            onChange={e => setCustomer({...customer, address: e.target.value})}
            rows="3"
          />

          <button type="submit" disabled={loading || cartTotal === 0}>
            {loading ? 'Procesando...' : `PAGAR $${cartTotal.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
};