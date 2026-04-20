// src/config/store.config.js
export const STORE_CONFIG = {
  name: "Click & Go Store",
  tagline: "Calidad y precio a un clic de distancia.",
  description: "Tu tienda de confianza",
  logo: "🛍️",
  whatsapp: "5804240000000",
  currency: "$",
  deliveryCost: 5.0,

  colors: {
    primary: "#667eea",
    secondary: "#764ba2",
    accent: "#34C759",
  },

  social: {
    // instagram: "@clickandgo_store",
    instagram: "instagram",
    // facebook: "ClickAndGoStore",
    facebook: "facebook",
    // twitter: "@clickandgo_st",
    twitter: "twitter",
  },

  schedule: "Lun - Sab: 8am - 6pm",
  location: "Caracas, Venezuela",

  // Nuevas categorías integradas
  categories: [
    { id: 'all',         label: 'Todos',         icon: '🏪' },
    { id: 'electronics', label: 'Electrónicos',  icon: '📱' },
    { id: 'accessories', label: 'Accesorios',    icon: '🎧' },
    { id: 'clothing',    label: 'Ropa',          icon: '👕' },
    { id: 'food',        label: 'Comida',        icon: '🍕' },
    { id: 'offers',      label: 'Ofertas',       icon: '🔥' }
  ]
};