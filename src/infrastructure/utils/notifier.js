// src/infrastructure/utils/notifier.js
export class Notifier {
  static container = null;

  static init() {
    if (document.getElementById('toast-container')) return;
    
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 320px;
      width: 90%;
    `;
    document.body.appendChild(container);
    this.container = container;
  }

  static show(message, type = 'info', duration = 3000) {
    this.init();

    const colors = {
      success: { bg: '#34C759', icon: '✅' },
      error:   { bg: '#FF3B30', icon: '❌' },
      warning: { bg: '#FF9500', icon: '⚠️' },
      info:    { bg: '#007AFF', icon: 'ℹ️' },
      cart:    { bg: '#667eea', icon: '🛒' },
      order:   { bg: '#764ba2', icon: '📦' },
      whatsapp:{ bg: '#25D366', icon: '📱' }
    };

    const { bg, icon } = colors[type] || colors.info;

    const toast = document.createElement('div');
    toast.style.cssText = `
      background: ${bg};
      color: white;
      padding: 1rem 1.25rem;
      border-radius: 12px;
      font-family: 'Segoe UI', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      animation: toastIn 0.3s ease;
      cursor: pointer;
      line-height: 1.4;
    `;

    toast.innerHTML = `
      <span style="font-size:1.2rem">${icon}</span>
      <span>${message}</span>
    `;

    toast.addEventListener('click', () => this.remove(toast));
    this.container.appendChild(toast);

    setTimeout(() => this.remove(toast), duration);
    return toast;
  }

  static remove(toast) {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }

  static success(msg, duration) { return this.show(msg, 'success', duration); }
  static error(msg, duration)   { return this.show(msg, 'error', duration); }
  static warning(msg, duration) { return this.show(msg, 'warning', duration); }
  static info(msg, duration)    { return this.show(msg, 'info', duration); }
  static cart(msg, duration)    { return this.show(msg, 'cart', duration); }
  static order(msg, duration)   { return this.show(msg, 'order', duration); }
  static whatsapp(msg, duration){ return this.show(msg, 'whatsapp', duration); }
}