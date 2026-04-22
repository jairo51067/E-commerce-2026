// src/presentation/components/ui/ProfileModal.jsx
import React, { useState, useEffect } from 'react';
import { STORE_CONFIG } from '@config/store.config.js';
import { Notifier } from '@infrastructure/utils/notifier.js';

export const ProfileModal = ({ isOpen, onClose, user, onSignOut, onOpenLogin }) => {
  const [visible, setVisible] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setVisible(true), 50);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleShare = async () => {
    const shareData = {
      title: STORE_CONFIG.name,
      text: `${STORE_CONFIG.tagline} - Visita nuestra tienda online`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        Notifier.success('✅ Compartido exitosamente');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        Notifier.success('📋 Link copiado al portapapeles');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        Notifier.error('❌ No se pudo compartir');
      }
    }
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hola ${STORE_CONFIG.name}, quiero información`);
    window.open(`https://wa.me/${STORE_CONFIG.whatsapp}?text=${message}`, '_blank');
  };

  // Genera URL QR con API pública
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(window.location.href)}`;

  return (
    <div
      className={`profile-overlay ${visible ? 'visible' : ''}`}
      onClick={handleClose}
    >
      <div
        className={`profile-modal ${visible ? 'visible' : ''}`}
        onClick={e => e.stopPropagation()}
      >

        {/* HEADER */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user ? '👤' : '👋'}
          </div>
          <div className="profile-header-info">
            <h2>{user ? user.name : '¡Bienvenido!'}</h2>
            <p>{user ? user.email : 'Explora nuestra tienda'}</p>
          </div>
          <button className="profile-close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>

        {/* QR MODAL */}
        {showQR && (
          <div className="qr-section">
            <div className="qr-wrapper">
              <img src={qrUrl} alt="QR Code" />
            </div>
            <p className="qr-info">
              📱 Escanea este código QR para compartir la tienda
            </p>
            <button
              className="qr-close-btn"
              onClick={() => setShowQR(false)}
            >
              Volver
            </button>
          </div>
        )}

        {/* LISTA OPCIONES */}
        {!showQR && (
          <div className="profile-list">

            {/* SECCIÓN TIENDA */}
            <div className="profile-section">
              <div className="profile-section-title">🏪 TIENDA</div>

              <button
                className="profile-item"
                onClick={() => setShowQR(true)}
              >
                <span className="profile-item-icon">📱</span>
                <div className="profile-item-content">
                  <strong>Código QR de la tienda</strong>
                  <span>Comparte con tus clientes</span>
                </div>
                <span className="profile-item-arrow">→</span>
              </button>

              <button
                className="profile-item"
                onClick={handleShare}
              >
                <span className="profile-item-icon">📤</span>
                <div className="profile-item-content">
                  <strong>Compartir tienda</strong>
                  <span>WhatsApp, redes sociales...</span>
                </div>
                <span className="profile-item-arrow">→</span>
              </button>

              <button
                className="profile-item"
                onClick={handleWhatsApp}
              >
                <span className="profile-item-icon">💬</span>
                <div className="profile-item-content">
                  <strong>Contáctanos</strong>
                  <span>+{STORE_CONFIG.whatsapp}</span>
                </div>
                <span className="profile-item-arrow">→</span>
              </button>
            </div>

            {/* SECCIÓN INFO */}
            <div className="profile-section">
              <div className="profile-section-title">ℹ️ INFORMACIÓN</div>

              <div className="profile-item info-item">
                <span className="profile-item-icon">🕐</span>
                <div className="profile-item-content">
                  <strong>Horario de atención</strong>
                  <span>{STORE_CONFIG.schedule}</span>
                </div>
              </div>

              <div className="profile-item info-item">
                <span className="profile-item-icon">📍</span>
                <div className="profile-item-content">
                  <strong>Ubicación</strong>
                  <span>{STORE_CONFIG.location}</span>
                </div>
              </div>

              <div className="profile-item info-item">
                <span className="profile-item-icon">📸</span>
                <div className="profile-item-content">
                  <strong>Instagram</strong>
                  <span>{STORE_CONFIG.social.instagram}</span>
                </div>
              </div>
            </div>

            {/* SECCIÓN APP */}
            <div className="profile-section">
              <div className="profile-section-title">📱 APLICACIÓN</div>

              <div className="profile-item info-item">
                <span className="profile-item-icon">🎯</span>
                <div className="profile-item-content">
                  <strong>Versión de la app</strong>
                  <span>1.0.0 • Build 2026</span>
                </div>
              </div>

              <div className="profile-item info-item">
                <span className="profile-item-icon">⚡</span>
                <div className="profile-item-content">
                  <strong>Sobre nosotros</strong>
                  <span>{STORE_CONFIG.description}</span>
                </div>
              </div>
            </div>

            {/* SESIÓN */}
            {user ? (
              <button
                className="profile-logout-btn"
                onClick={() => {
                  onSignOut();
                  handleClose();
                }}
              >
                🚪 Cerrar sesión
              </button>
            ) : (
              /* Aquí comentamos el botón de iniciar sesión - esta es la foma de comtarlo*/ 
              /*
              <button
                className="profile-login-btn"
                onClick={() => {
                  handleClose();
                  setTimeout(onOpenLogin, 300);
                }}
              >
                🔐 Iniciar sesión
              </button>
              */
             null // Ponemos null porque React necesita que el bloque retorne algo
            )}

            {/* FOOTER */}
            <p className="profile-footer">
              © 2026 {STORE_CONFIG.name}
              <br />
              <span>Hecho con ❤️ en Venezuela</span>
            </p>
          </div>
        )}

      </div>
    </div>
  );
};