# 🛒 Dummy Ecommerce Frontend (React + Vite)

This is the React frontend for the Dummy Ecommerce project. It integrates with the Laravel backend API and uses Laravel Echo for real-time notifications.

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Copy the example environment file and update it with your backend details:
```bash
cp .env.example .env
```

### 3. Required Environment Variables
Ensure your `.env` has the correct Reverb keys (matching the backend):
```env
VITE_API_URL="http://127.0.0.1:8000/api"
VITE_REVERB_APP_KEY="your_reverb_key"
VITE_REVERB_HOST="127.0.0.1"
VITE_REVERB_PORT="8081"
VITE_REVERB_SCHEME="http"
```

### 4. Run Development Server
```bash
npm run dev
```

---

## 🔑 Understanding Reverb Keys
When syncing this project between devices, keep in mind:
*   **REVERB_APP_KEY**: This is the "Public Key". Your React code uses this to connect to the WebSocket server.
*   **REVERB_APP_SECRET**: This is the "Private Key". Your Laravel backend uses this to authorize broadcasts.
*   **The Mismatch Problem**: If you generate new keys on the backend using `php artisan install:broadcasting --reverb`, you **must** copy the new `KEY` to your frontend `.env`. If they don't match, you will see a `Pusher error: Not found`.

---

## 🔔 Real-time Notifications (WebSocket)

The frontend uses **Pusher-js** and **Laravel Echo** to listen for events from the Laravel Reverb server.

### Common Issues
- **"Pusher error: Not found"**: This means the `VITE_REVERB_APP_KEY` in your `.env` does not match the one generated in the backend.
- **"WebSocket connection failed"**: Ensure the backend Reverb server is running: `php artisan reverb:start`.
- **"WSS" error on Localhost**: If the browser tries to use `wss://` (secure), ensure `VITE_REVERB_SCHEME=http` is set in your `.env`.

---

## 🛠️ Tech Stack
- **React 19**
- **Vite**
- **Redux Toolkit** (State management)
- **Framer Motion** (Animations)
- **Laravel Echo** (WebSockets)
