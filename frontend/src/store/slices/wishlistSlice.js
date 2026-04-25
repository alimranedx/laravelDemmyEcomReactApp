import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/user/wishlist');
    return response.data.data; // Assuming response structure is { success: true, data: [...] }
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch wishlist');
  }
});

export const addToWishlistServer = createAsyncThunk('wishlist/add', async (product, { rejectWithValue }) => {
  try {
    await api.post('/user/wishlist', { product_id: product.id });
    return product;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to add to wishlist');
  }
});

export const removeFromWishlistServer = createAsyncThunk('wishlist/remove', async (productId, { rejectWithValue }) => {
  try {
    await api.delete(`/user/wishlist/${productId}`);
    return productId;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to remove from wishlist');
  }
});

export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (product, { getState, dispatch }) => {
  const { items } = getState().wishlist;
  const isWishlisted = items.some(item => item.id === product.id);
  
  if (isWishlisted) {
    return dispatch(removeFromWishlistServer(product.id));
  } else {
    return dispatch(addToWishlistServer(product));
  }
});


const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        // The backend returns an array of Wishlist models: [{ id, user_id, product_id, product: {...} }, ...]
        // We flatten this to just the product objects so the rest of the app can treat them as regular products.
        state.items = action.payload.map(item => item.product).filter(Boolean);
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addToWishlistServer.fulfilled, (state, action) => {
        const product = action.payload;
        if (!state.items.find(item => item.id === product.id)) {
          state.items.push(product);
        }
      })
      // Remove
      .addCase(removeFromWishlistServer.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
