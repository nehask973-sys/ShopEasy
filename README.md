# ShopEasy - Online Shopping Website

ShopEasy is a beginner-friendly, responsive Indian shopping website built with Vite and vanilla JavaScript. It includes 37 sample products across seven categories, a persistent demo cart, coupons, and a local-only checkout flow. It has no backend and never processes a real payment.

## Folder structure

```text
ShopEasy/
├── README.md
└── frontend/
    ├── index.html
    ├── package.json
    ├── public/
    │   └── images/
    └── src/
        ├── main.js
        ├── style.css
        ├── data/
        │   └── products.js
        ├── components/
        │   ├── Cart.js
        │   ├── Footer.js
        │   ├── Header.js
        │   └── ProductCard.js
        └── pages/
            ├── Home.js
            ├── Categories.js
            ├── ProductDetails.js
            ├── Checkout.js
            ├── OrderConfirmation.js
            └── Orders.js
```

Product photos are loaded from Unsplash over the internet. `public/images/` is available for local assets if you want to make the project work without an image connection.

## Files at a glance

- `frontend/index.html` is the browser entry point. It sets the page metadata and loads the JavaScript module.
- `frontend/src/main.js` starts the app, stores shopping state, connects button actions, and switches between pages.
- `frontend/src/style.css` contains the colours, layouts, animations, and responsive rules for phone, tablet, and desktop sizes.
- `frontend/src/data/products.js` defines categories, saree filters, product details, and the sale-price calculation.
- `frontend/src/components/Header.js` renders navigation, search, and the cart count.
- `frontend/src/components/ProductCard.js` renders a reusable product card and formats prices in Indian rupees.
- `frontend/src/components/Cart.js` renders cart items and calculates item discounts, coupons, delivery, and totals.
- `frontend/src/components/Footer.js` renders the shared site footer.
- `frontend/src/pages/Home.js` builds the home page sections and featured products.
- `frontend/src/pages/Categories.js` filters products by category, saree type, and search terms.
- `frontend/src/pages/ProductDetails.js` shows one product and supports quantity-aware cart and Buy Now actions.
- `frontend/src/pages/Checkout.js` renders validated delivery and demo payment choices.
- `frontend/src/pages/OrderConfirmation.js` displays the order ID, products, payment, delivery address, total, and estimate.
- `frontend/src/pages/Orders.js` renders locally saved order history.

## Install and run

Install Node.js (LTS), open a terminal in `frontend/`, then run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`. To make and preview a production build:

```bash
npm run build
npm run preview
```

## Add products, change prices, or add categories

Add products to the `products` array in `frontend/src/data/products.js`. Copy an existing object and give it a unique numeric `id`, a name, category, subcategory, description, image ID, `originalPrice` in rupees, and a discount percentage. When the module loads, `salePrice` is calculated by the shared function as `originalPrice × (1 − discount / 100)`; it is never manually entered. For example, ₹1,500 with a 20% discount displays as ₹1,200.

To change a price or discount, edit that product's `originalPrice` or `discount`. Prices are formatted with `Intl.NumberFormat` using the `INR` currency.

To add a category, add a `{ name, image, tone }` entry to `categories` and add products with that exact category name. The header, menu, and category filters are generated from this list. Saree filters are Kota Silk Sarees, Kota Doria Silk Sarees, and Crepe Silk Sarees. For another subcategory filter, add its value to `sareeSubcategories` and ensure product `subcategory` fields use the same spelling.

## Cart and coupons

The cart is an object keyed by product ID and storing quantity. Add, remove, and quantity buttons update it; the cart count is the sum of quantities. `localStorage` keeps the cart between reloads on the same browser. Product discount is applied per item first, then a coupon is calculated against the discounted subtotal.

- `SAVE10` takes 10% off the discounted subtotal.
- `WELCOME50` takes ₹50 off when the discounted subtotal is at least ₹500.

Only one coupon can be active at a time. Reapplying the active code is rejected with a message and does not add another discount.

Delivery is ₹49 below a ₹999 total and free at or above ₹999. This is a simple demo rule; change the threshold or fee in `Cart.js` and `main.js` if needed.

## Checkout and payment demo

Buy Now creates a one-product checkout using the selected product-detail quantity without changing the existing cart. Cart checkout checks out the full cart. The form validates delivery details in the browser; the user chooses PhonePe / UPI demo or Cash on Delivery, then Place Order creates a local `ORD-YYYY-#####` order ID. Order details and product snapshots are saved to browser `localStorage` and shown under Orders.

The UPI option is deliberately a non-functional demo. No payment details are requested or sent. This is a front-end college project, not a production checkout: it has no server, database, authentication, inventory, or payment gateway. A real store would need a secure backend and a payment provider.

## Prepare for GitHub

1. Create a Git repository in the project root (`ShopEasy/`).
2. Keep source files and `package.json`; commit the generated `package-lock.json` after running `npm install` so installs are repeatable.
3. Do not commit `node_modules/` or private credentials. Add them to `.gitignore` if needed.
4. Push the repository to a new GitHub repository. Include this README and screenshots in the project submission if requested.

## Deploy

Build with `npm run build` from `frontend/`. The static output is `frontend/dist/`. Deploy that folder to GitHub Pages, Netlify, or Vercel with the build command `npm run build` and output directory `dist`; configure the project root as `frontend`. Because this is a client-only Vite app, no server environment variables are needed. Product images and web fonts use external URLs, so an internet connection is needed to load them.

## College presentation notes

**Project description:** ShopEasy is a simple online shopping website that helps users browse everyday products, search by name, filter by category, manage a shopping cart, apply discounts, and place demo orders.

**Objectives:** Build a responsive shopping interface; organize products into useful categories; demonstrate client-side state and price calculations; and model a safe, non-payment checkout process.

**Key features:** 37 sample products in seven categories; live search; category and saree-type filters; responsive navigation; cart quantity controls; SAVE10 and WELCOME50 coupons; Buy Now and cart checkout; delivery form validation; UPI demo and Cash on Delivery choices; order confirmation and local order history.

**Technologies:** HTML5, CSS3, vanilla JavaScript ES modules, Vite, and browser `localStorage`.

**Conclusion:** ShopEasy demonstrates the main customer-facing steps of a small e-commerce website in a lightweight front-end project. Its modular product data and components make it straightforward to extend, while its payment flow stays safely in demo mode.