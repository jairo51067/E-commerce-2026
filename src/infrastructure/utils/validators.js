// src/infrastructure/utils/validators.js
export class Validators {

  /**
   * Valida teléfono venezolano
   * Acepta: 04141234567, +584141234567, 414-123-4567
   */
  static phone(phone) {
    if (!phone) {
      return { valid: false, error: 'Teléfono requerido' };
    }

    const cleaned = phone.replace(/[\s\-\$\$]/g, '');
    const regex = /^(\+58|58|0)?(412|414|416|424|426)\d{7}$/;

    if (!regex.test(cleaned)) {
      return {
        valid: false,
        error: 'Teléfono inválido. Ej: 0414-1234567'
      };
    }

    return { valid: true, cleaned };
  }

  /**
   * Formatea teléfono para WhatsApp
   * 04141234567 → 584141234567
   */
  static formatPhoneWhatsApp(phone) {
    const cleaned = phone.replace(/[\s\-\$\$\+]/g, '');

    if (cleaned.startsWith('58')) return cleaned;
    if (cleaned.startsWith('0')) return '58' + cleaned.substring(1);
    return '58' + cleaned;
  }

  /**
   * Valida nombre (mínimo 3 caracteres)
   */
  static name(name) {
    if (!name || name.trim().length < 3) {
      return {
        valid: false,
        error: 'Nombre debe tener al menos 3 caracteres'
      };
    }
    return { valid: true };
  }

  /**
   * Valida dirección (mínimo 10 caracteres)
   */
  static address(address) {
    if (!address || address.trim().length < 10) {
      return {
        valid: false,
        error: 'Dirección debe ser más específica'
      };
    }
    return { valid: true };
  }
}