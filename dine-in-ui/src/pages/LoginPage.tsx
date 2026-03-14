import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";
import { loginUser, clearAuthError } from "../features/auth/authSlice";
import Loader from "../components/ui/Loader";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  useEffect(() => {
    if (isAuthenticated) navigate("/menu", { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(loginUser({ email, password }));
  };

  return (
    <div
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="card w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-4xl">🍔</span>
          <h1
            className="text-2xl font-bold mt-3"
            style={{ color: "var(--text-primary)" }}
          >
            Welcome back
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Sign in to order your food and bite
          </p>
        </div>

        {/* Error from API */}
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
          {/* Email */}
          <div>
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className={`input-field ${errors.email ? "input-error" : ""}`}
              disabled={loading}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" title="password" className="input-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`input-field ${errors.password ? "input-error" : ""}`}
              disabled={loading}
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary w-full mt-2"
            disabled={loading}
          >
            {loading ? <Loader size="xsm" /> : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p
          className="text-sm text-center mt-6"
          style={{ color: "var(--text-secondary)" }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold no-underline"
            style={{ color: "var(--color-primary-500)" }}
          >
            Sign Up
          </Link>
        </p>

        {/* Demo credentials hint */}
        <div
          className="mt-6 p-3 rounded-xl text-xs text-center"
          style={{
            backgroundColor: "var(--bg-surface-hover)",
            color: "var(--text-muted)",
          }}
        >
          <strong>Demo:</strong> john@example.com / password123
        </div>
      </div>
    </div>
  );
}
