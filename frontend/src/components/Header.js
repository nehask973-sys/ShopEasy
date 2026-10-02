import { categories } from '../data/products.js';

export function Header({ cartCount, activePage, menuOpen }) {
  const categoryLinks = categories.map(({ name }) => `<button class="menu-link" data-action="filter-category" data-category="${name}">${name}</button>`).join('');
  return `
    <div class="announcement">A little something for every day <span>·</span> Free delivery on orders over ₹999</div>
    <header class="site-header">
      <a class="brand" href="#home" data-action="navigate" data-page="home" aria-label="ShopEasy home"><span class="brand-mark">s</span><span>shop<span class="brand-light">easy</span><small>EVERYDAY FINDS</small></span></a>
      <nav class="desktop-nav" aria-label="Main navigation">
        <button class="nav-link ${activePage === 'home' ? 'active' : ''}" data-action="navigate" data-page="home">Home</button>
        <button class="nav-link ${activePage === 'categories' ? 'active' : ''}" data-action="navigate" data-page="categories">Categories</button>
        <button class="nav-link ${activePage === 'orders' ? 'active' : ''}" data-action="navigate" data-page="orders">Orders</button>
      </nav>
      <label class="search-box"><span aria-hidden="true">⌕</span><input id="site-search" type="search" aria-label="Search products" placeholder="Search for anything..." autocomplete="off"><kbd>⌘ K</kbd></label>
      <div class="header-actions">
        <button class="icon-button profile-action" data-action="navigate" data-page="orders" aria-label="Your orders" title="Your orders"><span>♙</span><small>Profile</small></button>
        <button class="icon-button cart-action" data-action="navigate" data-page="cart" aria-label="Shopping cart, ${cartCount} items" title="Shopping cart"><span>▱</span><small>Cart</small><b class="cart-count">${cartCount}</b></button>
        <button class="icon-button menu-toggle" data-action="toggle-menu" aria-label="${menuOpen ? 'Close' : 'Open'} menu" aria-expanded="${menuOpen}"><span>${menuOpen ? '×' : '☰'}</span></button>
      </div>
    </header>
    <div class="category-strip"><button data-action="navigate" data-page="categories">Shop all</button>${categories.map(({ name }) => `<button data-action="filter-category" data-category="${name}">${name}</button>`).join('')}</div>
    <nav class="mobile-menu ${menuOpen ? 'is-open' : ''}" aria-label="Mobile navigation">
      <button class="menu-link" data-action="navigate" data-page="home">Home</button>
      <button class="menu-link" data-action="navigate" data-page="categories">Categories</button>
      ${categoryLinks}
      <button class="menu-link" data-action="navigate" data-page="cart">Cart <span>${cartCount}</span></button>
      <button class="menu-link" data-action="navigate" data-page="orders">Orders</button>
    </nav>`;
}