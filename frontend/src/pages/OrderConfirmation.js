import { formatCurrency } from '../components/ProductCard.js';

export function OrderSuccess({ order }) {
  const delivery = order.deliveryDetails ?? order.address ?? {};
  const estimatedDate = new Date(order.createdAt);
  estimatedDate.setDate(estimatedDate.getDate() + 5);
  const paymentLabel = order.payment === 'Cash on Delivery' ? 'Cash on Delivery Selected' : 'PhonePe / UPI Demo Selected';
  const addressLines = [delivery.address, [delivery.city, delivery.state, delivery.pinCode].filter(Boolean).join(', ')].filter(Boolean);
  return `<main class="order-success"><div class="success-mark">✓</div><p class="eyebrow">THAT’S A WRAP</p><h1>Order placed<br><em>successfully!</em></h1><p class="success-copy">Thanks, ${escapeHtml(delivery.fullName)}. Your demo order has been placed.</p><div class="order-id-card"><span>YOUR ORDER ID</span><strong>${escapeHtml(order.id)}</strong><small>${new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</small></div><div class="confirmation-panel"><div class="confirmation-panel-heading"><h2>Your order</h2><span>${escapeHtml(order.status || 'Order Confirmed')}</span></div><div class="confirmation-products">${order.lines.map((line) => `<div class="confirmation-product"><img src="https://images.unsplash.com/${line.image}?auto=format&fit=crop&w=150&q=70" alt="${escapeHtml(line.name)}"><span><strong>${escapeHtml(line.name)}</strong><small>Qty ${line.quantity} · ${formatCurrency(line.salePrice)} each</small></span><b>${formatCurrency(line.salePrice * line.quantity)}</b></div>`).join('')}</div><div class="confirmation-total"><span>Total paid / due</span><strong>${formatCurrency(order.total)}</strong></div></div><div class="confirmation-details"><div><span>Payment method</span><strong>${paymentLabel}</strong></div><div><span>Delivery to</span><strong>${escapeHtml(delivery.fullName)} · ${escapeHtml(delivery.mobile)}</strong><small>${addressLines.map(escapeHtml).join('<br>')}</small></div><div><span>Estimated delivery</span><strong>By ${estimatedDate.toLocaleDateString('en-IN', { dateStyle: 'long' })}</strong></div></div><div class="success-actions"><button class="button button-dark" data-action="navigate" data-page="orders">View your orders <span>↗</span></button><button class="text-link" data-action="navigate" data-page="home">Back to home</button></div></main>`;
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}