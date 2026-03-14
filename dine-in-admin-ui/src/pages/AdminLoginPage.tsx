import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { loginAdmin, clearError } from "@features/auth/authSlice";
import type { AppDispatch, RootState } from "@store/store";
import Card from "@components/ui/Card";
import Input from "@components/ui/Input";
import Button from "@components/ui/Button";
import { UtensilsCrossed } from "lucide-react";

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginAdmin({ email, password }));
    if (loginAdmin.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-primary">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <Card className="overflow-hidden shadow-2xl shadow-primary-500/10 border-none">
          <div className="bg-primary-600 p-12 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20 rotate-12">
              <UtensilsCrossed size={120} />
            </div>
            <div className="relative z-10">
              <h1 className="text-4xl font-black tracking-tighter">Dine-In</h1>
              <p className="text-primary-100 text-[10px] mt-2 opacity-80 uppercase tracking-[0.3em] font-black">
                Management Portal
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-8 bg-surface">
            {error && (
              <div className="bg-error/10 border border-error/20 text-error px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest animate-shake">
                {error}
              </div>
            )}

            <Input
              label="Admin Identity"
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) dispatch(clearError());
              }}
              placeholder="e.g. manager@dinein.com"
            />

            <Input
              label="Access Secret"
              type="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) dispatch(clearError());
              }}
              placeholder="••••••••"
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full py-5 text-sm tracking-widest"
            >
              AUTHENTICATE SESSION
            </Button>
          </form>
        </Card>
        {/* <div className="flex flex-col items-center mt-10 gap-4">
          <p className="text-muted text-[10px] font-black uppercase tracking-[0.2em]">
            Restricted Admin Portal
          </p>
          <div className="h-1 w-8 bg-surface-200 dark:bg-surface-700 rounded-full"></div>
        </div> */}
      </div>
    </div>
  );
};

export default AdminLoginPage;
