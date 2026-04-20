// src/infrastructure/utils/notifier.js - FIX COMPLETO
export class Notifier {
  static init() {
    let container = document.getElementById('toast-container');
    if (container) return container;

    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
    return container;
  }

  static show(message, type = 'info', duration = 3500) {
    const container = this.init();

    const STYLES = {
      success:  { bg: '#34C759', icon: '✅' },
      error:    { bg: '#FF3B30', icon: '❌' },
      warning:  { bg: '#FF9500', icon: '⚠️' },
      info:     { bg: '#007AFF', icon: 'ℹ️' },
      cart:     { bg: '#667eea', icon: '🛒' },
      order:    { bg: '#764ba2', icon: '📦' },
      whatsapp: { bg: '#25D366', icon: '📱' }
    };

    const { bg, icon } = STYLES[type] || STYLES.info;

    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.style.cssText = `
      background: ${bg};
      color: white;
      padding: 0.85rem 1.1rem;
      border-radius: 12px;
      font-family: 'Segoe UI', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      gap: 0.6rem;
      cursor: pointer;
      line-height: 1.4;
      animation: toastIn 0.35s ease forwards;
      max-width: 100%;
      word-break: break-word;
    `;

    toast.innerHTML = `
      <span style="font-size:1.1rem;flex-shrink:0">${icon}</span>
      <span>${message}</span>
    `;

    toast.addEventListener('click', () => this.remove(toast));
    container.appendChild(toast);

    setTimeout(() => this.remove(toast), duration);
    return toast;
  }

  static remove(toast) {
    if (!toast || !toast.parentNode) return;
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 300);
  }

  static success(msg, d)  { return this.show(msg, 'success', d); }
  static error(msg, d)    { return this.show(msg, 'error', d); }
  static warning(msg, d)  { return this.show(msg, 'warning', d); }
  static info(msg, d)     { return this.show(msg, 'info', d); }
  static cart(msg, d)     { return this.show(msg, 'cart', d); }
  static order(msg, d)    { return this.show(msg, 'order', d); }
  static whatsapp(msg, d) { return this.show(msg, 'whatsapp', d); }
}