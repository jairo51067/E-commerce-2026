// src/presentation/components/ui/WelcomeModal.jsx
import React, { useEffect, useState } from 'react';
import { STORE_CONFIG } from '@config/store.config.js';

export const WelcomeModal = ({ onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animación entrada
    setTimeout(() => setVisible(true), 100);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 400);
  };

  return (
    <div className={`welcome-overlay ${visible ? 'visible' : ''}`}>
      <div className={`welcome-modal ${visible ? 'visible' : ''}`}>

        {/* FONDO DECORATIVO */}
        <div className="welcome-bg">
          <div className="welcome-circle c1" />
          <div className="welcome-circle c2" />
          <div className="welcome-circle c3" />
        </div>

        {/* CONTENIDO */}
        <div className="welcome-content">

          {/* LOGO */}
          <div className="welcome-logo">
            <span>{STORE_CONFIG.logo}</span>
          </div>

          {/* NOMBRE TIENDA */}
          <h1 className="welcome-title">
            {STORE_CONFIG.name}
          </h1>

          <p className="welcome-tagline">
            {STORE_CONFIG.tagline}
          </p>

          {/* DIVIDER */}
          <div className="welcome-divider" />

          {/* INFO */}
          <div className="welcome-info">
            <div className="welcome-info-item">
              <span>🕐</span>
              <span>{STORE_CONFIG.schedule}</span>
            </div>
            <div className="welcome-info-item">
              <span>📍</span>
              <span>{STORE_CONFIG.location}</span>
            </div>
            <div className="welcome-info-item">
              <span>📱</span>
              <span>+{STORE_CONFIG.whatsapp}</span>
            </div>
          </div>

          {/* REDES */}
          <div className="welcome-social">
            <span>📸 {STORE_CONFIG.social.instagram}</span>
            <span>👥 {STORE_CONFIG.social.facebook}</span>
          </div>

          {/* BOTÓN */}
          <button
            className="welcome-btn"
            onClick={handleClose}
          >
            🛍️ Ver Catálogo
          </button>

          <p className="welcome-footer">
            {STORE_CONFIG.description}
          </p>
        </div>

      </div>
    </div>
  );
};