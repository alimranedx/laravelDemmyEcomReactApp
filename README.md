# 🛒 Gravity Shop — Full-Stack E-Commerce Application

A premium, full-stack e-commerce application built with **React (Vite)** on the frontend and **Laravel** on the backend. Features a modern glassmorphic UI, JWT authentication, product catalog with infinite scroll, wishlist/cart management, and a complete checkout flow.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started (Local Development)](#-getting-started-local-development)
  - [1. Backend Setup (Laravel)](#1-backend-setup-laravel)
  - [2. Frontend Setup (React/Vite)](#2-frontend-setup-reactvite)
- [Environment Configuration](#-environment-configuration)
- [Deployment](#-deployment)
- [Application Routes](#-application-routes)
- [API Overview](#-api-overview)
- [Redux State Management](#-redux-state-management)
- [Developer Notes](#-developer-notes)

---

## 🧰 Tech Stack

### Frontend
| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.2.4 | UI Framework |
| `react-dom` | ^19.2.4 | DOM Rendering |
| `react-router-dom` | ^7.14.1 | Client-side Routing |
| `@reduxjs/toolkit` | ^2.11.2 | State Management |
| `react-redux` | ^9.2.0 | React-Redux Bindings |
| `framer-motion` | ^12.38.0 | Animations & Transitions |
| `axios` | ^1.15.0 | HTTP API Client |
| `vite` | ^8.0.4 | Build Tool / Dev Server |

### Backend
| Package | Purpose |
|---|---|
| `Laravel` (PHP) | REST API Framework |
| `tymon/jwt-auth` | JWT Authentication |
| `Laragon` | Local Dev Environment (recommended) |

---

## 📁 Project Structure

```
laravelDemmyEcomReactApp/
│
├── frontend/                     # React (Vite) Application
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js         # Axios instance with JWT interceptors
│   │   ├── components/
│   │   │   ├── home/
│   │   │   │   └── HeroSlider.jsx    # Dynamic product hero carousel
│   │   │   └── layout/
│   │   │       ├── Header.jsx        # Top nav with hamburger toggle
│   │   │       └── Sidebar.jsx       # Slide-out navigation drawer
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   └── ResetPassword.jsx
│   │   │   ├── dashboard/
│   │   │   │   └── Dashboard.jsx     # Protected user dashboard
│   │   │   ├── Home.jsx              # Catalog with Infinite Scroll
│   │   │   ├── ProductDetail.jsx     # Single product + Buy Now
│   │   │   ├── Cart.jsx
│   │   │   ├── Wishlist.jsx
│   │   │   └── Checkout.jsx          # Cart + Single-product checkout
│   │   ├── store/
│   │   │   ├── index.js              # Redux store configuration
│   │   │   └── slices/
│   │   │       ├── authSlice.js      # Login/Register/Logout state
│   │   │       ├── productSlice.js   # Product fetching + pagination
│   │   │       ├── cartSlice.js      # Cart CRUD operations
│   │   │       ├── wishlistSlice.js  # Wishlist sync with API
│   │   │       ├── themeSlice.js     # Light/Dark mode toggle
│   │   │       └── uiSlice.js        # Sidebar open/close state
│   │   ├── styles/
│   │   │   └── global.css            # Design system, tokens, effects
│   │   └── utils/
│   │       └── urlHelper.js          # Centralised image URL builder
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── API_DOCUMENTATION.doc         # Full backend API reference
```

---

## ✅ Prerequisites

Make sure you have the following installed on your system:

- **Node.js** ≥ 18.x — [Download](https://nodejs.org/)
- **npm** ≥ 9.x (comes with Node)
- **PHP** ≥ 8.1
- **Composer** — [Download](https://getcomposer.org/)
- **MySQL** (via Laragon, XAMPP, or native)
- **Laragon** (recommended for Windows) — [Download](https://laragon.org/)

---

## 🚀 Getting Started (Local Development)

### 1. Backend Setup (Laravel)

The Laravel backend is expected to live at `C:\laragon\www\laravelDummyEcom` (or configured in Laragon).

```bash
# 1. Navigate to your Laravel project
cd C:\laragon\www\laravelDummyEcom

# 2. Install PHP dependencies
composer install

# 3. Copy the example environment file
cp .env.example .env

# 4. Generate the application key
php artisan key:generate

# 5. Generate the JWT secret
php artisan jwt:secret

# 6. Configure your database in .env
# DB_DATABASE=laravelDummyEcom
# DB_USERNAME=root
# DB_PASSWORD=

# 7. Run migrations and seed the database
php artisan migrate --seed

# 8. Create the storage symlink for product images
php artisan storage:link

# 9. Start the Laravel development server
php artisan serve
# Backend will be available at: http://localhost:8000
```

> **Note:** With Laragon, simply start Laragon and it will serve the backend automatically at `http://laravelDummyEcom.test` — but the frontend is configured to use `http://localhost:8000`.

---

### 2. Frontend Setup (React/Vite)

```bash
# 1. Navigate to the frontend directory
cd laravelDemmyEcomReactApp/frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
# App will be available at: http://localhost:5174
```

That's it! The app should now be running at **http://localhost:5174**.

---

## ⚙️ Environment Configuration

The frontend API base URL is hardcoded in `src/api/client.js`:

```js
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});
```

To change the API URL (e.g., for staging/production), update this value or configure a Vite `.env` file:

```env
# frontend/.env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

Then update `client.js`:
```js
baseURL: import.meta.env.VITE_API_BASE_URL,
```

---

## 🌐 Deployment

### Frontend — Deploy to Vercel / Netlify

```bash
# Build the production bundle
cd frontend
npm run build
# Output will be in: frontend/dist/
```

Upload the `dist/` folder to Vercel, Netlify, or any static host.

**Important:** Set the environment variable on your host:
```
VITE_API_BASE_URL=https://your-laravel-api.com/api
```

### Backend — Deploy to Shared Hosting / VPS

1. Upload your Laravel project to the server.
2. Configure your `.env` with production DB credentials and `APP_ENV=production`.
3. Run `composer install --optimize-autoloader --no-dev`.
4. Set the web root to the `public/` directory.
5. Run `php artisan migrate --force` and `php artisan storage:link`.
6. Configure CORS in `config/cors.php` to allow your frontend's domain.

---

## 🗺️ Application Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Home page — Hero Slider + Product Catalog with Infinite Scroll |
| `/products/:id` | Public | Product Detail page with "Add to Cart" and "Buy Now" |
| `/cart` | Public | Shopping Cart page |
| `/wishlist` | Public | User Wishlist |
| `/checkout` | 🔒 Auth | Checkout page (cart or single-product) |
| `/login` | Guest only | Login page |
| `/register` | Guest only | Registration page |
| `/forgot-password` | Guest only | Request password reset email |
| `/reset-password` | Guest only | Set new password via token |
| `/dashboard` | 🔒 Auth | User dashboard — orders, profile |

---

## 📡 API Overview

All API requests are prefixed with `/api`. Authentication uses **JWT Bearer tokens** stored in `localStorage`.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | ❌ | Register a new user |
| `POST` | `/login` | ❌ | Login and receive JWT token |
| `POST` | `/logout` | ✅ | Invalidate the JWT token |
| `GET` | `/products` | ❌ | List products (supports `?search=&page=&per_page=`) |
| `GET` | `/products/:id` | ❌ | Get single product details |
| `GET` | `/cart` | ✅ | Get authenticated user's cart |
| `POST` | `/cart` | ✅ | Add item to cart |
| `DELETE` | `/cart/:id` | ✅ | Remove item from cart |
| `GET` | `/wishlist` | ✅ | Get authenticated user's wishlist |
| `POST` | `/wishlist` | ✅ | Toggle a product in wishlist |
| `POST` | `/orders` | ✅ | Place an order (checkout) |
| `GET` | `/orders` | ✅ | Get user's order history |

> 📄 See `API_DOCUMENTATION.doc` in the project root for the full, detailed API reference.

---

## 🗃️ Redux State Management

The app uses **Redux Toolkit** with the following slices:

| Slice | State Key | Responsibility |
|---|---|---|
| `authSlice` | `auth` | `token`, `user`, login/logout/register thunks |
| `productSlice` | `products` | `items`, `pagination`, `loading` — supports appending for infinite scroll |
| `cartSlice` | `cart` | `items`, add/remove/sync with API |
| `wishlistSlice` | `wishlist` | `items`, `toggleWishlist` thunk syncs with backend |
| `themeSlice` | `theme` | `mode` (`light`/`dark`), persisted to `localStorage` |
| `uiSlice` | `ui` | `isSidebarOpen`, toggle/open/close actions |

---

## 👨‍💻 Developer Notes

### Image URLs
All product images stored in Laravel's `public/storage/` must be accessed via the centralized utility:

```js
import { getImageUrl } from '../utils/urlHelper';

// Usage
<img src={getImageUrl(product)} alt={product.name} />
```

This utility handles multiple field names (`image_path`, `image_url`, `image`, etc.) and always prepends the correct Laravel storage base URL.

### Adding a New Redux Slice

1. Create `src/store/slices/mySlice.js` using `createSlice` or `createAsyncThunk`.
2. Import and register it in `src/store/index.js`:
   ```js
   import myReducer from './slices/mySlice';
   // add inside configureStore reducer:
   my: myReducer,
   ```

### Theme System
The theme is toggled by setting `data-theme="light"` or `data-theme="dark"` on the `<html>` element. CSS variables in `src/styles/global.css` automatically switch:

```css
:root { /* Dark theme defaults */ }
[data-theme='light'] { /* Light theme overrides */ }
```

### Infinite Scroll
The Home page (`src/pages/Home.jsx`) attaches a `scroll` event listener that dispatches the next page fetch when the user is within **500px of the bottom** of the page. New products are appended to `state.items` in `productSlice`.

### Protected Routes
Routes that require authentication use inline conditional rendering in `App.jsx`:
```jsx
<Route path="/checkout" element={token ? <Checkout /> : <Navigate to="/login" />} />
```

---

## 📬 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request against the `dev` branch

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
