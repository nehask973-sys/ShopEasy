import { ProductCard, formatCurrency } from './ProductCard.js';
import { salePrice } from '../data/products.js';

export function calculateTotals(items, products, couponCode = '') {
  const lines = Object.entries(items).map(([id, quantity]) => {
    const product = products.find((item) => item.id === Number(id));
    return product ? { product, quantity, original: (product.originalPrice ?? product.price) * quantity, sale: salePrice(product) * quantity } : null;
  }).filter(Boolean);
  const subtotal = lines.reduce((sum, line) => sum + line.original, 0);
  const itemDiscount = subtotal - lines.reduce((sum, line) => sum + line.sale, 0);
  const saleSubtotal = subtotal - itemDiscount;
  const code = couponCode.trim().toUpperCase();
  const couponDiscount = code === 'SAVE10' ? Math.round(saleSubtotal * 0.1) : code === 'WELCOME50' && saleSubtotal >= 500 ? 50 : 0;
  return { lines, subtotal, itemDiscount, saleSubtotal, couponDiscount, total: Math.max(0, saleSubtotal - couponDiscount) };
}

export function Cart({ items, products, couponCode, couponMessage }) {
  const totals = calculateTotals(items, products, couponCode);
  if (!totals.lines.length) return `<section class="empty-state"><span class="empty-icon">▱</span><p class="eyebrow">YOUR BAG IS WAITING</p><h1>Good finds belong in here.</h1><p>Browse the collection and add something you love.</p><button class="button button-dark" data-action="navigate" data-page="categories">Explore products <span>↗</span></button></section>`;
  const delivery = totals.total >= 999 || totals.total === 0 ? 0 : 49;
  return `
    <section class="page-section cart-page">
      <div class="page-heading"><div><p class="eyebrow">YOUR BAG</p><h1>Shopping cart <span>(${totals.lines.reduce((sum, line) => sum + line.quantity, 0)})</span></h1></div><button class="text-link" data-action="navigate" data-page="categories">Continue shopping <span>↗</span></button></div>
      <div class="cart-layout">
        <div class="cart-items">${totals.lines.map(({ product, quantity }) => `
          <article class="cart-line"><img src="https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=240&q=75" alt="${product.name}"><div class="cart-line-info"><span class="product-category">${product.category}</span><h2>${product.name}</h2><strong>${formatCurrency(salePrice(product))}</strong><div class="quantity-control"><button data-action="quantity" data-id="${product.id}" data-delta="-1" aria-label="Decrease quantity of ${product.name}">−</button><span>${quantity}</span><button data-action="quantity" data-id="${product.id}" data-delta="1" aria-label="Increase quantity of ${product.name}">+</button></div></div><button class="remove-button" data-action="remove-cart" data-id="${product.id}" aria-label="Remove ${product.name} from cart">Remove</button></article>`).join('')}</div>
        <aside class="summary-panel"><h2>Order summary</h2><div class="coupon-form"><label for="coupon-input">Have a coupon?</label><div><input id="coupon-input" value="${couponCode}" placeholder="Enter code" autocomplete="off"><button data-action="apply-coupon">Apply</button></div>${couponMessage ? `<p class="coupon-message ${couponMessage.startsWith('Coupon applied') ? 'success' : 'error'}">${couponMessage}</p>` : '<small>Try SAVE10 or WELCOME50</small>'}</div><div class="summary-lines"><p><span>Subtotal</span><strong>${formatCurrency(totals.subtotal)}</strong></p><p><span>Product discount</span><strong class="saving">−${formatCurrency(totals.itemDiscount)}</strong></p><p><span>Coupon discount</span><strong class="saving">−${formatCurrency(totals.couponDiscount)}</strong></p><p><span>Delivery</span><strong>${delivery ? formatCurrency(delivery) : 'Free'}</strong></p><p class="summary-total"><span>Total</span><strong>${formatCurrency(totals.total + delivery)}</strong></p></div><button class="button button-dark checkout-button" data-action="checkout">Continue to checkout <span>→</span></button><p class="secure-note">Secure checkout · Demo order only</p></aside>
      </div>
    </section>`;
}

export function CartRecommendations({ products, cartItems }) {
  const recommended = products.filter((product) => !cartItems[product.id]).slice(0, 4);
  return `<section class="page-section recommendations"><div class="section-heading"><div><p class="eyebrow">A FEW MORE FINDS</p><h2>You might like</h2></div></div><div class="product-grid">${recommended.map((product) => ProductCard(product)).join('')}</div></section>`;
}