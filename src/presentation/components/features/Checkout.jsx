// src/presentation/components/features/Checkout.jsx - COMPLETO FINAL
import React, { useState } from 'react';
import { useCart } from '@presentation/hooks/useCart.js';
import { useStore } from '@presentation/store/index.js';
import { WhatsAppService } from '@infrastructure/integrations/WhatsAppService.js';
import { Notifier } from '@infrastructure/utils/notifier.js';

const DELIVERY_COST = 5.00;

export const Checkout = ({ isOpen, onClose }) => {
  const { cart, cartTotal, clearCart } = useCart();
  const { addOrder } = useStore();

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryType: 'pickup'
  });
  const [loading, setLoading] = useState(false);

  // ✅ CRÍTICO: Si no está abierto NO renderiza
  if (!isOpen) return null;

  const isDelivery = customer.deliveryType === 'delivery';
  const deliveryCost = isDelivery ? DELIVERY_COST : 0;
  const finalTotal = cartTotal + deliveryCost;

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const order = {
      id: `ORD-${Date.now()}`,
      items: [...cart],
      customer: { ...customer },
      subtotal: cartTotal,
      deliveryCost,
      total: finalTotal,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    addOrder(order);
    WhatsAppService.sendOrder(order, customer.phone);

    Notifier.whatsapp('📱 Pedido enviado por WhatsApp!', 4000);
    Notifier.order(`📦 Pedido #${order.id} creado`, 4000);

    clearCart();
    setCustomer({ name: '', phone: '', address: '', deliveryType: 'pickup' });
    onClose();

  } catch (error) {
    Notifier.error('❌ Error: ' + error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout" onClick={e => e.stopPropagation()}>

        {/* HEADER */}
        <div className="checkout-header">
          <h2>💳 Finalizar Compra</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* RESUMEN */}
        <div className="order-summary">
          <h3>📦 Resumen ({cart.length} artículos)</h3>

          {cart.map(item => (
            <div key={item.id} className="summary-item">
              <span>{item.name} x{item.quantity}</span>
              <span>${(Number(item.price) * Number(item.quantity)).toFixed(2)}</span>
            </div>
          ))}

          <div className="summary-divider" />

          <div className="summary-item">
            <span>Subtotal:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          {isDelivery && (
            <div className="summary-item delivery-cost">
              <span>🚚 Delivery:</span>
              <span>+${DELIVERY_COST.toFixed(2)}</span>
            </div>
          )}

          <div className="total-line">
            <strong>TOTAL:</strong>
            <strong style={{ color: '#34C759', fontSize: '1.4rem' }}>
              ${finalTotal.toFixed(2)}
            </strong>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          {/* DATOS CLIENTE */}
          <div className="form-section">
            <h4>👤 Datos del Cliente</h4>
            <input
              placeholder="Nombre completo *"
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
          </div>

          {/* TIPO ENTREGA */}
          <div className="form-section">
            <h4>🚚 Tipo de Entrega</h4>
            <div className="delivery-options">

              <label
                className={`delivery-option ${customer.deliveryType === 'pickup' ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="deliveryType"
                  value="pickup"
                  checked={customer.deliveryType === 'pickup'}
                  onChange={() => setCustomer({...customer, deliveryType: 'pickup'})}
                />
                <div className="option-content">
                  <span className="option-icon">🏪</span>
                  <div>
                    <strong>Pasar a Buscar</strong>
                    <p>Retiro en tienda - Gratis</p>
                  </div>
                </div>
              </label>

              <label
                className={`delivery-option ${customer.deliveryType === 'delivery' ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="deliveryType"
                  value="delivery"
                  checked={customer.deliveryType === 'delivery'}
                  onChange={() => setCustomer({...customer, deliveryType: 'delivery'})}
                />
                <div className="option-content">
                  <span className="option-icon">🚚</span>
                  <div>
                    <strong>Delivery</strong>
                    <p>Envío a domicilio +${DELIVERY_COST.toFixed(2)}</p>
                  </div>
                </div>
              </label>

            </div>
          </div>

          {/* DIRECCIÓN solo si delivery */}
          {isDelivery && (
            <div className="form-section">
              <h4>📍 Dirección de Entrega</h4>
              <textarea
                placeholder="Calle, número, sector, referencias..."
                value={customer.address}
                onChange={e => setCustomer({...customer, address: e.target.value})}
                rows="3"
                required
              />
            </div>
          )}

          {/* MÉTODOS DE PAGO */}
          <div className="form-section payment-info">
            <h4>💳 Métodos de Pago Aceptados</h4>
            <div className="payment-methods">
              <span>💵 Efectivo</span>
              <span>📲 Pago Móvil</span>
              <span>🏦 Transferencia</span>
              <span>💳 Zelle</span>
            </div>
            <p className="payment-note">
              ⚠️ Adjunta tu comprobante de pago en el chat de WhatsApp
            </p>
          </div>

          {/* BOTÓN WHATSAPP */}
          <button
            type="submit"
            disabled={loading || cart.length === 0}
            className="whatsapp-btn"
          >
            {loading
              ? '⏳ Procesando...'
              : `📱 CONFIRMAR PEDIDO $${finalTotal.toFixed(2)}`
            }
          </button>

        </form>
      </div>
    </div>
  );
};