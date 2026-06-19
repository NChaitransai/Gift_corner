import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem('giftcorner_cart');
  return storedCart ? JSON.parse(storedCart) : [];
};

const saveCartToStorage = (cartItems) => {
  localStorage.setItem('giftcorner_cart', JSON.stringify(cartItems));
};

const initialState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, title, price, image, quantity = 1 } = action.payload;
      
      const cartItemId = id.toString();
      const existingItem = state.items.find((item) => item.cartItemId === cartItemId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          cartItemId,
          id,
          title,
          price,
          image,
          quantity,
        });
      }
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      const cartItemId = action.payload;
      state.items = state.items.filter((item) => item.cartItemId !== cartItemId);
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action) => {
      const { cartItemId, quantity } = action.payload;
      const item = state.items.find((item) => item.cartItemId === cartItemId);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage([]);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectCartCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer;
