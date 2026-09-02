import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  Check,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

import ImageUploader from "../components/ImageUploader";
import ErrorState from "../components/ErrorState";
import ProcessingStatus from "../components/ProcessingStatus";

import { useAuth } from "../context/AuthContext";

import {
  createTryOn,
  getTryOnSession,
  retryTryOn,
} from "../services/tryOnService";

function TryOn() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const selectedProduct = location.state?.product || null;

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [session, setSession] = useState(null);

  const [loading, setLoading] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const [error, setError] = useState("");
  const [processingStatus, setProcessingStatus] = useState("idle");

  const mountedRef = useRef(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: "/try-on",
        },
        replace: true,
      });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageSelected = (file) => {
    if (!file) {
      return;
    }

    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    const newPreview = URL.createObjectURL(file);

    setImage(file);
    setPreview(newPreview);
    setSession(null);
    setError("");
    setProcessingStatus("idle");
    setLoading(false);
  };

  const removeImage = () => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setImage(null);
    setPreview("");
    setSession(null);
    setError("");
    setProcessingStatus("idle");
    setLoading(false);
  };

  const pollTryOnSession = useCallback(
    async (sessionId) => {
      const maxAttempts = 100;
      const pollingInterval = 3000;

      for (
        let attempt = 0;
        attempt < maxAttempts;
        attempt += 1
      ) {
        if (!mountedRef.current) {
          return;
        }

        try {
          const response = await getTryOnSession(sessionId);
          const currentSession = response?.result;

          if (!currentSession) {
            throw new Error(
              "Invalid try-on session response from server."
            );
          }

          if (!mountedRef.current) {
            return;
          }

          setSession(currentSession);

          if (currentSession.status === "pending") {
            setProcessingStatus("pending");
          }

          if (currentSession.status === "processing") {
            setProcessingStatus("processing");
          }

          if (currentSession.status === "completed") {
            setProcessingStatus("completed");
            setLoading(false);

            navigate(`/try-on/result/${sessionId}`, {
              replace: true,
            });

            return;
          }

          if (currentSession.status === "failed") {
            setProcessingStatus("failed");
            setLoading(false);

            setError(
              currentSession.errorMessage ||
                "The virtual try-on could not be completed."
            );

            return;
          }

          if (
            !["pending", "processing"].includes(
              currentSession.status
            )
          ) {
            throw new Error(
              `Unknown try-on status: ${currentSession.status}`
            );
          }

          await new Promise((resolve) =>
            setTimeout(resolve, pollingInterval)
          );
        } catch (err) {
          console.error("TRY-ON POLLING ERROR:", err);

          if (!mountedRef.current) {
            return;
          }

          setProcessingStatus("failed");
          setLoading(false);

          setError(
            err.response?.data?.error?.message ||
              err.response?.data?.message ||
              err.message ||
              "Unable to check try-on status."
          );

          return;
        }
      }

      if (!mountedRef.current) {
        return;
      }

      setProcessingStatus("failed");
      setLoading(false);

      setError(
        "The try-on is taking longer than expected. Please try again."
      );
    },
    [navigate]
  );

  const handleAnalyze = async () => {
    if (!image) {
      setError("Please upload a photo first.");
      return;
    }

    if (!selectedProduct) {
      setError(
        "No product was selected. Please return to the product page and click Try On."
      );
      return;
    }

    const productId =
      selectedProduct._id ||
      selectedProduct.id ||
      selectedProduct.productId;

    if (!productId) {
      setError("Selected product information is invalid.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSession(null);
      setProcessingStatus("uploading");

      const response = await createTryOn({
        image,
        productId,
      });

      console.log("TRY-ON SESSION RESPONSE:", response);

      const createdSession =
        response?.tryOn ||
        response?.result ||
        response?.session;

      if (!createdSession) {
        throw new Error(
          "Try-on session was not returned by the server."
        );
      }

      const sessionId =
        createdSession.id ||
        createdSession._id;

      if (!sessionId) {
        throw new Error(
          "Try-on session ID was not returned by the server."
        );
      }

      setSession(createdSession);

      setProcessingStatus(
        createdSession.status || "pending"
      );

      await pollTryOnSession(sessionId);
    } catch (err) {
      console.error("TRY-ON WORKFLOW ERROR:", err);

      setProcessingStatus("failed");
      setLoading(false);

      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          err.message ||
          "Unable to start the try-on session."
      );
    }
  };

  const handleRetry = async () => {
    const sessionId =
      session?.id || session?._id;

    if (!sessionId) {
      setError("Try-on session could not be found.");
      return;
    }

    try {
      setRetrying(true);
      setLoading(true);
      setError("");
      setProcessingStatus("pending");

      const response = await retryTryOn(sessionId);

      console.log("TRY-ON RETRY RESPONSE:", response);

      const retrySession =
        response?.result ||
        response?.tryOn ||
        response?.session;

      if (retrySession) {
        setSession(retrySession);
      }

      await pollTryOnSession(sessionId);
    } catch (err) {
      console.error("TRY-ON RETRY ERROR:", err);

      setProcessingStatus("failed");
      setLoading(false);

      setError(
        err.response?.data?.error?.message ||
          err.response?.data?.message ||
          err.message ||
          "Unable to retry the try-on."
      );
    } finally {
      if (mountedRef.current) {
        setRetrying(false);
      }
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <section className="min-h-screen bg-neutral-50">
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5">
                <Sparkles className="h-3.5 w-3.5" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-600">
                  Raritone AI Studio
                </span>
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
                Try it before
                <span className="block text-neutral-400">
                  you buy it.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-500 sm:text-base">
                Upload your photo and see how your selected product
                looks on you.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/try-on/history"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950"
              >
                History
              </Link>

              <Link
                to="/products"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-black px-4 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                <span>Browse Products</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            <X className="mt-0.5 h-4 w-4 shrink-0" />

            <div>
              <p className="text-sm font-medium">
                Try-on couldn't start
              </p>

              <p className="mt-1 text-xs text-red-600">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white">
            {!preview ? (
              <div className="p-5 sm:p-7">
                <div className="mb-6">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-950 text-white">
                    <ImageIcon className="h-4 w-4" />
                  </div>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                    Step 01
                  </p>

                  <h2 className="mt-1 text-xl font-semibold">
                    Add your photo
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-neutral-500">
                    Use a clear full-body photo for the best AI
                    analysis.
                  </p>
                </div>

                <ImageUploader
                  onImageSelected={handleImageSelected}
                  disabled={loading}
                />
              </div>
            ) : (
              <div className="p-5 sm:p-7">
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                      Step 01
                    </p>

                    <h2 className="mt-1 text-xl font-semibold">
                      Your photo
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={loading}
                    className="inline-flex h-9 items-center gap-2 rounded-full border border-neutral-200 px-3 text-xs font-medium text-neutral-600 transition hover:bg-neutral-50 disabled:opacity-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Retake
                  </button>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-neutral-100">
                  <img
                    src={preview}
                    alt="Uploaded person"
                    className="max-h-[650px] w-full object-contain"
                  />

                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider shadow-sm backdrop-blur">
                    <Check className="h-3 w-3" />
                    Photo ready
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-800">
                      {image?.name}
                    </p>

                    <p className="mt-1 text-xs text-neutral-400">
                      {image
                        ? `${(
                            image.size /
                            1024 /
                            1024
                          ).toFixed(2)} MB`
                        : ""}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={removeImage}
                    disabled={loading}
                    className="shrink-0 text-xs font-medium text-neutral-500 hover:text-red-600 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white">
            <div className="p-5 sm:p-7">
              <div className="mb-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Step 02
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Selected Product
                </h2>

                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  Your product has already been selected from the
                  product page.
                </p>
              </div>

              {loading ? (
                <ProcessingStatus status={processingStatus} />
              ) : processingStatus === "failed" && session ? (
                <ErrorState
                  message={error}
                  code={session.errorCode}
                  onRetry={handleRetry}
                  onUploadNewPhoto={removeImage}
                  retrying={retrying}
                />
              ) : selectedProduct ? (
                <>
                  <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="h-[360px] w-full object-cover"
                    />

                    <div className="p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                        Garment
                      </p>

                      <h3 className="mt-2 text-xl font-semibold text-neutral-950">
                        {selectedProduct.name}
                      </h3>

                      {selectedProduct.brand && (
                        <p className="mt-1 text-sm text-neutral-500">
                          {selectedProduct.brand}
                        </p>
                      )}

                      <p className="mt-3 text-lg font-semibold text-neutral-950">
                        ₹
                        {Number(
                          selectedProduct.price || 0
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-neutral-200 bg-white px-4 py-3">
                    <p className="text-xs text-neutral-500">
                      This product is locked for your current try-on.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={!image || loading}
                    onClick={handleAnalyze}
                    className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400"
                  >
                    <Sparkles className="h-4 w-4" />

                    {image
                      ? `Try On ${selectedProduct.name}`
                      : "Upload Your Photo to Continue"}
                  </button>
                </>
              ) : (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                  <p className="text-sm font-medium text-red-700">
                    No product selected.
                  </p>

                  <p className="mt-2 text-xs leading-5 text-red-600">
                    Please go back to a product and click the Try On
                    button.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/products")}
                    className="mt-5 rounded-full bg-black px-5 py-2.5 text-xs font-semibold text-white"
                  >
                    Browse Products
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-neutral-200 pt-8">
          <div className="grid gap-6 sm:grid-cols-3">
            <TryOnStep
              number="01"
              icon={Upload}
              title="Upload"
              description="Add a clear photo of yourself."
            />

            <TryOnStep
              number="02"
              icon={Sparkles}
              title="AI Analysis"
              description="Your photo and selected product are sent to the AI service."
            />

            <TryOnStep
              number="03"
              icon={Camera}
              title="Try On"
              description="Review your AI-generated try-on result."
            />
          </div>
        </div>

        {session && (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />

              <span>
                Try-on session created successfully.
              </span>
            </div>

            {session.status && (
              <p className="mt-1 text-xs text-green-600">
                Session status:{" "}
                {String(session.status)
                  .replaceAll("_", " ")
                  .toUpperCase()}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function TryOnStep({
  number,
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-950 text-white">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
          {number}
        </p>

        <h3 className="mt-1 text-sm font-semibold">
          {title}
        </h3>

        <p className="mt-1 text-xs leading-5 text-neutral-500">
          {description}
        </p>
      </div>
    </div>
  );
}

export default TryOn;