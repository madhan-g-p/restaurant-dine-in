import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { selectCartSubtotal } from "../features/cart/cartSlice";
import { clearCart } from "../features/cart/cartSlice";
import { placeOrder } from "../features/order/orderSlice";
import Loader from "../components/ui/Loader";

const DELIVERY_FEE = 5.0;

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items } = useAppSelector((s) => s.cart);
  const { loading, error } = useAppSelector((s) => s.order);
  const subtotal = useAppSelector(selectCartSubtotal);
  const total = subtotal + DELIVERY_FEE;

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    address?: string;
    phone?: string;
  }>({});

  // If cart is empty, redirect
  if (items.length === 0) {
    navigate("/cart", { replace: true });
    return null;
  }

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Name is required";
    if (!address.trim()) e.address = "Address is required";
    else if (address.trim().length < 10)
      e.address = "Please enter a complete address";
    if (!phone.trim()) e.phone = "Phone number is required";
    else if (!/^\+?[\d\s\-()]{7,15}$/.test(phone))
      e.phone = "Enter a valid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(
      placeOrder({
        items: items.map((item) => ({
          menuItem: item.menuItem._id,
          quantity: item.quantity,
        })),
        deliveryDetails: { name, address, phone },
        // total,
      }),
    );

    if (placeOrder.fulfilled.match(result)) {
      dispatch(clearCart());
      setTimeout(() => {
        navigate(`/order-status/${result.payload.id}`);
      }, 1000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1
        className="text-3xl font-bold mb-8"
        style={{ color: "var(--text-primary)" }}
      >
        Checkout
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Delivery Form */}
        <div className="flex-1">
          <div className="card p-6">
            <h2
              className="text-lg font-bold mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Delivery Details
            </h2>

            {error && (
              <div
                className="mb-6 px-4 py-3 rounded-xl text-sm font-medium"
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  color: "var(--color-error)",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label htmlFor="name" className="input-label">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className={`input-field ${errors.name ? "input-error" : ""}`}
                  disabled={loading}
                />
                {errors.name && <p className="error-text">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="address" className="input-label">
                  Delivery Address
                </label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main Street, Apt 4B, City, State ZIP"
                  rows={3}
                  className={`input-field resize-none ${errors.address ? "input-error" : ""}`}
                  disabled={loading}
                />
                {errors.address && (
                  <p className="error-text">{errors.address}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="input-label">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className={`input-field ${errors.phone ? "input-error" : ""}`}
                  disabled={loading}
                />
                {errors.phone && <p className="error-text">{errors.phone}</p>}
              </div>

              <button
                type="submit"
                className="btn-primary w-full mt-4"
                disabled={loading}
              >
                {loading ? <Loader size="xsm" /> : "Confirm Order"}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96 shrink-0">
          <div className="card p-6 sticky top-24">
            <h3
              className="text-lg font-bold mb-5"
              style={{ color: "var(--text-primary)" }}
            >
              Order Summary
            </h3>

            <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.menuItem._id}
                  className="flex items-center gap-3"
                >
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.menuItem.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      x{item.quantity}
                    </p>
                  </div>
                  <span
                    className="text-sm font-semibold shrink-0"
                    style={{ color: "var(--text-primary)" }}
                  >
                    ${(item.menuItem.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <hr
              className="my-4"
              style={{ borderColor: "var(--border-color)" }}
            />

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
                <span style={{ color: "var(--text-primary)" }}>
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-secondary)" }}>
                  Delivery Fee
                </span>
                <span style={{ color: "var(--text-primary)" }}>
                  ${DELIVERY_FEE.toFixed(2)}
                </span>
              </div>
              <hr
                className="my-1"
                style={{ borderColor: "var(--border-color)" }}
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
          </div>
        </div>
      </div>
    </div>
  );
}
