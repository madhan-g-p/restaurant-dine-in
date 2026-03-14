import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "./hooks/useAppDispatch";
import type { RootState } from "./app/store";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import OrderStatusPage from "./pages/OrderStatusPage";
// DineIn MVP
import DineInMenuPage from "./pages/dinein/DineInMenuPage";
import DineInCartPage from "./pages/dinein/DineInCartPage";
import DineInOrderStatusPage from "./pages/dinein/DineInOrderStatusPage";
import DineInBillPage from "./pages/dinein/DineInBillPage";

export default function App() {
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<><Navbar /><LoginPage /></>} />
          <Route path="/signup" element={<><Navbar /><SignupPage /></>} />

          {/* DineIn MVP Public Routes (No Navbar) */}
          <Route path="/dinein" element={<DineInMenuPage />} />
          <Route path="/dinein/cart" element={<DineInCartPage />} />
          <Route path="/dinein/order/:id" element={<DineInOrderStatusPage />} />
          <Route path="/dinein/bill/:id" element={<DineInBillPage />} />

          {/* Protected routes */}
          <Route
            path="/menu"
            element={
              <ProtectedRoute>
                <MenuPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-status/:id"
            element={
              <ProtectedRoute>
                <OrderStatusPage />
              </ProtectedRoute>
            }
          />

          {/* Root redirect: /login if not authenticated, /menu if authenticated */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/menu" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/menu" : "/login"} replace />
            }
          />
        </Routes>
      </main>
    </div>
  );
}
