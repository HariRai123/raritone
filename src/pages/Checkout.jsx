import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CreditCard,
  MapPin,
  ShieldCheck,
  Truck,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../services/orderService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

function Checkout() {
  const navigate = useNavigate();

  const {
    cart,
    cartTotal,
    clearCart,
  } = useCart();

  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  /*
  |--------------------------------------------------------------------------
  | Authentication
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: "/checkout",
        },
        replace: true,
      });
    }
  }, [isAuthenticated, navigate]);

  /*
  |--------------------------------------------------------------------------
  | Empty Cart
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (isAuthenticated && cart.length === 0) {
      navigate("/cart", {
        replace: true,
      });
    }
  }, [cart.length, isAuthenticated, navigate]);

  /*
  |--------------------------------------------------------------------------
  | Form Change
  |--------------------------------------------------------------------------
  */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    // Clear previous error while typing
    if (error) {
      setError("");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Validation
  |--------------------------------------------------------------------------
  */

  const validateForm = () => {
    if (!form.firstName.trim()) {
      return "Please enter your first name.";
    }

    if (!form.lastName.trim()) {
      return "Please enter your last name.";
    }

    if (!form.email.trim()) {
      return "Please enter your email address.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      return "Please enter a valid email address.";
    }

    if (!form.phone.trim()) {
      return "Please enter your phone number.";
    }

    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      return "Please enter a valid 10-digit Indian phone number.";
    }

    if (!form.address.trim()) {
      return "Please enter your delivery address.";
    }

    if (!form.city.trim()) {
      return "Please enter your city.";
    }

    if (!form.state.trim()) {
      return "Please enter your state.";
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      return "Please enter a valid 6-digit PIN code.";
    }

    return null;
  };

  /*
  |--------------------------------------------------------------------------
  | Total
  |--------------------------------------------------------------------------
  */

  const shipping = 0;

  const total = useMemo(() => {
    return cartTotal + shipping;
  }, [cartTotal]);

  /*
  |--------------------------------------------------------------------------
  | Place Order
  |--------------------------------------------------------------------------
  */

 const handlePlaceOrder = async (event) => {
  event.preventDefault();

  const validationError = validateForm();

  if (validationError) {
    setError(validationError);
    return;
  }

  if (!cart || cart.length === 0) {
    setError("Your cart is empty.");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const orderItems = cart.map((item) => ({
      productId: item.productId,
      quantity: Number(item.quantity),
    }));

    const shippingAddress = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
    };

    console.log("CART:", cart);

    console.log("ORDER ITEMS:", orderItems);

    console.log("ORDER PAYLOAD:", {
      items: orderItems,
      shippingAddress,
      paymentMethod: "online",
    });

    const response = await createOrder({
      items: orderItems,
      shippingAddress,
      paymentMethod: "online",
    });

    console.log("ORDER RESPONSE:", response);

    clearCart();

    navigate("/orders", {
      replace: true,
    });
  } catch (err) {
    console.error("CHECKOUT ERROR:", err);
    console.error("BACKEND RESPONSE:", err.response?.data);

    setError(
      err.response?.data?.message ||
        "Unable to place your order."
    );
  } finally {
    setLoading(false);
  }
};

  /*
  |--------------------------------------------------------------------------
  | Prevent Rendering
  |--------------------------------------------------------------------------
  */

  if (!isAuthenticated || cart.length === 0) {
    return null;
  }

  return (
    <section className="min-h-screen bg-neutral-50/50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-8">

          <Link
            to="/cart"
            className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Cart
          </Link>

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
            CHECKOUT
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
            Complete Your Order
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Enter your delivery details to continue.
          </p>

        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* =====================================================
            FORM
        ====================================================== */}

        <form
          onSubmit={handlePlaceOrder}
          className="grid gap-8 lg:grid-cols-[1fr_380px]"
        >

          {/* ===================================================
              LEFT SIDE
          ==================================================== */}

          <div className="space-y-6">

            {/* =================================================
                DELIVERY DETAILS
            ================================================== */}

            <Card className="rounded-2xl border-neutral-200 bg-white p-5 shadow-none sm:p-7">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100">
                  <MapPin className="h-4 w-4 text-neutral-700" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    Delivery Details
                  </h2>

                  <p className="text-xs text-neutral-500">
                    Where should we deliver your order?
                  </p>
                </div>

              </div>

              <div className="mt-7 grid gap-5 sm:grid-cols-2">

                {/* FIRST NAME */}

                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name
                  </Label>

                  <Input
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    autoComplete="given-name"
                    disabled={loading}
                  />
                </div>

                {/* LAST NAME */}

                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name
                  </Label>

                  <Input
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    autoComplete="family-name"
                    disabled={loading}
                  />
                </div>

                {/* EMAIL */}

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Address
                  </Label>

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>

                {/* PHONE */}

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Phone Number
                  </Label>

                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    autoComplete="tel"
                    disabled={loading}
                  />
                </div>

                {/* ADDRESS */}

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">
                    Address
                  </Label>

                  <textarea
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="House / Flat number, street, area"
                    autoComplete="street-address"
                    disabled={loading}
                    rows={4}
                    className="flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                {/* CITY */}

                <div className="space-y-2">
                  <Label htmlFor="city">
                    City
                  </Label>

                  <Input
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                    autoComplete="address-level2"
                    disabled={loading}
                  />
                </div>

                {/* STATE */}

                <div className="space-y-2">
                  <Label htmlFor="state">
                    State
                  </Label>

                  <Input
                    id="state"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                    autoComplete="address-level1"
                    disabled={loading}
                  />
                </div>

                {/* PIN */}

                <div className="space-y-2">
                  <Label htmlFor="pincode">
                    PIN Code
                  </Label>

                  <Input
                    id="pincode"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="500001"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="postal-code"
                    disabled={loading}
                  />
                </div>

              </div>
            </Card>

            {/* =================================================
                PAYMENT
            ================================================== */}

            <Card className="rounded-2xl border-neutral-200 bg-white p-5 shadow-none sm:p-7">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100">
                  <CreditCard className="h-4 w-4 text-neutral-700" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    Payment
                  </h2>

                  <p className="text-xs text-neutral-500">
                    Select your payment method
                  </p>
                </div>

              </div>

              <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                    <CreditCard className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Online Payment
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      Secure payment gateway
                    </p>
                  </div>

                  <Check className="ml-auto h-5 w-5 text-green-600" />

                </div>

              </div>

              <p className="mt-4 text-xs leading-5 text-neutral-500">
                Payment gateway integration will be connected
                after the order API is finalized.
              </p>

            </Card>

          </div>

          {/* ===================================================
              RIGHT SIDE
          ==================================================== */}

          <div>

            <Card className="sticky top-24 rounded-2xl border-neutral-200 bg-white p-5 shadow-none sm:p-6">

              {/* SUMMARY HEADER */}

              <div className="flex items-center justify-between">

                <h2 className="text-lg font-semibold">
                  Order Summary
                </h2>

                <span className="text-xs text-neutral-500">
                  {cart.length}{" "}
                  {cart.length === 1
                    ? "item"
                    : "items"}
                </span>

              </div>

              {/* ITEMS */}

              <div className="mt-6 max-h-90 space-y-4 overflow-y-auto pr-1">

                {cart.map((item) => {

                  const itemTotal =
                    Number(item.price || 0) *
                    Number(item.quantity || 0);

                  return (
                    <div
                      key={item.productId}
                      className="flex gap-3"
                    >

                      <div className="h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">

                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />

                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="line-clamp-2 text-xs font-medium text-neutral-900">
                          {item.name}
                        </p>

                        <p className="mt-1 text-[11px] text-neutral-500">
                          Qty: {item.quantity}
                        </p>

                      </div>

                      <p className="shrink-0 text-xs font-semibold">
                        ₹
                        {itemTotal.toLocaleString(
                          "en-IN"
                        )}
                      </p>

                    </div>
                  );
                })}

              </div>

              <Separator className="my-6" />

              {/* TOTALS */}

              <div className="space-y-4 text-sm">

                <div className="flex justify-between text-neutral-500">

                  <span>
                    Subtotal
                  </span>

                  <span className="font-medium text-neutral-900">
                    ₹
                    {cartTotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

                <div className="flex justify-between text-neutral-500">

                  <span>
                    Shipping
                  </span>

                  <span className="font-medium text-green-600">
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
                    {total.toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>

              </div>

              {/* PLACE ORDER */}

              <Button
                type="submit"
                disabled={loading}
                className="mt-7 h-12 w-full rounded-full text-sm font-semibold"
              >
                {loading
                  ? "Processing Order..."
                  : "Place Order"}
              </Button>

              {/* SECURITY */}

              <div className="mt-6 space-y-4 border-t border-neutral-200 pt-6">

                <div className="flex gap-3">

                  <ShieldCheck className="h-5 w-5 shrink-0 text-neutral-700" />

                  <div>

                    <p className="text-xs font-semibold">
                      Secure Checkout
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                      Your personal information is protected.
                    </p>

                  </div>

                </div>

                <div className="flex gap-3">

                  <Truck className="h-5 w-5 shrink-0 text-neutral-700" />

                  <div>

                    <p className="text-xs font-semibold">
                      Reliable Delivery
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                      We'll keep you updated about your order.
                    </p>

                  </div>

                </div>

              </div>

            </Card>

          </div>

        </form>
      </div>
    </section>
  );
}

export default Checkout;