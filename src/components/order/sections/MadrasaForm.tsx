"use client";

import DynamicQurbaniInputs from "../DynamicQurbaniInputs";

interface MadrasaFormProps {
  fullName: string;
  setFullName: (name: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  quantity: number;
  qurbaniNames: string[];
  setQurbaniNames: (names: string[]) => void;
  region: string;
}

export default function MadrasaForm({
  fullName,
  setFullName,
  phone,
  setPhone,
  quantity,
  qurbaniNames,
  setQurbaniNames,
  region,
}: MadrasaFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <span
        className="text-sm uppercase tracking-[0.28px]"
        style={{ fontFamily: "Fredoka, sans-serif", color: "#47474A" }}
      >
        Your Details
      </span>

      {/* Full Name */}
      <div
        className="flex items-center gap-[10px]"
        style={{
          border: "1px solid #D8DADC",
          borderRadius: "10px",
          padding: "14px 16px",
          background: "#FFFFFF",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            fill="#37474F"
          />
        </svg>
        <input
          type="text"
          maxLength={30}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          className="flex-1 border-none bg-transparent outline-none"
          style={{ fontFamily: "Fredoka, sans-serif", fontSize: "16px", color: "#000000" }}
        />
      </div>

      {/* Contact Number */}
      <div
        className="flex items-center gap-[10px]"
        style={{
          border: "1px solid #D8DADC",
          borderRadius: "10px",
          padding: "14px 16px",
          background: "#FFFFFF",
        }}
      >
        <input
  type="number"  // Stays numeric; blocks most non-digits natively
  value={phone}
  onChange={(e) => {
    const inputValue = e.target.value.replace(/\D/g, '');  // Strip all non-digits (e, +, -, etc.)
    const maxLen = region === "uk" ? 11 : 10;
    setPhone(inputValue.slice(0, maxLen));  // Limit digits only
  }}
  placeholder={region === "uk" ? "07911 123456" : "99887 78899"}
  className="flex-1 border-none bg-transparent outline-none"
  style={{ fontFamily: "Fredoka, sans-serif", fontSize: "16px", color: "#000000" }}
/>
      </div>

      {/* Qurbani Names */}
      <DynamicQurbaniInputs
        quantity={quantity}
        names={qurbaniNames}
        onChange={(index, value) => {
          const newNames = [...qurbaniNames];
          newNames[index] = value;
          setQurbaniNames(newNames);
        }}
      />

      {/* Payment info */}
      <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-3">
        <span style={{ fontFamily: "Fredoka, sans-serif", fontSize: "14px", color: "#626262" }}>
          Payment via {region === "uk" ? "PayPal" : "Razorpay"}
        </span>
      </div>

      {/* PayPal button container for .uk */}
      {region === "uk" && <div id="madrasa-paypal-button" className="mt-1" />}
    </div>
  );
}
