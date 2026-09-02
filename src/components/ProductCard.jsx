import {
  Heart,
  ShoppingBag,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

function ProductCard({ product, priority = false }) {
  const navigate = useNavigate();

  const { addToCart, cart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  if (!product) return null;

  const {
    _id,
    name,
    brand,
    category,
    price,
    image,
    stock = 0,
    discount = 0,
  } = product;

  const numericPrice = Number(price || 0);
  const numericDiscount = Number(discount || 0);
  const numericStock = Number(stock || 0);

  const finalPrice =
    numericDiscount > 0
      ? numericPrice -
        (numericPrice * numericDiscount) / 100
      : numericPrice;

  const isOutOfStock = numericStock <= 0;

  const wishlisted = isWishlisted(_id);

  const isAddedToCart = cart.some(
    (item) => item.productId === _id
  );

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isOutOfStock || isAddedToCart) {
      return;
    }

    addToCart(product);
  };

  const handleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    toggleWishlist(product);
  };

  const handleTryOn = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isOutOfStock) {
      return;
    }

    navigate("/try-on", {
      state: {
        product,
      },
    });
  };

  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-0 shadow-none transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        <Link
          to={`/products/${_id}`}
          className="block h-full w-full"
        >
          <img
            src={image}
            alt={name}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            width="600"
            height="750"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {category && (
          <Badge
            variant="secondary"
            className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-neutral-700 backdrop-blur"
          >
            {category}
          </Badge>
        )}

        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={handleWishlist}
          aria-label={
            wishlisted
              ? `Remove ${name} from wishlist`
              : `Add ${name} to wishlist`
          }
          className={`absolute right-3 top-3 z-20 h-9 w-9 rounded-full bg-white/90 shadow-sm backdrop-blur hover:bg-white ${
            wishlisted
              ? "text-red-500"
              : "text-neutral-700"
          }`}
        >
          <Heart
            className={`h-4 w-4 ${
              wishlisted ? "fill-current" : ""
            }`}
          />
        </Button>

        {isOutOfStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40">
            <Badge className="rounded-full bg-white px-4 py-2 text-black hover:bg-white">
              Out of Stock
            </Badge>
          </div>
        )}

        {!isOutOfStock && (
          <div className="absolute bottom-3 left-3 right-3 z-10 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Button
              type="button"
              onClick={handleTryOn}
              className="h-10 w-full rounded-full bg-white text-black shadow-lg hover:bg-neutral-100"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Try On
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        {brand && (
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500 sm:text-xs">
            {brand}
          </p>
        )}

        <div className="flex items-start justify-between gap-3">
          <Link
            to={`/products/${_id}`}
            className="min-w-0 flex-1"
          >
            <h3 className="line-clamp-2 text-sm font-medium leading-5 text-neutral-900 transition-colors hover:text-neutral-500 sm:text-base">
              {name}
            </h3>
          </Link>

          <Link
            to={`/products/${_id}`}
            aria-label={`View ${name}`}
            className="hidden shrink-0 rounded-full border border-neutral-200 p-2 text-neutral-500 transition hover:border-black hover:text-black sm:block"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-neutral-950 sm:text-lg">
              ₹{finalPrice.toLocaleString("en-IN")}
            </span>

            {numericDiscount > 0 && (
              <span className="text-xs text-neutral-400 line-through sm:text-sm">
                ₹{numericPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {numericStock > 0 && numericStock <= 5 && (
            <span className="text-[10px] font-medium text-orange-600">
              Only {numericStock} left
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            to={`/products/${_id}`}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-neutral-300 px-3 text-xs font-medium text-neutral-900 transition-colors hover:bg-neutral-100 sm:text-sm"
          >
            View Product
          </Link>

          <Button
            type="button"
            disabled={isOutOfStock || isAddedToCart}
            onClick={handleAddToCart}
            className={`h-10 flex-1 rounded-full text-xs font-medium sm:text-sm ${
              isAddedToCart
                ? "bg-neutral-200 text-neutral-700 hover:bg-neutral-200"
                : ""
            }`}
          >
            <ShoppingBag className="mr-1.5 h-4 w-4" />

            <span className="hidden sm:inline">
              {isOutOfStock
                ? "Out of Stock"
                : isAddedToCart
                  ? "Added"
                  : "Add to Cart"}
            </span>

            <span className="sm:hidden">
              {isOutOfStock
                ? "Out"
                : isAddedToCart
                  ? "Added"
                  : "Add"}
            </span>
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default ProductCard;