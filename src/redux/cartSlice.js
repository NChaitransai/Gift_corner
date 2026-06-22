import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../services/api';

const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem('giftcorner_cart');
  return storedCart ? JSON.parse(storedCart) : [];
};

const saveCartToStorage = (cartItems) => {
  localStorage.setItem('giftcorner_cart', JSON.stringify(cartItems));
};

const initialState = {
  items: loadCartFromStorage(),
  status: 'idle',
  error: null,
};

// Async Thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCart(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const syncCartOnLogin = createAsyncThunk(
  'cart/syncCartOnLogin',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const response = await cartAPI.getCart(userId);
      const dbCart = response.data;
      
      const localCart = getState().cart.items;
      if (localCart.length === 0) {
        return dbCart;
      }
      
      const mergedCart = [...dbCart];
      
      for (const localItem of localCart) {
        const existingInDb = mergedCart.find(
          (item) => item.cartItemId === localItem.cartItemId
        );
        
        if (existingInDb) {
          const newQty = existingInDb.quantity + localItem.quantity;
          const updatedItem = { ...existingInDb, quantity: newQty };
          await cartAPI.updateCartItem(existingInDb.id, updatedItem);
          existingInDb.quantity = newQty;
        } else {
          const newItem = {
            id: `${userId}_${localItem.cartItemId}`,
            userId,
            productId: localItem.cartItemId,
            cartItemId: localItem.cartItemId,
            title: localItem.title,
            price: localItem.price,
            image: localItem.image,
            quantity: localItem.quantity,
          };
          await cartAPI.addCartItem(newItem);
          mergedCart.push(newItem);
        }
      }
      
      localStorage.setItem('giftcorner_cart', JSON.stringify([]));
      return mergedCart;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async ({ userId, item, quantity }, { getState, rejectWithValue }) => {
    try {
      const cartItemId = item.id.toString();
      
      if (!userId) {
        return { userId: null, item, quantity };
      }
      
      const state = getState();
      const existingItem = state.cart.items.find((i) => i.cartItemId === cartItemId);
      
      if (existingItem) {
        const newQty = existingItem.quantity + quantity;
        const updatedItem = { ...existingItem, quantity: newQty };
        const response = await cartAPI.updateCartItem(existingItem.id, updatedItem);
        return { userId, item: response.data, quantity };
      } else {
        const newItem = {
          id: `${userId}_${cartItemId}`,
          userId,
          productId: cartItemId,
          cartItemId,
          title: item.title,
          price: item.price,
          image: item.image,
          quantity,
        };
        const response = await cartAPI.addCartItem(newItem);
        return { userId, item: response.data, quantity };
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async ({ userId, cartItemId }, { rejectWithValue }) => {
    try {
      if (userId) {
        const id = `${userId}_${cartItemId}`;
        await cartAPI.removeCartItem(id);
      }
      return { userId, cartItemId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateQuantityAsync = createAsyncThunk(
  'cart/updateQuantityAsync',
  async ({ userId, cartItemId, quantity }, { getState, rejectWithValue }) => {
    try {
      const validQty = Math.max(1, quantity);
      if (userId) {
        const state = getState();
        const existingItem = state.cart.items.find((i) => i.cartItemId === cartItemId);
        if (existingItem) {
          const updatedItem = { ...existingItem, quantity: validQty };
          const response = await cartAPI.updateCartItem(existingItem.id, updatedItem);
          return { userId, cartItemId, quantity: validQty, item: response.data };
        }
      }
      return { userId, cartItemId, quantity: validQty };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCartAsync',
  async (userId, { rejectWithValue }) => {
    try {
      if (userId) {
        const response = await cartAPI.getCart(userId);
        const items = response.data;
        await Promise.all(items.map((i) => cartAPI.removeCartItem(i.id)));
      }
      return { userId };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage([]);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
        saveCartToStorage(state.items);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Sync Cart on Login
      .addCase(syncCartOnLogin.fulfilled, (state, action) => {
        state.items = action.payload;
        saveCartToStorage(state.items);
      })
      // Add to Cart
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        const { userId, item, quantity } = action.payload;
        if (!userId) {
          const cartItemId = item.id.toString();
          const existingItem = state.items.find((i) => i.cartItemId === cartItemId);
          if (existingItem) {
            existingItem.quantity += quantity;
          } else {
            state.items.push({
              cartItemId,
              id: item.id,
              title: item.title,
              price: item.price,
              image: item.image,
              quantity,
            });
          }
        } else {
          const cartItemId = item.cartItemId;
          const existingItemIndex = state.items.findIndex((i) => i.cartItemId === cartItemId);
          if (existingItemIndex > -1) {
            state.items[existingItemIndex] = item;
          } else {
            state.items.push(item);
          }
        }
        saveCartToStorage(state.items);
      })
      // Remove from Cart
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        const { cartItemId } = action.payload;
        state.items = state.items.filter((item) => item.cartItemId !== cartItemId);
        saveCartToStorage(state.items);
      })
      // Update Quantity
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        const { userId, cartItemId, quantity, item } = action.payload;
        if (!userId) {
          const existingItem = state.items.find((i) => i.cartItemId === cartItemId);
          if (existingItem) {
            existingItem.quantity = quantity;
          }
        } else if (item) {
          const existingItemIndex = state.items.findIndex((i) => i.cartItemId === cartItemId);
          if (existingItemIndex > -1) {
            state.items[existingItemIndex] = item;
          }
        }
        saveCartToStorage(state.items);
      })
      // Clear Cart
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
        saveCartToStorage([]);
      });
  },
});

export const { clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectCartCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer;
