"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const STEPS = [
  "Qurbani\nConfirmed",
  "Qurbani in\nProgress",
  "Packing &\nDispatch",
  "Out for\nDelivery",
  "Qurbani\nDelivered",
];

const STATUS_STEP_MAP: Record<string, number> = {
  confirmed: 0,
  "in-progress": 1,
  packing: 2,
  "out-for-delivery": 3,
  delivered: 4,
};

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Confirmed",
  "in-progress": "In Progress",
  packing: "Packing",
  "out-for-delivery": "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_COLOR: Record<string, string> = {
  confirmed: "#4679F3",
  "in-progress": "#B54708",
  packing: "#055048",
  "out-for-delivery": "#590C96",
  delivered: "#26953E",
  cancelled: "#BF0000",
};

export interface BakridServices {
  weight: string;
  sale_price: number;
  original_price: number;
  delivery_charge: number;
  is_free_delivery: boolean;
  day: string;
  date: string;
  start_time: string;
  end_time: string;
  full_name: string;
  phone_number: string;
  currency: string;
}

export interface BakridOrder {
  id: string;
  order_status: string;
  item_total: number;
  tax_amount: number;
  delivery_fee: number;
  packaging_fee: number;
  total_amount: number;
  paid_via: string;
  created_at: string;
  bakrid_services: BakridServices;
  qurbani_names: string[];
  delivery_prefs: string;
  coupon_code: string | null;
  coupon_discount_amount: number | null;
}

interface OrderDetailsPageProps {
  order: BakridOrder;
}

