"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { FiClock } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

import toast from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";
import CancelOrderUI from "@/components/CancelOrderUI";
import { useRegion } from "@/components/layout/RegionContext";

import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/dist/client/link";
import { MdChatBubbleOutline } from "react-icons/md";
import { generateInvoicePDF } from "@/lib/invoice-pdf/generateInvoicePDF";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

/* ================= TYPES ================= */

type BakridService = {
  weight: string | undefined;
  sale_price: number;
  original_price?: number;
  day?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  full_name?: string;
  phone_number?: string;
  delivery_charge: number;
  is_free_delivery?: boolean;
  currency?: string;
  selected_tier?: string;
};

type OrderType = {
  id: string;
  order_status: string;
  item_total: number;
  tax_amount: number;
  delivery_fee: number;
  packaging_fee: number;
  total_amount: number;
  paid_via: string;
  created_at: string;
  bakrid_services?: BakridService;
  delivery_prefs: string;
  coupon_code: string | null;
  coupon_discount_amount: null | number;
  qurbani_names: string[];
  address_data?: { address?: string; city?: string; state?: string; landmark?: string } | null;
};

const statusStyles = {
  delivered: "bg-[#E0FFDD] text-[#0A8100] border-[#0A8100]",
  ready_for_pickup: "bg-[#E7C9FF] text-[#590C96] border-[#590C96]",
  pending: "bg-[#DDE7FF] text-[#4679F3] border-[#4679F3]",
  processing: "bg-[#FFEAAA] text-[#B54708] border-[#B54708]",
  cancelled: "bg-[#FFDBD9] text-[#BF0000] border-[#BF0000]",
  shipped: "bg-[#AAFFF6] text-[#055048] border-[#055048]",
  assigned: "bg-[#FFEAAA] text-[#B54708] border-[#B54708]",
  on_the_way: "bg-[#E7C9FF] text-[#590C96] border-[#590C96]",
};

const statusText = {
  pending: "Qurbani Confirmed",
  processing: "Qurbani in Progress",
  shipped: "Packing & Dispatch",
  delivered: "Qurbani Delivered",
  cancelled: "Cancelled",
  ready_for_pickup: "Out for Delivery",
};

const STATUS_STEP_MAP: Record<string, number> = {
  pending: 0,
  processing: 1,
  assigned: 1,
  shipped: 2,
  ready_for_pickup: 3,
  on_the_way: 3,
  delivered: 4,
  cancelled: 0,
};

/* ================= COMPONENT ================= */

