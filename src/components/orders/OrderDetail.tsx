"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import DynamicQurbaniInputs from "@/components/order/DynamicQurbaniInputs";
import { SidebarOrderData } from "../order/types";
import { useRegion } from "../layout/RegionContext";

interface CustomerDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  orderData?: SidebarOrderData;
}

export default function OrderDetail({ isOpen, onClose, orderData }: CustomerDetailsPanelProps) {
  const { region } = useRegion();
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    area: "",
    building: "",
    landmark: "",
    city: "",
    state: "",
    agreeToTerms: false,
  });
  const [qurbaniNames, setQurbaniNames] = useState<string[]>([]);
  const [prevQuantity, setPrevQuantity] = useState<number | undefined>(undefined);


  console.log("orderData" ,orderData) 

  // Sync qurbaniNames length with quantity during render
  if (orderData?.quantity !== prevQuantity) {
    setPrevQuantity(orderData?.quantity);
    const newQty = orderData?.quantity || 1;
    setQurbaniNames((prev) => {
      const updated = [...prev];
      if (updated.length < newQty) {
        for (let i = updated.length; i < newQty; i++) updated.push("");
      } else if (updated.length > newQty) {
        return updated.slice(0, newQty);
      }
      return updated;
    });
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleProceedToPayment = () => {
    if (!orderData) {
      toast.error("Order data missing. Please go back and select options.");
      return;
    }

    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!formData.contactNumber.trim()) {
      toast.error("Please enter your contact number");
      return;
    }

    const filteredNames = qurbaniNames.map((n) => n.trim()).filter(Boolean);
    if (filteredNames.length === 0) {
      toast.error("Please enter at least one Qurbani name");
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    if (orderData.deliveryPreference === "Self / Family") {
      if (!formData.area.trim() && !formData.building.trim()) {
        toast.error("Please enter your delivery address");
        return;
      }
    }

    // Save all order + customer data for the checkout page
    const checkoutData = {
      quantity: orderData.quantity,
      unitPrice: orderData.unitPrice,
      totalPrice: orderData.unitPrice * orderData.quantity,
      selectedTier: orderData.selectedTier,
      serviceDateId: orderData.serviceDateId,
      timingId: orderData.timingId,
      deliveryPreference: orderData.deliveryPreference,
      fullName: formData.fullName.trim(),
      contactNumber: formData.contactNumber.trim(),
      area: formData.area.trim(),
      building: formData.building.trim(),
      landmark: formData.landmark.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      qurbaniNames: filteredNames,
      region,
      serviceWeightLow: orderData.service.weight_low,
      serviceWeightHigh: orderData.service.weight_high,
    };

    sessionStorage.setItem("qurbani_checkout_data", JSON.stringify(checkoutData));
    router.push("/checkout");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" style={{ pointerEvents: "auto" }}>
      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "#0F0707", opacity: 0.66 }}
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      />

      {/* Customer Details Panel */}
      <div
        className="absolute right-0 top-0 flex h-full w-full flex-col sm:w-[680px]"
        style={{
          background: "#FFFFFF",
          borderRadius: "24px 0px 0px 24px",
          animation: "slideInRight 0.3s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center gap-[76px] border-b border-black/20"
          style={{
            background: "#FFBABC",
            padding: "17px 22px",
            borderRadius: "24px 0px 0px 0px",
            minHeight: "90px",
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center hover:opacity-80"
            aria-label="Go back"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path
                d="M23.332 28.334 15 20.001l8.332-8.333"
                stroke="#0F0F0F"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h2
            style={{
              margin: 0,
              fontFamily: "Fredoka, sans-serif",
              fontWeight: 600,
              fontSize: "28px",
              lineHeight: "25px",
              letterSpacing: "0.46px",
              color: "#494949",
              textAlign: "center",
              flex: 1,
            }}
          >
            Customer Details
          </h2>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-7 py-8">
          <div className="mx-auto flex max-w-[624px] flex-col gap-4">

            {/* Full Name */}
            <div className="flex flex-col gap-[6px]">
              <label style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 500, fontSize: "14px", lineHeight: "125%", color: "#000000" }}>
                Full Name 
              </label>
              <div
                className="flex items-center gap-[10px]"
                style={{ border: "1px solid #D8DADC", borderRadius: "10px", padding: "14px 16px", background: "#FFFFFF" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#37474F" />
                </svg>
                <input
                  type="text"
maxLength={30}
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Robert Miles"
                  className="flex-1 border-none bg-transparent outline-none"
                  style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 400, fontSize: "16px", lineHeight: "125%", color: "#000000" }}
                />
              </div>
            </div>

            {/* Qurbani Names */}
            <div className="flex flex-col gap-[6px]">
              <label style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 500, fontSize: "14px", lineHeight: "125%", color: "#000000" }}>
                Qurbani Names
              </label>
              <DynamicQurbaniInputs
                quantity={orderData?.quantity || 1}
                names={qurbaniNames}
                onChange={(index, value) => {
                  const updated = [...qurbaniNames];
                  updated[index] = value;
                  setQurbaniNames(updated);
                }}
              />
            </div>

            {/* Contact Number */}
            <div className="flex flex-col gap-[6px]">
              <label style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 500, fontSize: "14px", lineHeight: "125%", color: "#000000" }}>
                Contact Number
              </label>
              <div
                className="flex items-center gap-3"
                style={{ border: "1px solid #D8DADC", borderRadius: "10px", padding: "14px 15px", background: "#FFFFFF" }}
              >
                <div className="flex items-center gap-2">
                  {region === "uk" ? (
                    <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                      <rect width="24" height="18" fill="#012169" />
                      <path d="M0 0L24 18M24 0L0 18" stroke="white" strokeWidth="3" />
                      <path d="M0 0L24 18M24 0L0 18" stroke="#C8102E" strokeWidth="1.5" />
                      <path d="M12 0V18M0 9H24" stroke="white" strokeWidth="5" />
                      <path d="M12 0V18M0 9H24" stroke="#C8102E" strokeWidth="3" />
                    </svg>
                  ) : (
                    <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                      <rect width="24" height="6" fill="#FAB446" />
                      <rect y="6" width="24" height="6" fill="#F5F5F5" />
                      <rect y="12" width="24" height="6" fill="#73AF00" />
                      <circle cx="12" cy="9" r="2" fill="#1065D3" />
                    </svg>
                  )}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="#494949" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <input
  type="tel"  // Use 'tel' for better mobile keyboard + number handling
  inputMode="numeric"
  maxLength={11}
  pattern="[0-9]*"  // Only allows digits
  name="contactNumber"
  value={formData.contactNumber.replace(/\D/g, '').slice(0, 11)}  // Clean + limit to 11 digits
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);  // Strip non-digits, max 11
    handleInputChange({
      ...e,
      target: { ...e.target, name: 'contactNumber', value }
    });
  }}
  placeholder={region === "uk" ? "07911 123456" : "99887 78899"}
  className="flex-1 border-none bg-transparent outline-none"
  style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 400, fontSize: "16px", lineHeight: "125%", color: "#000000" }}
