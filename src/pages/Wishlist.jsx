import { Link } from "react-router-dom";
import {
  ArrowRight,
  Heart,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart, cart } = useCart();

  const isInCart = (productId) => {
    return cart.some(
      (item) => item.productId === productId
    );
  };

  const handleAddToCart = (product) => {
    if (Number(product.stock || 0) <= 0) {
      return;
    }

    if (isInCart(product._id)) {
      return;
    }

    addToCart(product);
  };

  /*
  |--------------------------------------------------------------------------
  | EMPTY WISHLIST
  |--------------------------------------------------------------------------
  */

  if (wishlist.length === 0) {
    return (
      <section className="min-h-screen bg-neutral-50/50">

        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">

          <div className="max-w-md text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
              <Heart className="h-8 w-8 text-neutral-500" />
            </div>

            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
              SAVED ITEMS
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-950">
              Your wishlist is empty
            </h1>

            <p className="mt-3 text-sm leading-6 text-neutral-500">
              Save the pieces you love and come back
              to them whenever you're ready.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-black px-7 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Discover Products
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </div>

      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | WISHLIST
  |--------------------------------------------------------------------------
  */

  return (
    <section className="min-h-screen bg-neutral-50/50">

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

        {/* HEADER */}

        <div className="flex flex-col gap-4 border-b border-neutral-200 pb-7 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
              SAVED ITEMS
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Wishlist
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              {wishlist.length}{" "}
              {wishlist.length === 1
                ? "item"
                : "items"}{" "}
              saved
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

        {/* PRODUCT GRID */}

        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">

          {wishlist.map((product) => {

            const stock = Number(
              product.stock || 0
            );

            const price = Number(
              product.price || 0
            );

            const productInCart =
              isInCart(product._id);

            return (
              <Card
                key={product._id}
                className="group overflow-hidden rounded-2xl border-neutral-200 bg-white p-0 shadow-none"
              >

                {/* IMAGE */}

                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">

                  <Link
                    to={`/products/${product._id}`}
                    className="block h-full"
                  >

                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />

                  </Link>

                  {/* REMOVE */}

                  <button
                    type="button"
                    onClick={() =>
                      toggleWishlist(product)
                    }
                    aria-label={`Remove ${product.name} from wishlist`}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-neutral-700 shadow-sm backdrop-blur transition hover:bg-white hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* STOCK */}

                  {stock <= 0 && (
                    <div className="absolute bottom-3 left-3">
                      <Badge
                        variant="secondary"
                        className="rounded-full bg-black/80 px-3 py-1 text-[10px] text-white hover:bg-black/80"
                      >
                        Out of Stock
                      </Badge>
                    </div>
                  )}

                </div>

                {/* INFO */}

                <div className="p-4">

                  <Link
                    to={`/products/${product._id}`}
                  >

                    <h2 className="line-clamp-1 text-sm font-medium text-neutral-950 transition hover:text-neutral-500">
                      {product.name}
                    </h2>

                  </Link>

                  {product.brand && (
                    <p className="mt-1 text-xs text-neutral-400">
                      {product.brand}
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between gap-2">

                    <p className="text-sm font-semibold text-neutral-950">
                      ₹
                      {price.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    {product.category && (
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                        {product.category}
                      </span>
                    )}

                  </div>

                  <Separator className="my-4" />

                  {/* ACTION */}

                  <Button
                    type="button"
                    className="h-10 w-full rounded-full text-xs"
                    disabled={
                      stock <= 0 ||
                      productInCart
                    }
                    onClick={() =>
                      handleAddToCart(product)
                    }
                  >

                    <ShoppingBag className="mr-2 h-4 w-4" />

                    {stock <= 0
                      ? "Out of Stock"
                      : productInCart
                        ? "Already in Cart"
                        : "Add to Cart"}

                  </Button>

                </div>

              </Card>
            );
          })}

        </div>

      </div>

    </section>
  );
}

export default Wishlist;