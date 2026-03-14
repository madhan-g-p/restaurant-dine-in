import { useNavigate } from "react-router-dom";
import type { Order } from "../../types";

interface OrderCardProps {
  order: Order;
}

const statusBadgeClass: Record<string, string> = {
  "Order Received": "badge-received",
  Preparing: "badge-preparing",
  "Out for Delivery": "badge-delivery",
  Delivered: "badge-delivered",
};

export default function OrderCard({ order }: OrderCardProps) {
  const navigate = useNavigate();

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const itemsSummary =
    order.items.length <= 2
      ? order.items.map((i) => i.name).join(", ")
      : `${order.items[0].name}, ${order.items[1].name} +${order.items.length - 2} more`;

  return (
    <div
      onClick={() => navigate(`/order-status/${order.id}`)}
      className="card p-5 cursor-pointer transition-all duration-200 hover:shadow-lg"
      style={{ borderColor: "var(--border-color)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Order ID & Date */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-sm font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {order.id}
            </span>
            <span className={`badge ${statusBadgeClass[order.status] || ""}`}>
              {order.status}
            </span>
          </div>

          {/* Date */}
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            {formattedDate}
          </p>

          {/* Items summary */}
          <p
            className="text-sm mt-2 truncate"
            style={{ color: "var(--text-secondary)" }}
          >
            {itemsSummary}
          </p>
        </div>

        {/* Total */}
        <div className="text-right shrink-0">
          <span
            className="text-lg font-extrabold"
            style={{ color: "var(--color-primary-500)" }}
          >
            ${order.totalAmount?.toFixed(2)}
          </span>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            {order.items.reduce((s, i) => s + i.quantity, 0)} items
          </p>
        </div>
      </div>
    </div>
  );
}