function formatCurrency(amount: number, currency: string): string {
  const symbol = currency === "GBP" ? "£" : currency === "USD" ? "$" : "₹";
  return `${symbol}${amount.toLocaleString("en-IN")}`;
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function OrderDetailsPage({ order }: OrderDetailsPageProps) {
  const [showQurbaniModal, setShowQurbaniModal] = useState(false);
  const activeStep = STATUS_STEP_MAP[order.order_status] ?? 0;
  const bs = order.bakrid_services;
  const currency = bs?.currency || "INR";
  const qurbaniCount = order.qurbani_names?.length || 1;
  const shortOrderId = order.id.substring(0, 8).toUpperCase();
  const statusLabel = STATUS_LABEL[order.order_status] || order.order_status;
  const statusColor = STATUS_COLOR[order.order_status] || "#333333";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7FBFF",
        fontFamily: "'Fredoka', sans-serif",
      }}
    >
      {/* Top Bar - Logo */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "12px 30px",
        }}
      >
        <Link href="/">
          <div
            style={{
              background: "#FFFFFF",
              boxShadow: "2px 4px 8px rgba(0,0,0,0.25)",
              borderRadius: 12,
              padding: "6px 16px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              draggable={false}
              src="/images/Zirwa.png"
              alt="Zirwa Qurbani Service"
              width={110}
              height={56}
              style={{ objectFit: "contain" }}
            />
          </div>
        </Link>
      </div>

      {/* Main Card */}
      <div
        style={{
          width: 850,
          maxWidth: "95vw",
          margin: "0 auto 24px",
          background: "#FFFFFF",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
          borderRadius: 16,
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        {/* Header Row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link
              href="/my-orders"
              style={{
                width: 32,
                height: 32,
                border: "1px solid #000000",
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
              }}
            >
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                <path
                  d="M13 6H1M1 6L6 1M1 6L6 11"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <span
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 500,
                fontSize: 22,
                lineHeight: "140%",
                letterSpacing: "-0.02em",
                color: "#363636",
              }}
            >
              Order Details
            </span>
          </div>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              border: "1px solid #E72343",
              borderRadius: 18,
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M2 18V6C2 4.89543 2.89543 4 4 4H14C15.1046 4 16 4.89543 16 6V12C16 13.1046 15.1046 14 14 14H6L2 18Z"
                fill="#E72343"
              />
              <path
                d="M22 10V18L18 14H10C8.89543 14 8 13.1046 8 12V10C8 8.89543 8.89543 8 10 8H20C21.1046 8 22 8.89543 22 10Z"
                fill="#E72343"
              />
            </svg>
            <span
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                lineHeight: "140%",
                letterSpacing: "-0.02em",
                color: "#E72343",
              }}
            >
              Chat with us
            </span>
          </button>
        </div>

        {/* Thank You Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span
            style={{
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 500,
              fontSize: 18,
              lineHeight: "140%",
              textAlign: "center",
              letterSpacing: "-0.02em",
              color: "#333333",
            }}
          >
            Thank You
          </span>
          {bs?.day && (
            <span
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 400,
                fontSize: 13,
                lineHeight: "140%",
                letterSpacing: "-0.02em",
                color: "#333333",
              }}
            >
              Your Order is Scheduled for {bs.day}
            </span>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <span
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 600,
                fontSize: 13,
                lineHeight: "140%",
                letterSpacing: "-0.02em",
                color: "#333333",
              }}
            >
              Order ID:
            </span>
            <span
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 400,
                fontSize: 13,
                lineHeight: "140%",
                letterSpacing: "-0.02em",
                color: "#054267",
              }}
            >
              {" "}#{shortOrderId}
            </span>
          </div>
        </div>

        {/* Progress Stepper */}
        <div style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0,
              width: "100%",
            }}
          >
            {STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flex:
                    i === 0 || i === STEPS.length - 1 ? "0 0 auto" : undefined,
                }}
              >
                {i > 0 && (
                  <div
                    style={{
                      width: i === 1 ? 82 : 111,
                      height: 0,
                      borderTop: `4px solid ${
                        i <= activeStep ? "#1AB759" : "#D9D9D9"
                      }`,
                    }}
                  />
                )}
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: `5px solid ${
                      i <= activeStep ? "#1AB759" : "#D9D9D9"
                    }`,
                    boxSizing: "border-box",
                    flexShrink: 0,
                    background: "#FFFFFF",
                  }}
                />
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 8,
              width: "100%",
            }}
          >
            {STEPS.map((s, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: 11,
                  lineHeight: "14px",
                  textAlign: "center",
                  letterSpacing: "-0.02em",
                  color: "#333333",
                  width: 100,
                  whiteSpace: "pre-line",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 24,
            width: "100%",
          }}
        >
          {/* Left Column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              width: 290,
              flexShrink: 0,
            }}
          >
            {/* Order Info Card */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E1E1E1",
                borderRadius: 8,
                padding: 12,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <span
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#333333",
                    width: 120,
                  }}
                >
                  Order ID:
                </span>
                <span
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontWeight: 400,
                    fontSize: 14,
                    color: "rgba(51,51,51,0.8)",
                  }}
                >
                  #{shortOrderId}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <span
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#333333",
                    width: 120,
                  }}
                >
                  Order Status:
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px 9px",
                    border: `0.89px solid ${statusColor}`,
                    borderRadius: 6,
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: 13,
                    color: statusColor,
                  }}
                >
                  {statusLabel}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <span
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#333333",
                    width: 120,
                  }}
                >
                  No. of Items:
                </span>
                <span
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontWeight: 400,
                    fontSize: 14,
                    color: "rgba(51,51,51,0.8)",
                  }}
                >
                  {qurbaniCount} {qurbaniCount === 1 ? "Item" : "Items"}
                </span>
              </div>
            </div>

            {/* Customer Details Card */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #BBBBBB",
                borderRadius: 8,
                padding: 12,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {/* Customer Name & Phone */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M16 16C18.2091 16 20 14.2091 20 12C20 9.79086 18.2091 8 16 8C13.7909 8 12 9.79086 12 12C12 14.2091 13.7909 16 16 16Z"
                    fill="#646A78"
                  />
                  <path
                    d="M16 18C11.5817 18 8 20.2386 8 23V25H24V23C24 20.2386 20.4183 18 16 18Z"
                    fill="#646A78"
                  />
                </svg>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontFamily: "'Fredoka', sans-serif",
                      fontWeight: 600,
                      fontSize: 16,
                      lineHeight: "20px",
                      letterSpacing: "0.28px",
                      color: "#47474A",
                    }}
                  >
                    {bs?.full_name || "—"}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Fredoka', sans-serif",
                      fontWeight: 500,
                      fontSize: 12,
                      lineHeight: "16px",
                      letterSpacing: "0.28px",
                      color: "#7C7B7B",
                    }}
                  >
                    {bs?.phone_number || "—"}
                  </span>
                </div>
              </div>

              <div
                style={{ width: "100%", height: 0, borderTop: "0.93px solid #D8DADC" }}
              />

              {/* Payment Method */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path
                    d="M4.66667 7H23.3333C24.0697 7 24.6667 7.59695 24.6667 8.33333V19.6667C24.6667 20.403 24.0697 21 23.3333 21H4.66667C3.93029 21 3.33333 20.403 3.33333 19.6667V8.33333C3.33333 7.59695 3.93029 7 4.66667 7Z"
                    stroke="#646A78"
                    strokeWidth="1.5"
                  />
                  <path d="M3.33333 12H24.6667" stroke="#646A78" strokeWidth="1.5" />
                  <path
                    d="M7 16.3333H12.3333"
                    stroke="#646A78"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontFamily: "'Fredoka', sans-serif",
                      fontWeight: 500,
                      fontSize: 14,
                      lineHeight: "20px",
                      letterSpacing: "0.28px",
                      color: "#47474A",
                    }}
                  >
                    Payment Method
                  </span>
                  <span
                    style={{
                      fontFamily: "'Fredoka', sans-serif",
                      fontWeight: 500,
                      fontSize: 12,
                      lineHeight: "16px",
                      letterSpacing: "0.28px",
                      color: "#7C7B7B",
                    }}
                  >
                    Paid via {order.paid_via}
                  </span>
                </div>
              </div>

              {/* Payment Date */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <rect
                    x="4.66667"
                    y="5.83333"
                    width="18.6667"
                    height="18.6667"
                    rx="2"
                    stroke="#646A78"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M4.66667 11.6667H23.3333"
                    stroke="#646A78"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M9.33333 3.5V5.83333"
                    stroke="#646A78"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M18.6667 3.5V5.83333"
                    stroke="#646A78"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M17.5 18.0833L19.8333 20.4167"
                    stroke="#646A78"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="17.5"
                    cy="18.0833"
                    r="4.08333"
                    stroke="#646A78"
                    strokeWidth="1.5"
                  />
                </svg>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontFamily: "'Fredoka', sans-serif",
                      fontWeight: 500,
                      fontSize: 14,
                      lineHeight: "20px",
                      letterSpacing: "0.28px",
                      color: "#47474A",
                    }}
                  >
                    Payment Date
                  </span>
                  <span
                    style={{
                      fontFamily: "'Fredoka', sans-serif",
                      fontWeight: 500,
                      fontSize: 12,
                      lineHeight: "16px",
                      letterSpacing: "0.28px",
                      color: "#7C7B7B",
                    }}
                  >
                    {formatDate(order.created_at)}
                  </span>
                </div>
              </div>

              {/* Delivery Preference */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path
                    d="M14 2.33333C9.21333 2.33333 5.33333 6.21333 5.33333 11C5.33333 17.5 14 25.6667 14 25.6667C14 25.6667 22.6667 17.5 22.6667 11C22.6667 6.21333 18.7867 2.33333 14 2.33333Z"
                    stroke="#646A78"
                    strokeWidth="2"
                  />
                  <circle cx="14" cy="11" r="3" stroke="#646A78" strokeWidth="2" />
                </svg>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontFamily: "'Fredoka', sans-serif",
                      fontWeight: 500,
                      fontSize: 14,
                      lineHeight: "20px",
                      letterSpacing: "0.28px",
                      color: "#47474A",
                    }}
                  >
                    Delivery
                  </span>
                  <span
                    style={{
                      fontFamily: "'Fredoka', sans-serif",
                      fontWeight: 500,
                      fontSize: 12,
                      lineHeight: "16px",
                      letterSpacing: "0.28px",
                      color: "#7C7B7B",
                      textTransform: "capitalize",
                    }}
                  >
                    {order.delivery_prefs === "madrasa"
                      ? "Madrasa Donation"
                      : order.delivery_prefs || "—"}
                  </span>
                </div>
              </div>

              <div style={{ width: "100%", height: 0, borderTop: "0.93px solid #D8DADC" }} />

              {/* Qurbani Details row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect x="4" y="3" width="20" height="22" rx="2" stroke="#646A78" strokeWidth="1.5" />
                    <path d="M9 8h10M9 13h10M9 18h6" stroke="#646A78" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <span
                    style={{
                      fontFamily: "'Fredoka', sans-serif",
                      fontWeight: 500,
                      fontSize: 14,
                      lineHeight: "20px",
                      letterSpacing: "0.28px",
                      color: "#47474A",
                    }}
                  >
                    Qurbani Details
                  </span>
                </div>
                <button
                  onClick={() => setShowQurbaniModal(true)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Fredoka', sans-serif",
                      fontWeight: 500,
                      fontSize: 13,
                      color: "#ED0213",
                    }}
                  >
                    View Details
                  </span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2.5 11.5L11.5 2.5M11.5 2.5H6M11.5 2.5V8"
                      stroke="#ED0213"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Bill Summary */}
          <div
            style={{
              flex: 1,
              background: "#FFFFFF",
              border: "1px solid #D7D7D7",
              borderRadius: 8,
              padding: 12,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Bill Summary Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d="M4.58333 2.75H17.4167C18.4292 2.75 19.25 3.57081 19.25 4.58333V19.25L16.5 17.4167L13.75 19.25L11 17.4167L8.25 19.25L5.5 17.4167L2.75 19.25V4.58333C2.75 3.57081 3.57081 2.75 4.58333 2.75Z"
                  fill="#000000"
                />
                <path
                  d="M7.33333 8.25H14.6667"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  d="M7.33333 11.9167H14.6667"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              <span
                style={{
                  fontFamily: "'Fredoka', sans-serif",
                  fontWeight: 600,
                  fontSize: 16.7,
                  lineHeight: "15px",
                  letterSpacing: "0.28px",
                  color: "#000000",
                }}
              >
                Bill Summary
              </span>
            </div>

            {/* Product Card */}
            <div
              style={{
                background: "#FEFEFE",
                border: "0.32px solid #848181",
                boxShadow: "3.96px 3.96px 11.88px rgba(0,0,0,0.25)",
                borderRadius: 10,
                padding: 10,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  padding: 4,
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span
                    style={{
                      fontFamily: "'Fredoka', sans-serif",
                      fontWeight: 600,
                      fontSize: 22,
                      lineHeight: "28px",
                      color: "#494949",
                    }}
                  >
                    {qurbaniCount} x Qurban
                  </span>
                  {bs?.sale_price && (
                    <span
                      style={{
                        fontFamily: "'Fredoka', sans-serif",
                        fontWeight: 600,
                        fontSize: 15,
                        color: "#ED0213",
                      }}
                    >
                      ({formatCurrency(bs.sale_price, currency)})
                    </span>
                  )}
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}
                >
                  {bs?.weight && (
                    <>
                      <span
                        style={{
                          fontFamily: "'Fredoka', sans-serif",
                          fontWeight: 500,
                          fontSize: 15,
                          color: "#656567",
                        }}
                      >
                        {bs.weight}
                      </span>
                      <div style={{ width: 1, height: 14, background: "#94949E" }} />
                    </>
                  )}
                  <span
                    style={{
                      fontFamily: "'Fredoka', sans-serif",
                      fontWeight: 500,
                      fontSize: 15,
                      color: "#A3A3A3",
                    }}
                  >
                    Hygienic
                  </span>
                  <div style={{ width: 1, height: 14, background: "#94949E" }} />
                  <span
                    style={{
                      fontFamily: "'Fredoka', sans-serif",
                      fontWeight: 500,
                      fontSize: 15,
                      color: "#A3A3A3",
                    }}
                  >
                    100% Shariah
                  </span>
                </div>

                {bs?.day && bs?.start_time && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="#646A78" strokeWidth="1.5" />
                      <path d="M3 9H21" stroke="#646A78" strokeWidth="1.5" />
                      <path d="M8 2V4M16 2V4" stroke="#646A78" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span
                      style={{
                        fontFamily: "'Fredoka', sans-serif",
                        fontWeight: 500,
                        fontSize: 13,
                        color: "#646A78",
                      }}
                    >
                      {bs.day} · {formatTime(bs.start_time)} – {formatTime(bs.end_time)}
                    </span>
                  </div>
                )}

                {order.qurbani_names?.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span
                      style={{
                        fontFamily: "'Fredoka', sans-serif",
                        fontWeight: 500,
                        fontSize: 12,
                        color: "#888",
                        marginBottom: 2,
                      }}
                    >
                      Qurbani Names:
                    </span>
                    {order.qurbani_names.map((name, i) => (
                      <span
                        key={i}
                        style={{
                          fontFamily: "'Fredoka', sans-serif",
                          fontWeight: 400,
                          fontSize: 13,
                          color: "#494949",
                        }}
                      >
                        {i + 1}. {name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Price Breakdown */}
            <div
              style={{
                borderTop: "1px solid #AAABAD",
                padding: "8px 12px",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {/* Item Total */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontWeight: 500,
                    fontSize: 14,
                    letterSpacing: "0.28px",
                    color: "#494949",
                  }}
                >
                  Item Total
                </span>
                <span
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontWeight: 500,
                    fontSize: 16,
                    color: "#000000",
                  }}
                >
                  {formatCurrency(order.item_total, currency)}
                </span>
              </div>

              {/* Taxes */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontWeight: 500,
                    fontSize: 14,
                    letterSpacing: "0.28px",
                    color: "#47474A",
                  }}
                >
                  Taxes
                </span>
                <span
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontWeight: 500,
                    fontSize: 16,
                    color: "#000000",
                  }}
                >
                  {formatCurrency(order.tax_amount || 0, currency)}
                </span>
              </div>

              {/* Delivery Charge */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontWeight: 500,
                    fontSize: 14,
                    letterSpacing: "0.28px",
                    color: "#47474A",
                  }}
                >
                  Delivery Charge
                </span>
                {bs?.is_free_delivery ? (
                  <span
                    style={{
                      fontFamily: "'Fredoka', sans-serif",
                      fontWeight: 600,
                      fontSize: 15,
                      color: "#1AB759",
                    }}
                  >
                    FREE
                  </span>
                ) : (
                  <span
                    style={{
                      fontFamily: "'Fredoka', sans-serif",
                      fontWeight: 500,
                      fontSize: 16,
                      color: "#000000",
                    }}
                  >
                    {formatCurrency(
                      order.delivery_fee || bs?.delivery_charge || 0,
                      currency
                    )}
                  </span>
                )}
              </div>

              {/* Packaging Charge */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontWeight: 500,
                    fontSize: 14,
                    letterSpacing: "0.28px",
                    color: "#47474A",
                  }}
                >
                  Packaging Charge
                </span>
                <span
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontWeight: 500,
                    fontSize: 16,
                    color: "#000000",
                  }}
                >
                  {formatCurrency(order.packaging_fee || 0, currency)}
                </span>
              </div>

              {/* Coupon Discount — only shown when applicable */}
              {order.coupon_discount_amount != null &&
                order.coupon_discount_amount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      style={{
                        fontFamily: "'Fredoka', sans-serif",
                        fontWeight: 500,
                        fontSize: 14,
                        letterSpacing: "0.28px",
                        color: "#1AB759",
                      }}
                    >
                      Coupon Discount
                      {order.coupon_code ? ` (${order.coupon_code})` : ""}
                    </span>
                    <span
                      style={{
                        fontFamily: "'Fredoka', sans-serif",
                        fontWeight: 500,
                        fontSize: 16,
                        color: "#1AB759",
                      }}
                    >
                      -{formatCurrency(order.coupon_discount_amount, currency)}
                    </span>
                  </div>
                )}

              {/* Grand Total */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 4,
                  borderTop: "1px dashed #D7D7D7",
                  paddingTop: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontWeight: 600,
                    fontSize: 16,
                    lineHeight: "20px",
                    letterSpacing: "0.28px",
                    color: "#000000",
                  }}
                >
                  Grand Total
                </span>
                <span
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontWeight: 700,
                    fontSize: 18,
                    lineHeight: "20px",
                    color: "#ED0213",
                  }}
                >
                  {formatCurrency(order.total_amount, currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 16,
            width: "100%",
          }}
        >
          <button
            style={{
              padding: "8px 20px",
              background:
                "linear-gradient(0deg, rgba(129,127,127,0.7), rgba(129,127,127,0.7)), linear-gradient(90deg, #FF4B55 0%, #BA3139 100%)",
              opacity: 0.44,
              borderRadius: 10,
              border: "none",
              cursor: "not-allowed",
              minWidth: 120,
              height: 40,
            }}
          >
            <span
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 500,
                fontSize: 14,
                lineHeight: "140%",
                letterSpacing: "-0.02em",
                color: "#FFFFFF",
              }}
            >
              Track Order
            </span>
          </button>

          <Link
            href="/invoice"
            style={{
              padding: "8px 20px",
              background: "linear-gradient(90deg, #FF4B55 0%, #BA3139 100%)",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              minWidth: 120,
              height: 40,
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <span
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 500,
                fontSize: 14,
                lineHeight: "140%",
                letterSpacing: "-0.02em",
                color: "#FFFFFF",
              }}
            >
              Download Invoice
            </span>
          </Link>

          <button
            style={{
              padding: "10px 24px",
              background:
                "linear-gradient(0deg, rgba(129,127,127,0.7), rgba(129,127,127,0.7)), linear-gradient(90deg, #FF4B55 0%, #BA3139 100%)",
              opacity: 0.44,
              borderRadius: 10,
              border: "none",
              cursor: "not-allowed",
              minWidth: 120,
              height: 40,
            }}
          >
            <span
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 500,
                fontSize: 14,
                lineHeight: "125%",
                color: "#FFFFFF",
              }}
            >
              Cancel Order
            </span>
          </button>
        </div>
      </div>

      {/* Qurbani Details Modal */}
      {showQurbaniModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
            }}
            onClick={() => setShowQurbaniModal(false)}
          />

          {/* Modal Card */}
          <div
            style={{
              position: "relative",
              background: "#FFFFFF",
              borderRadius: 16,
              padding: "32px 28px",
              width: "100%",
              maxWidth: 520,
              display: "flex",
              flexDirection: "column",
              gap: 20,
              boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
            }}
          >
            {/* Close */}
            <button
              onClick={() => setShowQurbaniModal(false)}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 4,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M15 5L5 15M5 5L15 15"
                  stroke="#ED0213"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <h2
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 600,
                fontSize: 28,
                color: "#ED0213",
                margin: 0,
              }}
            >
              Qurbani Details
            </h2>

            {/* Customer Name */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{
                  fontFamily: "'Fredoka', sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  color: "#000000",
                }}
              >
                Customer Name
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  border: "1px solid #D8DADC",
                  borderRadius: 10,
                  padding: "14px 16px",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                    fill="#37474F"
                  />
                </svg>
                <span
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontWeight: 400,
                    fontSize: 16,
                    color: "#000000",
                  }}
                >
                  {bs?.full_name || "—"}
                </span>
              </div>
            </div>

            {/* Qurbani Names */}
            {order.qurbani_names?.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: order.qurbani_names.length > 1 ? "1fr 1fr" : "1fr",
                    gap: 10,
                  }}
                >
                  {order.qurbani_names.map((name, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label
                        style={{
                          fontFamily: "'Fredoka', sans-serif",
                          fontWeight: 500,
                          fontSize: 14,
                          color: "#000000",
                        }}
                      >
                        Qurbani Name {i + 1}
                      </label>
                      <div
                        style={{
                          border: "1px solid #D8DADC",
                          borderRadius: 10,
                          padding: "14px 16px",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Fredoka', sans-serif",
                            fontWeight: 400,
                            fontSize: 16,
                            color: "#000000",
                          }}
                        >
                          {name || "—"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Number */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{
                  fontFamily: "'Fredoka', sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  color: "#000000",
                }}
              >
                Contact Number
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  border: "1px solid #D8DADC",
                  borderRadius: 10,
                  padding: "14px 16px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontWeight: 400,
                    fontSize: 16,
                    color: "#000000",
                  }}
                >
                  {bs?.phone_number || "—"}
                </span>
              </div>
            </div>

            {/* Delivery */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label
                style={{
                  fontFamily: "'Fredoka', sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  color: "#000000",
                }}
              >
                Delivery
              </label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  border: "1px solid #D8DADC",
                  borderRadius: 10,
                  padding: "14px 16px",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    stroke="#ED0213"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <p
                    style={{
                      fontFamily: "'Fredoka', sans-serif",
                      fontWeight: 600,
                      fontSize: 15,
                      color: "#47474A",
                      margin: 0,
                      textTransform: "capitalize",
                    }}
                  >
                    {order.delivery_prefs === "madrasa"
                      ? "Madrasa Donation"
                      : order.delivery_prefs || "—"}
                  </p>
                  {bs?.is_free_delivery && (
                    <p
                      style={{
                        fontFamily: "'Fredoka', sans-serif",
                        fontWeight: 500,
                        fontSize: 12,
                        color: "#1AB759",
                        margin: 0,
                      }}
                    >
                      Free Delivery
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
