// src/config/store.config.js

/**
 * ═══════════════════════════════════════════════════════
 * VendeYa™ - Plataforma E-Commerce para PyMEs
 * "Tu tienda online en 5 minutos"
 * ═══════════════════════════════════════════════════════
 *
 * Este archivo contiene TODA la configuración personalizable
 * de la tienda para cada cliente final.
 *
 * Solo edita los valores según el cliente.
 */

export const STORE_CONFIG = {

  // ═══════════════════════════════════════════
  // 🚀 IDENTIDAD DE LA PLATAFORMA (VendeYa)
  // ═══════════════════════════════════════════
  platform: {
    name:        'VendeYa',
    tagline:     'Tu tienda online en 5 minutos',
    slogan:      'Del catálogo a la venta, sin fricciones',
    version:     '1.0.0',
    build:       '2026.01',
    logo:        '⚡',
    website:     'https://vendeya.app',
    email:       'hola@vendeya.app',
    copyright:   'VendeYa™ - Todos los derechos reservados'
  },

  // ═══════════════════════════════════════════
  // 🏪 DATOS DE LA TIENDA (cliente final)
  // ═══════════════════════════════════════════
  name:        'Mi Tienda',
  tagline:     'Los mejores productos a un clic',
  description: 'Descubre productos únicos con entrega rápida',

  logo:        '🛍️',

  // ═══════════════════════════════════════════
  // 📞 CONTACTO
  // ═══════════════════════════════════════════
  whatsapp:    '5804245231898',
  email:       'ventas@mitienda.com',

  // ═══════════════════════════════════════════
  // 💰 CONFIGURACIÓN COMERCIAL
  // ═══════════════════════════════════════════
  currency:     '$',
  currencyName: 'USD',
  deliveryCost: 5.00,

  // ═══════════════════════════════════════════
  // 🎨 BRANDING VISUAL (personalizable)
  // ═══════════════════════════════════════════
  colors: {
    primary:   '#667eea',
    secondary: '#764ba2',
    accent:    '#34C759'
  },

  // ═══════════════════════════════════════════
  // 📱 REDES SOCIALES
  // ═══════════════════════════════════════════
  social: {
    instagram: '@mitienda.ve',
    facebook:  'MiTiendaVE',
    tiktok:    '@mitienda.ve'
  },

  // ═══════════════════════════════════════════
  // 🕐 HORARIO Y UBICACIÓN
  // ═══════════════════════════════════════════
  schedule: 'Lun - Sáb: 9am a 7pm',
  location: 'Caracas, Venezuela',

  // ═══════════════════════════════════════════
  // 🏷️ CATEGORÍAS DE PRODUCTOS
  // ═══════════════════════════════════════════
  categories: [
    { id: 'all',         label: 'Todos',        icon: '🏪' },
    { id: 'electronics', label: 'Electrónica',  icon: '📱' },
    { id: 'accessories', label: 'Accesorios',   icon: '🎧' },
    { id: 'clothing',    label: 'Ropa',         icon: '👕' },
    { id: 'food',        label: 'Comida',       icon: '🍕' },
    { id: 'offers',      label: 'Ofertas',      icon: '🔥' }
  ],

  // ═══════════════════════════════════════════
  // 💬 TEXTOS COMERCIALES (cliente final)
  // ═══════════════════════════════════════════
  texts: {
    heroTitle:    'Descubre lo mejor',
    heroSubtitle: 'Productos seleccionados al mejor precio',
    cartTitle:    'Tu Carrito',
    checkoutCTA:  'Finalizar Compra',
    searchPlaceholder: 'Buscar en la tienda...',
    noResults:    'No encontramos productos',
    noResultsSub: 'Prueba con otra búsqueda o categoría',
    viewAll:      'Ver todos los productos'
  }
};