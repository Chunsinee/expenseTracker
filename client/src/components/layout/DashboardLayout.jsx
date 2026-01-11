import { useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { User, Bell, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const DashboardLayout = ({ children, title = "Overview" }) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-20">
          <Link to="/dashboard" className="flex items-center">
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent font-['Cabin']">
              Cash
            </span>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent font-['Cabin']">
              Flow
            </span>
          </Link>
          <button
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Topbar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-5">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right hidden xl:block">
                <p className="text-base font-semibold text-gray-900">
                  {user?.username || "Guest"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary border-2 border-white shadow-sm">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
