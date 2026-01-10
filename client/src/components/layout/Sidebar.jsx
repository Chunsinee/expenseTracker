import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Wallet, LogOut, PieChart } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Wallet, label: "Add Expense", href: "/transactions" },
];

export const Sidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 h-screen fixed left-0 top-0 z-50">
      <div className="h-24 flex items-center justify-center shadow-sm relative z-10">
        <Link to="/dashboard" className="flex items-center">
          <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent font-['Cabin']">
            Cash
          </span>
          <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent font-['Cabin']">
            Flow
          </span>
        </Link>
      </div>

      <nav className="flex-1 py-8 px-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200 ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-blue-500/30"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-2xl transition-colors cursor-pointer"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};
