import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import Profile from "./pages/Profile";

import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/AdminUsers";
import AdminOrders from "./pages/AdminOrders";
import Admin3DAssets from "./pages/Admin3DAssets";
import ThreeDTryOn from "./pages/ThreeDTryOn";
import Forbidden from "./pages/Forbidden";
import Placeholder from "./pages/Placeholder";

import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";

import TryOn from "./pages/TryOn";
import TryOnHistory from "./pages/TryOnHistory";
import TryOnResult from "./pages/TryOnResult";
import Checkout from "./pages/Checkout";

import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <div className="app">
          {/* Customer Navbar */}
          <Navbar />

          <main>
            <Routes>
              {/* =================================================
                  PUBLIC ROUTES
              ================================================== */}

              <Route path="/" element={<Home />} />

              <Route path="/products" element={<Products />} />

              <Route path="/products/:id" element={<ProductDetails />} />

              <Route path="/login" element={<Login />} />

              <Route path="/register" element={<Register />} />

              <Route path="/forbidden" element={<Forbidden />} />

              {/* =================================================
                  AUTHENTICATED USER ROUTES
              ================================================== */}

              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />

                <Route path="/cart" element={<Cart />} />

                <Route path="/checkout" element={<Checkout />} />

                <Route path="/wishlist" element={<Wishlist />} />

                <Route path="/orders" element={<Orders />} />

                <Route path="/orders/:id" element={<OrderDetails />} />

                <Route path="/try-on" element={<TryOn />} />

                <Route path="/tryon" element={<TryOn />} />

                <Route path="/try-on/history" element={<TryOnHistory />} />
                <Route path="/try-on/3d" element={<ThreeDTryOn />} />
                <Route
                  path="/try-on/result/:sessionId"
                  element={<TryOnResult />}
                />

                <Route path="/try-on/result" element={<TryOnResult />} />

                <Route path="/tryon/history" element={<TryOnHistory />} />
              </Route>

              {/* =================================================
                  ADMIN ROUTES
              ================================================== */}

              <Route element={<ProtectedRoute roles={["admin"]} />}>
                <Route element={<AdminLayout />}>
                  {/* Dashboard */}

                  <Route path="/admin" element={<AdminDashboard />} />

                  {/* Existing Admin Pages */}

                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/3d-assets" element={<Admin3DAssets />} />
                  <Route path="/admin/users" element={<AdminUsers />} />

                  <Route path="/admin/orders" element={<AdminOrders />} />

                  {/* Future Admin Pages */}

                  <Route
                    path="/admin/inventory"
                    element={<Placeholder title="Inventory Management" />}
                  />

                  <Route
                    path="/admin/analytics"
                    element={<Placeholder title="Analytics" />}
                  />

                  <Route
                    path="/admin/settings"
                    element={<Placeholder title="Admin Settings" />}
                  />
                </Route>
              </Route>

              {/* =================================================
                  FALLBACK
              ================================================== */}

              <Route
                path="*"
                element={<Placeholder title="Page Not Found" />}
              />
            </Routes>
          </main>

          {/* Customer Footer */}
          <Footer />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
