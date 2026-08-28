import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  Sparkles,
  X,
  LogOut,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);

  const { cartCount } = useCart();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const navigation = [
    {
      label: "Women",
      href: "/products?category=women",
    },
    {
      label: "Men",
      href: "/products?category=men",
    },
    {
      label: "Kids",
      href: "/products?category=kids",
    },
    {
      label: "New Arrivals",
      href: "/products?sort=newest",
    },
  ];

  const handleLogout = () => {
    logout();
    setSearchOpen(false);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ================= MOBILE MENU ================= */}

        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger
              type="button"
              aria-label="Open navigation"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-neutral-100"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>

            <SheetContent
              side="left"
              className="w-[300px]"
            >
              <div className="flex flex-col gap-8 pt-8">

                {/* Mobile Logo */}

                <Link
                  to="/"
                  className="text-xl font-bold tracking-[0.25em]"
                >
                  RARITONE
                </Link>

                {/* Mobile Navigation */}

                <nav className="flex flex-col gap-5">

                  {navigation.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className="text-sm font-medium transition-colors hover:text-neutral-500"
                    >
                      {item.label}
                    </Link>
                  ))}

                  {/* Try On */}

                  <Link
                    to="/try-on"
                    className="flex items-center gap-2 text-sm font-semibold"
                  >
                    <Sparkles className="h-4 w-4" />
                    Virtual Try-On
                  </Link>

                  {/* Wishlist */}

                  {isAuthenticated && (
                    <Link
                      to="/wishlist"
                      className="flex items-center gap-2 text-sm font-semibold"
                    >
                      <Heart className="h-4 w-4" />
                      Wishlist
                    </Link>
                  )}

                  {/* Cart */}

                  <button
                    type="button"
                    onClick={() => navigate("/cart")}
                    className="flex items-center gap-2 text-left text-sm font-semibold"
                  >
                    <ShoppingBag className="h-4 w-4" />

                    Cart

                    {cartCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1.5 text-[10px] font-semibold text-white">
                        {cartCount}
                      </span>
                    )}
                  </button>

                  {/* Orders */}

                  {isAuthenticated && (
                    <Link
                      to="/orders"
                      className="text-sm font-semibold"
                    >
                      My Orders
                    </Link>
                  )}

                  {/* Profile */}

                  {isAuthenticated && (
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 text-sm font-semibold"
                    >
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                  )}

                  {/* Mobile Login */}

                  {!isAuthenticated && (
                    <Link
                      to="/login"
                      className="text-sm font-semibold"
                    >
                      Login
                    </Link>
                  )}

                  {/* Mobile Logout */}

                  {isAuthenticated && (
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-left text-sm font-semibold text-red-600 transition-colors hover:text-red-700"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  )}

                </nav>

                {/* Logged-in User */}

                {isAuthenticated && user && (
                  <div className="border-t border-neutral-200 pt-5">

                    <div className="flex items-center gap-3">

                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name || "Profile"}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                          {(user.name || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {user.name || "User"}
                        </p>

                        <p className="truncate text-xs text-neutral-500">
                          {user.email || ""}
                        </p>
                      </div>

                    </div>

                  </div>
                )}

              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* ================= LOGO ================= */}

        <Link
          to="/"
          className="text-lg font-bold tracking-[0.28em] sm:text-xl"
        >
          RARITONE
        </Link>

        {/* ================= DESKTOP NAVIGATION ================= */}

        <nav className="hidden items-center gap-7 lg:flex">

          {navigation.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-sm font-medium text-neutral-700 transition-colors hover:text-black"
            >
              {item.label}
            </Link>
          ))}

          <Link
            to="/try-on"
            className="flex items-center gap-1.5 text-sm font-semibold"
          >
            <Sparkles className="h-4 w-4" />
            Try On
          </Link>

        </nav>

        {/* ================= ACTIONS ================= */}

        <div className="flex items-center gap-1">

          {/* SEARCH */}

          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            onClick={() => setSearchOpen((value) => !value)}
          >
            {searchOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </Button>

          {/* WISHLIST */}

          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Wishlist"
              onClick={() => navigate("/wishlist")}
            >
              <Heart className="h-5 w-5" />
            </Button>
          )}

          {/* CART */}

          <div className="relative">

            <Button
              variant="ghost"
              size="icon"
              aria-label={`Cart${
                cartCount > 0
                  ? `, ${cartCount} items`
                  : ""
              }`}
              onClick={() => navigate("/cart")}
            >
              <ShoppingBag className="h-5 w-5" />
            </Button>

            {cartCount > 0 && (
              <span className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-bold leading-none text-white">
                {cartCount > 99
                  ? "99+"
                  : cartCount}
              </span>
            )}

          </div>

          {/* ================= PROFILE / LOGIN ================= */}

          {isAuthenticated ? (
            <div className="flex items-center">

              <Button
                variant="ghost"
                size="icon"
                aria-label="Profile"
                onClick={() => navigate("/profile")}
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user?.name || "Profile"}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>

              {/* DESKTOP LOGOUT */}

              <Button
                variant="ghost"
                size="icon"
                aria-label="Logout"
                title="Logout"
                onClick={handleLogout}
                className="text-neutral-600 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-5 w-5" />
              </Button>

            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Login"
              title="Login"
              onClick={() => navigate("/login")}
            >
              <User className="h-5 w-5" />
            </Button>
          )}

        </div>
      </div>

      {/* ================= SEARCH BAR ================= */}

      {searchOpen && (
        <div className="border-t border-neutral-200 bg-white">

          <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">

            <Search className="h-5 w-5 text-neutral-400" />

            <input
              type="search"
              placeholder="Search products..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
              autoFocus
              onKeyDown={(event) => {

                if (event.key === "Enter") {

                  const query =
                    event.currentTarget.value.trim();

                  if (query) {

                    navigate(
                      `/products?search=${encodeURIComponent(
                        query,
                      )}`,
                    );

                    setSearchOpen(false);
                  }
                }

              }}
            />

          </div>

        </div>
      )}

    </header>
  );
}

export default Navbar;