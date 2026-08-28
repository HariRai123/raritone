import { useEffect, useState } from "react";
import {
  IndianRupee,
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  Clock3,
  Truck,
  CheckCircle2,
} from "lucide-react";

import { getDashboardStats } from "../../services/adminService";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboardStats();

        setDashboard(data);
      } catch (err) {
        console.error(
          "ADMIN DASHBOARD ERROR:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen bg-neutral-50 p-6">
        <div className="mx-auto max-w-7xl">

          <div className="animate-pulse space-y-6">

            <div className="h-10 w-64 rounded bg-neutral-200" />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-32 rounded-2xl bg-neutral-200"
                />
              ))}

            </div>

          </div>

        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-neutral-50 p-6">
        <div className="mx-auto max-w-7xl">

          <Card className="rounded-2xl border-red-200 bg-red-50 p-6 shadow-none">

            <p className="font-medium text-red-700">
              {error}
            </p>

          </Card>

        </div>
      </section>
    );
  }

  const stats = dashboard?.stats;

  const statCards = [
    {
      title: "Total Revenue",
      value: `₹${Number(
        stats?.totalRevenue || 0
      ).toLocaleString("en-IN")}`,
      icon: IndianRupee,
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
    },
    {
      title: "Total Customers",
      value: stats?.totalUsers || 0,
      icon: Users,
    },
    {
      title: "Products",
      value: stats?.totalProducts || 0,
      icon: Package,
    },
  ];

  return (
    <section className="min-h-screen bg-neutral-50">

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* HEADER */}

        <div className="mb-8">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
            RARITONE ADMIN
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Monitor your store performance and
            operations.
          </p>

        </div>

        {/* STAT CARDS */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {statCards.map((stat) => {

            const Icon = stat.icon;

            return (
              <Card
                key={stat.title}
                className="rounded-2xl border-neutral-200 bg-white p-5 shadow-none"
              >

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-xs font-medium text-neutral-500">
                      {stat.title}
                    </p>

                    <p className="mt-3 text-2xl font-semibold text-neutral-950">
                      {stat.value}
                    </p>

                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">

                    <Icon className="h-5 w-5 text-neutral-700" />

                  </div>

                </div>

              </Card>
            );
          })}

        </div>

        {/* ORDER STATUS */}

        <div className="mt-6">

          <Card className="rounded-2xl border-neutral-200 bg-white p-6 shadow-none">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-semibold">
                  Order Overview
                </h2>

                <p className="mt-1 text-xs text-neutral-500">
                  Current order status breakdown
                </p>

              </div>

              <ShoppingCart className="h-5 w-5 text-neutral-400" />

            </div>

            <Separator className="my-6" />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

              <OrderStatus
                label="Pending"
                value={stats?.orders?.pending}
                icon={Clock3}
              />

              <OrderStatus
                label="Confirmed"
                value={stats?.orders?.confirmed}
                icon={CheckCircle2}
              />

              <OrderStatus
                label="Shipped"
                value={stats?.orders?.shipped}
                icon={Truck}
              />

              <OrderStatus
                label="Delivered"
                value={stats?.orders?.delivered}
                icon={CheckCircle2}
              />

              <OrderStatus
                label="Cancelled"
                value={stats?.orders?.cancelled}
                icon={AlertTriangle}
              />

            </div>

          </Card>

        </div>

        {/* RECENT + LOW STOCK */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* RECENT ORDERS */}

          <Card className="rounded-2xl border-neutral-200 bg-white p-6 shadow-none">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-semibold">
                  Recent Orders
                </h2>

                <p className="mt-1 text-xs text-neutral-500">
                  Latest customer orders
                </p>

              </div>

            </div>

            <Separator className="my-5" />

            <div className="space-y-4">

              {dashboard?.recentOrders?.length ? (

                dashboard.recentOrders.map(
                  (order) => (
                    <div
                      key={order._id}
                      className="flex items-center justify-between gap-4"
                    >

                      <div className="min-w-0">

                        <p className="truncate text-sm font-medium">
                          #
                          {order._id
                            .slice(-8)
                            .toUpperCase()}
                        </p>

                        <p className="mt-1 truncate text-xs text-neutral-500">
                          {order.user?.name ||
                            "Customer"}
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="text-sm font-medium">
                          ₹
                          {Number(
                            order.total || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        <Badge
                          variant="outline"
                          className="mt-1 rounded-full text-[10px] capitalize"
                        >
                          {order.status}
                        </Badge>

                      </div>

                    </div>
                  )
                )

              ) : (

                <p className="py-8 text-center text-sm text-neutral-400">
                  No orders yet.
                </p>

              )}

            </div>

          </Card>

          {/* LOW STOCK */}

          <Card className="rounded-2xl border-neutral-200 bg-white p-6 shadow-none">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="font-semibold">
                  Low Stock
                </h2>

                <p className="mt-1 text-xs text-neutral-500">
                  Products that need attention
                </p>

              </div>

              <AlertTriangle className="h-5 w-5 text-amber-500" />

            </div>

            <Separator className="my-5" />

            <div className="space-y-4">

              {dashboard?.lowStockProducts
                ?.length ? (

                dashboard.lowStockProducts.map(
                  (product) => (
                    <div
                      key={product._id}
                      className="flex items-center gap-3"
                    >

                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-10 rounded-lg object-cover"
                      />

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-medium">
                          {product.name}
                        </p>

                        <p className="mt-1 text-xs text-neutral-500">
                          {product.category}
                        </p>

                      </div>

                      <Badge
                        variant="outline"
                        className="rounded-full border-amber-200 bg-amber-50 text-[10px] text-amber-700"
                      >
                        {product.stock} left
                      </Badge>

                    </div>
                  )
                )

              ) : (

                <p className="py-8 text-center text-sm text-neutral-400">
                  All products have sufficient stock.
                </p>

              )}

            </div>

          </Card>

        </div>

      </div>

    </section>
  );
}

function OrderStatus({
  label,
  value,
  icon: Icon,
}) {
  return (
    <div className="rounded-xl bg-neutral-50 p-4">

      <div className="flex items-center justify-between">

        <p className="text-xs text-neutral-500">
          {label}
        </p>

        <Icon className="h-4 w-4 text-neutral-400" />

      </div>

      <p className="mt-3 text-xl font-semibold">
        {value || 0}
      </p>

    </div>
  );
}

export default AdminDashboard;