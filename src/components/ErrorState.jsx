import {
  AlertCircle,
  RefreshCw,
  Upload,
} from "lucide-react";

function ErrorState({
  message,
  code,
  onRetry,
  onUploadNewPhoto,
  retrying = false,
}) {
  const getTitle = () => {
    switch (code) {
      case "AI_SERVICE_UNAVAILABLE":
        return "AI service unavailable";

      case "AI_TIMEOUT":
        return "Try-on timed out";

      case "AI_INVALID_RESPONSE":
        return "Invalid AI response";

      case "RETRY_LIMIT_REACHED":
        return "Retry limit reached";

      case "INVALID_IMAGE":
        return "Invalid image";

      case "TRYON_FAILED":
        return "Try-on failed";

      default:
        return "Try-on failed";
    }
  };

  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
        <AlertCircle className="h-6 w-6 text-red-500" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-neutral-900">
        {getTitle()}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-neutral-600">
        {message ||
          "We couldn't generate your virtual try-on. Please try again."}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {onRetry && code !== "RETRY_LIMIT_REACHED" && (
          <button
            type="button"
            onClick={onRetry}
            disabled={retrying}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                retrying ? "animate-spin" : ""
              }`}
            />

            {retrying
              ? "Retrying..."
              : "Try Again"}
          </button>
        )}

        {onUploadNewPhoto && (
          <button
            type="button"
            onClick={onUploadNewPhoto}
            disabled={retrying}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />

            Upload New Photo
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorState;