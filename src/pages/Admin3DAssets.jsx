import { useEffect, useState } from "react";
import {
  Box,
  Check,
  X,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import ThreeDViewer from "../components/ThreeDViewer";
import {
  getAllThreeDAssets,
  reviewThreeDAsset,
} from "../services/threeDAssetService";

function Admin3DAssets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewingId, setReviewingId] = useState("");
  const [rejectingId, setRejectingId] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    let active = true;

    const fetchAssets = async () => {
      try {
        const response = await getAllThreeDAssets();

        if (!active) {
          return;
        }

        setAssets(response?.assets || []);
      } catch (err) {
        if (!active) {
          return;
        }

        console.error("Failed to load 3D assets:", err);

        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            "Unable to load 3D assets.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchAssets();

    return () => {
      active = false;
    };
  }, []);

  const loadAssets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllThreeDAssets();

      setAssets(response?.assets || []);
    } catch (err) {
      console.error("Failed to load 3D assets:", err);

      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Unable to load 3D assets.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (assetId) => {
    try {
      setReviewingId(assetId);
      setError("");

      const response = await reviewThreeDAsset(assetId, {
        status: "approved",
      });

      const updatedAsset = response?.asset;

      setAssets((currentAssets) =>
        currentAssets.map((asset) =>
          asset._id === assetId
            ? {
                ...asset,
                ...(updatedAsset || {}),
                status: "approved",
              }
            : asset,
        ),
      );
    } catch (err) {
      console.error("Failed to approve asset:", err);

      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Unable to approve asset.",
      );
    } finally {
      setReviewingId("");
    }
  };

  const handleReject = async (assetId) => {
    const reason = rejectionReason.trim();

    if (!reason) {
      setError("Please provide a rejection reason.");
      return;
    }

    try {
      setReviewingId(assetId);
      setError("");

      const response = await reviewThreeDAsset(assetId, {
        status: "rejected",
        reason,
      });

      const updatedAsset = response?.asset;

      setAssets((currentAssets) =>
        currentAssets.map((asset) =>
          asset._id === assetId
            ? {
                ...asset,
                ...(updatedAsset || {}),
                status: "rejected",
                rejectionReason: reason,
              }
            : asset,
        ),
      );

      setRejectingId("");
      setRejectionReason("");
    } catch (err) {
      console.error("Failed to reject asset:", err);

      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          "Unable to reject asset.",
      );
    } finally {
      setReviewingId("");
    }
  };

  const formatFileSize = (bytes) => {
    const size = Number(bytes || 0);

    if (!size) {
      return "0 MB";
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  };

  const formatStatus = (status) => {
    return String(status || "")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-neutral-500" />

              <p className="mt-3 text-sm text-neutral-500">
                Loading 3D assets...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5">
              <Box className="h-3.5 w-3.5" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Raritone Admin
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              3D Asset Review
            </h1>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Review generated 3D product assets before making them
              available to customers.
            </p>
          </div>

          <button
            type="button"
            onClick={loadAssets}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />

            <div className="flex-1">
              <p className="text-sm font-medium">
                Something went wrong
              </p>

              <p className="mt-1 text-xs text-red-600">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-400 transition hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {assets.length === 0 ? (
          <div className="mt-8 flex min-h-[400px] items-center justify-center rounded-3xl border border-neutral-200 bg-white">
            <div className="text-center">
              <Box className="mx-auto h-10 w-10 text-neutral-300" />

              <h2 className="mt-4 text-lg font-semibold text-neutral-800">
                No 3D assets found
              </h2>

              <p className="mt-2 text-sm text-neutral-500">
                Generated 3D assets will appear here for review.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {assets.map((asset) => {
              const product =
                asset.productId &&
                typeof asset.productId === "object"
                  ? asset.productId
                  : null;

              const isReviewing = reviewingId === asset._id;
              const isRejecting = rejectingId === asset._id;

              return (
                <div
                  key={asset._id}
                  className="overflow-hidden rounded-3xl border border-neutral-200 bg-white"
                >
                  <div className="grid lg:grid-cols-[1.1fr_1fr]">
                    <div className="min-h-[420px] bg-neutral-100">
                      {asset.assetUrl ? (
                        <ThreeDViewer
                          url={asset.assetUrl}
                          className="h-full min-h-[420px] rounded-none border-0"
                        />
                      ) : (
                        <div className="flex h-full min-h-[420px] items-center justify-center">
                          <div className="text-center">
                            <Box className="mx-auto h-8 w-8 text-neutral-300" />

                            <p className="mt-3 text-sm text-neutral-500">
                              3D preview unavailable
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-6 sm:p-8">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                            Product
                          </p>

                          <h2 className="mt-1 truncate text-xl font-semibold text-neutral-950">
                            {product?.name || "Unknown Product"}
                          </h2>

                          {product?.brand && (
                            <p className="mt-1 text-sm text-neutral-500">
                              {product.brand}
                            </p>
                          )}
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider ${
                            asset.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : asset.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {formatStatus(asset.status)}
                        </span>
                      </div>

                      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-2xl bg-neutral-50 p-3">
                          <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                            Format
                          </p>

                          <p className="mt-1 text-sm font-semibold text-neutral-800">
                            {String(asset.format || "").toUpperCase()}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-neutral-50 p-3">
                          <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                            Polygons
                          </p>

                          <p className="mt-1 text-sm font-semibold text-neutral-800">
                            {Number(
                              asset.polygonCount || 0,
                            ).toLocaleString()}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-neutral-50 p-3">
                          <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                            File Size
                          </p>

                          <p className="mt-1 text-sm font-semibold text-neutral-800">
                            {formatFileSize(asset.fileSize)}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-neutral-50 p-3">
                          <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                            Version
                          </p>

                          <p className="mt-1 truncate text-sm font-semibold text-neutral-800">
                            {asset.modelVersion || "3d-v1"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-neutral-50 p-4">
                          <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                            Source
                          </p>

                          <p className="mt-1 text-sm font-semibold text-neutral-800">
                            {asset.source || "Not specified"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-neutral-50 p-4">
                          <p className="text-[10px] uppercase tracking-wider text-neutral-400">
                            License
                          </p>

                          <p className="mt-1 text-sm font-semibold text-neutral-800">
                            {asset.license || "Not specified"}
                          </p>
                        </div>
                      </div>

                      {asset.rejectionReason && (
                        <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-red-500">
                            Rejection Reason
                          </p>

                          <p className="mt-1 text-sm leading-6 text-red-700">
                            {asset.rejectionReason}
                          </p>
                        </div>
                      )}

                      {asset.status === "pending_review" && (
                        <div className="mt-7">
                          {!isRejecting ? (
                            <div className="grid gap-3 sm:grid-cols-2">
                              <button
                                type="button"
                                disabled={isReviewing}
                                onClick={() =>
                                  handleApprove(asset._id)
                                }
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isReviewing ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}

                                Approve
                              </button>

                              <button
                                type="button"
                                disabled={isReviewing}
                                onClick={() => {
                                  setRejectingId(asset._id);
                                  setRejectionReason("");
                                  setError("");
                                }}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <X className="h-4 w-4" />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                              <label
                                htmlFor={`reason-${asset._id}`}
                                className="text-xs font-semibold text-neutral-800"
                              >
                                Rejection reason
                              </label>

                              <textarea
                                id={`reason-${asset._id}`}
                                value={rejectionReason}
                                onChange={(event) =>
                                  setRejectionReason(
                                    event.target.value,
                                  )
                                }
                                rows={4}
                                placeholder="Explain why this asset should be rejected..."
                                className="mt-3 w-full resize-none rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none transition focus:border-neutral-500"
                              />

                              <div className="mt-3 flex gap-2">
                                <button
                                  type="button"
                                  disabled={isReviewing}
                                  onClick={() =>
                                    handleReject(asset._id)
                                  }
                                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                                >
                                  {isReviewing && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  )}

                                  Reject Asset
                                </button>

                                <button
                                  type="button"
                                  disabled={isReviewing}
                                  onClick={() => {
                                    setRejectingId("");
                                    setRejectionReason("");
                                  }}
                                  className="h-10 rounded-full border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Admin3DAssets;