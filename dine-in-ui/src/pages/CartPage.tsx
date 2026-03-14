import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppDispatch";
import { selectCartSubtotal } from "../features/cart/cartSlice";
import CartItemComponent from "../components/cart/CartItem";

const DELIVERY_FEE = 5.0;

export default function CartPage() {
  const navigate = useNavigate();
  const { items } = useAppSelector((s) => s.cart);
  const subtotal = useAppSelector(selectCartSubtotal);
  const total = subtotal + (items.length > 0 ? DELIVERY_FEE : 0);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <span className="text-6xl">🛒</span>
        <h2
          className="text-2xl font-bold mt-4"
          style={{ color: "var(--text-primary)" }}
        >
          Your cart is empty
        </h2>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          Go explore our menu and add some delicious items!
        </p>
        <Link to="/menu" className="btn-primary inline-flex mt-6">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1
        className="text-3xl font-bold mb-8"
        style={{ color: "var(--text-primary)" }}
      >
        Your Cart
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 flex flex-col gap-4">
          {items.map((item) => (
            <CartItemComponent key={item.menuItem._id} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:w-80 shrink-0">
          <div
            className="card p-6 sticky top-24"
            style={{ borderColor: "var(--border-color)" }}
          >
            <h3
              className="text-lg font-bold mb-5"
              style={{ color: "var(--text-primary)" }}
            >
              Order Summary
            </h3>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-secondary)" }}>
                  Subtotal ({items.length} items)
                </span>
                <span
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-secondary)" }}>
                  Delivery Fee
                </span>
                <span
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  ${DELIVERY_FEE.toFixed(2)}
                </span>
              </div>

              <hr
                style={{ borderColor: "var(--border-color)" }}
                className="my-1"
              />

              <div className="flex justify-between">
                <span
                  className="font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Total
                </span>
                <span
                  className="text-xl font-extrabold"
                  style={{ color: "var(--color-primary-500)" }}
                >
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="btn-primary w-full mt-6"
            >
              Proceed to Checkout →
            </button>

            <Link
              to="/menu"
              className="btn-secondary w-full mt-3 text-center no-underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
