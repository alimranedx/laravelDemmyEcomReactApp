import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import themeReducer from './slices/themeSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import uiReducer from './slices/uiSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    theme: themeReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,

  },
});
