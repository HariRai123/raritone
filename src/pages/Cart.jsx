import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } =
    useCart();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  /*
   * ===============================
   * PROCEED TO CHECKOUT
   * ===============================
   *
   * Order is NOT created here.
   *
   * Cart
   *   ↓
   * Checkout
   *   ↓
   * Delivery details
   *   ↓
   * Payment
   *   ↓
   * Create order
   */

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: "/checkout",
        },
      });

      return;
    }

    navigate("/checkout");
  };

  /*
   * ===============================
   * EMPTY CART
   * ===============================
   */

  if (cart.length === 0) {
    return (
      <section className="min-h-[80vh] bg-white">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-md text-center">
            {/* ICON */}

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
              <ShoppingBag className="h-8 w-8 text-neutral-500" />
            </div>

            {/* LABEL */}

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
              YOUR BAG
            </p>

            {/* TITLE */}

            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
              Your bag is empty
            </h1>

            {/* DESCRIPTION */}

            <p className="mt-3 text-sm leading-6 text-neutral-500">
              Looks like you haven't added anything to your bag yet. Explore our
              collection and find something you love.
            </p>

            {/* SHOP BUTTON */}

            <Link
              to="/products"
              className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-black px-7 text-sm font-medium text-shadow-white transition-colors hover:bg-neutral-800"
            >
            <p className="text-white">Continue Shopping</p>  
            </Link>
          </div>
        </div>
      </section>
    );
  }

  /*
   * ===============================
   * CART
   * ===============================
   */

  return (
    <section className="min-h-screen bg-neutral-50/50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        {/* ================= HEADER ================= */}

        <div className="mb-8">
          <Link
            to="/products"
            className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
                YOUR BAG
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
                Shopping Bag
              </h1>
            </div>

            <p className="text-sm text-neutral-500">
              {cart.length} {cart.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        {/* ================= CART CONTENT ================= */}

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* ================= ITEMS ================= */}

          <div className="space-y-4">
            {cart.map((item) => {
              const itemTotal =
                Number(item.price || 0) * Number(item.quantity || 0);

              const stock = Number(item.stock) || 999;

              return (
                <Card
                  key={item.productId}
                  className="overflow-hidden rounded-2xl border-neutral-200 bg-white p-0 shadow-none"
                >
                  <div className="flex gap-4 p-4 sm:gap-6 sm:p-5">
                    {/* ================= IMAGE ================= */}

                    <Link
                      to={`/products/${item.productId}`}
                      className="h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:h-40 sm:w-32"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </Link>

                    {/* ================= DETAILS ================= */}

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            to={`/products/${item.productId}`}
                            className="line-clamp-2 text-sm font-medium text-neutral-900 transition-colors hover:text-neutral-500 sm:text-base"
                          >
                            {item.name}
                          </Link>

                          <p className="mt-1 text-sm text-neutral-500">
                            ₹{Number(item.price || 0).toLocaleString("en-IN")}
                          </p>
                        </div>

                        {/* REMOVE */}

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.productId)}
                          aria-label={`Remove ${item.name}`}
                          className="h-8 w-8 shrink-0 text-neutral-400 hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* ================= BOTTOM ================= */}

                      <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-4">
                        {/* QUANTITY */}

                        <div>
                          <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                            Quantity
                          </p>

                          <div className="flex h-9 items-center rounded-full border border-neutral-200">
                            {/* MINUS */}

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={item.quantity <= 1}
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1,
                                )
                              }
                              className="h-8 w-8 rounded-full"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </Button>

                            {/* COUNT */}

                            <span className="w-7 text-center text-xs font-medium">
                              {item.quantity}
                            </span>

                            {/* PLUS */}

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              disabled={item.quantity >= stock}
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1,
                                )
                              }
                              className="h-8 w-8 rounded-full"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </Button>
                          </div>

                          {/* STOCK */}

                          <p className="mt-1 text-[10px] text-neutral-400">
                            {stock} available
                          </p>
                        </div>

                        {/* ITEM TOTAL */}

                        <div className="text-right">
                          <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">
                            Total
                          </p>

                          <p className="mt-1 text-sm font-semibold text-neutral-950 sm:text-base">
                            ₹{itemTotal.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}

            {/* ================= CLEAR CART ================= */}

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={clearCart}
                className="text-xs text-neutral-500 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Clear Cart
              </Button>
            </div>
          </div>

          {/* ================= SUMMARY ================= */}

          <div>
            <Card className="sticky top-24 rounded-2xl border-neutral-200 bg-white p-5 shadow-none sm:p-6">
              {/* TITLE */}

              <h2 className="text-lg font-semibold text-neutral-950">
                Order Summary
              </h2>

              {/* TOTALS */}

              <div className="mt-6 space-y-4 text-sm">
                {/* SUBTOTAL */}

                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal</span>

                  <span className="font-medium text-neutral-900">
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                {/* SHIPPING */}

                <div className="flex justify-between text-neutral-500">
                  <span>Shipping</span>

                  <span className="font-medium text-green-600">FREE</span>
                </div>

                <Separator />

                {/* TOTAL */}

                <div className="flex justify-between">
                  <span className="font-semibold text-neutral-950">Total</span>

                  <span className="text-lg font-semibold text-neutral-950">
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* ================= CHECKOUT ================= */}

              <Button
                type="button"
                onClick={handleCheckout}
                className="mt-7 h-12 w-full rounded-full text-sm font-semibold"
              >
                Proceed to Checkout
              </Button>

              {/* ================= BENEFITS ================= */}

              <div className="mt-7 space-y-4 border-t border-neutral-200 pt-6">
                {/* DELIVERY */}

                <div className="flex gap-3">
                  <Truck className="h-5 w-5 shrink-0 text-neutral-700" />

                  <div>
                    <p className="text-xs font-semibold">Fast Delivery</p>

                    <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                      Reliable delivery to your doorstep.
                    </p>
                  </div>
                </div>

                {/* SECURITY */}

                <div className="flex gap-3">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-neutral-700" />

                  <div>
                    <p className="text-xs font-semibold">Secure Checkout</p>

                    <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                      Your order information is protected.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cart;
