import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";

import { getMyOrders } from "../services/orderService";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Fetch Orders
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyOrders();

        /*
         * Backend returns:
         *
         * {
         *   message: "...",
         *   orders: [...]
         * }
         */

        setOrders(response?.orders || []);
      } catch (err) {
        console.error("GET ORDERS ERROR:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Status Configuration
  |--------------------------------------------------------------------------
  */

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          className:
            "border-amber-200 bg-amber-50 text-amber-700",
          icon: Clock3,
        };

      case "confirmed":
        return {
          label: "Confirmed",
          className:
            "border-blue-200 bg-blue-50 text-blue-700",
          icon: CheckCircle2,
        };

      case "shipped":
        return {
          label: "Shipped",
          className:
            "border-purple-200 bg-purple-50 text-purple-700",
          icon: Truck,
        };

      case "delivered":
        return {
          label: "Delivered",
          className:
            "border-green-200 bg-green-50 text-green-700",
          icon: CheckCircle2,
        };

      case "cancelled":
        return {
          label: "Cancelled",
          className:
            "border-red-200 bg-red-50 text-red-700",
          icon: XCircle,
        };

      default:
        return {
          label: status || "Unknown",
          className:
            "border-neutral-200 bg-neutral-50 text-neutral-700",
          icon: Package,
        };
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <section className="min-h-screen bg-neutral-50/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="mb-8">
            <div className="h-3 w-28 animate-pulse rounded bg-neutral-200" />

            <div className="mt-4 h-10 w-48 animate-pulse rounded-lg bg-neutral-200" />
          </div>

          <div className="space-y-5">

            {[1, 2, 3].map((item) => (
              <Card
                key={item}
                className="overflow-hidden rounded-2xl border-neutral-200 bg-white p-5 shadow-none"
              >
                <div className="animate-pulse">

                  <div className="flex justify-between">
                    <div className="h-5 w-40 rounded bg-neutral-200" />
                    <div className="h-6 w-24 rounded-full bg-neutral-200" />
                  </div>

                  <div className="mt-3 h-3 w-32 rounded bg-neutral-200" />

                  <div className="mt-6 space-y-4">

                    {[1, 2].map((row) => (
                      <div
                        key={row}
                        className="flex gap-4"
                      >
                        <div className="h-20 w-16 rounded-lg bg-neutral-200" />

                        <div className="flex-1">
                          <div className="h-4 w-40 rounded bg-neutral-200" />
                          <div className="mt-3 h-3 w-20 rounded bg-neutral-200" />
                        </div>
                      </div>
                    ))}

                  </div>

                </div>
              </Card>
            ))}

          </div>
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <section className="min-h-screen bg-neutral-50/50">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">

          <div className="max-w-md text-center">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <XCircle className="h-7 w-7 text-red-500" />
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
              ORDERS
            </p>

            <h1 className="mt-3 text-2xl font-semibold">
              Unable to load orders
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              {error}
            </p>

            <Button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full"
            >
              Try Again
            </Button>

          </div>

        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Empty Orders
  |--------------------------------------------------------------------------
  */

  if (orders.length === 0) {
    return (
      <section className="min-h-screen bg-neutral-50/50">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">

          <div className="max-w-md text-center">

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
              <ShoppingBag className="h-8 w-8 text-neutral-500" />
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
              PURCHASE HISTORY
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              No orders yet
            </h1>

            <p className="mt-3 text-sm leading-6 text-neutral-500">
              You haven't placed any orders yet.
              Discover the latest Raritone collection
              and find something you'll love.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-black px-7 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Start Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Orders
  |--------------------------------------------------------------------------
  */

  return (
    <section className="min-h-screen bg-neutral-50/50">

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-8">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
            PURCHASE HISTORY
          </p>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                My Orders
              </h1>

              <p className="mt-2 text-sm text-neutral-500">
                View and track all your Raritone orders.
              </p>

            </div>

            <Link to="/products">
              <Button
                variant="outline"
                className="rounded-full"
              >
                Continue Shopping
              </Button>
            </Link>

          </div>

        </div>

        {/* =====================================================
            ORDER LIST
        ====================================================== */}

        <div className="space-y-5">

          {orders.map((order) => {

            const status =
              getStatusConfig(order.status);

            const StatusIcon = status.icon;

            const orderNumber =
              order._id
                ?.slice(-8)
                .toUpperCase();

            return (
              <Card
                key={order._id}
                className="overflow-hidden rounded-2xl border-neutral-200 bg-white p-0 shadow-none"
              >

                {/* =================================================
                    ORDER HEADER
                ================================================== */}

                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                  <div>

                    <div className="flex flex-wrap items-center gap-3">

                      <h2 className="text-sm font-semibold text-neutral-950 sm:text-base">
                        Order #{orderNumber}
                      </h2>

                      <Badge
                        variant="outline"
                        className={`gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${status.className}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>

                    </div>

                    <div className="mt-2 flex items-center gap-2 text-xs text-neutral-400">

                      <CalendarDays className="h-3.5 w-3.5" />

                      <span>
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </span>

                      <span>•</span>

                      <span>
                        {order.items?.length || 0}{" "}
                        {order.items?.length === 1
                          ? "item"
                          : "items"}
                      </span>

                    </div>

                  </div>

                  <div className="text-left sm:text-right">

                    <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                      Order Total
                    </p>

                    <p className="mt-1 text-lg font-semibold text-neutral-950">
                      ₹
                      {Number(
                        order.total || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </p>

                  </div>

                </div>

                <Separator />

                {/* =================================================
                    PRODUCTS
                ================================================== */}

                <div className="divide-y divide-neutral-100">

                  {order.items?.map(
                    (item, index) => {

                      const itemTotal =
                        Number(
                          item.price || 0
                        ) *
                        Number(
                          item.quantity || 0
                        );

                      return (
                        <div
                          key={`${order._id}-${item.product}-${index}`}
                          className="flex gap-4 p-5 sm:px-6"
                        >

                          {/* IMAGE */}

                          <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:h-28 sm:w-24">

                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />

                          </div>

                          {/* DETAILS */}

                          <div className="flex min-w-0 flex-1 flex-col justify-between">

                            <div>

                              <h3 className="line-clamp-2 text-sm font-medium text-neutral-950">
                                {item.name}
                              </h3>

                              <p className="mt-1 text-xs text-neutral-500">
                                ₹
                                {Number(
                                  item.price || 0
                                ).toLocaleString(
                                  "en-IN"
                                )}{" "}
                                ×{" "}
                                {item.quantity}
                              </p>

                            </div>

                            <p className="mt-3 text-sm font-semibold text-neutral-950">
                              ₹
                              {itemTotal.toLocaleString(
                                "en-IN"
                              )}
                            </p>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

                {/* =================================================
                    DELIVERY ADDRESS
                ================================================== */}

                {order.shippingAddress && (
                  <>
                    <Separator />

                    <div className="p-5 sm:px-6">

                      <div className="flex gap-3">

                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                            Delivery Address
                          </p>

                          <p className="mt-2 text-sm font-medium text-neutral-900">
                            {order.shippingAddress.firstName}{" "}
                            {order.shippingAddress.lastName}
                          </p>

                          <p className="mt-1 max-w-xl text-xs leading-5 text-neutral-500">
                            {order.shippingAddress.address},{" "}
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state}{" "}
                            -{" "}
                            {order.shippingAddress.pincode}
                          </p>

                          <p className="mt-1 text-xs text-neutral-500">
                            {order.shippingAddress.phone}
                          </p>

                        </div>

                      </div>

                    </div>
                  </>
                )}

                {/* =================================================
                    FOOTER
                ================================================== */}

                <div className="border-t border-neutral-100 bg-neutral-50/60 px-5 py-4 sm:px-6">

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-2 text-xs text-neutral-500">

                      <Package className="h-4 w-4" />

                      <span>
                        Payment:{" "}
                        <span className="font-medium capitalize text-neutral-800">
                          {order.paymentStatus ||
                            "pending"}
                        </span>
                      </span>

                    </div>

                    <Link
                      to={`/orders/${order._id}`}
                      className="inline-flex h-7 items-center justify-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2.5 text-xs font-medium transition hover:bg-neutral-100"
                    >
                      View Order
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                  </div>

                </div>

              </Card>
            );
          })}

        </div>

      </div>

    </section>
  );
}

export default Orders;