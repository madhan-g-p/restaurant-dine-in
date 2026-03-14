import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@features/auth/authSlice";
import type { RootState } from "@store/store";
import DarkModeToggle from "@ui/DarkModeToggle";
import {
  LayoutDashboard,
  SquareMenu,
  UtensilsCrossed,
  ClipboardList,
  LogOut,
  User,
  Layers,
} from "lucide-react";

interface SidebarProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<SidebarProps> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Menu", path: "/menu", icon: SquareMenu },
    { name: "Orders", path: "/orders", icon: ClipboardList },
    { name: "Floor & tables", path: "/tables", icon: Layers },
  ];

  return (
    <div className="flex min-h-screen bg-primary">
      {/* Sidebar */}
      <aside className="w-72 bg-surface border-r border-color flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-color">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
              <UtensilsCrossed size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-primary tracking-tighter">
                DINEIN
              </h1>
              <p className="text-[10px] font-black text-muted uppercase tracking-[0.2em] -mt-1">
                Admin Center
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 py-6">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black transition-all uppercase tracking-[0.15em]
                ${
                  isActive
                    ? "bg-primary-600 text-white shadow-2xl shadow-primary-500/30 scale-[1.02]"
                    : "text-muted hover:bg-surface-100 hover:text-primary dark:hover:text-gray-950"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} strokeWidth={isActive ? 3 : 2} />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-2 border-t border-color">
          <div className="bg-surface-100 rounded-2xl p-2 flex items-center justify-around  gap-3 border border-color">
            <div className="min-w-2 flex items-center justify-around gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 shadow-sm">
                <User size={20} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col justify-around">
                <p className="text-[0.8rem] text-black! font-bold! truncate uppercase tracking-tight">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-[0.6rem] text-gray-600! font-bold! uppercase tracking-widest truncate">
                  {user?.role}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="cursor-pointer w-fit h-fit flex items-center justify-center gap-3 p-2 rounded-2xl text-xs font-black text-red-600 bg-emerald-50! dark:bg-red-900/20! border border-red-100 dark:border-red-800/50 hover:scale-[0.98] transition-all uppercase tracking-tighter"
            >
              <LogOut size={16} strokeWidth={3} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-72 flex flex-col min-h-screen">
        <header className="p-6 bg-surface/80 backdrop-blur-sm border-b border-color sticky top-0 z-10 flex items-center justify-between px-12">
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-muted uppercase tracking-wider ">
              Dine-In Management
            </h2>
            {/* <p className="text-xl font-black text-primary tracking-tight">
              Active Operation Centre
            </p> */}
          </div>
          <div className="flex items-center gap-8">
            <DarkModeToggle />
            <div className="w-10 h-10 rounded-full bg-surface-100 border border-color flex items-center justify-center font-black text-muted text-xs shadow-inner">
              AD
            </div>
          </div>
        </header>

        <main className="px-10 py-6 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
