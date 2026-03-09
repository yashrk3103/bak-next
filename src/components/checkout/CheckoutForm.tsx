"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/layout/Footer";

const COUPONS = [
  {
    code: "GET130CB",
    description: "Up to ₹30 Off + ₹100 cashback on orders of ₹699 or more",
    validity: "05/08/2021 04:00 – 09/08/2021 12:00",
    savings: "Save ₹30 + ₹100 cashback with this offer",
  },
  {
    code: "FLAT200",
    description: "Flat ₹200 Off on orders of ₹1499 or more",
    validity: "01/06/2026 00:00 – 30/06/2026 23:59",
    savings: "Save ₹200 with this offer",
  },
  {
    code: "QURBANI50",
    description: "Up to ₹50 Off on your first Qurbani booking",
    validity: "01/03/2026 00:00 – 10/06/2026 23:59",
    savings: "Save ₹50 with this offer",
  },
];

type PaymentMethod = "net-banking" | "google-pay" | "visa" | "mastercard" | "apple-pay" | "credit-debit" | "cod" | "upi";

export default function CheckoutForm() {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("net-banking");
  const [showCoupon, setShowCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  return (
    <>
      <div style={{ background: "#F7FBFF", minHeight: "100vh", position: "relative" }}>
        {/* Top bar with logo + login */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            maxWidth: "1356px",
            margin: "0 auto",
            padding: "52px 24px 0",
          }}
        >
          <Link href="/" style={{ textDecoration: "none" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px 24px",
                background: "#FFFFFF",
                // boxShadow: "2px 4px 8px rgba(0, 0, 0, 0.25)",
                borderRadius: "16px",
                width: "206px",
                height: "100px",
              }}
            >
              <Image
                src="/images/Frame 1437253701.png"
                alt="Zirwa Qurbani Service"
                width={158}
                height={80}
                style={{ width: "158px", height: "auto" }}
              />
            </div>
          </Link>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 7px 0 21px",
              gap: "24px",
              background: "#ED0213",
              borderRadius: "60px",
              border: "none",
              cursor: "pointer",
              height: "56px",
            }}
          >
            <span
              style={{
                fontFamily: "'SF Pro', 'Poppins', sans-serif",
                fontWeight: 510,
                fontSize: "20px",
                lineHeight: "24px",
                color: "#FFFFFF",
              }}
            >
              Login
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "46px",
                height: "46px",
                background: "#FFFFFF",
                borderRadius: "50%",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8 5l7 7-7 7" stroke="#ED0213" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>

        {/* Main checkout card */}
        <div
          style={{
            maxWidth: "1266px",
            margin: "40px auto 80px",
            background: "#FFFFFF",
            borderRadius: "20px",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          {/* Header: back + title */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Link
              href="/"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "41px",
                height: "41px",
                border: "1px solid #000000",
                borderRadius: "23px",
                textDecoration: "none",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M12 7H2M2 7L7 2M2 7L7 12" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <span
              style={{
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 500,
                fontSize: "30px",
                lineHeight: "140%",
                letterSpacing: "-0.02em",
                color: "#363636",
              }}
            >
              Checkout
            </span>
          </div>

          {/* Two-column layout */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "32px",
              flexWrap: "wrap",
            }}
          >
            {/* LEFT COLUMN */}
            <div style={{ flex: "1 1 616px", maxWidth: "616px", display: "flex", flexDirection: "column", gap: "40px" }}>
              {/* Price Summary */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <span
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    lineHeight: "20px",
                    letterSpacing: "0.28px",
                    textDecoration: "underline",
                    color: "#47474A",
                  }}
                >
                  Price Summary
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <PriceRow label="Delivery Charge" value="Included in price" />
                  <PriceRow label="Subtotal" value="₹36,000" />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: "18px", letterSpacing: "0.4px", color: "#353535" }}>
                      Discount
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: "18px", textDecoration: "line-through", color: "#353535", letterSpacing: "0.4px" }}>
                        ₹362
                      </span>
                      <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: "16px", lineHeight: "19px", color: "#ED0213", letterSpacing: "0.6px" }}>
                        ₹412
                      </span>
                    </div>
                  </div>
                  <PriceRow label="Platform Handling" value="₹10" />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: "16px", lineHeight: "24px", letterSpacing: "0.6px", color: "#353535" }}>
                      Total (Incl. Taxes)
                    </span>
                    <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: "16px", lineHeight: "19px", letterSpacing: "0.6px", color: "#353535" }}>
                      ₹35,598
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Date */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: "14px", lineHeight: "20px", letterSpacing: "0.28px", textDecoration: "underline", color: "#47474A" }}>
                    Delivery Date & Time
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "18px 16px",
                    background: "#FFFFFF",
                    border: "1px solid #D8DADC",
                    borderRadius: "10px",
                  }}
                >
                  <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 400, fontSize: "16px", color: "#000" }}>
                    7th June
                  </span>
                  <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: "14px", letterSpacing: "0.6px", color: "#ED0213" }}>
                    6:30 pm
                  </span>
                </div>
              </div>

              {/* Delivery Address */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: "14px", lineHeight: "20px", letterSpacing: "0.28px", textDecoration: "underline", color: "#47474A" }}>
                    Delivery Address
                  </span>
                  <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: "14px", letterSpacing: "0.6px", color: "#ED0213" }}>
                    Change
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      background: "rgba(217, 35, 35, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" fill="#ED0213" />
                    </svg>
                  </div>
                  <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: "17px", color: "#313131", flex: 1 }}>
                    781 Hilll Junctions, Apt. 406, Bengaluru, Karnataka - 560038
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: "14px", lineHeight: "20px", letterSpacing: "0.28px", textDecoration: "underline", color: "#47474A" }}>
                  Payment Method
                </span>

                <div style={{ display: "flex", flexDirection: "column", gap: "17px" }}>
                  <div style={{ padding: "0 10px" }}>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "16px", lineHeight: "24px", textTransform: "uppercase", color: "#82131B" }}>
                      We accept domestic and international payments
                    </span>
                  </div>

                  {/* Net Banking - selected */}
                  <PaymentOption
                    label="Net Banking"
                    value="net-banking"
                    selected={selectedPayment === "net-banking"}
                    onSelect={() => setSelectedPayment("net-banking")}
                    highlighted
                  />

                  {/* Google Pay */}
                  <PaymentOption
                    label="Google Pay"
                    value="google-pay"
                    selected={selectedPayment === "google-pay"}
                    onSelect={() => setSelectedPayment("google-pay")}
                    icon={<GooglePayIcon />}
                  />

                  {/* Visa */}
                  <PaymentOption
                    label="Visa"
                    value="visa"
                    selected={selectedPayment === "visa"}
                    onSelect={() => setSelectedPayment("visa")}
                    icon={<VisaIcon />}
                  />

                  {/* MasterCard */}
                  <PaymentOption
                    label="MasterCard"
                    value="mastercard"
                    selected={selectedPayment === "mastercard"}
                    onSelect={() => setSelectedPayment("mastercard")}
                    icon={<MasterCardIcon />}
                  />

                  {/* Apple Pay */}
                  <PaymentOption
                    label="Apple Pay"
                    value="apple-pay"
                    selected={selectedPayment === "apple-pay"}
                    onSelect={() => setSelectedPayment("apple-pay")}
                    icon={<ApplePayIcon />}
                  />

                  {/* Credit/Debit */}
                  <PaymentOption
                    label="Credit/Debit"
                    value="credit-debit"
                    selected={selectedPayment === "credit-debit"}
                    onSelect={() => setSelectedPayment("credit-debit")}
                    highlighted
                  />

                  {/* Cash on delivery */}
                  <PaymentOption
                    label="Cash on delivery"
                    value="cod"
                    selected={selectedPayment === "cod"}
                    onSelect={() => setSelectedPayment("cod")}
                    highlighted
                  />

                  {/* Pay using UPI */}
                  <PaymentOption
                    label="Pay using UPI"
                    value="upi"
                    selected={selectedPayment === "upi"}
                    onSelect={() => setSelectedPayment("upi")}
                    highlighted
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div style={{ flex: "1 1 562px", maxWidth: "562px", display: "flex", flexDirection: "column", gap: "80px" }}>
              {/* Step Indicator */}
              <div style={{ display: "flex", alignItems: "center", gap: "21px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0" }}>
                  {/* Step 1 dot */}
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#E5E5E5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: "23px", height: "23px", borderRadius: "50%", background: "linear-gradient(90deg, #FF4B55 0%, #BA3139 100%)" }} />
                  </div>
                  {/* Line */}
                  <div style={{ width: "3.5px", height: "221px", background: "#C44949", borderRadius: "2px" }} />
                  {/* Step 2 dot */}
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#E5E5E5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: "23px", height: "23px", borderRadius: "50%", background: "linear-gradient(90deg, #FF4B55 0%, #BA3139 100%)" }} />
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "293px" }}>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "23px", lineHeight: "28px", color: "#000" }}>
                    Customer Details
                  </span>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "23px", lineHeight: "28px", color: "#000" }}>
                    Payment Method
                  </span>
                </div>
              </div>

              {/* Order Summary Card */}
              <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {/* Summary box */}
                  <div
                    style={{
                      background: "#FFF1F1",
                      borderRadius: "10px",
                      padding: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    <SummaryRow label="Subtotal:" value="₹36,000" />
                    <div style={{ width: "100%", height: "0px", borderBottom: "0.4px solid rgba(0,0,0,0.4)" }} />
                    <SummaryRow label="Tax" value="5%" />
                    <div style={{ width: "100%", height: "0px", borderBottom: "0.4px solid rgba(0,0,0,0.4)" }} />
                    <SummaryRow label="Shipping:" value="Free" />
                    <div style={{ width: "100%", height: "0px", borderBottom: "0.4px solid #000" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "18px", lineHeight: "24px", color: "#000" }}>
                        Order Total
                      </span>
                      <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: "16px", lineHeight: "19px", letterSpacing: "0.6px", color: "#353535" }}>
                        ₹37,800
                      </span>
                    </div>
                  </div>
                </div>

                {/* Apply coupon link */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="#494949" />
                  </svg>
                  <button
                    onClick={() => setShowCoupon(true)}
                    style={{
                      fontFamily: "'Fredoka', sans-serif",
                      fontWeight: 500,
                      fontSize: "14px",
                      lineHeight: "15px",
                      letterSpacing: "0.28px",
                      color: "#494949",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      textDecoration: "underline",
                    }}
                  >
                    {appliedCoupon ? `Coupon Applied: ${appliedCoupon}` : "Apply coupon code to get discount"}
                  </button>
                </div>

                {/* Place Order button */}
                <button
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "11px 33px",
                    gap: "20px",
                    width: "100%",
                    height: "60px",
                    background: "linear-gradient(90deg, #FF4B55 0%, #BA3139 100%)",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Fredoka', sans-serif",
                      fontWeight: 500,
                      fontSize: "18px",
                      color: "#FFFFFF",
                    }}
                  >
                    Place Order
                  </span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* <Footer /> */}
      </div>

      {/* Apply Coupon Modal */}
      {showCoupon && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 7, 7, 0.66)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowCoupon(false)}
        >
          <div
            style={{
              position: "relative",
              width: "592px",
              maxWidth: "95vw",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#FFFFFF",
              boxShadow: "0px 20px 47px rgba(0, 0, 0, 0.1)",
              borderRadius: "24px",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowCoupon(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                width: "16px",
                height: "17px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
                <path d="M1 1.5L15 15.5M15 1.5L1 15.5" stroke="#ED0213" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            {/* Title */}
            <h2
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 700,
                fontSize: "32px",
                lineHeight: "36px",
                color: "#ED0213",
                margin: 0,
              }}
            >
              Apply Coupon
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "42px", marginTop: "12px" }}>
              {/* Coupon input */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: "14px", lineHeight: "20px", letterSpacing: "0.28px", color: "#47474A" }}>
                  Enter Coupon Code
                </span>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "18px 16px",
                    background: "#FFFFFF",
                    border: "1px solid #D8DADC",
                    borderRadius: "10px",
                  }}
                >
                  <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 400, fontSize: "16px", color: "#000" }}>
                    Type code
                  </span>
                  <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: "14px", letterSpacing: "0.6px", color: "#ED0213", cursor: "pointer" }}>
                    Apply
                  </span>
                </div>
              </div>

              {/* Coupon cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 500, fontSize: "14px", lineHeight: "20px", letterSpacing: "0.28px", color: "#47474A" }}>
                  Available Coupons
                </span>

                {COUPONS.map((coupon) => (
                  <CouponCard
                    key={coupon.code}
                    code={coupon.code}
                    description={coupon.description}
                    validity={coupon.validity}
                    savings={coupon.savings}
                    onApply={() => {
                      setAppliedCoupon(coupon.code);
                      setShowCoupon(false);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ===== Sub-components ===== */

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: "18px", letterSpacing: "0.4px", color: "#353535" }}>
        {label}
      </span>
      <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: "18px", textAlign: "right", letterSpacing: "0.4px", color: "#353535" }}>
        {value}
      </span>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: "16px", lineHeight: "24px", color: "#000" }}>
        {label}
      </span>
      <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: "16px", lineHeight: "24px", color: value === "Free" ? "#000" : "#363636" }}>
        {value}
      </span>
    </div>
  );
}

