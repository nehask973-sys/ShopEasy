import './style.css';
import { products, salePrice } from './data/products.js';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { Cart, CartRecommendations, calculateTotals } from './components/Cart.js';
import { Home } from './pages/Home.js';
import { Categories } from './pages/Categories.js';
import { ProductDetails } from './pages/ProductDetails.js';
import { Checkout } from './pages/Checkout.js';
import { OrderSuccess } from './pages/OrderConfirmation.js';
import { Orders } from './pages/Orders.js';

const app = document.querySelector('#app');
const storedCart = readStorage('shopeasy-cart', {});
const state = {
  page: 'home', category: '', subcategory: '', query: '', cart: storedCart,
  coupon: '', couponMessage: '', menuOpen: false, checkoutItems: null,
  checkoutSource: 'cart', orders: readStorage('shopeasy-orders', []), latestOrder: null,
  selectedProductId: null, detailQuantity: 1
};

function readStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

function saveStorage() {
  localStorage.setItem('shopeasy-cart', JSON.stringify(state.cart));
  localStorage.setItem('shopeasy-orders', JSON.stringify(state.orders));
}

function cartCount() {
  return Object.values(state.cart).reduce((sum, quantity) => sum + quantity, 0);
}

function contentForPage() {
  if (state.page === 'home') return Home();
  if (state.page === 'categories') return Categories({ activeCategory: state.category, activeSubcategory: state.subcategory, query: state.query });
  if (state.page === 'product') return ProductDetails({ product: products.find((item) => item.id === state.selectedProductId), quantity: state.detailQuantity });
  if (state.page === 'cart') return `${Cart({ items: state.cart, products, couponCode: state.coupon, couponMessage: state.couponMessage })}${cartCount() ? CartRecommendations({ products, cartItems: state.cart }) : ''}`;
  if (state.page === 'checkout') return Checkout({ items: state.checkoutItems ?? state.cart, products, couponCode: state.coupon });
  if (state.page === 'success' && state.latestOrder) return OrderSuccess({ order: state.latestOrder });
  return Orders({ orders: state.orders, products });
}

function syncCheckoutControls() {
  const placeOrder = document.querySelector('.place-order-button');
  if (placeOrder) placeOrder.innerHTML = 'Place Order <span>→</span>';
}

function render() {
  app.innerHTML = `${Header({ cartCount: cartCount(), activePage: state.page, menuOpen: state.menuOpen })}<div id="page-content">${contentForPage()}</div>${Footer()}<div class="toast" role="status" aria-live="polite"></div>`;
  const search = document.querySelector('#site-search');
  search.value = state.query;
  search.addEventListener('input', (event) => {
    state.query = event.target.value;
    state.page = 'categories'; state.category = ''; state.subcategory = '';
    renderContent();
  });
  syncCheckoutControls();
}

function renderContent() {
  document.querySelector('#page-content').innerHTML = contentForPage();
  syncCheckoutControls();
}

function navigate(page) {
  state.page = page;
  state.menuOpen = false;
  if (page !== 'categories') { state.category = ''; state.subcategory = ''; state.query = ''; }
  if (page === 'checkout') { state.checkoutItems = null; state.checkoutSource = 'cart'; }
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showToast(message) {
  const toast = document.querySelector('.toast');
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove('visible'), 2200);
}

function addToCart(id, quantity = 1) {
  state.cart[id] = (state.cart[id] || 0) + quantity;
  saveStorage(); render(); showToast('Added to your bag');
}