/>
              </div>
            </div>

            {/* Address — Self/Family only */}
            {orderData?.deliveryPreference === "Self / Family" && (
              <div className="flex flex-col gap-[6px]">
                <label style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 500, fontSize: "14px", lineHeight: "125%", color: "#000000" }}>
                  Address
                </label>

                {[
                  { name: "area", placeholder: "SM range, MG road, Pune 411061", label: "Search for Area/Locality" },
                  { name: "building", placeholder: "231", label: "Flat No / Building Name / Street Name" },
                  { name: "landmark", placeholder: "60 feet road", label: "Landmark" },
                ].map((field) => (
                  <div key={field.name} className="flex flex-col gap-[6px]">
                    <span style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 500, fontSize: "14px", lineHeight: "125%", color: "#000000" }}>
                      {field.label}
                    </span>
                    <div style={{ border: "1px solid #D8DADC", borderRadius: "10px", padding: "14px 16px", background: "#FFFFFF" }}>
                      <input
                      maxLength={30}
                        type="text"
                        name={field.name}
                        value={formData[field.name as keyof typeof formData] as string}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        className="w-full border-none bg-transparent outline-none"
                        style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 400, fontSize: "16px", lineHeight: "125%", color: "#000000" }}
                      />
                    </div>
                  </div>
                ))}

                <div className="flex gap-4">
                  {[
                    { name: "city", placeholder: "Chennai", label: "City" },
                    { name: "state", placeholder: "Tamil Nadu", label: "State" },
                  ].map((field) => (
                    <div key={field.name} className="flex flex-1 flex-col gap-[6px]">
                      <span style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 500, fontSize: "14px", lineHeight: "125%", color: "#000000" }}>
                        {field.label}
                      </span>
                      <div style={{ border: "1px solid #D8DADC", borderRadius: "10px", padding: "14px 16px", background: "#FFFFFF" }}>
                        <input
                          type="text"
                             maxLength={10}
                          name={field.name}
                          value={formData[field.name as keyof typeof formData] as string}
                          onChange={handleInputChange}
                          placeholder={field.placeholder}
                          className="w-full border-none bg-transparent outline-none"
                          style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 400, fontSize: "16px", lineHeight: "125%", color: "#000000" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Terms Checkbox */}
            <div
              className="flex items-center gap-4"
              style={{ background: "#FBF4F4", border: "1px solid #ED0213", borderRadius: "12px", padding: "24px 12px" }}
            >
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, agreeToTerms: !prev.agreeToTerms }))}
                className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center"
                style={{ background: "#FFFFFF", border: "1px solid #ED0213", borderRadius: "6px" }}
                aria-label="Accept terms"
              >
                {formData.agreeToTerms && (
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                    <path d="M1.333 5.222 4.889 8.778 12.667 1" stroke="#ED0213" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <span style={{ fontFamily: "Fredoka, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: "18px", color: "#434242" }}>
                I confirm that the Qurbani is performed on my behalf with correct Niyyah and strictly as per Islamic Shariah.{" "}
                <Link href="/terms" style={{ color: "#ED0213", textDecoration: "underline", fontWeight: 500 }}>
                  Read Terms &amp; Conditions
                </Link>
              </span>
            </div>

          </div>
        </div>

        {/* Proceed to Payment Button */}
        <div className="px-7 pb-6">
          <button
            type="button"
            disabled={!formData.agreeToTerms}
            onClick={handleProceedToPayment}
            className="flex w-full max-w-[624px] mx-auto items-center justify-center hover:opacity-90 transition-opacity"
            style={{
              height: "64px",
              background: !formData.agreeToTerms
                ? "#999"
                : "linear-gradient(90deg, #FF4B55 0%, #BA3139 100%)",
              boxShadow: "4px 8px 24px rgba(36, 107, 253, 0.25)",
              borderRadius: "43px",
              fontFamily: "Fredoka, sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              lineHeight: "28px",
              color: "#FFFFFF",
              border: "none",
              cursor: !formData.agreeToTerms ? "not-allowed" : "pointer",
            }}
          >
            Proceed to Payment
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
