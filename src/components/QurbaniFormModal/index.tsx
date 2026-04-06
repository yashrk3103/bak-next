"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";

const STORAGE_KEYS = {
  SUBMITTED: "qurbani_form_submitted_at",
  DISMISSED: "qurbani_form_dismissed_at",
};

const TIMINGS = {
  INITIAL_DELAY: 10_000,       // 10 seconds
  SCROLL_THRESHOLD: 0.5,       // 50% scroll
  SUPPRESS_24H: 24 * 60 * 60 * 1000, // 24 hours
};

export default function QurbaniFormModal() {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const hasTriggered = useRef(false);

  /* ---- Field-level error states ---- */
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  /* ---- Should we suppress the modal entirely? ---- */
  const isSuppressed = useCallback(() => {
    const submittedAt = localStorage.getItem(STORAGE_KEYS.SUBMITTED);
    if (submittedAt) {
      const elapsed = Date.now() - Number(submittedAt);
      if (elapsed < TIMINGS.SUPPRESS_24H) return true;
    }
    const dismissedAt = localStorage.getItem(STORAGE_KEYS.DISMISSED);
    if (dismissedAt) {
      const elapsed = Date.now() - Number(dismissedAt);
      if (elapsed < TIMINGS.SUPPRESS_24H) return true;
    }
    return false;
  }, []);

  /* ---- Show modal (with guard) ---- */
  const showModal = useCallback(() => {
    if (isSuppressed()) return;
    setVisible(true);
  }, [isSuppressed]);

  /* ---- Initial triggers: 10s timer + 50% scroll ---- */
  useEffect(() => {
    if (isSuppressed()) return;

    // 10-second timer
    const timer = setTimeout(() => {
      if (!hasTriggered.current) {
        hasTriggered.current = true;
        showModal();
      }
    }, TIMINGS.INITIAL_DELAY);

    // 50% scroll
    const handleScroll = () => {
      const scrollPercent =
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPercent >= TIMINGS.SCROLL_THRESHOLD && !hasTriggered.current) {
        hasTriggered.current = true;
        showModal();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isSuppressed, showModal]);

  /* ---- Exit intent: cursor leaves viewport ---- */
  useEffect(() => {
    if (isSuppressed()) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !visible) {
        showModal();
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [visible, isSuppressed, showModal]);

  /* ---- Close handler: suppress for 24 hours ---- */
  const handleClose = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEYS.DISMISSED, String(Date.now()));
  };

  /* ---- Validation helpers ---- */
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  /* ---- Clear field error on change ---- */
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (nameError) setNameError("");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
  };

  /* ---- Submit handler ---- */
  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    let hasError = false;

    // Name validation
    if (!trimmedName) {
      setNameError("Please enter your full name");
      hasError = true;
    } else {
      setNameError("");
    }

    // Email validation
    if (!trimmedEmail) {
      setEmailError("Please enter your email address");
      hasError = true;
    } else if (!validateEmail(trimmedEmail)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (hasError) return;

    setLoading(true);

    const { error } = await supabase.rpc("add_interested_user_email", {
      p_email: trimmedEmail,
      p_name: trimmedName,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
      return;
    }

    toast.success("Thank you for your interest!");
    localStorage.setItem(STORAGE_KEYS.SUBMITTED, String(Date.now()));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">

      {/* Modal Card */}
      <div className="w-full max-w-md bg-[#f3f3f3] rounded-3xl shadow-xl overflow-hidden">

        {/* Top Images */}
        <div className="grid grid-cols-2 gap-2 p-3 relative">
          <Image
                      draggable={false}

src="/images/qurbani_1.png"
            alt="qurbani"
            width={200}
            height={112}
            className="w-full h-28 object-cover rounded-xl"
          />
          <Image
                      draggable={false}

src="/images/qurbani_2.png"
            alt="qurbani"
            width={200}
            height={112}
            className="w-full h-28 object-cover rounded-xl"
          />

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 bg-white/80 hover:bg-white w-7 h-7 rounded-full flex items-center justify-center shadow"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pb-6">

          {/* Heading */}
          <h2 className="text-xl md:text-2xl font-bold text-red-600 leading-snug">
            Your Qurbani can feed a Family/Madrasa this Eid.
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-sm mt-2 leading-relaxed">
            Sign up to ensure your sacrifice reaches the needy/Madrasa - with
            full transparency and step by step tracking.
          </p>

          {/* Form */}
          <div className="mt-5 space-y-4">

            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                maxLength={30}
                value={name}
                onChange={handleNameChange}
                placeholder="Enter your name"
                className={`mt-1 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 ${
                  nameError
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-red-400"
                }`}
              />
              {nameError && (
                <p className="text-red-600 text-xs mt-1">{nameError}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email address"
                className={`mt-1 w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 ${
                  emailError
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-red-400"
                }`}
              />
              {emailError && (
                <p className="text-red-600 text-xs mt-1">{emailError}</p>
              )}
            </div>

            {/* Mobile Number */}
          </div>

          {/* Info Box */}
          <div className="mt-5 flex items-start gap-3 bg-yellow-100 text-yellow-800 text-xs p-3 rounded-xl">
            <div className="w-10 h-5 flex items-center justify-center bg-yellow-500 text-white rounded-full text-xs font-bold">
              i
            </div>
            <p>
              No spam. Only essential Qurbani updates and early booking alerts.
              (just a line to give a sense of no-spam security)
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-5 w-full py-3 rounded-full text-white font-semibold bg-gradient-to-r from-red-500 to-red-700 hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "I Want to Help"}
          </button>
        </div>
      </div>
    </div>
  );
}
