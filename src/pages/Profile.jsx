import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  Check,
  Clock3,
  Crown,
  Edit3,
  Image as ImageIcon,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { getProfile } from "../services/authService";
import { getMyTryOnResults } from "../services/tryOnService.js"

function Profile() {
  const { user, updateUserProfile } = useAuth();

  const [profile, setProfile] = useState(user);

  const [name, setName] = useState(user?.name || "");

  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState(
    user?.profileImage || "",
  );

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [tryOnResults, setTryOnResults] = useState([]);

  const [tryOnLoading, setTryOnLoading] = useState(true);

  const [tryOnError, setTryOnError] = useState("");

  const fileRef = useRef(null);

  /* =========================================================
     LOAD PROFILE
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);

        const data = await getProfile();

        if (!mounted) return;

        setProfile(data?.user || null);
        setName(data?.user?.name || "");
        setPreview(data?.user?.profileImage || "");
      } catch (err) {
        console.error("PROFILE ERROR:", err);

        if (mounted) {
          setError(
            err.response?.data?.message ||
              "Unable to load profile.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     LOAD TRY-ON HISTORY
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const loadTryOnResults = async () => {
      try {
        setTryOnLoading(true);
        setTryOnError("");

        const data = await getMyTryOnResults();

        if (!mounted) return;

        setTryOnResults(
          Array.isArray(data?.results)
            ? data.results
            : [],
        );
      } catch (err) {
        console.error(
          "TRY-ON HISTORY ERROR:",
          err,
        );

        if (mounted) {
          setTryOnResults([]);

          setTryOnError(
            err.response?.data?.message ||
              "Unable to load Try-On history.",
          );
        }
      } finally {
        if (mounted) {
          setTryOnLoading(false);
        }
      }
    };

    loadTryOnResults();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     CLEANUP PREVIEW
  ========================================================= */

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  /* =========================================================
     IMAGE CHANGE
  ========================================================= */

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Profile image must be 5MB or smaller.",
      );
      return;
    }

    setError("");

    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setImage(file);

    setPreview(URL.createObjectURL(file));
  };

  /* =========================================================
     UPDATE PROFILE
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("name", name.trim());

      if (image) {
        formData.append("profileImage", image);
      }

      const data =
        await updateUserProfile(formData);

      setProfile(data?.user || null);

      setName(data?.user?.name || "");

      setPreview(
        data?.user?.profileImage || "",
      );

      setImage(null);

      setMessage(
        "Profile updated successfully.",
      );

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    } catch (err) {
      console.error(
        "UPDATE PROFILE ERROR:",
        err,
      );

      setError(
        err.response?.data?.message ||
          "Unable to update profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     HELPERS
  ========================================================= */

  const formatDate = (date) => {
    if (!date) return "--";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "--";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
    );
  };

  const formatProcessingTime = (time) => {
    if (
      time === null ||
      time === undefined
    ) {
      return "--";
    }

    const number = Number(time);

    if (Number.isNaN(number)) {
      return "--";
    }

    return `${number.toFixed(3)}s`;
  };

  const formatMeasurement = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "--";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return "--";
    }

    return number.toFixed(4);
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <section className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="animate-pulse">

            <div className="h-3 w-28 rounded bg-neutral-200" />

            <div className="mt-3 h-9 w-56 rounded-lg bg-neutral-200" />

            <div className="mt-3 h-4 w-80 max-w-full rounded bg-neutral-200" />

          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[280px_1fr]">

            <div className="h-80 rounded-3xl bg-neutral-200 animate-pulse" />

            <div className="h-80 rounded-3xl bg-neutral-200 animate-pulse" />

          </div>

        </div>

      </section>
    );
  }

  /* =========================================================
     PROFILE
  ========================================================= */

  return (
    <section className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <UserRound className="h-4 w-4 text-neutral-500" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
                Your Account
              </span>

            </div>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              Manage your account and AI try-on activity.
            </p>

          </div>

          {profile?.role === "admin" && (
            <div className="flex flex-wrap gap-2">

              <Link
                to="/admin/products"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-black px-4 text-xs font-semibold text-white transition hover:bg-neutral-800"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin Products
              </Link>

              <Link
                to="/admin/users"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 text-xs font-semibold transition hover:bg-neutral-50"
              >
                Users
              </Link>

              <Link
                to="/admin/orders"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 text-xs font-semibold transition hover:bg-neutral-50"
              >
                Orders
              </Link>

            </div>
          )}

        </div>

        {/* ===================================================
            PROFILE AREA
        =================================================== */}

        <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">

          {/* =================================================
              PROFILE CARD
          ================================================= */}

          <aside className="overflow-hidden rounded-3xl border border-neutral-200 bg-white">

            <div className="h-24 bg-neutral-950" />

            <div className="-mt-12 px-6 pb-6">

              <div className="relative inline-block">

                {preview ? (
                  <img
                    src={preview}
                    alt={
                      profile?.name ||
                      "Profile"
                    }
                    className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-lg"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-neutral-100 text-3xl font-semibold shadow-lg">
                    {(
                      profile?.name ||
                      "U"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-black text-white">
                  <Camera className="h-3.5 w-3.5" />
                </div>

              </div>

              <div className="mt-5">

                <div className="flex items-center gap-2">

                  <h2 className="text-xl font-semibold">
                    {profile?.name ||
                      "User"}
                  </h2>

                  {profile?.role ===
                    "admin" && (
                    <Crown className="h-4 w-4 text-neutral-500" />
                  )}

                </div>

                <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
                  <Mail className="h-3.5 w-3.5" />
                  {profile?.email || ""}
                </p>

                <div className="mt-4 flex items-center gap-2">

                  <span className="rounded-full bg-neutral-950 px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-white">
                    {profile?.role ||
                      "user"}
                  </span>

                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-[9px] font-semibold text-neutral-500">
                    Raritone Member
                  </span>

                </div>

              </div>

              {/* Quick Links */}

              <div className="mt-7 space-y-2 border-t border-neutral-100 pt-5">

                <Link
                  to="/orders"
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm transition hover:bg-neutral-50"
                >
                  <span>My Orders</span>
                  <span>→</span>
                </Link>

                <Link
                  to="/wishlist"
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm transition hover:bg-neutral-50"
                >
                  <span>Wishlist</span>
                  <span>→</span>
                </Link>

                <Link
                  to="/try-on"
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm transition hover:bg-neutral-50"
                >
                  <span>Try-On Studio</span>
                  <Sparkles className="h-4 w-4" />
                </Link>

              </div>

            </div>

          </aside>

          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">

            <div className="flex items-start justify-between gap-4">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Account Settings
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Keep your account information up to date.
                </p>

              </div>

              <Edit3 className="h-5 w-5 text-neutral-300" />

            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5"
            >

              {message && (
                <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm">

                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
                    <Check className="h-3.5 w-3.5" />
                  </div>

                  <span>
                    {message}
                  </span>

                </div>
              )}

              {error && (
                <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">

                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100">
                    <X className="h-3.5 w-3.5" />
                  </div>

                  <span>
                    {error}
                  </span>

                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">

                <div>

                  <label
                    htmlFor="profile-name"
                    className="mb-2 block text-xs font-semibold"
                  >
                    Full Name
                  </label>

                  <input
                    id="profile-name"
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value,
                      )
                    }
                    className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-neutral-100"
                    required
                  />

                </div>

                <div>

                  <label
                    htmlFor="profile-email"
                    className="mb-2 block text-xs font-semibold"
                  >
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                    <input
                      id="profile-email"
                      value={
                        profile?.email ||
                        ""
                      }
                      disabled
                      className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-sm text-neutral-500 outline-none"
                    />

                  </div>

                </div>

              </div>

              {/* Image Upload */}

              <div>

                <label
                  htmlFor="profile-image"
                  className="mb-2 block text-xs font-semibold"
                >
                  Profile Picture
                </label>

                <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-4 sm:flex-row sm:items-center">

                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">

                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-neutral-300" />
                    )}

                  </div>

                  <div className="flex-1">

                    <p className="text-sm font-medium">
                      Change profile picture
                    </p>

                    <p className="mt-1 text-xs text-neutral-400">
                      PNG, JPG or WebP · Maximum 5MB
                    </p>

                    <input
                      ref={fileRef}
                      id="profile-image"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={
                        handleImageChange
                      }
                      className="mt-3 block w-full text-xs text-neutral-500 file:mr-3 file:rounded-full file:border-0 file:bg-black file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-neutral-800"
                    />

                  </div>

                </div>

              </div>

              <div className="flex justify-end border-t border-neutral-100 pt-5">

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Save Changes
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

        {/* ===================================================
            TRY-ON HISTORY
        =================================================== */}

        <div className="mt-8 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <Sparkles className="h-4 w-4 text-neutral-500" />

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  AI Try-On
                </span>

              </div>

              <h2 className="mt-1 text-xl font-semibold">
                Your Try-On Activity
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Your recent AI body-analysis sessions.
              </p>

            </div>

            <Link
              to="/try-on/history"
              className="text-xs font-semibold underline underline-offset-4"
            >
              View All
            </Link>

          </div>

          {/* Loading */}

          {tryOnLoading && (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-2xl bg-neutral-100"
                />
              ))}

            </div>
          )}

          {/* Error */}

          {!tryOnLoading &&
            tryOnError && (
              <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                {tryOnError}
              </div>
            )}

          {/* Empty */}

          {!tryOnLoading &&
            !tryOnError &&
            tryOnResults.length === 0 && (
              <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 px-6 py-14 text-center">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-950 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  No Try-On activity yet
                </h3>

                <p className="mt-2 max-w-sm text-sm text-neutral-500">
                  Start your first AI try-on and
                  your analysis will appear here.
                </p>

                <Link
                  to="/try-on"
                  className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-black px-5 text-xs font-semibold text-white"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Open Try-On Studio
                </Link>

              </div>
            )}

          {/* Results */}

          {!tryOnLoading &&
            tryOnResults.length > 0 && (
              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {tryOnResults
                  .slice(0, 6)
                  .map((item) => {

                    const measurements =
                      item?.bodyMeasurements ||
                      {};

                    const personDetected =
                      Boolean(
                        item.personDetected,
                      );

                    return (
                      <article
                        key={item._id}
                        className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
                      >

                        {/* Image */}

                        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">

                          {item.inputImageReference ? (
                            <img
                              src={
                                item.inputImageReference
                              }
                              alt="Try-On"
                              loading="lazy"
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <ImageIcon className="h-7 w-7 text-neutral-300" />
                            </div>
                          )}

                          <div className="absolute left-3 top-3">

                            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider backdrop-blur">
                              {item.status
                                ?.replaceAll(
                                  "_",
                                  " ",
                                ) ||
                                "Analysis"}
                            </span>

                          </div>

                        </div>

                        {/* Content */}

                        <div className="p-4">

                          <div className="flex items-center justify-between">

                            <h3 className="text-sm font-semibold">
                              Body Analysis
                            </h3>

                            <span className="text-[10px] text-neutral-400">
                              {formatDate(
                                item.createdAt,
                              )}
                            </span>

                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2">

                            <div className="rounded-xl bg-neutral-50 p-3">

                              <p className="text-[9px] uppercase tracking-wider text-neutral-400">
                                Shoulder
                              </p>

                              <p className="mt-1 text-xs font-semibold">
                                {formatMeasurement(
                                  measurements.shoulder_width_ratio,
                                )}
                              </p>

                            </div>

                            <div className="rounded-xl bg-neutral-50 p-3">

                              <p className="text-[9px] uppercase tracking-wider text-neutral-400">
                                Hip
                              </p>

                              <p className="mt-1 text-xs font-semibold">
                                {formatMeasurement(
                                  measurements.hip_width_ratio,
                                )}
                              </p>

                            </div>

                          </div>

                          <div className="mt-3 flex items-center justify-between text-[10px] text-neutral-400">

                            <span className="flex items-center gap-1">
                              <Clock3 className="h-3 w-3" />
                              {formatProcessingTime(
                                item.processingTime,
                              )}
                            </span>

                            <span
                              className={
                                personDetected
                                  ? "font-semibold text-neutral-800"
                                  : "font-semibold text-red-500"
                              }
                            >
                              {personDetected
                                ? "Person detected"
                                : "Detection failed"}
                            </span>

                          </div>

                          <Link
                            to={`/try-on/result/${item._id}`}
                            className="mt-4 flex h-9 items-center justify-center rounded-full border border-neutral-200 text-xs font-semibold transition hover:bg-neutral-950 hover:text-white"
                          >
                            View Analysis
                          </Link>

                        </div>

                      </article>
                    );
                  })}

              </div>
            )}

        </div>

      </div>

    </section>
  );
}

export default Profile;