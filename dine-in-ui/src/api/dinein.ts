import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Configure axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for HttpOnly session cookie
});

export const dineInApi = {
  // Sessions
  initSession: (tableNumber: string, fingerprint: string) =>
    api.post('/dinein/sessions/init', { tableNumber, fingerprint }),
  
  pingSession: () => 
    api.patch('/dinein/sessions/ping'),

  // Menu & Heatmap
  getMenu: () => 
    api.get('/dinein/menu'),
  
  getHeatmap: () => 
    api.get('/dinein/heatmap'),

  // Orders
  placeOrder: (items: { menuItemId: string; quantity: number }[]) =>
    api.post('/dinein/orders', { items }),

  getOrder: (orderId: string) => 
    api.get(`/dinein/orders/${orderId}`),

  // Payments
  getBill: (orderId: string) => 
    api.get(`/dinein/payments/${orderId}/bill`),

  initiatePayment: (orderId: string, amount: number) =>
    api.post('/dinein/payments/pay', { orderId, amount }),
};

export default dineInApi;
