// ─── User & Auth ───────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// ─── Menu ──────────────────────────────────────────────────
export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface MenuState {
  items: MenuItem[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

// ─── Cart ──────────────────────────────────────────────────
export interface CartItem {
  _id: string;
  menuItem: MenuItem;
  quantity: number;
  name?: string;
}

export type CartState = {
  items: CartItem[];
};

// ─── Order ─────────────────────────────────────────────────
export type OrderStatusType =
  | 'Order Received'
  | 'Preparing'
  | 'Out for Delivery'
  | 'Delivered';

export interface DeliveryDetails {
  name: string;
  address: string;
  phone: string;
}

export interface Order {
  _id: string;
  id: string;
  items: CartItem[];
  deliveryDetails: DeliveryDetails;
  status: OrderStatusType;
  totalAmount: number;
  createdAt: string;
  estimatedDelivery: string;
}

export interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  totalOrders: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

export interface PlaceOrderPayload {
  items: { menuItem: string; quantity: number }[];
  deliveryDetails: DeliveryDetails;
  // total: number;
}
