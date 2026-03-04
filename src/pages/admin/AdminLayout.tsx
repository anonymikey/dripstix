import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Package, Grid3X3, ShoppingBag, FileText, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { label: "Products", icon: Package, path: "/admin" },
  { label: "Categories", icon: Grid3X3, path: "/admin/categories" },
  { label: "Orders", icon: ShoppingBag, path: "/admin/orders" },
  { label: "Site Content", icon: FileText, path: "/admin/content" },
];

const AdminLayout = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/admin/login");
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  if (!isAdmin) return null;

  const sidebarContent = (
    <>
      <Link to="/" className="font-display text-2xl font-black">
        <span className="text-primary">Drip</span>
        <span className="text-secondary">Stix</span>
      </Link>
      <p className="mt-1 text-xs text-muted-foreground">Admin Panel</p>
      <nav className="mt-8 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              location.pathname === item.path
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <button
        onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}
        className="mt-8 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <LogOut className="h-4 w-4" />
        Sign Out
      </button>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
        <Link to="/" className="font-display text-xl font-black">
          <span className="text-primary">Drip</span>
          <span className="text-secondary">Stix</span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-foreground">
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-30 h-full w-64 border-r border-border bg-card p-6 transition-transform duration-200 md:static md:translate-x-0 ${sidebarOpen ? "translate-x-0 pt-16" : "-translate-x-full"}`}>
        {sidebarContent}
      </aside>

      <main className="flex-1 p-4 pt-16 md:p-8 md:pt-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
