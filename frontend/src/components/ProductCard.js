import { salePrice } from '../data/products.js';

export function ProductCard(product) {
  const price = salePrice(product);
  return `
    <article class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=640&q=82" alt="${product.name}" loading="lazy">
        <span class="discount-badge">${product.discount}% off</span>
        <button class="quick-add" data-action="add-cart" data-id="${product.id}" aria-label="Add ${product.name} to cart" title="Add to cart">+</button>
      </div>
      <div class="product-info">
        <p class="product-category">${product.category}<span>${product.subcategory}</span></p>
        <h3><button class="product-title-link" data-action="product-details" data-id="${product.id}">${product.name}</button></h3>
        <p class="product-description">${product.description}</p>
        <div class="price-row"><strong>${formatCurrency(price)}</strong><del>${formatCurrency(product.originalPrice ?? product.price)}</del><span>${product.discount}% off</span></div>
        <div class="product-buttons"><button class="button button-dark button-small" data-action="add-cart" data-id="${product.id}">Add to cart</button><button class="button button-outline button-small" data-action="buy-now" data-id="${product.id}">Buy now</button></div>
      </div>
    </article>`;
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}