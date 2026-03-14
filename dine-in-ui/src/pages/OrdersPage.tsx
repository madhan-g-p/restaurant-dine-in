import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { fetchOrders } from "../features/order/orderSlice";
import OrderCard from "../components/order/OrderCard";
import Pagination from "../components/ui/Pagination";
import Loader from "../components/ui/Loader";
import ErrorMessage from "../components/ui/ErrorMessage";

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, currentPage, totalPages, loading, error } = useAppSelector(
    (s) => s.order,
  );

  useEffect(() => {
    dispatch(fetchOrders(currentPage));
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    dispatch(fetchOrders(page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1
        className="text-3xl font-bold mb-8"
        style={{ color: "var(--text-primary)" }}
      >
        My Orders
      </h1>

      {error && (
        <div className="mb-6">
          <ErrorMessage
            message={error}
            onRetry={() => dispatch(fetchOrders(currentPage))}
          />
        </div>
      )}

      {loading && <Loader message="Loading orders..." />}

      {!loading && orders.length === 0 && !error && (
        <div className="text-center py-20">
          <span className="text-5xl">📦</span>
          <p
            className="text-lg font-medium mt-4"
            style={{ color: "var(--text-secondary)" }}
          >
            No orders yet
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Your order history will appear here after you place your first
            order.
          </p>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <>
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
