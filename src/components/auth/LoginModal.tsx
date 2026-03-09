"use client";

import { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PHONE_REGEX = /^(\+91[6-9][0-9]{9}|[6-9][0-9]{9})$/;

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [step, setStep] = useState<"phone" | "success">("phone");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isSuccessStep = step === "success";

  if (!isOpen) return null;

  const handleClose = () => {
    setStep("phone");
    setPhone("");
    setError("");
    setLoading(false);
    onClose();
  };

  const handleContinue = async () => {
    const cleaned = phone.trim().replace(/\s|-/g, "");
    if (!PHONE_REGEX.test(cleaned)) {
      setError("Enter a valid Indian mobile number (e.g. 9876543210 or +919876543210).");
      return;
    }

    setPhone(cleaned);
    setError("");
    setLoading(true);
    // Keep the two-step login UI without any OTP or backend dependency.
    window.setTimeout(() => {
      setLoading(false);
      setStep("success");
    }, 250);
  };

  return (
    <>
      {/* Dark overlay */}
      <div
        onClick={handleClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "#0F0707",
          opacity: 0.66,
          zIndex: 1000,
        }}
      />

      {/* Modal card */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1001,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: "32px 24px 28px",
          gap: "24px",
          width: "min(520px, calc(100vw - 24px))",
          maxHeight: "calc(100vh - 24px)",
          overflowY: "auto",
          background: "#FFFFFF",
          boxShadow: "4px 4px 20px rgba(172, 2, 2, 0.4)",
          borderRadius: "32px",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Close"
          style={{
            position: "absolute",
            right: "24px",
            top: "24px",
            width: "24px",
            height: "24px",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M4.21 4.387a.75.75 0 0 1 1.06 0L12 10.939l6.728-6.552a.75.75 0 1 1 1.044 1.079L13.062 12l6.71 6.534a.75.75 0 1 1-1.044 1.079L12 13.061l-6.728 6.552a.75.75 0 0 1-1.044-1.079L11.938 12 5.27 5.466a.75.75 0 0 1-.06-1.079Z"
              fill="#000000"
            />
          </svg>
        </button>

        {/* Content frame */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 0,
            gap: "24px",
            width: "100%",
            paddingTop: "4px",
          }}
        >
          {/* Title */}
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: "36px",
              lineHeight: "1.15",
              textAlign: "center",
              color: "#484C52",
              width: "100%",
              marginTop: 0,
            }}
          >
            Login
          </span>

          {/* Form */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 0,
              gap: "24px",
              width: "100%",
            }}
          >
            {/* Input fields section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                padding: 0,
                gap: "16px",
                width: "100%",
              }}
            >
              {/* Mobile No field */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: 0,
                  gap: "10px",
                  width: "100%",
                }}
              >
                <label
                  style={{
                    fontFamily: "'Fredoka One', cursive",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "125%",
                    color: "#000000",
                    height: "18px",
                  }}
                >
                  Mobile No
                </label>
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    padding: "0 24px",
                    gap: "18px",
                    width: "100%",
                    height: "56px",
                    background: "#FFFFFF",
                    border: "1.8635px solid #D8DADC",
                    borderRadius: "8px",
                    fontFamily: "'Fredoka', cursive",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "125%",
                    color: "rgba(0, 0, 0, 0.6)",
                    outline: "none",
                  }}
                />
              </div>

              {/* Confirmation section — shown in step 2 */}
              {step === "success" && (
                <>
                  <div
                    style={{
                      boxSizing: "border-box",
                      width: "100%",
                      padding: "20px 18px",
                      borderRadius: "16px",
                      background: "#FFF6F6",
                      border: "1px solid #F6CACA",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        fontSize: "20px",
                        lineHeight: "30px",
                        color: "#484C52",
                      }}
                    >
                      Login details saved
                    </span>
                    <p
                      style={{
                        margin: 0,
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 400,
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "#5F5E5E",
                      }}
                    >
                      You can continue using <strong>{phone}</strong> as the login number. {" "}
                      OTP generation has been removed from this flow.
                    </p>
                  </div>

                  <button
                    onClick={() => setStep("phone")}
                    style={{
                      width: "100%",
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 400,
                      fontSize: "13px",
                      lineHeight: "16px",
                      textAlign: "right",
                      letterSpacing: "-0.2px",
                      color: "#949CAB",
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                      padding: 0,
                    }}
                  >
                    Edit mobile number
                  </button>
                </>
              )}

              {/* Error message */}
              {error && (
                <p
                  style={{
                    width: "100%",
                    margin: 0,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "13px",
                    lineHeight: "18px",
                    color: "#D32F2F",
                    textAlign: "left",
                  }}
                >
                  {error}
                </p>
              )}
            </div>

            {/* CTA button */}
            <button
              onClick={step === "phone" ? handleContinue : handleClose}
              disabled={loading}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: "14px 0px",
                gap: "10px",
                width: isSuccessStep ? "264px" : "100%",
                maxWidth: "264px",
                height: "52px",
                background: loading ? "#F87878" : "#ED0213",
                borderRadius: "24px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s",
              }}
            >
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  fontSize: "20px",
                  lineHeight: "30px",
                  letterSpacing: "-0.02em",
                  color: "#FFFFFF",
                }}
              >
                {loading
                  ? "Continuing..."
                  : step === "phone" ? "Continue Login" : "Done"}
              </span>
            </button>

            {/* Terms */}
            <span
              style={{
                width: "100%",
                maxWidth: "352px",
                fontFamily: "'Fredoka', cursive",
                fontWeight: 400,
                fontSize: "15.7276px",
                lineHeight: "19px",
                textAlign: "center",
                letterSpacing: "-0.262127px",
                color: "#5F5E5E",
                display: "block",
                margin: "0 auto",
              }}
            >
              By signing in you agree to our{" "}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#E6A817",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Terms and Conditions
              </a>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