export default function OrdersPage() {
  return (
    <Suspense fallback={<p className="text-center py-20">Loading...</p>}>
      <OrdersContent />
    </Suspense>
  );
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const router = useRouter();

  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const { region } = useRegion();

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("vendor_order")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setOrder(data);
      setActiveStep(STATUS_STEP_MAP[data.order_status] ?? 0);

      setLoading(false);
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  /* ================= INVOICE ================= */

  const handleDownloadInvoice = () => {
    if (!order) return;

    generateInvoicePDF({
      orderId: order.id,
      invoiceNumber: "#AB2324-01",
      customerName: order.bakrid_services?.full_name ?? "",
      customerPhone: order.bakrid_services?.phone_number ?? "",
      address: "",
      invoiceDate: new Date(order.created_at).toLocaleDateString(),
      paidVia: order.paid_via,
      items: [
        {
          name: "Qurban service",
          timeSlot: "Day 1, 7:00 AM - 9:00 AM",
          quantity: 2,
          price: 18500,
        },
      ],
      deliveryCharge: order.delivery_fee,
      couponDiscount: order.coupon_discount_amount ?? 0,
      totalAmount: order.item_total,
      region,
    });
  };

  /* ================= CANCEL ================= */
  const handleCancelOrder = async () => {
    if (!order) return;

    const { error } = await supabase.rpc("cancel_order_user", {
      p_order_id: order.id,
      p_total_chicken_weight: 0,
      p_total_mutton_weight: 0,
    });

    if (error) {
      toast.error("Cancel failed");
      return;
    }

    setOrder({ ...order, order_status: "cancelled" });
    toast.success("Cancelled");
  };

  if (loading) return <p className="text-center py-20">Loading...</p>;
  if (!order) return <p>No order found</p>;
  console.log(activeStep, "activeStep");

  return (
    <div className="min-h-auto bg-[#F6F7FB] flex justify-center py-10 px-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl p-8 shadow-xl">
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Left: Back arrow + Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link
              href="/profile?active=orders"
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

          {/* Right: Chat with us */}
          <button
            onClick={() => {
              router.push("/chat/orderId=" + order.id);
            }}
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
            <MdChatBubbleOutline className="text-[#E72343]" />
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

        {/* CENTER */}
        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold">Thank You</h2>
          <p className="text-gray-500 mb-2">
            Scheduled for {order.bakrid_services?.day}
          </p>

          <p className="font-bold text-sm">
            <span className="text-black">Order Id: </span>
            <span className="text-[#054267]">#{order.id.slice(0, 8)}</span>
          </p>
        </div>

        {/* TIMELINE */}
        <div className="relative px-8 mb-10">
          <div className="absolute top-3 left-0 w-full h-[3px] bg-gray-300">
            <div
              className="h-full bg-green-500"
              style={{
                width: `${(activeStep / (Object.keys(statusText).length - 1)) * 100}%`,
              }}
            />
          </div>

          <div className="flex justify-between relative z-10">
            {Object.keys(statusText).map((step, i) => {
              const isActive = i <= activeStep;
              return (
                <div key={i} className="flex flex-col items-center w-24">
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center
                      ${isActive ? "bg-green-500 border-green-500" : "border-gray-400 bg-white"}
                    `}
                  >
                    {isActive && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <p className="text-xs font-bold mt-2 text-center ">
                    {statusText[step as keyof typeof statusText]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* GRID */}
        {(() => {
          const bs = order.bakrid_services;
          const curr = bs?.currency || "INR";
          const sym = curr === "GBP" ? "£" : curr === "USD" ? "$" : "₹";
          const fmt = (n: number) => `${sym}${n.toLocaleString("en-IN")}`;
          const qtyCount = order.qurbani_names?.length || 1;
          return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="space-y-4">
            {/* Order Info Card */}
            <div style={{ border: "1px solid #E1E1E1", borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 14, color: "#333", width: 120 }}>Order ID:</span>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 400, fontSize: 13, color: "rgba(51,51,51,0.7)" }}>#{order.id.slice(0, 12)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 14, color: "#333", width: 120 }}>Order Status:</span>
                <Button
                  variant="outline"
                  className={cn(
                    "rounded-lg px-3 py-1 text-xs font-semibold capitalize",
                    statusStyles[order.order_status as keyof typeof statusStyles],
                  )}
                >
                  {statusText[order.order_status as keyof typeof statusText] || order.order_status}
                </Button>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 14, color: "#333", width: 120 }}>No. of Items:</span>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 400, fontSize: 14, color: "rgba(51,51,51,0.8)" }}>
                  {qtyCount} {qtyCount === 1 ? "Item" : "Items"}
                </span>
              </div>
            </div>

            {/* Customer Details Card */}
            <div style={{ border: "1px solid #BBBBBB", borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Name + Phone */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FaUserCircle style={{ color: "#646A78", fontSize: 28, flexShrink: 0 }} />
                <div>
                  <p style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: "#47474A", margin: 0 }}>
                    {bs?.full_name || "—"}
                  </p>
                  <p style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 12, color: "#7C7B7B", margin: 0 }}>
                    {bs?.phone_number || "—"}
                  </p>
                </div>
              </div>

              <div style={{ borderTop: "1px solid #D8DADC" }} />

              {/* Payment Method */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                  <path d="M4.667 7h18.666C24.07 7 24.667 7.597 24.667 8.333v11.334C24.667 20.403 24.07 21 23.333 21H4.667C3.93 21 3.333 20.403 3.333 19.667V8.333C3.333 7.597 3.93 7 4.667 7Z" stroke="#646A78" strokeWidth="1.5" />
                  <path d="M3.333 12h21.334" stroke="#646A78" strokeWidth="1.5" />
                  <path d="M7 16.333h5.333" stroke="#646A78" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <div>
                  <p style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 13, color: "#47474A", margin: 0 }}>Payment Method</p>
                  <p style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 12, color: "#7C7B7B", margin: 0 }}>
                    Paid via {order.paid_via}
                  </p>
                </div>
              </div>

              {/* Payment Date */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                  <rect x="4.667" y="5.833" width="18.666" height="18.667" rx="2" stroke="#646A78" strokeWidth="1.5" />
                  <path d="M4.667 11.667h18.666" stroke="#646A78" strokeWidth="1.5" />
                  <path d="M9.333 3.5v2.333M18.667 3.5v2.333" stroke="#646A78" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <div>
                  <p style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 13, color: "#47474A", margin: 0 }}>Payment Date</p>
                  <p style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 12, color: "#7C7B7B", margin: 0 }}>
                    {new Date(order.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
              </div>

              <div style={{ borderTop: "1px solid #D8DADC" }} />

              {/* Qurbani Details row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                    <rect x="4" y="3" width="20" height="22" rx="2" stroke="#646A78" strokeWidth="1.5" />
                    <path d="M9 9h10M9 14h10M9 19h6" stroke="#646A78" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <p style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 13, color: "#47474A", margin: 0 }}>Qurbani Details</p>
                </div>
                <button
                  onClick={() => setShowDetailsPopup(true)}
                  style={{ display: "flex", alignItems: "center", gap: 4, background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
                >
                  <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 13, color: "#ED0213" }}>View Details</span>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 11.5L11.5 2.5M11.5 2.5H6M11.5 2.5V8" stroke="#ED0213" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT — Bill Summary */}
          <div style={{ border: "1px solid #D7D7D7", borderRadius: 10, padding: 16, display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                <path d="M4.583 2.75h12.834C18.43 2.75 19.25 3.571 19.25 4.583V19.25l-2.75-1.833-2.75 1.833L11 17.417l-2.75 1.833-2.75-1.833L2.75 19.25V4.583C2.75 3.571 3.571 2.75 4.583 2.75Z" fill="#000" />
                <path d="M7.333 8.25h7.334M7.333 11.917h7.334" stroke="#FFF" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: "#000" }}>Bill Summary</span>
            </div>

            {/* Product Card */}
            <div style={{ background: "#FEFEFE", border: "0.5px solid #848181", boxShadow: "3px 3px 10px rgba(0,0,0,0.15)", borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 20, color: "#494949" }}>
                  {qtyCount} x Qurban
                </span>
                {bs?.sale_price && (
                  <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 14, color: "#ED0213" }}>
                    ({fmt(bs.sale_price)})
                  </span>
                )}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: bs?.day ? 8 : 0 }}>
                {bs?.weight && <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 13, color: "#656567" }}>{bs.weight}</span>}
                {bs?.weight && <span style={{ color: "#94949E", fontSize: 12 }}>|</span>}
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 13, color: "#A3A3A3" }}>Hygienic</span>
                <span style={{ color: "#94949E", fontSize: 12 }}>|</span>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 13, color: "#A3A3A3" }}>100% Shariah</span>
              </div>
              {bs?.day && bs?.start_time && (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <FiClock style={{ color: "#646A78", fontSize: 13, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 13, color: "#646A78" }}>
                    {bs.day} · {new Date(`1970-01-01T${bs.start_time}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })} – {new Date(`1970-01-01T${bs.end_time}`).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                  </span>
                </div>
              )}
            </div>

            {/* Price rows */}
            <div style={{ borderTop: "1px solid #AAABAD", paddingTop: 10, display: "flex", flexDirection: "column", gap: 9 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 14, color: "#494949" }}>Item Total</span>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 15, color: "#000" }}>{fmt(order.item_total)}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 14, color: "#47474A" }}>Taxes</span>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 15, color: "#000" }}>{fmt(order.tax_amount || 0)}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 14, color: "#47474A" }}>Delivery Charge</span>
                {bs?.is_free_delivery ? (
                  <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 14, color: "#1AB759" }}>FREE</span>
                ) : (
                  <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 15, color: "#000" }}>
                    {fmt(order.delivery_fee || bs?.delivery_charge || 0)}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 14, color: "#47474A" }}>Packing Charge</span>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 15, color: "#000" }}>{fmt(order.packaging_fee || 0)}</span>
              </div>

              {order.coupon_discount_amount != null && order.coupon_discount_amount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 14, color: "#1AB759" }}>
                    Coupon Discount{order.coupon_code ? ` (${order.coupon_code})` : ""}
                  </span>
                  <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 15, color: "#1AB759" }}>
                    -{fmt(order.coupon_discount_amount)}
                  </span>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed #D7D7D7", paddingTop: 8, marginTop: 2 }}>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 16, color: "#000" }}>Grand Total</span>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 17, color: "#ED0213" }}>{fmt(order.total_amount)}</span>
              </div>
            </div>
          </div>
        </div>
          );
        })()}

        {/* BUTTONS */}
        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={() => setShowDetailsPopup(true)}
            className="px-6 py-2 border border-[#E72343] text-[#E72343] rounded-lg hover:bg-red-50"
          >
            View Details
          </button>

          <button
            onClick={handleDownloadInvoice}
            className="px-6 py-2  btn-gradient text-white rounded-lg"
          >
            Download Invoice
          </button>

          {/* <button
            onClick={() => setIsModalOpen(true)}
            disabled={isCancelDisabled}
            className="px-6 py-2 bg-gray-400 text-white rounded-lg"
          >
            Cancel order
          </button> */}
        </div>

        <CancelOrderUI
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleCancelOrder}
        />

        {/* VIEW DETAILS POPUP */}
        {showDetailsPopup && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setShowDetailsPopup(false)}
          >
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 20,
                padding: "32px 28px 28px",
                width: "100%",
                maxWidth: 540,
                maxHeight: "90vh",
                overflowY: "auto",
                boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                position: "relative",
                fontFamily: "'Fredoka', sans-serif",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowDetailsPopup(false)}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 4,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M16.5 5.5L5.5 16.5M5.5 5.5L16.5 16.5" stroke="#ED0213" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </button>

              {/* Title */}
              <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 30, color: "#ED0213", margin: "0 0 22px" }}>
                Qurbani Details
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Customer Name */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 14, color: "#000" }}>
                    Customer Name
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, border: "1px solid #D8DADC", borderRadius: 10, padding: "13px 16px" }}>
                    <FaUserCircle style={{ color: "#37474F", fontSize: 22, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 400, fontSize: 16, color: "#000" }}>
                      {order.bakrid_services?.full_name || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Qurbani Names Grid */}
                {order.qurbani_names && order.qurbani_names.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: order.qurbani_names.length > 1 ? "1fr 1fr" : "1fr", gap: 12 }}>
                    {order.qurbani_names.map((name, i) => (
                      <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 14, color: "#000" }}>
                          Qurbani Name {i + 1}
                        </label>
                        <div style={{ border: "1px solid #D8DADC", borderRadius: 10, padding: "13px 16px" }}>
                          <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 400, fontSize: 16, color: "#000" }}>
                            {name || "—"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Contact Number */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 14, color: "#000" }}>
                    Contact Number
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, border: "1px solid #D8DADC", borderRadius: 10, padding: "13px 16px" }}>
                    {/* Flag */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      <svg width="26" height="18" viewBox="0 0 24 18" fill="none">
                        <rect width="24" height="6" fill="#FAB446" />
                        <rect y="6" width="24" height="6" fill="#F5F5F5" />
                        <rect y="12" width="24" height="6" fill="#73AF00" />
                        <circle cx="12" cy="9" r="2.5" fill="none" stroke="#1065D3" strokeWidth="1.2" />
                      </svg>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M4 6l4 4 4-4" stroke="#494949" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 400, fontSize: 16, color: "#000" }}>
                      {order.bakrid_services?.phone_number || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Delivery */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 14, color: "#000" }}>
                    Delivery
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, border: "1px solid #D8DADC", borderRadius: 10, padding: "13px 16px" }}>
                    <div style={{ width: 38, height: 38, background: "#FFE4E4", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke="#ED0213" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 15, color: "#47474A", margin: 0, textTransform: "capitalize" }}>
                        {order.delivery_prefs === "madrasa" ? "Madrasa Donation" : order.delivery_prefs || "—"}
                      </p>
                      {order.delivery_prefs === "Self / Family" && order.address_data && (
                        <p style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 400, fontSize: 13, color: "#7C7B7B", margin: 0 }}>
                          {[order.address_data.address, order.address_data.landmark, order.address_data.city, order.address_data.state].filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Paid Via */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 14, color: "#000" }}>
                    Payment Method
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, border: "1px solid #D8DADC", borderRadius: 10, padding: "13px 16px" }}>
                    <div style={{ width: 38, height: 38, background: "#F0F4FF", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="5" width="20" height="14" rx="2" stroke="#4679F3" strokeWidth="1.8" />
                        <path d="M2 10h20" stroke="#4679F3" strokeWidth="1.8" />
                        <path d="M6 15h4" stroke="#4679F3" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </div>
                    <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 400, fontSize: 16, color: "#000" }}>
                      {order.paid_via || "—"}
                    </span>
                  </div>
                </div>

                {/* Coupon Discount */}
                {order.coupon_discount_amount && order.coupon_discount_amount > 0 ? (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F0FFF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "12px 16px" }}>
                    <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: 14, color: "#15803D" }}>Coupon Discount</span>
                    <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 600, fontSize: 16, color: "#15803D" }}>-₹{order.coupon_discount_amount}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
