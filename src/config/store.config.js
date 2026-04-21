export const STORE_CONFIG = {
  name: 'BlackBox Store',
  tagline: 'Los mejores productos al mejor precio',
  description: 'Tu tienda de confianza',
  logo: '🛍️',
  whatsapp: '5804245231898',
  currency: '$',
  deliveryCost: 5.00,

  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#34C759'
  },

  social: {
    instagram: '@blackboxstore',
    facebook: 'BlackBoxStore'
  },

  schedule: 'Lun - Sab: 8am - 6pm',
  location: 'Caracas, Venezuela',

  // ✅ CATEGORÍAS
  categories: [
    { id: 'all',         label: 'Todos',       icon: '🏪' },
    { id: 'electronics', label: 'Electrónica',  icon: '📱' },
    { id: 'accessories', label: 'Accesorios',   icon: '🎧' },
    { id: 'clothing',    label: 'Ropa',         icon: '👕' },
    { id: 'food',        label: 'Comida',       icon: '🍕' },
    { id: 'offers',      label: 'Ofertas',      icon: '🔥' }
  ]
};