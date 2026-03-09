"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import OrderPanel from "@/components/order/OrderPanel";

export default function HeroSection() {
  const [showOrder, setShowOrder] = useState(false);

  return (
    <section
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{
        minHeight: "100vh",
        background: [
          "linear-gradient(180deg, rgba(237,2,19,0) 0%, rgba(237,2,19,0.4) 100%)",
          "url('/images/hero-bg.png') center / cover no-repeat",
        ].join(", "),
        backgroundColor: "#2d0a0a",
      }}
    >
      {/* Navbar sits inside hero — scrolls away with page */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* WhatsApp button — fixed to viewport, only in hero section context */}
      <WhatsAppButton />
      {/* Radial red glow — centered, matches Figma Ellipse 1233 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div
          style={{
            width: "min(854px, 56.5vw)",
            height: "min(407px, 27vw)",
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(237,2,19,0.4) 0%, rgba(237,2,19,0) 100%)",
          }}
        />
      </div>

      {/* Main content — Frame 1437253420 */}
      <div
        className="relative z-10 flex flex-col items-center text-center"
        style={{
          gap: "clamp(40px, 4vw, 56px)",
          width: "min(1008px, 90vw)",
          padding: "0 16px",
        }}
      >
        {/* Text stack — Frame 1437253436 */}
        <div
          className="flex flex-col items-center w-full"
          style={{ gap: "14px" }}
        >
          {/* Headline */}
          <h1
            className="text-white font-semibold m-0"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(1.8rem, 4.23vw, 63.91px)",
              lineHeight: "clamp(2.5rem, 4.5vw, 1.25)",
            }}
          >
            Outsource Your Qurbani with Complete Shariah Compliance &amp; Full
            Transparency
          </h1>

          {/* Subtitle */}
          <p
            className="text-white m-0"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontSize: "clamp(1.1rem, 1.47vw, 22.22px)",
              lineHeight: "1.5",
              maxWidth: "min(900px, 93vw)",
            }}
          >
            From animal selection to sacrifice and distribution among the needy
            &mdash; we handle your Qurbani with dignity, accountability, and
            strict adherence to Islamic principles.
          </p>
        </div>

        {/* CTA button — Component 29 */}
        <button
          type="button"
          onClick={() => setShowOrder(true)}
          className="inline-flex items-center bg-white rounded-full"
          style={{
            padding: "clamp(4px,0.4vw,5px) clamp(5px,0.5vw,7px) clamp(4px,0.4vw,5px) clamp(14px,1.5vw,21px)",
            gap: "clamp(16px,1.8vw,24px)",
            border: "none",
            cursor: "pointer",
            height: "clamp(48px,4.5vw,56px)",
          }}
        >
          <span
            className="font-medium text-black whitespace-nowrap"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "clamp(14px,1.3vw,20px)",
              lineHeight: "1.2",
            }}
          >
            Book Qurbani Now
          </span>

          {/* Arrow circle */}
          <span
            className="flex items-center justify-center rounded-full bg-black flex-shrink-0"
            style={{
              width: "clamp(36px,3.5vw,46px)",
              height: "clamp(36px,3.5vw,46px)",
            }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3.5 13.5L13.5 3.5M13.5 3.5H6.5M13.5 3.5V10.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </div>

      {/* Order Panel overlay */}
      <OrderPanel isOpen={showOrder} onClose={() => setShowOrder(false)} />
    </section>
  );
}
