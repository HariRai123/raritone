import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";

function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();

  const navigation = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      label: "Products",
      href: "/admin/products",
      icon: Package,
    },
    {
      label: "Inventory",
      href: "/admin/inventory",
      icon: Boxes,
    },
    {
      label: "Customers",
      href: "/admin/customers",
      icon: Users,
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const isActive = (href) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col
          border-r border-neutral-200 bg-white
          transition-transform duration-300
          lg:static lg:z-auto lg:translate-x-0
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* LOGO */}

        <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-6">

          <Link
            to="/admin"
            onClick={() => setMobileOpen(false)}
            className="text-lg font-bold tracking-[0.25em]"
          >
            RARITONE
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* ADMIN LABEL */}

        <div className="px-4 pt-7">

          <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Administration
          </p>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 space-y-1 px-4 py-4">

          {navigation.map((item) => {

            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 rounded-xl px-3 py-2.5
                  text-sm font-medium transition
                  ${
                    active
                      ? "bg-black text-white"
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950"
                  }
                `}
              >

                <Icon className="h-4 w-4 shrink-0" />

                <span>{item.label}</span>

              </Link>
            );
          })}

        </nav>

        {/* STORE LINK */}

        <div className="border-t border-neutral-200 p-4">

          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center rounded-xl border border-neutral-200 px-3 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            View Store
          </Link>

        </div>

      </aside>
    </>
  );
}

export default AdminSidebar;