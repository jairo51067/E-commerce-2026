// src/presentation/components/ui/OrderSuccessModal.jsx
import React, { useEffect, useState } from 'react';

export const OrderSuccessModal = ({ order, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleReopenWhatsApp = () => {
    window.open(order.whatsappUrl, '_blank');
  };

  return (
    <div className={`success-overlay ${visible ? 'visible' : ''}`}>
      <div className={`success-modal ${visible ? 'visible' : ''}`}>

        {/* ICONO ANIMADO */}
        <div className="success-icon-wrap">
          <div className="success-icon">✓</div>
        </div>

        {/* TÍTULO */}
        <h1 className="success-title">
          ¡Pedido Exitoso!
        </h1>

        <p className="success-subtitle">
          Gracias por tu compra, {order.customerName}
        </p>

        {/* NÚMERO DE ORDEN */}
        <div className="success-order-id">
          <span>Número de orden</span>
          <strong>#{order.id}</strong>
        </div>

        {/* TOTAL */}
        <div className="success-total">
          <span>Total pagado</span>
          <strong>${order.total.toFixed(2)}</strong>
        </div>

        {/* INFO */}
        <div className="success-info">
          <div className="success-info-item">
            <span>📱</span>
            <div>
              <strong>WhatsApp abierto</strong>
              <p>Revisa el mensaje y envíalo</p>
            </div>
          </div>
          <div className="success-info-item">
            <span>⏰</span>
            <div>
              <strong>Respuesta rápida</strong>
              <p>Te contactaremos en minutos</p>
            </div>
          </div>
          <div className="success-info-item">
            <span>📋</span>
            <div>
              <strong>Guarda tu número</strong>
              <p>Para seguimiento del pedido</p>
            </div>
          </div>
        </div>

        {/* BOTONES */}
        <div className="success-actions">
          <button
            className="success-btn-whatsapp"
            onClick={handleReopenWhatsApp}
          >
            💬 Abrir WhatsApp de nuevo
          </button>

          <button
            className="success-btn-close"
            onClick={handleClose}
          >
            🛍️ Seguir comprando
          </button>
        </div>

      </div>
    </div>
  );
};