import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Sparkles,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  RotateCcw,
  Box,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";

import { getProductById } from "../services/productService";
import { getProductThreeDAsset } from "../services/threeDAssetService";
import { createThreeDTryOnSession } from "../services/threeDTryOnService";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

import ThreeDViewer from "../components/ThreeDViewer";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { addToCart, cart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const [threeDAsset, setThreeDAsset] = useState(null);
  const [threeDLoading, setThreeDLoading] = useState(false);
  const [threeDError, setThreeDError] = useState("");
  const [viewMode, setViewMode] = useState("2d");
  const [tryOnLoading, setTryOnLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setThreeDLoading(true);
        setThreeDError("");
        setThreeDAsset(null);
        setViewMode("2d");

        const data = await getProductById(id);

        if (!mounted) {
          return;
        }

        setProduct(data);

        try {
          const threeDResponse = await getProductThreeDAsset(id);

          if (!mounted) {
            return;
          }

          setThreeDAsset(threeDResponse?.asset || null);
        } catch (threeDErr) {
          if (!mounted) {
            return;
          }

          if (threeDErr.response?.status !== 404) {
            console.error("Error fetching 3D asset:", threeDErr);
            setThreeDError("Unable to load the 3D preview.");
          }

          setThreeDAsset(null);
        }
      } catch (err) {
        if (!mounted) {
          return;
        }

        console.error("Error fetching product:", err);
        setError("Unable to load product.");
      } finally {
        if (mounted) {
          setLoading(false);
          setThreeDLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleQuantityDecrease = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const handleQuantityIncrease = () => {
    setQuantity((current) => Math.min(stock, current + 1));
  };

  const handleAddToCart = () => {
    if (stock <= 0) {
      return;
    }

    addToCart(product, quantity);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    if (stock <= 0) {
      return;
    }

    addToCart(product, quantity);
    navigate("/cart");
  };

  const handleTryOn = async () => {
    if (!threeDAsset?._id || tryOnLoading) {
      return;
    }

    try {
      setTryOnLoading(true);
      setThreeDError("");

      const response = await createThreeDTryOnSession({
        productId: product._id,
        threeDAssetId: threeDAsset._id,
      });

      const session = response?.session;

      if (!session?._id) {
        throw new Error("3D try-on session was not created.");
      }

      navigate(`/3d-try-on?id=${session._id}`);
    } catch (err) {
      console.error("CREATE 3D TRY-ON SESSION ERROR:", err);

      setThreeDError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          err.message ||
          "Unable to start 3D try-on.",
      );
    } finally {
      setTryOnLoading(false);
    }
  };

  const handleWishlist = () => {
    toggleWishlist(product);
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-5 w-40 rounded bg-neutral-200" />

            <div className="grid gap-10 lg:grid-cols-2">
              <div className="aspect-[4/5] rounded-2xl bg-neutral-200" />

              <div className="space-y-6 py-4">
                <div className="h-4 w-24 rounded bg-neutral-200" />
                <div className="h-10 w-3/4 rounded bg-neutral-200" />
                <div className="h-6 w-32 rounded bg-neutral-200" />
                <div className="h-20 w-full rounded bg-neutral-100" />
                <div className="h-12 w-full rounded bg-neutral-200" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-white px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <span className="text-xl font-semibold">!</span>
          </div>

          <h2 className="text-xl font-semibold text-neutral-900">
            Something went wrong
          </h2>

          <p className="mt-2 text-sm text-neutral-500">{error}</p>

          <Button
            type="button"
            className="mt-6 rounded-full"
            onClick={() => navigate("/products")}
          >
            Back to Products
          </Button>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Product not found</h2>

          <Button
            type="button"
            className="mt-5 rounded-full"
            onClick={() => navigate("/products")}
          >
            Browse Products
          </Button>
        </div>
      </section>
    );
  }

  const stock = Number(product.stock || 0);
  const price = Number(product.price || 0);
  const wishlisted = isWishlisted(product._id);

  const isAlreadyInCart = cart.some(
    (item) => item.productId === product._id,
  );

  const threeDUrl = threeDAsset?.assetUrl || "";
  const hasThreeDAsset = Boolean(threeDAsset?._id && threeDUrl);

  return (
    <section className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <Link
          to="/products"
          className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="relative">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode("2d")}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  viewMode === "2d"
                    ? "bg-black text-white"
                    : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
                }`}
              >
                <ImageIcon className="h-4 w-4" />
                2D Images
              </button>

              <button
                type="button"
                onClick={() => setViewMode("3d")}
                disabled={!hasThreeDAsset || threeDLoading}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  viewMode === "3d"
                    ? "bg-black text-white"
                    : "border border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <Box className="h-4 w-4" />

                {threeDLoading
                  ? "Checking 3D..."
                  : hasThreeDAsset
                    ? "3D View"
                    : "3D Coming Soon"}
              </button>
            </div>

            {viewMode === "3d" ? (
              threeDLoading ? (
                <div className="flex aspect-[4/5] items-center justify-center rounded-2xl bg-neutral-100">
                  <div className="text-center">
                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />

                    <p className="mt-3 text-sm text-neutral-500">
                      Loading 3D preview...
                    </p>
                  </div>
                </div>
              ) : threeDError ? (
                <div className="flex aspect-[4/5] items-center justify-center rounded-2xl bg-neutral-50 px-6 text-center">
                  <div>
                    <Box className="mx-auto h-8 w-8 text-neutral-300" />

                    <p className="mt-3 text-sm font-medium text-neutral-700">
                      3D preview unavailable
                    </p>

                    <p className="mt-1 text-xs text-neutral-400">
                      {threeDError}
                    </p>
                  </div>
                </div>
              ) : threeDUrl ? (
                <ThreeDViewer url={threeDUrl} />
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center rounded-2xl bg-neutral-50 px-6 text-center">
                  <div>
                    <Box className="mx-auto h-8 w-8 text-neutral-300" />

                    <p className="mt-3 text-sm font-medium text-neutral-700">
                      3D preview coming soon
                    </p>

                    <p className="mt-1 text-xs text-neutral-400">
                      This product does not have an approved 3D model.
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />

                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  onClick={handleWishlist}
                  aria-label={
                    wishlisted
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                  className={`absolute right-4 top-4 h-11 w-11 rounded-full bg-white/95 shadow-sm backdrop-blur ${
                    wishlisted ? "text-red-500" : "text-neutral-800"
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      wishlisted ? "fill-current" : ""
                    }`}
                  />
                </Button>

                {stock > 0 && (
                  <Badge className="absolute bottom-4 left-4 rounded-full bg-black px-4 py-2 text-white hover:bg-black">
                    <Sparkles className="mr-2 h-3.5 w-3.5" />
                    Virtual Try-On Available
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            {product.category && (
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500">
                {product.category}
              </p>
            )}

            {product.brand && (
              <p className="mb-2 text-sm font-medium text-neutral-500">
                {product.brand}
              </p>
            )}

            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            <div className="mt-5">
              <span className="text-2xl font-semibold text-neutral-950 sm:text-3xl">
                ₹{price.toLocaleString("en-IN")}
              </span>
            </div>

            <Separator className="my-7" />

            {product.description && (
              <div>
                <h2 className="mb-2 text-sm font-semibold text-neutral-900">
                  Description
                </h2>

                <p className="text-sm leading-7 text-neutral-500 sm:text-base">
                  {product.description}
                </p>
              </div>
            )}

            <div className="mt-6">
              {stock > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  <span className="text-sm font-medium text-green-700">
                    In Stock
                  </span>

                  {stock <= 5 && (
                    <span className="text-xs text-orange-600">
                      Only {stock} left
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />

                  <span className="text-sm font-medium text-red-600">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {stock > 0 && (
              <div className="mt-7">
                <p className="mb-2 text-sm font-medium">Quantity</p>

                <div className="flex h-11 w-fit items-center rounded-full border border-neutral-200">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleQuantityDecrease}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-full"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <span className="w-10 text-center text-sm font-medium">
                    {quantity}
                  </span>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleQuantityIncrease}
                    disabled={quantity >= stock}
                    className="h-10 w-10 rounded-full"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {threeDError && viewMode === "2d" && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {threeDError}
              </div>
            )}

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                disabled={stock <= 0}
                onClick={handleAddToCart}
                className="h-12 rounded-full text-sm font-semibold"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />

                {stock <= 0
                  ? "Out of Stock"
                  : added
                    ? "Added to Cart ✓"
                    : isAlreadyInCart
                      ? "Add More to Cart"
                      : "Add to Cart"}
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={stock <= 0 || !hasThreeDAsset || tryOnLoading}
                onClick={handleTryOn}
                className="h-12 rounded-full border-neutral-300 text-sm font-semibold"
              >
                {tryOnLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting Try-On...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {hasThreeDAsset ? "Try On" : "3D Try-On Coming Soon"}
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="secondary"
                disabled={stock <= 0}
                onClick={handleBuyNow}
                className="h-12 rounded-full text-sm font-semibold sm:col-span-2"
              >
                Buy Now
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 border-t border-neutral-200 pt-7 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <Truck className="mt-0.5 h-5 w-5 shrink-0 text-neutral-700" />

                <div>
                  <p className="text-xs font-semibold">Fast Delivery</p>

                  <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                    Quick and reliable delivery.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-neutral-700" />

                <div>
                  <p className="text-xs font-semibold">Easy Returns</p>

                  <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                    Hassle-free return experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-neutral-700" />

                <div>
                  <p className="text-xs font-semibold">Secure Checkout</p>

                  <p className="mt-1 text-[11px] leading-5 text-neutral-500">
                    Your information stays protected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {stock > 0 && (
          <div className="mt-16 overflow-hidden rounded-2xl bg-neutral-950 px-6 py-10 text-white sm:px-10 lg:mt-20 lg:py-14">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />

                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                    Raritone Virtual Try-On
                  </span>
                </div>

                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  See how {product.name} looks on you.
                </h2>

                <p className="mt-3 text-sm leading-6 text-neutral-400 sm:text-base">
                  Upload your photo and use Raritone's AI-powered
                  try-on experience before you buy.
                </p>
              </div>

              <Button
                type="button"
                onClick={handleTryOn}
                disabled={!hasThreeDAsset || tryOnLoading}
                className="h-12 rounded-full bg-white px-7 text-sm font-semibold text-black hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {tryOnLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Starting Try-On...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {hasThreeDAsset
                      ? "Try This Product"
                      : "3D Try-On Coming Soon"}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductDetails;