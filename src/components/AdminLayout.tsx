import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { Button } from "@/components/ui/button";
import {
  Scale,
  Home,
  Users,
  Bell,
  FileText,
  LogOut,
  Menu,
  X,
  ClipboardList,
  Repeat,
  Scale3DIcon,
} from "lucide-react";
import { toast } from "sonner";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logout berhasil");
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  const sidebarItems = [
    { icon: Home, label: "Dashboard", path: "/admin" },
    { icon: Bell, label: "Notifikasi", path: "/admin/notifikasi" },
    {
      icon: Users,
      label: "Data Pelaku Usaha",
      path: "/admin/data-pelaku-usaha",
    },
    {
      icon: ClipboardList,
      label: "Data Permohonan",
      path: "/admin/permohonan",
    },
    { icon: Repeat, label: "Data Perpanjang", path: "/admin/perpanjang" },
    { icon: Scale, label: "Daftar Alat ", path: "/admin/alat" },
    { icon: FileText, label: "Artikel", path: "/admin/artikel" },
  ];

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <aside
        className={`
            fixed lg:static z-40 top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 shadow-lg
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
          `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b border-gray-200">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white">
              <img
                src="/src/assets/Logo Disperindag.png"
                alt="Logo Disperindag"
                className="object-contain w-full h-full"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin Portal</h1>
              <p className="text-xs text-gray-600">Kemetrologian</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white shadow-md"
        >
          {sidebarOpen ? (
            <X className="w-4 h-4" />
          ) : (
            <Menu className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-auto bg-gray-50 p-4 pt-16 lg:pt-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
