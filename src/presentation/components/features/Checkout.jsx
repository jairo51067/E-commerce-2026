// src/presentation/components/features/Checkout.jsx
import React, { useState } from 'react';
import { useCart } from '@presentation/hooks/useCart.js';
import { Notifier } from '@infrastructure/utils/notifier.js';
import { Validators } from '@infrastructure/utils/validators.js';
import { STORE_CONFIG } from '@config/store.config.js';
import { OrderSuccessModal } from '@presentation/components/ui/OrderSuccessModal.jsx';

export const Checkout = ({ isOpen, onClose }) => {
  const { cart, cartTotal, clearCart, addOrder } = useCart();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    deliveryType: 'pickup'
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  if (!isOpen && !successOrder) return null;

  const deliveryCost = form.deliveryType === 'delivery'
    ? STORE_CONFIG.deliveryCost
    : 0;

  const finalTotal = cartTotal + deliveryCost;

  const validateForm = () => {
    const newErrors = {};

    const nameVal = Validators.name(form.name);
    if (!nameVal.valid) newErrors.name = nameVal.error;

    const phoneVal = Validators.phone(form.phone);
    if (!phoneVal.valid) newErrors.phone = phoneVal.error;

    if (form.deliveryType === 'delivery') {
      const addressVal = Validators.address(form.address);
      if (!addressVal.valid) newErrors.address = addressVal.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, phone: value });

    if (errors.phone) {
      setErrors({ ...errors, phone: null });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Notifier.error('⚠️ Por favor revisa los datos');
      return;
    }

    setIsProcessing(true);

    try {
      const orderId = `ORD-${Date.now().toString().slice(-8)}`;
      const phoneFormatted = Validators.formatPhoneWhatsApp(form.phone);

      const order = {
        id: orderId,
        customer: {
          name: form.name.trim(),
          phone: form.phone,
          phoneWhatsapp: phoneFormatted,
          address: form.address.trim(),
          deliveryType: form.deliveryType
        },
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
          image: item.image
        })),
        subtotal: Number(cartTotal.toFixed(2)),
        deliveryCost: Number(deliveryCost.toFixed(2)),
        total: Number(finalTotal.toFixed(2)),
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // ✅ Crear pedido (descuenta stock automáticamente)
      addOrder(order);

      // ✅ Construir mensaje WhatsApp
      const itemsText = cart
        .map(item =>
          `• ${item.name}\n   ${item.quantity} × $${Number(item.price).toFixed(2)} = $${(item.price * item.quantity).toFixed(2)}`
        )
        .join('\n\n');

      const deliveryText = form.deliveryType === 'delivery'
        ? `🚚 *DELIVERY*\n📍 ${form.address}\n💰 Costo delivery: $${deliveryCost.toFixed(2)}`
        : '🏪 *RETIRO EN TIENDA*';

      const message = `🛒 *NUEVO PEDIDO #${orderId}*
━━━━━━━━━━━━━━━━━━━

👤 *Cliente:* ${form.name}
📞 *Teléfono:* ${form.phone}

${deliveryText}

━━━━━━━━━━━━━━━━━━━
📦 *PRODUCTOS:*

${itemsText}

━━━━━━━━━━━━━━━━━━━
💰 *RESUMEN:*
Subtotal: $${cartTotal.toFixed(2)}
${deliveryCost > 0 ? `Delivery: $${deliveryCost.toFixed(2)}\n` : ''}*TOTAL: $${finalTotal.toFixed(2)}*

━━━━━━━━━━━━━━━━━━━
🏪 ${STORE_CONFIG.name}
⏰ ${new Date().toLocaleString('es-VE')}

_Pedido generado desde la app_ 📱`;

      const whatsappUrl = `https://wa.me/${STORE_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;

      // ✅ Guardar datos para modal éxito
      setSuccessOrder({
        id: orderId,
        total: finalTotal,
        whatsappUrl,
        customerName: form.name
      });

      // ✅ Abrir WhatsApp
      window.open(whatsappUrl, '_blank');

      // ✅ Limpiar
      clearCart();
      setForm({ name: '', phone: '', address: '', deliveryType: 'pickup' });
      setErrors({});

      Notifier.success(`✅ Pedido #${orderId} creado!`);

    } catch (error) {
      Notifier.error('❌ Error al procesar pedido');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccessOrder(null);
    onClose();
  };

  // ✅ Si hay pedido exitoso → mostrar modal
  if (successOrder) {
    return (
      <OrderSuccessModal
        order={successOrder}
        onClose={handleCloseSuccess}
      />
    );
  }

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout" onClick={e => e.stopPropagation()}>

        {/* HEADER */}
        <div className="checkout-header">
          <h2>💳 Finalizar Compra</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* RESUMEN PEDIDO */}
        <div className="order-summary">
          <h3>📋 Tu Pedido ({cart.length} productos)</h3>
          {cart.map(item => (
            <div key={item.id} className="summary-item">
              <span>{item.name} × {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <div className="summary-divider"></div>

          <div className="summary-item">
            <span>Subtotal:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          {deliveryCost > 0 && (
            <div className="summary-item">
              <span className="delivery-cost">🚚 Delivery:</span>
              <span className="delivery-cost">+${deliveryCost.toFixed(2)}</span>
            </div>
          )}

          <div className="total-line">
            <strong>TOTAL:</strong>
            <strong style={{color: '#34C759', fontSize: '1.3rem'}}>
              ${finalTotal.toFixed(2)}
            </strong>
          </div>
        </div>

        {/* DATOS CLIENTE */}
        <div className="form-section">
          <h4>👤 Tus Datos</h4>

          <input
            type="text"
            placeholder="Nombre completo *"
            value={form.name}
            onChange={e => {
              setForm({...form, name: e.target.value});
              if (errors.name) setErrors({...errors, name: null});
            }}
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && (
            <p className="error-msg">⚠️ {errors.name}</p>
          )}

          <input
            type="tel"
            placeholder="Teléfono * (ej: 0414-1234567)"
            value={form.phone}
            onChange={handlePhoneChange}
            className={errors.phone ? 'input-error' : ''}
          />
          {errors.phone && (
            <p className="error-msg">⚠️ {errors.phone}</p>
          )}
          <p className="phone-hint">
            💡 Formato: 0414-1234567 o +584141234567
          </p>
        </div>

        {/* TIPO ENTREGA */}
        <div className="form-section">
          <h4>📦 Tipo de Entrega</h4>
          <div className="delivery-options">

            <label className={`delivery-option ${form.deliveryType === 'pickup' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="delivery"
                value="pickup"
                checked={form.deliveryType === 'pickup'}
                onChange={e => setForm({...form, deliveryType: e.target.value})}
              />
              <div className="option-content">
                <span className="option-icon">🏪</span>
                <div>
                  <strong>Retiro en Tienda</strong>
                  <p>Sin costo adicional</p>
                </div>
              </div>
            </label>

            <label className={`delivery-option ${form.deliveryType === 'delivery' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="delivery"
                value="delivery"
                checked={form.deliveryType === 'delivery'}
                onChange={e => setForm({...form, deliveryType: e.target.value})}
              />
              <div className="option-content">
                <span className="option-icon">🚚</span>
                <div>
                  <strong>Delivery a Domicilio</strong>
                  <p>+${STORE_CONFIG.deliveryCost.toFixed(2)} - Coordinamos por WhatsApp</p>
                </div>
              </div>
            </label>

          </div>
        </div>

        {/* DIRECCIÓN (solo si delivery) */}
        {form.deliveryType === 'delivery' && (
          <div className="form-section">
            <h4>📍 Dirección de Entrega</h4>
            <textarea
              placeholder="Dirección completa (calle, casa/edificio, referencia)"
              value={form.address}
              onChange={e => {
                setForm({...form, address: e.target.value});
                if (errors.address) setErrors({...errors, address: null});
              }}
              rows={3}
              className={errors.address ? 'input-error' : ''}
            />
            {errors.address && (
              <p className="error-msg">⚠️ {errors.address}</p>
            )}
          </div>
        )}

        {/* INFO PAGO */}
        <div className="form-section payment-info">
          <h4>💳 Método de Pago</h4>
          <div className="payment-methods">
            <span>💵 Efectivo</span>
            <span>💳 Tarjeta</span>
            <span>📱 Pago Móvil</span>
            <span>🏦 Transferencia</span>
          </div>
          <p className="payment-note">
            💡 Coordinaremos el pago por WhatsApp
          </p>
        </div>
        {/* BOTÓN WHATSAPP */}
        <button
          className="whatsapp-btn"
          onClick={handleSubmit}
          disabled={isProcessing || cart.length === 0}
        >
          {isProcessing
            ? '⏳ Procesando pedido...'
            : `💬 Enviar Pedido por WhatsApp - $${finalTotal.toFixed(2)}`
          }
        </button>

      </div>
    </div>
  );
};