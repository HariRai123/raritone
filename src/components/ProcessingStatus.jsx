import {
  Check,
  LoaderCircle,
  Sparkles,
  Upload,
} from "lucide-react";

function ProcessingStatus({ status }) {
  const steps = [
    {
      key: "uploading",
      label: "Photo uploaded",
      description: "Uploading your photo securely.",
      icon: Upload,
    },
    {
      key: "pending",
      label: "Request queued",
      description: "Your try-on request is waiting for processing.",
      icon: Check,
    },
    {
      key: "processing",
      label: "Generating result",
      description: "AI is generating your virtual try-on.",
      icon: Sparkles,
    },
  ];

  const statusOrder = {
    idle: 0,
    uploading: 1,
    pending: 2,
    processing: 3,
    completed: 4,
    failed: 4,
  };

  const currentOrder =
    statusOrder[status] ?? 0;

  return (
    <div className="flex min-h-[450px] flex-col justify-center rounded-2xl bg-neutral-50 p-8">
      <div className="mx-auto w-full max-w-md">

        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
            <LoaderCircle className="h-6 w-6 animate-spin text-neutral-700" />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-neutral-900">
            {status === "uploading" &&
              "Uploading your photo..."}

            {status === "pending" &&
              "Preparing your try-on..."}

            {status === "processing" &&
              "AI is generating your try-on..."}
          </h3>

          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Please keep this tab open while your
            virtual try-on is being processed.
          </p>
        </div>

        <div className="space-y-3">
          {steps.map((step) => {
            const Icon = step.icon;

            const stepOrder =
              statusOrder[step.key];

            const completed =
              currentOrder > stepOrder;

            const active =
              status === step.key;

            return (
              <div
                key={step.key}
                className={`flex items-center gap-4 rounded-xl border p-4 transition ${
                  active
                    ? "border-neutral-300 bg-white"
                    : completed
                      ? "border-green-200 bg-green-50"
                      : "border-neutral-200 bg-white/60"
                }`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    completed
                      ? "bg-green-100 text-green-700"
                      : active
                        ? "bg-neutral-950 text-white"
                        : "bg-neutral-100 text-neutral-400"
                  }`}
                >
                  {completed ? (
                    <Check className="h-4 w-4" />
                  ) : active ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-neutral-800">
                    {step.label}
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default ProcessingStatus;