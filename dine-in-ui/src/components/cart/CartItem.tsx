import type { CartItem as CartItemType } from "../../types";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { removeFromCart, updateQuantity } from "../../features/cart/cartSlice";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const dispatch = useAppDispatch();
  const lineTotal = item.menuItem.price * item.quantity;

  return (
    <div
      className="card flex items-center gap-4 p-4 transition-all duration-200"
      style={{ borderColor: "var(--border-color)" }}
    >
      {/* Image */}
      <img
        src={item.menuItem.image}
        alt={item.menuItem.name}
        className="w-20 h-20 rounded-xl object-cover shrink-0"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4
          className="text-sm font-bold truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {item.menuItem.name}
        </h4>
        <p
          className="text-sm mt-0.5"
          style={{ color: "var(--text-secondary)" }}
        >
          ${item.menuItem.price.toFixed(2)} each
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() =>
              dispatch(
                updateQuantity({
                  id: item.menuItem._id,
                  quantity: item.quantity - 1,
                }),
              )
            }
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors"
            style={{
              backgroundColor: "var(--bg-surface-hover)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
            }}
          >
            −
          </button>
          <span
            className="w-8 text-center text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {item.quantity}
          </span>
          <button
            onClick={() =>
              dispatch(
                updateQuantity({
                  id: item.menuItem._id,
                  quantity: item.quantity + 1,
                }),
              )
            }
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors"
            style={{
              backgroundColor: "var(--bg-surface-hover)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-color)",
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Price + Remove */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span
          className="text-base font-extrabold"
          style={{ color: "var(--color-primary-500)" }}
        >
          ${lineTotal.toFixed(2)}
        </span>
        <button
          onClick={() => dispatch(removeFromCart(item.menuItem._id))}
          className="text-xs font-medium px-2 py-1 rounded-lg transition-colors"
          style={{ color: "var(--color-error)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          Remove
        </button>
      </div>
    </div>
  );
}
