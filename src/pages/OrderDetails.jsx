import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  Truck,
  XCircle,
} from "lucide-react";

import { getOrderById } from "../services/orderService";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getOrderById(id);

        setOrder(response.order);
      } catch (err) {
        console.error("GET ORDER ERROR:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load order."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const getStatusIndex = (status) => {
    const statuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
    ];

    return statuses.indexOf(status);
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-neutral-50/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">

            <div className="h-4 w-32 rounded bg-neutral-200" />

            <div className="h-10 w-64 rounded bg-neutral-200" />

            <div className="h-64 rounded-2xl bg-neutral-200" />

            <div className="h-80 rounded-2xl bg-neutral-200" />

          </div>
        </div>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className="min-h-screen bg-neutral-50/50">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">

          <div className="text-center">

            <XCircle className="mx-auto h-12 w-12 text-red-500" />

            <h1 className="mt-5 text-2xl font-semibold">
              Order Not Found
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              {error || "This order could not be found."}
            </p>

            <Link to="/orders">
              <Button className="mt-6 rounded-full">
                Back to Orders
              </Button>
            </Link>

          </div>

        </div>
      </section>
    );
  }

  const orderNumber = order._id
    ?.slice(-8)
    .toUpperCase();

  const currentStatus = getStatusIndex(
    order.status
  );

  const trackingSteps = [
    {
      key: "pending",
      label: "Order Placed",
      description: "Your order has been received.",
      icon: Clock3,
    },
    {
      key: "confirmed",
      label: "Confirmed",
      description: "Your order has been confirmed.",
      icon: CheckCircle2,
    },
    {
      key: "shipped",
      label: "Shipped",
      description: "Your order is on the way.",
      icon: Truck,
    },
    {
      key: "delivered",
      label: "Delivered",
      description: "Your order has been delivered.",
      icon: Check,
    },
  ];

  return (
    <section className="min-h-screen bg-neutral-50/50">

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

        {/* HEADER */}

        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
              ORDER DETAILS
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Order #{orderNumber}
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              Placed{" "}
              {new Date(
                order.createdAt
              ).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>

          </div>

          <Badge
            variant="outline"
            className="w-fit rounded-full px-3 py-1 capitalize"
          >
            {order.status}
          </Badge>

        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">

          {/* LEFT */}

          <div className="space-y-6">

            {/* TRACKING */}

            <Card className="rounded-2xl border-neutral-200 bg-white p-6 shadow-none">

              <div className="flex items-center gap-3">

                <Package className="h-5 w-5" />

                <h2 className="font-semibold">
                  Order Tracking
                </h2>

              </div>

              <div className="mt-8 space-y-7">

                {order.status === "cancelled" ? (

                  <div className="flex items-center gap-4 rounded-xl bg-red-50 p-4 text-red-700">

                    <XCircle className="h-6 w-6" />

                    <div>
                      <p className="font-medium">
                        Order Cancelled
                      </p>

                      <p className="mt-1 text-xs">
                        This order has been cancelled.
                      </p>
                    </div>

                  </div>

                ) : (

                  trackingSteps.map(
                    (step, index) => {

                      const StepIcon =
                        step.icon;

                      const completed =
                        currentStatus >= index;

                      return (
                        <div
                          key={step.key}
                          className="relative flex gap-4"
                        >

                          {index <
                            trackingSteps.length -
                              1 && (
                            <div
                              className={`absolute left-[15px] top-8 h-10 w-px ${
                                currentStatus >
                                index
                                  ? "bg-black"
                                  : "bg-neutral-200"
                              }`}
                            />
                          )}

                          <div
                            className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                              completed
                                ? "bg-black text-white"
                                : "border border-neutral-200 bg-white text-neutral-400"
                            }`}
                          >
                            <StepIcon className="h-4 w-4" />
                          </div>

                          <div>

                            <p
                              className={`text-sm font-medium ${
                                completed
                                  ? "text-neutral-950"
                                  : "text-neutral-400"
                              }`}
                            >
                              {step.label}
                            </p>

                            <p className="mt-1 text-xs text-neutral-500">
                              {step.description}
                            </p>

                          </div>

                        </div>
                      );
                    }
                  )

                )}

              </div>

            </Card>

            {/* PRODUCTS */}

            <Card className="overflow-hidden rounded-2xl border-neutral-200 bg-white p-0 shadow-none">

              <div className="p-6">

                <h2 className="font-semibold">
                  Items
                </h2>

              </div>

              <Separator />

              <div className="divide-y divide-neutral-100">

                {order.items.map(
                  (item, index) => {

                    const itemTotal =
                      Number(item.price || 0) *
                      Number(item.quantity || 0);

                    return (
                      <div
                        key={`${item.product}-${index}`}
                        className="flex gap-4 p-5 sm:p-6"
                      >

                        <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">

                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />

                        </div>

                        <div className="flex flex-1 flex-col justify-between">

                          <div>

                            <h3 className="text-sm font-medium">
                              {item.name}
                            </h3>

                            <p className="mt-1 text-xs text-neutral-500">
                              ₹
                              {Number(
                                item.price
                              ).toLocaleString(
                                "en-IN"
                              )}{" "}
                              ×{" "}
                              {item.quantity}
                            </p>

                          </div>

                          <p className="mt-3 text-sm font-semibold">
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

            </Card>

          </div>

          {/* RIGHT */}

          <div className="space-y-6">

            {/* SUMMARY */}

            <Card className="rounded-2xl border-neutral-200 bg-white p-6 shadow-none">

              <h2 className="font-semibold">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4 text-sm">

                <div className="flex justify-between text-neutral-500">
                  <span>Items</span>
                  <span>
                    {order.items.length}
                  </span>
                </div>

                <div className="flex justify-between text-neutral-500">
                  <span>Shipping</span>
                  <span className="text-green-600">
                    FREE
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="font-semibold">
                    Total
                  </span>

                  <span className="text-xl font-semibold">
                    ₹
                    {Number(
                      order.total
                    ).toLocaleString("en-IN")}
                  </span>
                </div>

              </div>

              <div className="mt-6 rounded-xl bg-neutral-50 p-4">

                <p className="text-xs text-neutral-500">
                  Payment Status
                </p>

                <p className="mt-1 text-sm font-medium capitalize">
                  {order.paymentStatus ||
                    "Pending"}
                </p>

              </div>

            </Card>

            {/* ADDRESS */}

            {order.shippingAddress && (
              <Card className="rounded-2xl border-neutral-200 bg-white p-6 shadow-none">

                <div className="flex gap-3">

                  <MapPin className="h-5 w-5 text-neutral-500" />

                  <div>

                    <h2 className="font-semibold">
                      Delivery Address
                    </h2>

                    <p className="mt-4 text-sm font-medium">
                      {order.shippingAddress.firstName}{" "}
                      {order.shippingAddress.lastName}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-neutral-500">
                      {order.shippingAddress.address}
                      <br />
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}
                      <br />
                      {order.shippingAddress.pincode}
                    </p>

                    <p className="mt-2 text-xs text-neutral-500">
                      {order.shippingAddress.phone}
                    </p>

                  </div>

                </div>

              </Card>
            )}

          </div>

        </div>

      </div>

    </section>
  );
}

export default OrderDetails;