"use client";

import Link from "next/link";
import Image from "next/image";

type SidebarItem = "profile" | "orders" | "logout";

export default function ProfileForm() {
  const activeTab: SidebarItem = "profile";

  return (
    <div style={{ background: "#FFFCFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top bar: logo + profile button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          padding: "20px 24px",
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <Image
            src="/images/Frame 1437253701.png"
            alt="Zirwa Qurbani Service"
            width={100}
            height={50}
            style={{ width: "100px", height: "auto", display: "block" }}
          />
        </Link>

        <Link
          href="/profile"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 7px 0 18px",
            gap: "12px",
            background: "#ED0213",
            borderRadius: "60px",
            border: "none",
            cursor: "pointer",
            height: "44px",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 510,
              fontSize: "16px",
              lineHeight: "20px",
              color: "#FFFFFF",
            }}
          >
            Profile
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "34px",
              height: "34px",
              background: "#FFFFFF",
              borderRadius: "50%",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#ED0213" />
            </svg>
          </span>
        </Link>
      </div>

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "40px",
          maxWidth: "1200px",
          width: "100%",
          margin: "20px auto 60px",
          padding: "0 24px",
          flex: 1,
        }}
      >
        {/* Page title */}
        <h1
          style={{
            fontFamily: "'Noto Serif', serif",
            fontWeight: 700,
            fontSize: "36px",
            lineHeight: "44px",
            letterSpacing: "-1px",
            color: "#363636",
            margin: 0,
            textAlign: "center",
          }}
        >
          My Profile
        </h1>

        {/* Two-column layout */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "32px",
            width: "100%",
          }}
        >
          {/* LEFT: Sidebar card */}
          <div
            style={{
              width: "220px",
              minWidth: "220px",
              background: "#FFFFFF",
              border: "1px solid rgba(0, 0, 0, 0.12)",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
              borderRadius: "18px",
              padding: "40px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "40px",
            }}
          >
            {/* Avatar + name */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "#D9D9D9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#999" />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  fontSize: "15px",
                  lineHeight: "140%",
                  letterSpacing: "-0.02em",
                  color: "#333333",
                }}
              >
                Sam Jordan
              </span>
            </div>

            {/* Menu items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
              {/* My Profile - active */}
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                  gap: "8px",
                  width: "100%",
                  height: "42px",
                  background: activeTab === "profile" ? "linear-gradient(90deg, #FF4B55 0%, #BA3139 100%)" : "transparent",
                  borderRadius: "10px",
                  border: "none",
                  borderBottom: activeTab !== "profile" ? "1px solid #D7D7D7" : "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill={activeTab === "profile" ? "#FFFFFF" : "#000"} />
                </svg>
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 500,
                    fontSize: "15px",
                    lineHeight: "140%",
                    letterSpacing: "-0.02em",
                    color: activeTab === "profile" ? "#FFFFFF" : "#363636",
                  }}
                >
                  My Profile
                </span>
              </button>

              {/* My Orders */}
              <Link
                href="/my-orders"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                  gap: "8px",
                  width: "100%",
                  height: "42px",
                  borderBottom: "1px solid #D7D7D7",
                  textDecoration: "none",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z" fill="#000" />
                </svg>
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 500,
                    fontSize: "15px",
                    lineHeight: "140%",
                    letterSpacing: "-0.02em",
                    color: "#363636",
                  }}
                >
                  My Orders
                </span>
              </Link>

              {/* Logout */}
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                  gap: "10px",
                  width: "100%",
                  height: "42px",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid #D7D7D7",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5V5z" fill="#FF5858" />
                  <path d="M16.56 12.01l-3.09-3.09L12 10.38l4.62 4.62 4.62-4.62-1.47-1.46-3.21 3.09z" fill="#FF5858" transform="rotate(-90 16.62 12.01)" />
                </svg>
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 500,
                    fontSize: "15px",
                    lineHeight: "140%",
                    letterSpacing: "-0.02em",
                    color: "#363636",
                  }}
                >
                  Logout
                </span>
              </button>
            </div>
          </div>

          {/* RIGHT: Profile form card */}
          <div
            style={{
              flex: 1,
              maxWidth: "700px",
              border: "1px solid rgba(0, 0, 0, 0.12)",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
              borderRadius: "18px",
              padding: "24px 28px",
              display: "flex",
              flexDirection: "column",
              gap: "28px",
            }}
          >
            {/* Title */}
            <h2
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: "22px",
                lineHeight: "140%",
                letterSpacing: "-0.02em",
                background: "linear-gradient(90deg, #FF4B55 0%, #BA3139 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                margin: 0,
              }}
            >
              Profile Settings
            </h2>

            {/* Avatar + name row */}
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ position: "relative", width: "90px", height: "90px", flexShrink: 0 }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "#D9D9D9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#999" />
                  </svg>
                </div>
                {/* Upload button overlay */}
                <div
                  style={{
                    position: "absolute",
                    right: "0",
                    bottom: "0",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: "linear-gradient(90deg, #FF4B55 0%, #BA3139 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 20h14v-2H5v2zm7-18L5.33 9h3.67v4h6V9h3.67L12 2z" fill="#F8F8F8" />
                  </svg>
                </div>
              </div>
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "16px",
                  lineHeight: "140%",
                  letterSpacing: "-0.02em",
                  color: "#333333",
                }}
              >
                Sam Jordan
              </span>
            </div>

            {/* Form fields - 2 columns */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <FormField label="First Name*" value="Sam" />
                <FormField label="Last Name*" value="Jordan" />
                <FormField label="Email*" value="samjordan@gmail.com" />
                <FormField label="Phone*" value="8624935014" />
              </div>

              {/* Update button */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "10px 40px",
                    height: "46px",
                    background: "linear-gradient(90deg, #FF4B55 0%, #BA3139 100%)",
                    borderRadius: "24px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 600,
                      fontSize: "15px",
                      lineHeight: "140%",
                      letterSpacing: "-0.02em",
                      color: "#FFFFFF",
                    }}
                  >
                    Update
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function FormField({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          fontSize: "14px",
          lineHeight: "140%",
          letterSpacing: "-0.02em",
          color: "#75797E",
        }}
      >
        {label}
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 14px",
          border: "1px solid #EEEEEE",
          borderRadius: "8px",
          height: "44px",
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: "15px",
            lineHeight: "140%",
            letterSpacing: "-0.02em",
            color: "#606060",
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
