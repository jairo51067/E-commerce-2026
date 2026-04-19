// src/infrastructure/integrations/WhatsAppService.js
export class WhatsAppService {
  static sendOrder(order, customerPhone) {
    const itemsText = order.items
      .map(item => 
        `• ${item.name} (x${item.quantity}) $${item.price * item.quantity}`
      )
      .join('\n');

    const message = `
🚀 *NUEVO PEDIDO #${order.id}*

👤 *Cliente:* ${order.customer.name}
📞 *Tel:* ${customerPhone}
📍 *Dir:* ${order.customer.address}

🛒 *PEDIDO:*
${itemsText}

💰 *TOTAL:* $${order.total.toFixed(2)}
💳 *Pago:* ${order.paymentMethod}

⏰ *${new Date().toLocaleString('es-CO')}*
    `.trim();

    const phoneUrl = `https://wa.me/${customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    
    window.open(phoneUrl, '_blank');
    return phoneUrl;
  }
}