import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Sparkles,
  XCircle,
} from "lucide-react";

import { getThreeDTryOnSession } from "../services/threeDTryOnService";
import ThreeDViewer from "../components/ThreeDViewer";

function ThreeDTryOn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sessionId = searchParams.get("id");

  const [session, setSession] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(sessionId));

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    let cancelled = false;
    let timeoutId;

    const poll = async () => {
      try {
        const response =
          await getThreeDTryOnSession(sessionId);

        if (cancelled) {
          return;
        }

        const currentSession = response?.session;

        if (!currentSession) {
          throw new Error(
            "Invalid 3D try-on session response.",
          );
        }

        setSession(currentSession);

        if (currentSession.status === "completed") {
          setLoading(false);
          return;
        }

        if (currentSession.status === "failed") {
          setLoading(false);

          setError(
            currentSession.errorMessage ||
              "3D try-on could not be completed.",
          );

          return;
        }

        timeoutId = setTimeout(poll, 3000);
      } catch (err) {
        if (cancelled) {
          return;
        }

        setLoading(false);

        setError(
          err.response?.data?.error?.message ||
            err.response?.data?.message ||
            err.message ||
            "Unable to load 3D try-on session.",
        );
      }
    };

    poll();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [sessionId]);

  const status = session?.status || "pending";

  const statusLabel = {
    pending: "Waiting",
    processing: "Processing",
    fitting: "Fitting garment",
    completed: "Completed",
    failed: "Failed",
  }[status];

  const resultUrl =
    session?.threeDResultReference ||
    session?.result3DReference ||
    session?.resultAssetUrl ||
    "";

  if (!sessionId) {
    return (
      <section className="min-h-screen bg-neutral-50">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4">
          <div className="w-full rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <XCircle className="mx-auto h-10 w-10 text-red-500" />

            <h2 className="mt-4 text-lg font-semibold text-red-900">
              3D Try-On Session Missing
            </h2>

            <p className="mt-2 text-sm leading-6 text-red-700">
              A valid 3D try-on session ID is required.
            </p>

            <button
              type="button"
              onClick={() => navigate("/try-on")}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-black px-5 text-sm font-semibold text-white"
            >
              <RotateCcw className="h-4 w-4" />
              Start Try-On
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-neutral-50">
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/try-on"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Try-On
          </Link>

          <div className="mt-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-600">
                Raritone 3D Studio
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              Your 3D Try-On
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              Inspect the fitted garment from every angle.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {error ? (
          <div className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <XCircle className="mx-auto h-10 w-10 text-red-500" />

            <h2 className="mt-4 text-lg font-semibold text-red-900">
              3D Try-On Failed
            </h2>

            <p className="mt-2 text-sm leading-6 text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() => navigate("/try-on")}
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-black px-5 text-sm font-semibold text-white"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        ) : !session || loading ? (
          <div className="mx-auto max-w-xl rounded-3xl border border-neutral-200 bg-white p-10 text-center">
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-neutral-700" />

            <h2 className="mt-5 text-lg font-semibold">
              {statusLabel || "Preparing your 3D try-on"}
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              Please wait while your 3D experience is being
              prepared.
            </p>

            <div className="mx-auto mt-6 max-w-sm overflow-hidden rounded-full bg-neutral-100">
              <div className="h-1.5 w-1/2 animate-pulse rounded-full bg-black" />
            </div>
          </div>
        ) : status === "completed" && resultUrl ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white">
              <div className="border-b border-neutral-200 px-5 py-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />

                  <span className="text-sm font-semibold">
                    3D Try-On Ready
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <ThreeDViewer url={resultUrl} />
              </div>
            </div>

            <aside className="h-fit rounded-3xl border border-neutral-200 bg-white p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                Session
              </p>

              <h2 className="mt-2 text-lg font-semibold">
                {session.productId?.name ||
                  session.product?.name ||
                  "3D Try-On"}
              </h2>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs text-neutral-400">
                    Status
                  </p>

                  <p className="mt-1 text-sm font-medium capitalize">
                    {status}
                  </p>
                </div>

                {session.threeDModelVersion && (
                  <div>
                    <p className="text-xs text-neutral-400">
                      Model Version
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {session.threeDModelVersion}
                    </p>
                  </div>
                )}

                {session.processingTime != null && (
                  <div>
                    <p className="text-xs text-neutral-400">
                      Processing Time
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {Number(
                        session.processingTime,
                      ).toFixed(2)}
                      s
                    </p>
                  </div>
                )}
              </div>

              <Link
                to="/try-on"
                className="mt-8 flex h-11 items-center justify-center rounded-full bg-black text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                Start Another Try-On
              </Link>
            </aside>
          </div>
        ) : (
          <div className="mx-auto max-w-xl rounded-3xl border border-neutral-200 bg-white p-10 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-neutral-600" />

            <h2 className="mt-4 text-lg font-semibold">
              {statusLabel}
            </h2>

            <p className="mt-2 text-sm text-neutral-500">
              Your 3D try-on is still being prepared.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ThreeDTryOn;