function buyNow(id, quantity = 1) {
  state.checkoutItems = { [id]: quantity }; state.checkoutSource = 'buy-now'; state.page = 'checkout'; state.menuOpen = false;
  render(); window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openProductDetails(id) {
  state.selectedProductId = Number(id);
  state.detailQuantity = 1;
  state.page = 'product';
  state.menuOpen = false;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

app.addEventListener('click', (event) => {
  const element = event.target.closest('[data-action]');
  if (!element) return;
  const { action, id, page, category, subcategory, delta } = element.dataset;
  if (action === 'navigate') navigate(page);
  if (action === 'toggle-menu') { state.menuOpen = !state.menuOpen; render(); }
  if (action === 'filter-category') {
    state.page = 'categories'; state.category = category || ''; state.subcategory = ''; state.query = ''; state.menuOpen = false;
    render(); window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  if (action === 'filter-subcategory') { state.subcategory = subcategory || ''; renderContent(); }
  if (action === 'clear-filters') { state.category = ''; state.subcategory = ''; state.query = ''; renderContent(); }
  if (action === 'add-cart') addToCart(id);
  if (action === 'buy-now') buyNow(id);
  if (action === 'product-details') openProductDetails(id);
  if (action === 'detail-quantity') { state.detailQuantity = Math.max(1, state.detailQuantity + Number(delta)); renderContent(); }
  if (action === 'add-detail-cart') addToCart(id, state.detailQuantity);
  if (action === 'buy-detail-now') buyNow(id, state.detailQuantity);
  if (action === 'quantity') {
    state.cart[id] = Math.max(0, (state.cart[id] || 0) + Number(delta));
    if (state.cart[id] === 0) delete state.cart[id];
    saveStorage(); render();
  }
  if (action === 'remove-cart') { delete state.cart[id]; saveStorage(); render(); }
  if (action === 'apply-coupon') {
    const code = document.querySelector('#coupon-input').value.trim().toUpperCase();
    const saleTotal = calculateTotals(state.cart, products).saleSubtotal;
    if (code && code === state.coupon) state.couponMessage = 'This coupon has already been applied.';
    else if (code === 'SAVE10') { state.coupon = code; state.couponMessage = 'Coupon applied successfully!'; }
    else if (code === 'WELCOME50' && saleTotal >= 500) { state.coupon = code; state.couponMessage = 'Coupon applied successfully!'; }
    else { state.couponMessage = code === 'WELCOME50' ? 'Add items worth ₹500 to use this coupon.' : 'Invalid coupon code.'; }
    render();
  }
  if (action === 'checkout') { state.page = 'checkout'; state.checkoutItems = null; state.checkoutSource = 'cart'; render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
});

app.addEventListener('change', (event) => {
  if (!event.target.matches('[name="payment"]')) return;
  let message = document.querySelector('.payment-selection-message');
  if (!message) {
    message = document.createElement('p');
    message.className = 'payment-selection-message';
    message.setAttribute('role', 'status');
    document.querySelector('.payment-options')?.after(message);
  }
  message.textContent = event.target.value === 'Cash on Delivery' ? 'Cash on Delivery Selected' : 'PhonePe / UPI Demo Selected';
});

app.addEventListener('submit', (event) => {
  if (event.target.id !== 'checkout-form') return;
  event.preventDefault();
  const formData = new FormData(event.target);
  const items = state.checkoutItems ?? state.cart;
  const totals = calculateTotals(items, products, state.coupon);
  const delivery = totals.total > 0 && totals.total < 999 ? 49 : 0;
  const order = {
    id: `ORD-${new Date().getFullYear()}-${String(Math.floor(10000 + Math.random() * 90000))}`, createdAt: new Date().toISOString(), payment: formData.get('payment'),
    address: Object.fromEntries(['fullName', 'mobile', 'address', 'city', 'state', 'pinCode'].map((name) => [name, formData.get(name)])),
    deliveryDetails: Object.fromEntries(['fullName', 'mobile', 'address', 'city', 'state', 'pinCode'].map((name) => [name, formData.get(name)])),
    lines: totals.lines.map(({ product, quantity }) => ({ id: product.id, name: product.name, image: product.image, quantity, originalPrice: product.originalPrice ?? product.price, salePrice: salePrice(product), discount: product.discount })),
    subtotal: totals.subtotal, productDiscount: totals.itemDiscount, couponDiscount: totals.couponDiscount,
    deliveryFee: delivery, total: totals.total + delivery, coupon: state.coupon, status: 'Order Confirmed'
  };
  state.orders.unshift(order); state.latestOrder = order;
  if (state.checkoutSource === 'cart') state.cart = {};
  state.coupon = ''; state.couponMessage = ''; state.checkoutItems = null;
  saveStorage(); state.page = 'success'; render(); window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); document.querySelector('#site-search')?.focus(); }
  if (event.key === 'Escape' && state.menuOpen) { state.menuOpen = false; render(); }
});

render();