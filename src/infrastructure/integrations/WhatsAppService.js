// src/infrastructure/integrations/WhatsAppService.js
export class WhatsAppService {
  static STORE_PHONE = '5804245231898';
  static DELIVERY_COST = 5.00;

  static sendOrder(order, customerPhone) {
    const itemsText = order.items
      .map(item =>
        `  • ${item.name} (x${item.quantity}) = $${(item.price * item.quantity).toFixed(2)}`
      )
      .join('\n');

    const deliverySection = order.customer.deliveryType === 'delivery'
      ? `📍 *Dirección:* ${order.customer.address}
🚚 *Costo Delivery:* +$${order.deliveryCost.toFixed(2)}`
      : `🏪 *Entrega:* Pasa a buscar en tienda`;

    const message = `
🛍️ *NUEVO PEDIDO #${order.id}*
━━━━━━━━━━━━━━━━━━━━━━

👤 *Cliente:* ${order.customer.name}
📞 *WhatsApp:* ${customerPhone}
${deliverySection}

━━━━━━━━━━━━━━━━━━━━━━
🛒 *PRODUCTOS SOLICITADOS:*
${itemsText}

━━━━━━━━━━━━━━━━━━━━━━
💰 *Subtotal:* $${order.subtotal.toFixed(2)}
${order.deliveryCost > 0 ? `🚚 *Delivery:* +$${order.deliveryCost.toFixed(2)}` : ''}
💵 *TOTAL A PAGAR: $${order.total.toFixed(2)}*

━━━━━━━━━━━━━━━━━━━━━━
💳 *MÉTODOS DE PAGO:*
  - 💵 Efectivo
  - 📲 Pago Móvil
  - 🏦 Transferencia Bancaria
  - 💳 Zelle

━━━━━━━━━━━━━━━━━━━━━━
📋 *PASOS A SEGUIR:*
1️⃣ Realiza tu pago por cualquier método
2️⃣ Adjunta el comprobante en ESTE chat
3️⃣ Verificaremos tu pago
4️⃣ Te notificaremos cuando esté listo
${order.customer.deliveryType === 'delivery'
  ? '5️⃣ 🚚 Tu pedido será enviado a tu dirección'
  : '5️⃣ 🏪 Te avisamos cuando puedas pasar a buscarlo'
}

━━━━━━━━━━━━━━━━━━━━━━
⏰ *${new Date().toLocaleString('es-VE')}*
✅ _Gracias por tu compra - E-Commerce 2026_
    `.trim();

    const storeUrl = `https://wa.me/${this.STORE_PHONE}?text=${encodeURIComponent(message)}`;
    console.log('📱 WhatsApp URL:', storeUrl);
    window.open(storeUrl, '_blank');

    return storeUrl;
  }
}