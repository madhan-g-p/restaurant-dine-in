import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@components/layout/ProtectedRoute";
import AdminLayout from "@components/layout/AdminLayout";
import AdminLoginPage from "@pages/AdminLoginPage";
import AdminDashboardPage from "@pages/AdminDashboardPage";
import AdminTablesPage from "@pages/AdminTablesPage";
import AdminMenuPage from "@pages/AdminMenuPage";
import AdminOrdersPage from "@pages/AdminOrdersPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tables"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminTablesPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/menu"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminMenuPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminOrdersPage />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
