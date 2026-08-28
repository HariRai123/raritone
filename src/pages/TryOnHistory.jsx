import { useEffect, useState } from "react";

import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  LoaderCircle,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  getTryOnHistory,
} from "../services/tryOnService";

function TryOnHistory() {
  const [sessions, setSessions] =
    useState([]);

  const [pagination, setPagination] =
    useState({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadHistory = async (
    page = 1,
  ) => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getTryOnHistory(
          page,
          10,
        );

      setSessions(
        response?.results || [],
      );

      setPagination(
        response?.pagination || {
          page,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      );
    } catch (err) {
      console.error(
        "TRY-ON HISTORY ERROR:",
        err,
      );

      setError(
        err.response?.data
          ?.error?.message ||
          err.response?.data
            ?.message ||
          "Unable to load your try-on history.",
      );

      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  let cancelled = false;

  const fetchHistory = async () => {
    try {
      const response = await getTryOnHistory(1, 10);

      if (cancelled) return;

      setSessions(response?.results || []);

      setPagination(
        response?.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      );
    } catch (err) {
      if (cancelled) return;

      console.error(
        "TRY-ON HISTORY ERROR:",
        err,
      );

      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Unable to load your try-on history.",
      );

      setSessions([]);
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  fetchHistory();

  return () => {
    cancelled = true;
  };
}, []);

  const handlePrevious =
    () => {
      if (
        pagination.hasPreviousPage
      ) {
        loadHistory(
          pagination.page - 1,
        );
      }
    };

  const handleNext = () => {
    if (
      pagination.hasNextPage
    ) {
      loadHistory(
        pagination.page + 1,
      );
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      {/* HEADER */}

      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
                Raritone AI Studio
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                My Try-Ons
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
                View your previous virtual
                try-on sessions and results.
              </p>
            </div>

            <Link
              to="/try-on"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              <Sparkles className="h-4 w-4" />
              New Try-On
            </Link>
          </div>
        </div>
      </div>

      {/* CONTENT */}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ERROR */}

        {error && (
          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

              <div>
                <p className="text-sm font-semibold text-red-800">
                  Unable to load history
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                loadHistory(
                  pagination.page,
                )
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-4 text-sm font-medium text-red-700 hover:bg-red-100"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <LoadingState />
        ) : sessions.length === 0 ? (
          /* EMPTY */

          <EmptyState />
        ) : (
          <>
            {/* RESULTS */}

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sessions.map(
                (session) => (
                  <TryOnCard
                    key={
                      session._id
                    }
                    session={
                      session
                    }
                  />
                ),
              )}
            </div>

            {/* PAGINATION */}

            {pagination.totalPages >
              1 && (
              <Pagination
                pagination={
                  pagination
                }
                onPrevious={
                  handlePrevious
                }
                onNext={
                  handleNext
                }
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Try-On Card
|--------------------------------------------------------------------------
*/

function TryOnCard({
  session,
}) {
  const product =
    session.productId &&
    typeof session.productId ===
      "object"
      ? session.productId
      : null;

  const status =
    session.status;

  const date = session.createdAt
    ? new Date(
        session.createdAt,
      ).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        },
      )
    : "Unknown date";

  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg">

      {/* IMAGE */}

      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        {status ===
          "completed" &&
        session.resultImageReference ? (
          <img
            src={
              session.resultImageReference
            }
            alt={
              product?.name ||
              "Try-on result"
            }
            className="h-full w-full object-cover"
          />
        ) : session.inputImageReference ? (
          <img
            src={
              session.inputImageReference
            }
            alt="Try-on input"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Sparkles className="h-8 w-8 text-neutral-300" />
          </div>
        )}

        <StatusBadge
          status={status}
        />
      </div>

      {/* CONTENT */}

      <div className="p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Product
        </p>

        <h2 className="mt-1 truncate text-sm font-semibold text-neutral-900">
          {product?.name ||
            "Unknown Product"}
        </h2>

        {product?.brand && (
          <p className="mt-1 truncate text-xs text-neutral-500">
            {product.brand}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between text-xs text-neutral-400">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {date}
          </span>

          {session.processingTime && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {Number(
                session.processingTime,
              ).toFixed(1)}
              s
            </span>
          )}
        </div>

        <Link
          to={`/try-on/result/${session._id}`}
          className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-black text-xs font-semibold text-white transition hover:bg-neutral-800"
        >
          View Result
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Status Badge
|--------------------------------------------------------------------------
*/

function StatusBadge({
  status,
}) {
  if (status === "completed") {
    return (
      <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-green-700 shadow-sm backdrop-blur">
        <Check className="h-3 w-3" />
        Completed
      </div>
    );
  }

  if (status === "processing") {
    return (
      <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-700 shadow-sm backdrop-blur">
        <LoaderCircle className="h-3 w-3 animate-spin" />
        Processing
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-600 shadow-sm backdrop-blur">
        <Clock className="h-3 w-3" />
        Pending
      </div>
    );
  }

  return (
    <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-red-600 shadow-sm backdrop-blur">
      <X className="h-3 w-3" />
      Failed
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Loading
|--------------------------------------------------------------------------
*/

function LoadingState() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({
        length: 6,
      }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-3xl border border-neutral-200 bg-white"
        >
          <div className="aspect-[4/5] animate-pulse bg-neutral-100" />

          <div className="space-y-3 p-5">
            <div className="h-3 w-20 animate-pulse rounded bg-neutral-100" />

            <div className="h-5 w-3/4 animate-pulse rounded bg-neutral-100" />

            <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-100" />

            <div className="h-10 animate-pulse rounded-full bg-neutral-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Empty State
|--------------------------------------------------------------------------
*/

function EmptyState() {
  return (
    <div className="flex min-h-[450px] flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
        <Sparkles className="h-7 w-7 text-neutral-400" />
      </div>

      <h2 className="mt-5 text-xl font-semibold">
        No try-ons yet
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-neutral-500">
        Try a product virtually and
        your results will appear here.
      </p>

      <Link
        to="/try-on"
        className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-black px-5 text-sm font-semibold text-white hover:bg-neutral-800"
      >
        <Sparkles className="h-4 w-4" />
        Start Your First Try-On
      </Link>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Pagination
|--------------------------------------------------------------------------
*/

function Pagination({
  pagination,
  onPrevious,
  onNext,
}) {
  return (
    <div className="mt-8 flex flex-col gap-4 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-neutral-500">
        Page{" "}
        <span className="font-medium text-neutral-800">
          {pagination.page}
        </span>{" "}
        of{" "}
        <span className="font-medium text-neutral-800">
          {pagination.totalPages}
        </span>

        <span className="ml-2 text-neutral-400">
          ({pagination.total} total)
        </span>
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={
            !pagination.hasPreviousPage
          }
          className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={
            !pagination.hasNextPage
          }
          className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default TryOnHistory;