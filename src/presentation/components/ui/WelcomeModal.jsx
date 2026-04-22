// src/presentation/components/ui/WelcomeModal.jsx
import React, { useEffect, useState } from 'react';
import { STORE_CONFIG } from '@config/store.config.js';

export const WelcomeModal = ({ onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`welcome-overlay ${visible ? 'visible' : ''}`}
      onClick={handleClose}
    >
      <div
        className={`welcome-modal ${visible ? 'visible' : ''}`}
        onClick={e => e.stopPropagation()}
      >

        {/* HEADER VISUAL */}
        <div className="welcome-header">
          <div className="welcome-logo-container">
            <div className="welcome-logo-icon">
              {STORE_CONFIG.logo}
            </div>
          </div>

          <h1 className="welcome-title">
            {STORE_CONFIG.name}
          </h1>

          <p className="welcome-tagline">
            {STORE_CONFIG.tagline}
          </p>

          <div className="welcome-badge">
            ✨ {STORE_CONFIG.description}
          </div>
        </div>

        {/* FEATURES */}
        <div className="welcome-features">
          <div className="welcome-feature">
            <span className="feature-icon">🚚</span>
            <div>
              <strong>Delivery Rápido</strong>
              <span>Entrega en tu zona</span>
            </div>
          </div>

          <div className="welcome-feature">
            <span className="feature-icon">💳</span>
            <div>
              <strong>Múltiples Pagos</strong>
              <span>Efectivo, móvil, transfer</span>
            </div>
          </div>

          <div className="welcome-feature">
            <span className="feature-icon">💬</span>
            <div>
              <strong>Atención WhatsApp</strong>
              <span>Respuesta inmediata</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          className="welcome-cta"
          onClick={handleClose}
        >
          🛍️ Explorar productos
        </button>

        {/* FOOTER - POWERED BY VENDEYA */}
        <div className="welcome-footer">
          <span>Powered by</span>
          <strong>
            {STORE_CONFIG.platform.logo} {STORE_CONFIG.platform.name}
          </strong>
        </div>

      </div>
    </div>
  );
};