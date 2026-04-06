"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const [show, setShow] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string>("");

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (open) {
      timeout = setTimeout(() => setShow(true), 10);
    } else {
      setTimeout(() => {
        setShow(false);
        // Reset state on close
        setPhone("");
        setOtp("");
        setOtpSent(false);
        setErrMsg("");
      }, 0);
    }
    return () => clearTimeout(timeout);
  }, [open]);

  const handleSendOtp = async (): Promise<void> => {
    setErrMsg("");
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone) return setErrMsg("Phone Number is required.");
    
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      phone: `+${cleanPhone}`,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      setErrMsg(error.message);
      return;
    }

    toast.success("OTP sent successfully!");
    setOtpSent(true);
  };

  const handleVerifyOtp = async (): Promise<void> => {
    setErrMsg("");
    if (!otp.trim()) return setErrMsg("OTP is required.");

    setLoading(true);

    const { data, error } = await supabase.auth.verifyOtp({
      phone: `+${phone}`,
      token: otp,
      type: "sms",
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      setErrMsg(error.message);
      return;
    }

    toast.success("Login successful!");

    if (data?.session) {
      localStorage.setItem("auth-token", data.session.access_token);
      window.dispatchEvent(new Event("auth-change"));
    }

    if (data?.user) {
      localStorage.setItem("userId", data.user.id);
    }

    onClose();
  };

  return (
    <>
      {open && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4
          bg-black/40 backdrop-blur-sm transition-opacity duration-300
          ${show ? "opacity-100" : "opacity-0"}`}
        >
          <div
            className={`relative bg-white z-60 w-full max-w-md p-8 rounded-2xl shadow-lg border
            transition-all duration-300
            ${
              show
                ? "scale-100 translate-y-0 opacity-100"
                : "scale-75 translate-y-5 opacity-0"
            }`}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-center text-3xl font-semibold text-black">
              Login
            </h2>

            <p className="text-center text-gray-500 text-sm mb-6">
              {otpSent
                ? "Enter the OTP sent to your phone"
                : "Login to continue to our website"}
            </p>

            {errMsg && (
              <p className="text-red-600 text-sm mb-3 text-center">
                {errMsg}
              </p>
            )}

            {!otpSent ? (
              <div>
                <div className="mb-4">
                  <label className="font-semibold text-black text-sm mb-1 block">
                    Mobile No *
                  </label>
                  <PhoneInput
                    country={"in"}
                    value={phone}
                    onChange={(value: string) => setPhone(value)}
                    inputStyle={{ width: '100%'}}
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    disabled={loading}
                    onClick={handleSendOtp}
                    className="w-full max-w-[264px] bg-[#C41E3A] hover:bg-red-700 text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2 transition-colors"
                  >
                    {loading && (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    )}
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-black mb-1">
                    OTP *
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setOtp(e.target.value)
                    }
                    placeholder="Enter OTP"
                    className="w-full text-black border border-gray-300 rounded-lg px-4 py-3 focus:border-red-500 outline-none"
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    disabled={loading}
                    onClick={handleVerifyOtp}
                    className="w-full max-w-[264px] bg-[#C41E3A] hover:bg-red-700 text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2 transition-colors"
                  >
                    {loading && (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    )}
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
                <div className="text-center text-sm text-gray-500 mt-4">
                  Didn&apos;t receive OTP?{" "}
                  <button
                    onClick={() => setOtpSent(false)}
                    className="text-[#C41E3A] hover:underline"
                  >
                    Resend
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}