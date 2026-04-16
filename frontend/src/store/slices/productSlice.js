import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/client';

export const fetchProducts = createAsyncThunk('products/fetchAll', async ({ page = 1, search = '', per_page = 12, append = false }, { rejectWithValue }) => {
  try {
    const response = await api.get(`/products?page=${page}&search=${search}&per_page=${per_page}`);
    return { ...response.data, append };
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch products');
  }
});


const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    pagination: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.append) {
          state.items = [...state.items, ...action.payload.data];
        } else {
          state.items = action.payload.data;
        }
        state.pagination = {
          current_page: action.payload.current_page,
          last_page: action.payload.last_page,
          total: action.payload.total,
        };
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
