import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import {
  fetchOrderStatus,
  updateOrderStatus,
} from "../features/order/orderSlice";
import Loader from "../components/ui/Loader";
import ErrorMessage from "../components/ui/ErrorMessage";
import type { OrderStatusType } from "../types";
import { API_BASE_URL } from "../api/axiosInstance";

const STATUS_STEPS: { status: OrderStatusType; icon: string; label: string }[] =
  [
    { status: "Order Received", icon: "📋", label: "Order Received" },
    { status: "Preparing", icon: "👨‍🍳", label: "Preparing" },
    { status: "Out for Delivery", icon: "🚗", label: "Out for Delivery" },
    { status: "Delivered", icon: "✅", label: "Delivered" },
  ];

function getStatusIndex(status: OrderStatusType): number {
  return STATUS_STEPS.findIndex((s) => s.status === status);
}

export default function OrderStatusPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentOrder, loading, error } = useAppSelector((s) => s.order);

  useEffect(() => {
    if (!id) return;

    // 1. Fetch initial details
    dispatch(fetchOrderStatus(id));

    // 2. Setup SSE for live updates
    const token = localStorage.getItem("token") || "";
    // Note: Standard EventSource doesn't support headers, so we pass token in query
    const sseUrl = `${API_BASE_URL}/order/${id}/status/stream?token=${token}`;

    const eventSource = new EventSource(sseUrl);

    eventSource.onopen = () => {
      // console.log("SSE Connection opened");
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // console.log("SSE update received:", data);

        if (data.status) {
          dispatch(
            updateOrderStatus({ orderId: data.orderId, status: data.status }),
          );
        }
      } catch (err) {
        console.error("Error parsing SSE message:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Connection error:", err);
      eventSource.close();
    };

    return () => {
      // console.log("Closing SSE connection");
      eventSource.close();
    };
  }, [id, dispatch]);

  if (loading && !currentOrder) {
    return <Loader message="Loading order details..." />;
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <ErrorMessage
          message={error}
          onRetry={() => id && dispatch(fetchOrderStatus(id))}
        />
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <span className="text-5xl">🔍</span>
        <p
          className="text-lg font-medium mt-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Order not found
        </p>
        <Link to="/orders" className="btn-primary inline-flex mt-6">
          Back to Orders
        </Link>
      </div>
    );
  }

  const currentIdx = getStatusIndex(currentOrder.status);
  const estimatedTime = new Date(
    currentOrder.estimatedDelivery,
  ).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Order Tracking
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            {currentOrder.id}
          </p>
        </div>
        <Link to="/orders" className="btn-secondary text-sm">
          ← All Orders
        </Link>
      </div>

      {/* Status Timeline */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-base font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Order Status
          </h2>
          {currentOrder.status !== "Delivered" && (
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: "var(--color-primary-500)" }}
              />
              <span
                className="text-xs font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                Live tracking
              </span>
            </div>
          )}
        </div>

        <div className="relative">
          {/* Progress bar background */}
          <div className="flex items-center justify-between relative">
            {/* Line behind dots */}
            <div
              className="absolute top-6 left-8 right-8 h-1 rounded-full"
              style={{ backgroundColor: "var(--border-color)" }}
            />
            {/* Active line */}
            <div
              className="absolute top-6 left-8 h-1 rounded-full transition-all duration-1000"
              style={{
                backgroundColor: "var(--color-primary-500)",
                width: `calc(${(currentIdx / (STATUS_STEPS.length - 1)) * 100}% - 4rem)`,
              }}
            />

            {STATUS_STEPS.map((step, idx) => {
              const isCompleted = idx <= currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div
                  key={step.status + idx}
                  className="flex flex-col items-center z-10 flex-1"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-500 ${
                      isCurrent ? "ring-4 scale-110" : ""
                    }`}
                    style={{
                      backgroundColor: isCompleted
                        ? "var(--color-primary-500)"
                        : "var(--bg-surface-hover)",
                      borderColor: isCurrent
                        ? "rgba(249, 115, 22, 0.3)"
                        : "white",
                    }}
                  >
                    {step.icon}
                  </div>
                  <span
                    className={`text-xs mt-3 text-center font-medium ${
                      isCurrent ? "font-bold" : ""
                    }`}
                    style={{
                      color: isCompleted
                        ? "var(--color-primary-500)"
                        : "var(--text-muted)",
                    }}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Estimated delivery */}
        {currentOrder.status !== "Delivered" && (
          <div
            className="mt-8 p-4 rounded-xl text-center"
            style={{ backgroundColor: "var(--bg-surface-hover)" }}
          >
            <p
              className="text-xs font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              Estimated Delivery
            </p>
            <p
              className="text-2xl font-bold mt-1"
              style={{ color: "var(--color-primary-500)" }}
            >
              {estimatedTime}
            </p>
          </div>
        )}

        {currentOrder.status === "Delivered" && (
          <div
            className="mt-8 p-4 rounded-xl text-center"
            style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}
          >
            <p
              className="text-lg font-bold"
              style={{ color: "var(--color-success)" }}
            >
              🎉 Order Delivered!
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Enjoy your meal!
            </p>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="card p-6">
        <h3
          className="text-base font-bold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Order Items
        </h3>

        <div className="flex flex-col gap-3">
          {currentOrder.items.map((item) => (
            <div key={item._id} className="flex items-center gap-3 py-2">
              <img
                src={item.menuItem.image}
                alt={item.menuItem.name}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.menuItem.name}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  x{item.quantity} · ${item.menuItem?.price?.toFixed(2)} each
                </p>
              </div>
              <span
                className="text-sm font-semibold shrink-0"
                style={{ color: "var(--text-primary)" }}
              >
                ${(item?.menuItem?.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <hr className="my-4" style={{ borderColor: "var(--border-color)" }} />

        <div className="flex justify-between">
          <span
            className="text-sm font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Delivery/Platform fee:
          </span>
          <span
            className="text-sm font-semibold shrink-0"
            style={{ color: "var(--text-primary)" }}
          >
            $5.00
          </span>
        </div>

        <hr className="my-4" style={{ borderColor: "var(--border-color)" }} />

        <div className="flex justify-between">
          <span className="font-bold" style={{ color: "var(--text-primary)" }}>
            Total
          </span>
          <span
            className="text-xl font-extrabold"
            style={{ color: "var(--color-primary-500)" }}
          >
            ${currentOrder?.totalAmount?.toFixed(2)}
          </span>
        </div>

        {/* Delivery details */}
        <div
          className="mt-6 pt-4 border-t"
          style={{ borderColor: "var(--border-color)" }}
        >
          <h4
            className="text-xs font-bold uppercase mb-2"
            style={{ color: "var(--text-muted)", letterSpacing: "0.05em" }}
          >
            Delivery To
          </h4>
          <p className="text-sm" style={{ color: "var(--text-primary)" }}>
            {currentOrder.deliveryDetails.name}
          </p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {currentOrder.deliveryDetails.address}
          </p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {currentOrder.deliveryDetails.phone}
          </p>
        </div>
      </div>
    </div>
  );
}
