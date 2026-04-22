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
        Notifier.success('📋 Link copiado');
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
            <h2>{user ? user.name : '¡Hola, bienvenido!'}</h2>
            <p>{user ? user.email : 'Explora nuestra tienda'}</p>
          </div>
          <button className="profile-close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>

        {showQR && (
          <div className="qr-section">
            <div className="qr-wrapper">
              <img src={qrUrl} alt="QR Code" />
            </div>
            <p className="qr-info">
              📱 Comparte la tienda escaneando este código
            </p>
            <button
              className="qr-close-btn"
              onClick={() => setShowQR(false)}
            >
              ← Volver
            </button>
          </div>
        )}

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
                  <strong>Código QR</strong>
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
                  <span>WhatsApp, redes, etc.</span>
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

            {/* INFORMACIÓN TIENDA */}
            <div className="profile-section">
              <div className="profile-section-title">ℹ️ INFORMACIÓN</div>

              <div className="profile-item info-item">
                <span className="profile-item-icon">🕐</span>
                <div className="profile-item-content">
                  <strong>Horario</strong>
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

            {/* APLICACIÓN - REBRANDED CON VENDEYA */}
            <div className="profile-section">
              <div className="profile-section-title">📱 APLICACIÓN</div>

              <div className="profile-item info-item">
                <span className="profile-item-icon">
                  {STORE_CONFIG.platform.logo}
                </span>
                <div className="profile-item-content">
                  <strong>{STORE_CONFIG.platform.name}</strong>
                  <span>v{STORE_CONFIG.platform.version} • Build {STORE_CONFIG.platform.build}</span>
                </div>
              </div>

              <div className="profile-item info-item">
                <span className="profile-item-icon">🎯</span>
                <div className="profile-item-content">
                  <strong>Nuestra plataforma</strong>
                  <span>{STORE_CONFIG.platform.slogan}</span>
                </div>
              </div>

              <a
                className="profile-item"
                href={STORE_CONFIG.platform.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="profile-item-icon">🌐</span>
                <div className="profile-item-content">
                  <strong>¿Quieres tu tienda?</strong>
                  <span>vendeya.app</span>
                </div>
                <span className="profile-item-arrow">→</span>
              </a>
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
              <button
                className="profile-login-btn"
                onClick={() => {
                  handleClose();
                  setTimeout(onOpenLogin, 300);
                }}
              >
                🔐 Iniciar sesión
              </button>
            )}

            {/* FOOTER */}
            <p className="profile-footer">
              © 2026 {STORE_CONFIG.name}
              <br />
              <span>
                Potenciado por {STORE_CONFIG.platform.logo} <strong>{STORE_CONFIG.platform.name}</strong>
              </span>
            </p>
          </div>
        )}

      </div>
    </div>
  );
};