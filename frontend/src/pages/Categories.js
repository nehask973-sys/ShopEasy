import { categories, products, sareeSubcategories } from '../data/products.js';
import { ProductCard } from '../components/ProductCard.js';

export function Categories({ activeCategory, activeSubcategory, query }) {
  const filtered = products.filter((product) => {
    const matchesCategory = !activeCategory || product.category === activeCategory;
    const matchesSubcategory = !activeSubcategory || product.subcategory === activeSubcategory;
    const search = query.trim().toLowerCase();
    const matchesSearch = !search || `${product.name} ${product.category} ${product.subcategory} ${product.description}`.toLowerCase().includes(search);
    return matchesCategory && matchesSubcategory && matchesSearch;
  });
  const title = activeCategory || 'All the good things';
  return `<main class="page-section catalog-page"><div class="catalog-intro"><p class="eyebrow">THE SHOP</p><h1>${title}</h1><p>Everyday essentials, thoughtful little treats and prices that feel just right.</p></div><div class="catalog-controls"><div class="filter-group" aria-label="Filter by category"><button class="filter-chip ${!activeCategory ? 'selected' : ''}" data-action="filter-category" data-category="">Everything <span>${products.length}</span></button>${categories.map(({ name }) => `<button class="filter-chip ${activeCategory === name ? 'selected' : ''}" data-action="filter-category" data-category="${name}">${name}</button>`).join('')}</div>${activeCategory === 'Sarees' ? `<div class="filter-group subcategory-filters" aria-label="Filter sarees"><button class="filter-chip ${!activeSubcategory ? 'selected' : ''}" data-action="filter-subcategory" data-subcategory="">All sarees</button>${sareeSubcategories.map((name) => `<button class="filter-chip ${activeSubcategory === name ? 'selected' : ''}" data-action="filter-subcategory" data-subcategory="${name}">${name}</button>`).join('')}</div>` : ''}<div class="results-row"><span>${query ? `Results for “${query.replace(/[<>]/g, '')}”` : activeSubcategory || activeCategory || 'All finds'}</span><span>${filtered.length} products</span></div></div>${filtered.length ? `<div class="product-grid catalog-grid">${filtered.map((product) => ProductCard(product)).join('')}</div>` : `<div class="empty-results"><span>⌕</span><h2>No finds just yet.</h2><p>Try another search or clear the category filters.</p><button class="button button-dark" data-action="clear-filters">See all products</button></div>`}</main>`;
}