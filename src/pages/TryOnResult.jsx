import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Camera,
  Check,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

import {
  getTryOnSession,
  retryTryOn,
} from "../services/tryOnService";

import { useCart } from "../context/CartContext";

function TryOnResult() {
  const navigate = useNavigate();
  const location = useLocation();

  const { sessionId: routeSessionId } = useParams();

  const [searchParams] = useSearchParams();

  const { addToCart } = useCart();

  const sessionId =
    routeSessionId || searchParams.get("id");

  const initialSession =
    location.state?.session || null;

  const [session, setSession] =
    useState(initialSession);

  const [loading, setLoading] =
    useState(!initialSession);

  const [retrying, setRetrying] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;
    let timeoutId = null;

    const fetchSession = async () => {
      if (!sessionId) {
        if (!cancelled) {
          setError(
            "Try-on session ID is missing."
          );

          setLoading(false);
        }

        return;
      }

      try {
        const response =
          await getTryOnSession(
            sessionId
          );

        const currentSession =
          response?.result;

        if (!currentSession) {
          throw new Error(
            "Try-on session was not found."
          );
        }

        if (cancelled) {
          return;
        }

        setSession(currentSession);
        setError("");

        const isProcessing =
          currentSession.status === "pending" ||
          currentSession.status === "processing";

        const isCompletedWithoutImage =
          currentSession.status === "completed" &&
          !currentSession.resultImageReference;

        if (
          isProcessing ||
          isCompletedWithoutImage
        ) {
          setLoading(false);

          timeoutId = setTimeout(
            fetchSession,
            1500
          );

          return;
        }

        setLoading(false);
      } catch (err) {
        console.error(
          "TRY-ON RESULT ERROR:",
          err
        );

        if (!cancelled) {
          setError(
            err.response?.data?.error?.message ||
              err.response?.data?.message ||
              err.message ||
              "Unable to load try-on result."
          );

          setLoading(false);
        }
      }
    };

    fetchSession();

    return () => {
      cancelled = true;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [sessionId]);

  const refreshSession = async () => {
    if (!sessionId) {
      setError(
        "Try-on session ID is missing."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await getTryOnSession(
          sessionId
        );

      if (!response?.result) {
        throw new Error(
          "Try-on session was not found."
        );
      }

      setSession(response.result);
    } catch (err) {
      console.error(
        "TRY-ON REFRESH ERROR:",
        err
      );

      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          err.message ||
          "Unable to load try-on result."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    if (!sessionId) {
      setError(
        "Try-on session ID is missing."
      );

      return;
    }

    try {
      setRetrying(true);
      setError("");

      const response =
        await retryTryOn(sessionId);

      if (response?.result) {
        setSession(response.result);
      }

      setRetrying(false);

      setLoading(false);
    } catch (err) {
      console.error(
        "TRY-ON RESULT RETRY ERROR:",
        err
      );

      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          err.message ||
          "Unable to retry try-on."
      );

      setRetrying(false);
    }
  };

  const handleAddToCart = () => {
    const productId =
      typeof session?.productId ===
      "object"
        ? session.productId._id ||
          session.productId.id
        : session?.productId;

    if (!productId) {
      setError(
        "Product information is unavailable."
      );

      return;
    }

    addToCart(productId, 1);

    navigate("/cart");
  };

  if (!sessionId) {
    return (
      <main className="min-h-screen bg-neutral-50 px-4 py-12">
        <div className="mx-auto max-w-xl">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <X className="mx-auto h-8 w-8 text-red-500" />

            <h1 className="mt-4 text-xl font-semibold text-red-900">
              Try-On Session Missing
            </h1>

            <p className="mt-2 text-sm text-red-700">
              We could not find the try-on
              session.
            </p>

            <Link
              to="/try-on"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-black px-6 text-sm font-semibold text-white"
            >
              <Camera className="h-4 w-4" />
              Start Try-On
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (loading && !session) {
    return (
      <main className="min-h-screen bg-neutral-50 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="h-6 w-32 animate-pulse rounded bg-neutral-200" />

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="aspect-[4/5] animate-pulse rounded-3xl bg-neutral-200" />

            <div className="space-y-5">
              <div className="h-10 w-64 animate-pulse rounded bg-neutral-200" />

              <div className="h-20 animate-pulse rounded-2xl bg-neutral-200" />

              <div className="h-12 animate-pulse rounded-full bg-neutral-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error && !session) {
    return (
      <main className="min-h-screen bg-neutral-50 px-4 py-12">
        <div className="mx-auto max-w-xl">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <X className="mx-auto h-8 w-8 text-red-500" />

            <h1 className="mt-4 text-xl font-semibold text-red-900">
              Unable to Load Result
            </h1>

            <p className="mt-2 text-sm text-red-700">
              {error}
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={refreshSession}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-black px-5 text-sm font-semibold text-white"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>

              <Link
                to="/try-on"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-neutral-200 bg-white px-5 text-sm font-semibold"
              >
                Back to Try-On
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (session?.status === "failed") {
    const retryLimitReached =
      session.errorCode ===
      "RETRY_LIMIT_REACHED";

    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
            <Link
              to="/try-on"
              className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-black"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Try-On
            </Link>
          </div>
        </div>

        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4 py-12">
          <div className="w-full rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <X className="h-7 w-7 text-red-500" />
            </div>

            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-red-500">
              Try-On Failed
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              We couldn't generate your try-on.
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-neutral-500">
              {session.errorMessage ||
                "Your image could not be processed. Please try again."}
            </p>

            {session.errorCode && (
              <div className="mt-4 inline-flex rounded-full bg-neutral-100 px-3 py-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                  {session.errorCode}
                </span>
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-xl bg-red-50 p-3 text-xs text-red-600">
                {error}
              </div>
            )}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {!retryLimitReached && (
                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={retrying}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      retrying
                        ? "animate-spin"
                        : ""
                    }`}
                  />

                  {retrying
                    ? "Retrying..."
                    : "Try Again"}
                </button>
              )}

              <Link
                to="/try-on"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-6 text-sm font-semibold text-neutral-800"
              >
                <Upload className="h-4 w-4" />
                Upload New Photo
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (
    session?.status === "pending" ||
    session?.status === "processing"
  ) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-12">
          <div className="w-full rounded-3xl border border-neutral-200 bg-white p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-950 text-white">
              <Sparkles className="h-7 w-7 animate-pulse" />
            </div>

            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
              Raritone AI Studio
            </p>

            <h1 className="mt-2 text-3xl font-semibold">
              {session.status === "pending"
                ? "Preparing your try-on..."
                : "AI is generating your try-on..."}
            </h1>

            <p className="mt-4 text-sm leading-6 text-neutral-500">
              Please keep this page open while
              your try-on is being processed.
            </p>

            <div className="mx-auto mt-8 h-1.5 max-w-xs overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-black" />
            </div>

            <button
              type="button"
              onClick={refreshSession}
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-black"
            >
              <RefreshCw className="h-4 w-4" />
              Check Status
            </button>

            <Link
              to="/try-on/history"
              className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-neutral-600 hover:text-black"
            >
              View Try-On History
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const product =
    typeof session?.productId === "object"
      ? session.productId
      : null;

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            to="/try-on"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Try-On
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5">
            <Check className="h-3.5 w-3.5 text-green-600" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-green-700">
              Try-On Complete
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight">
            Your look is ready.
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Here's how the selected garment
            looks on you.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white">
            <div className="relative bg-neutral-100">
              {session.resultImageReference ? (
                <img
                  src={
                    session.resultImageReference
                  }
                  alt="Virtual try-on result"
                  className="max-h-[800px] w-full object-contain"
                />
              ) : (
                <div className="flex min-h-[500px] items-center justify-center">
                  <div className="text-center">
                    <X className="mx-auto h-8 w-8 text-neutral-400" />

                    <p className="mt-3 text-sm text-neutral-500">
                      Result image is unavailable.
                    </p>

                    <button
                      type="button"
                      onClick={refreshSession}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-xs font-semibold text-white"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Refresh
                    </button>
                  </div>
                </div>
              )}

              <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider shadow-sm backdrop-blur">
                <Sparkles className="h-3 w-3" />
                AI Result
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {product && (
              <div className="rounded-3xl border border-neutral-200 bg-white p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Selected Garment
                </p>

                <div className="mt-5 flex gap-4">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-28 w-20 rounded-2xl object-cover"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    {product.brand && (
                      <p className="text-xs text-neutral-400">
                        {product.brand}
                      </p>
                    )}

                    <h2 className="mt-1 text-lg font-semibold">
                      {product.name}
                    </h2>

                    <p className="mt-2 text-base font-medium">
                      ₹
                      {Number(
                        product.price || 0
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-3xl border border-neutral-200 bg-white p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                Session Details
              </p>

              <div className="mt-5 space-y-4">
                <DetailRow
                  label="Status"
                  value="Completed"
                />

                <DetailRow
                  label="AI Model"
                  value={
                    session.aiModelVersion ||
                    "VTON"
                  }
                />

                <DetailRow
                  label="Processing Time"
                  value={
                    session.processingTime
                      ? `${Number(
                          session.processingTime
                        ).toFixed(2)} sec`
                      : "—"
                  }
                />
              </div>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white p-6">
              <div className="grid gap-3">
                {product && (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex h-12 items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:bg-neutral-800"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Add to Cart
                  </button>
                )}

                <Link
                  to="/try-on"
                  className="flex h-12 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-6 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50"
                >
                  <Sparkles className="h-4 w-4" />
                  Try Another Product
                </Link>

                <Link
                  to="/try-on/history"
                  className="flex h-12 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-6 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50"
                >
                  View Try-On History
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function DetailRow({
  label,
  value,
}) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-100 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-neutral-500">
        {label}
      </span>

      <span className="text-sm font-medium text-neutral-900">
        {value}
      </span>
    </div>
  );
}

export default TryOnResult;