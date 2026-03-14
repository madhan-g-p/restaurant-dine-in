import type { Order, OrderStatusType, PaginatedResponse, PlaceOrderPayload } from '../types';
import axiosInstance from './axiosInstance';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory order store (simulates backend)
let mockOrders: Order[] = [];

const ORDER_STATUSES: OrderStatusType[] = [
  'Order Received',
  'Preparing',
  'Out for Delivery',
  'Delivered',
];

function getEstimatedDelivery(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 35);
  return now.toISOString();
}

export async function createOrder(payload: PlaceOrderPayload): Promise<Order> {
  const order = await axiosInstance.post('/order', payload);
  return order.data;
}

export async function getOrders(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Order>> {
  const orders = await axiosInstance.get(`/order?page=${page}&limit=${limit}`);
  return orders.data;
}

export async function getOrderStatus(orderId: string): Promise<Order> {
  const response = await axiosInstance.get(`/order/${orderId}`);
  return response.data;
}
