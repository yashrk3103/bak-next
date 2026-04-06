"use client";

import Link from "next/link";

export default function OrderPanelInfoBox() {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-[#FFF7D8] p-3">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 17v-5m0-4h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
          stroke="#CD8412"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p
        style={{
          margin: 0,
          fontFamily: "Fredoka, sans-serif",
          fontWeight: 400,
          fontSize: "14px",
          lineHeight: "18px",
          color: "#626262",
        }}
      >
        Slots are limited and allocated on a first-come-first-serve basis. Secure your
        preferred time now to avoid delays.{" "}
        <Link href="/terms" style={{ color: "#2E5AAC", textDecoration: "underline" }}>
          Read Terms &amp; Conditions
        </Link>
      </p>
    </div>
  );
}
