import { useEffect, useState } from "react";
import { PackageCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  getAllOrders,
  updateOrderStatus,
} from "../services/orderService";

const statuses = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();

        if (!cancelled) {
          setOrders(data);
          setError("");
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e.response?.data?.message ||
              "Unable to load orders.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * CHANGE ORDER STATUS
   * ---------------------------------------------------------
   */

  const change = async (id, status) => {
    try {
      setError("");

      const data = await updateOrderStatus(id, status);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === id
            ? data.order
            : order,
        ),
      );
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Unable to update order.",
      );
    }
  };

  /*
   * ---------------------------------------------------------
   * UI
   * ---------------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
            ADMIN / FULFILMENT
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            Orders
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Monitor customer orders and update fulfilment
            status.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ORDERS */}

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>
              Order queue
            </CardTitle>

            <CardDescription>
              {orders.length} orders
            </CardDescription>
          </CardHeader>

          <CardContent>

            {/* LOADING */}

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="h-32 animate-pulse rounded-xl bg-neutral-100"
                    />
                  ),
                )}
              </div>

            ) : orders.length === 0 ? (

              /* EMPTY */

              <div className="py-12 text-center text-sm text-neutral-500">
                No orders found.
              </div>

            ) : (

              /* ORDER LIST */

              <div className="space-y-4">

                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="rounded-2xl border p-4 sm:p-5"
                  >

                    {/* ORDER HEADER */}

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                      <div>
                        <p className="font-semibold">
                          #
                          {order._id
                            .slice(-8)
                            .toUpperCase()}
                        </p>

                        <p className="text-sm text-neutral-500">
                          {order.user?.name ||
                            "Unknown user"}{" "}
                          ·{" "}
                          {order.user?.email ||
                            "No email"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">

                        <Badge variant="outline">
                          ₹
                          {Number(
                            order.total || 0,
                          ).toLocaleString(
                            "en-IN",
                          )}
                        </Badge>

                        <select
                          value={order.status}
                          onChange={(event) =>
                            change(
                              order._id,
                              event.target.value,
                            )
                          }
                          className="h-9 rounded-lg border border-input bg-background px-3 text-sm"
                        >
                          {statuses.map(
                            (status) => (
                              <option
                                key={status}
                                value={status}
                              >
                                {status}
                              </option>
                            ),
                          )}
                        </select>

                      </div>
                    </div>

                    {/* ORDER ITEMS */}

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">

                      {order.items?.map(
                        (item, index) => (
                          <div
                            key={`${order._id}-${item.product || index}`}
                            className="flex items-center gap-3 rounded-xl bg-neutral-50 p-3"
                          >

                            <img
                              src={item.image}
                              alt={
                                item.name ||
                                "Product"
                              }
                              className="h-14 w-11 rounded-md object-cover"
                            />

                            <div className="min-w-0 flex-1">

                              <p className="truncate text-sm font-medium">
                                {item.name ||
                                  "Product"}
                              </p>

                              <p className="text-xs text-neutral-500">
                                Qty{" "}
                                {item.quantity}
                              </p>

                            </div>

                            <PackageCheck className="h-4 w-4 text-neutral-400" />

                          </div>
                        ),
                      )}

                    </div>
                  </div>
                ))}

              </div>
            )}

          </CardContent>
        </Card>

      </div>
    </main>
  );
}

export default AdminOrders;