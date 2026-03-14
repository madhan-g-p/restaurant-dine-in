import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add a request interceptor to include the JWT token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
api.interceptors.response.use((response) => {
  return response.data;
})
export const adminApi = {
  // Auth
  login: (credentials: any) => api.post('/auth/login', credentials),

  // Tables
  getTables: (floor?: number) => api.get('/admin/tables', { params: { floor } }),
  createTable: (data: any) => api.post('/admin/tables', data),
  updateTable: (id: string, data: any) => api.patch(`/admin/tables/${id}`, data),
  deleteTable: (id: string) => api.delete(`/admin/tables/${id}`),
  setTableStatus: (id: string, status: string) => api.patch(`/admin/tables/${id}/status`, { status }),
  downloadQr: (id: string) => api.get(`/admin/tables/${id}/qr`, { responseType: 'blob' }),

  // Menu
  getCategories: () => api.get('/admin/menu/categories'),
  createCategory: (data: any) => api.post('/admin/menu/categories', data),
  updateCategory: (id: string, data: any) => api.patch(`/admin/menu/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/admin/menu/categories/${id}`),

  getItems: (categoryId: string) => api.get(`/admin/menu/categories/${categoryId}`),
  createItem: (data: any) => api.post('/admin/menu/items', data),
  updateItem: (id: string, data: any) => api.patch(`/admin/menu/items/${id}`, data),
  deleteItem: (id: string) => api.delete(`/admin/menu/items/${id}`),

  // Orders
  getActiveOrders: () => api.get('/admin/orders'),
  updateOrderStatus: (id: string, status: string) => api.patch(`/admin/orders/${id}/status`, { status }),

  // Payments
  verifyPayment: (orderId: string) => api.patch(`/admin/payments/${orderId}/verify`),
};

export default adminApi;
