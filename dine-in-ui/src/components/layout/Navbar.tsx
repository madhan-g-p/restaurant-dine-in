import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../hooks/useAppDispatch";
import { logout } from "../../features/auth/authSlice";
import { selectCartTotalQuantity } from "../../features/cart/cartSlice";
import DarkModeToggle from "../ui/DarkModeToggle";
import Popover from "../ui/Popover";
import type { PopoverHandle } from "../ui/Popover";

export default function Navbar() {
  const popoverRef = React.useRef<PopoverHandle>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const cartCount = useAppSelector(selectCartTotalQuantity);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    popoverRef.current?.hide();
  };

  const navLinks = isAuthenticated
    ? [
        { to: "/menu", label: "Menu" },
        { to: "/cart", label: "Cart", badge: cartCount },
        { to: "/orders", label: "Orders" },
      ]
    : [
        { to: "/login", label: "Login" },
        { to: "/signup", label: "Sign Up" },
      ];

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-lg border-b"
      style={{
        backgroundColor: "var(--navbar-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to={isAuthenticated ? "/menu" : "/login"}
            className="flex items-center gap-2 no-underline"
          >
            <span className="text-2xl">🍔</span>
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--color-primary-500)" }}
            >
              FoodBite
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 no-underline"
                style={{ color: "var(--text-primary)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "var(--bg-surface-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                {link.label}
                {link.badge ? (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--badge-bg)",
                      color: "var(--badge-text)",
                    }}
                  >
                    {link.badge > 9 ? "9+" : link.badge}
                  </span>
                ) : null}
              </Link>
            ))}
          </div>

          {/* Right side: user info + dark mode + mobile toggle */}
          <div className="flex items-center gap-3">
            <DarkModeToggle />

            {isAuthenticated && (
              <div className="hidden md:flex items-center gap-3">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Hi, {user?.name?.split(" ")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary py-1.5! px-3! text-xs"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => popoverRef.current?.toggle()}
              className="md:hidden p-2 rounded-lg transition-colors"
              style={{ color: "var(--text-primary)" }}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <Popover 
        id="mobile-menu-popover" 
        ref={popoverRef}
        className="w-[calc(100%-2rem)] md:hidden mt-2 rounded-2xl shadow-2xl border"
        style={{
          inset: '70px auto auto 1rem',
          margin: 0,
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div className="p-4">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => popoverRef.current?.hide()}
                className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium no-underline transition-colors hover:bg-surface-hover"
                style={{ color: "var(--text-primary)" }}
              >
                {link.label}
                {link.badge ? (
                  <span
                    className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--badge-bg)",
                      color: "var(--badge-text)",
                    }}
                  >
                    {link.badge}
                  </span>
                ) : null}
              </Link>
            ))}

            {isAuthenticated && (
              <>
                <hr
                  style={{ borderColor: "var(--border-color)" }}
                  className="my-2"
                />
                <div className="flex items-center justify-between px-4">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Hi, {user?.name?.split(" ")[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn-secondary py-1.5! px-3! text-xs"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </Popover>
    </nav>
  );
}
