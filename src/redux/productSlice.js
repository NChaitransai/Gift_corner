import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI } from '../services/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productAPI.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch products');
    }
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productAPI.create(productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await productAPI.update(id, productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await productAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete product');
    }
  }
);

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Add product
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearProductError } = productSlice.actions;

export const selectAllProducts = (state) => state.products.items;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;

export default productSlice.reducer;