function RadioCircle({ selected }: { selected: boolean }) {
  return (
    <div
      style={{
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        border: "1.5px solid #000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {selected && (
        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#000" }} />
      )}
    </div>
  );
}

function PaymentOption({
  label,
  value,
  selected,
  onSelect,
  highlighted,
  icon,
}: {
  label: string;
  value: string;
  selected: boolean;
  onSelect: () => void;
  highlighted?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onSelect}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0 10px",
        gap: "16px",
        width: "100%",
        height: "36px",
        background: highlighted ? "#FFF1F1" : "transparent",
        borderRadius: highlighted ? "10px" : "0",
        border: "none",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <RadioCircle selected={selected} />
      {icon && <div style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>}
      <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: "16px", lineHeight: "24px", color: "#000" }}>
        {label}
      </span>
    </button>
  );
}

function CouponCard({
  code,
  description,
  validity,
  savings,
  onApply,
}: {
  code: string;
  description: string;
  validity: string;
  savings: string;
  onApply: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        gap: "16px",
        background:
          "radial-gradient(3.38% 10% at 0% 35%, #EEEEF1 50%, rgba(238,238,241,0) 50%), radial-gradient(3.38% 10% at 0% 50%, #EEEEF1 50%, rgba(238,238,241,0) 50%), radial-gradient(3.38% 10% at 0% 65%, #EEEEF1 50%, rgba(238,238,241,0) 50%), radial-gradient(3.38% 10% at 100% 35%, #EEEEF1 50%, rgba(238,238,241,0) 50%), radial-gradient(3.38% 10% at 100% 50%, #EEEEF1 50%, rgba(238,238,241,0) 50%), radial-gradient(3.38% 10% at 100% 65%, #EEEEF1 50%, rgba(238,238,241,0) 50%), #FFFFFF",
        border: "0.85px solid #ADABAB",
        borderRadius: "16px",
      }}
    >
      {/* Left: coupon details */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8.5px", flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12.75px" }}>
          {/* Code badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "3.4px" }}>
            <div
              style={{
                width: "30px",
                height: "30px",
                background: "#FFF1F1",
                border: "0.85px solid #999",
                borderRadius: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "16px" }}>🏷️</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px 8px",
                border: "0.85px dashed #999",
                borderRadius: "2px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontWeight: 700,
                  fontSize: "12px",
                  lineHeight: "17px",
                  textTransform: "uppercase",
                  color: "#2E2E2E",
                }}
              >
                {code}
              </span>
            </div>
          </div>

          {/* Description */}
          <span style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "16px", color: "#666" }}>
            {description}
          </span>

          {/* Validity */}
          <span style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 400, fontSize: "10px", lineHeight: "16px", color: "#666" }}>
            {validity}
          </span>
        </div>
      </div>

      {/* Right: savings + apply */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "19px", width: "81px" }}>
        <span
          style={{
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 700,
            fontSize: "12px",
            lineHeight: "17px",
            textAlign: "center",
            color: "#000",
          }}
        >
          {savings}
        </span>
        <button
          onClick={onApply}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "9px 21px",
            width: "100%",
            background: "#ED0213",
            border: "0.85px solid #E31837",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              fontFamily: "'Arial', sans-serif",
              fontWeight: 700,
              fontSize: "12px",
              lineHeight: "17px",
              textTransform: "capitalize",
              color: "#FFFFFF",
            }}
          >
            Apply
          </span>
        </button>
      </div>
    </div>
  );
}

/* ===== Payment Icons ===== */
function GooglePayIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="11" cy="18" r="11" fill="#D6D6D6" />
      <text x="7" y="22" fontFamily="Arial" fontSize="10" fontWeight="700" fill="#383E41">G</text>
    </svg>
  );
}

function VisaIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="13" cy="18" r="13" fill="#262626" />
      <text x="6" y="22" fontFamily="Arial" fontSize="10" fontWeight="700" fill="#FFF">V</text>
    </svg>
  );
}

function MasterCardIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="12" cy="18" r="10" fill="#265797" />
      <circle cx="18" cy="18" r="6" fill="#DFAC16" opacity="0.7" />
    </svg>
  );
}

function ApplePayIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="12" cy="18" r="12" fill="#262626" />
      <text x="6" y="22" fontFamily="Arial" fontSize="11" fontWeight="700" fill="#FFF"></text>
    </svg>
  );
}
