import { useEffect, useRef, useState } from "react";
import { Camera, ImagePlus, Upload, X, ShieldCheck } from "lucide-react";

import {
  validateImageFile,
  validateImageDimensions,
} from "../utils/imageValidation";

function ImageUploader({ onImageSelected, disabled = false }) {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraOpen, setCameraOpen] = useState(false);

  const [cameraError, setCameraError] = useState("");

  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file) => {
    if (!file) {
      setCameraError("Please select an image.");

      return false;
    }

    const basicValidation = validateImageFile(file);

    if (!basicValidation.valid) {
      setCameraError(basicValidation.message);

      return false;
    }

    const dimensionValidation = await validateImageDimensions(file);

    if (!dimensionValidation.valid) {
      setCameraError(dimensionValidation.message);

      return false;
    }

    setCameraError("");

    onImageSelected(file);

    return true;
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (file) {
      await handleFile(file);
    }

    event.target.value = "";
  };

  const openFilePicker = () => {
    if (disabled) return;

    fileInputRef.current?.click();
  };

  const handleDragOver = (event) => {
    event.preventDefault();

    if (!disabled) {
      setDragActive(true);
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();

    setDragActive(false);
  };

  const handleDrop = async (event) => {
    event.preventDefault();

    setDragActive(false);

    if (disabled) return;

    const file = event.dataTransfer.files?.[0];

    if (file) {
      await handleFile(file);
    }
  };

  const openCamera = async () => {
    if (disabled) return;

    setCameraError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera access is not supported by this browser.");

      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",

          width: {
            ideal: 1280,
          },

          height: {
            ideal: 720,
          },
        },

        audio: false,
      });

      streamRef.current = stream;

      setCameraOpen(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          videoRef.current.play().catch((error) => {
            console.error("Video play error:", error);
          });
        }
      }, 100);
    } catch (error) {
      console.error("Camera access error:", error);

      if (error.name === "NotAllowedError") {
        setCameraError(
          "Camera permission was denied. Please allow camera access in your browser.",
        );
      } else if (error.name === "NotFoundError") {
        setCameraError("No camera was found on this device.");
      } else if (error.name === "NotReadableError") {
        setCameraError(
          "Your camera is already being used by another application.",
        );
      } else {
        setCameraError(
          "Unable to access the camera. Please check your browser permissions.",
        );
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOpen(false);
  };

  const capturePhoto = async () => {
    const video = videoRef.current;

    if (!video) {
      setCameraError("Camera is not ready yet. Please wait a moment.");

      return;
    }

    if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      setCameraError("Camera is still loading. Please try again.");

      return;
    }

    if (!video.videoWidth || !video.videoHeight) {
      setCameraError("Camera dimensions are unavailable. Please try again.");

      return;
    }

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;

    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      setCameraError("Unable to capture camera image.");

      return;
    }

    context.translate(canvas.width, 0);

    context.scale(-1, 1);

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          setCameraError("Unable to create image from camera.");

          return;
        }

        const file = new File([blob], `raritone-camera-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        const valid = await handleFile(file);

        if (valid) {
          stopCamera();
        }
      },
      "image/jpeg",
      0.92,
    );
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });

        streamRef.current = null;
      }
    };
  }, []);

  if (cameraOpen) {
    return (
      <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-950">
        {/* Camera Header */}

        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
              <Camera className="h-4 w-4 text-white" />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
                Camera
              </p>

              <h3 className="mt-0.5 text-sm font-medium text-white">
                Capture your photo
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={stopCamera}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close camera"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Camera */}

        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-900 sm:aspect-[3/4]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />

          {/* Body Guide */}

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative h-[75%] w-[62%] rounded-[45%] border border-white/50">
              <span className="absolute -left-px -top-px h-8 w-8 rounded-tl-2xl border-l-2 border-t-2 border-white" />

              <span className="absolute -right-px -top-px h-8 w-8 rounded-tr-2xl border-r-2 border-t-2 border-white" />

              <span className="absolute -bottom-px -left-px h-8 w-8 rounded-bl-2xl border-b-2 border-l-2 border-white" />

              <span className="absolute -bottom-px -right-px h-8 w-8 rounded-br-2xl border-b-2 border-r-2 border-white" />
            </div>
          </div>

          {/* Hint */}

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-center text-[11px] text-white/80 backdrop-blur-md">
            Stand in good lighting and keep your full body visible
          </div>
        </div>

        {/* Camera Error */}

        {cameraError && (
          <div className="mx-5 mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-xs text-red-300">
            {cameraError}
          </div>
        )}

        {/* Actions */}

        <div className="flex items-center justify-center gap-3 px-5 py-5">
          <button
            type="button"
            onClick={stopCamera}
            className="h-11 rounded-full border border-white/15 px-5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={capturePhoto}
            className="group flex h-12 items-center gap-3 rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:scale-[1.02] hover:bg-neutral-100"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
              <Camera className="h-3.5 w-3.5" />
            </span>
            Capture Photo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFilePicker}
        className={`
          group relative cursor-pointer overflow-hidden rounded-3xl
          border transition-all duration-300
          ${
            dragActive
              ? "border-black bg-neutral-100"
              : "border-neutral-200 bg-neutral-50 hover:border-neutral-400 hover:bg-white"
          }
          ${disabled ? "pointer-events-none opacity-50" : ""}
        `}
      >
        {/* Decorative Background */}

        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-neutral-200/60 blur-3xl transition duration-500 group-hover:bg-neutral-300/60" />

        <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-neutral-200/60 blur-3xl" />

        <div className="relative flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">
          {/* Icon */}

          <div
            className={`
              relative flex h-20 w-20 items-center justify-center
              rounded-[28px] bg-white shadow-sm ring-1 ring-neutral-200
              transition duration-300
              group-hover:-translate-y-1 group-hover:shadow-lg
              ${dragActive ? "scale-105" : ""}
            `}
          >
            <div className="absolute inset-2 rounded-[22px] bg-neutral-950" />

            {dragActive ? (
              <Upload className="relative h-7 w-7 text-white" />
            ) : (
              <ImagePlus className="relative h-7 w-7 text-white" />
            )}
          </div>

          {/* Text */}

          <div className="mt-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
              {dragActive ? "Drop your photo" : "Your photo"}
            </p>

            <h3 className="mt-2 text-xl font-semibold tracking-tight text-neutral-950">
              {dragActive ? "Release to upload" : "Upload a full-body photo"}
            </h3>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-neutral-500">
              Choose a clear photo or drag one here. Good lighting and a visible
              full body give better results.
            </p>
          </div>

          {/* File Info */}

          <div className="mt-6 flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />

            <span className="text-[10px] font-medium text-neutral-500">
              JPG · JPEG · PNG · WEBP
            </span>

            <span className="text-neutral-300">•</span>

            <span className="text-[10px] font-medium text-neutral-500">
              Max 10MB
            </span>
          </div>

          {/* Input */}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={disabled}
            hidden
          />
        </div>
      </div>

      {/* Actions */}

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={openFilePicker}
          disabled={disabled}
          className="group flex h-12 items-center justify-center gap-2 rounded-2xl bg-black px-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Upload className="h-4 w-4 transition group-hover:-translate-y-0.5" />
          Upload Photo
        </button>

        <button
          type="button"
          onClick={openCamera}
          disabled={disabled}
          className="group flex h-12 items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Camera className="h-4 w-4 transition group-hover:scale-110" />
          Use Camera
        </button>
      </div>

      {/* Trust */}

      <div className="flex items-center justify-center gap-2 pt-1 text-[10px] text-neutral-400">
        <ShieldCheck className="h-3.5 w-3.5" />

        <span>Your photo is securely processed for the try-on experience.</span>
      </div>

      {/* Error */}

      {cameraError && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          <X className="mt-0.5 h-4 w-4 shrink-0" />

          <p className="text-xs leading-5">{cameraError}</p>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
