import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
};

export const authAPI = {
  getUsers: () => api.get('/users'),
  register: (userData) => api.post('/users', userData),
};

export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getUserOrders: (userId) => api.get(`/orders?userId=${userId}`),
};

export const loginAPI = {
  saveLogin: (loginData) => api.post('/loginHistory', loginData),
};

export const cartAPI = {
  getCart: (userId) =>
    api.get(`/carts?userId=${userId}`),

  addCartItem: (data) =>
    api.post('/carts', data),

  updateCartItem: (id, data) =>
    api.patch(`/carts/${id}`, data),

  removeCartItem: (id) =>
    api.delete(`/carts/${id}`),
};

export default api;
