"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import OrderDetail from "@/components/orders/OrderDetail";
import { supabase } from "@/lib/supabaseClient";
import toast from "react-hot-toast";
import {
  BakridServiceData,
  DeliveryDay,
  TimeSlot,
} from "./types";
import OrderPanelHeader from "./sections/OrderPanelHeader";
import TierSelector, { Tier } from "./sections/TierSelector";
import QuantitySelector from "./sections/QuantitySelector";
import DaySelector from "./sections/DaySelector";
import TimeSlotSelector from "./sections/TimeSlotSelector";
import DeliveryPreferenceSelector from "./sections/DeliveryPreferenceSelector";
import MadrasaForm from "./sections/MadrasaForm";
import OrderPanelInfoBox from "./sections/OrderPanelInfoBox";
import { useRegion } from "../layout/RegionContext";

/* ---------- Domain helpers ---------- */

const preferenceOptions = ["Self / Family", "Madrasa / Needy"];

interface OrderPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderPanel({ isOpen, onClose }: OrderPanelProps) {
  const { region } = useRegion();
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<Tier>("basic");
  const [quantity, setQuantity] = useState(1);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [preference, setPreference] = useState(preferenceOptions[1]);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [deliveryDays, setDeliveryDays] = useState<DeliveryDay[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [service, setService] = useState<BakridServiceData | null>(null);

  // Madrasa inline form fields
  const [madrasaFullName, setMadrasaFullName] = useState("");
  const [madrasaPhone, setMadrasaPhone] = useState("");
  const [qurbaniNames, setQurbaniNames] = useState<string[]>([""]);

  const isMadrasa = preference === "Madrasa / Needy";

  // When region becomes "uk", force preference to "Madrasa / Needy"
  useEffect(() => {
    if (region === "uk") {
      setPreference("Madrasa / Needy");
    }
  }, [region]);

  // Helper to update quantity and sync names
  const updateQuantity = (newQty: number) => {
    setQuantity(newQty);
    setQurbaniNames((prev) => {
      const newNames = [...prev];
      if (newNames.length < newQty) {
        for (let i = newNames.length; i < newQty; i++) {
          newNames.push("");
        }
      } else if (newNames.length > newQty) {
        return newNames.slice(0, newQty);
      }
      return newNames;
    });
  };

  const tierUnitPrice = useMemo(() => {
    if (!service) return 0;
    if (region === "uk") {
      if (selectedTier === "basic") return service.basic_price_uk ?? service.sale_price_uk ?? service.sale_price;
      if (selectedTier === "standard") return service.standard_price_uk ?? service.sale_price_uk ?? service.sale_price;
      if (selectedTier === "premium") return service.premium_price_uk ?? service.sale_price_uk ?? service.sale_price;
    }
    return service.sale_price;
  }, [service, region, selectedTier]);

  const totalPrice = useMemo(() => quantity * tierUnitPrice, [quantity, tierUnitPrice]);

  const packageFeatures = service
    ? [`${service.weight_low} - ${service.weight_high} kg`, "Hygienic", "100 % Shariah"]
    : ["Hygienic", "100 % Shariah"];

  useEffect(() => {
    const fetchBakridData = async () => {
      try {
        // 1️⃣ Get Service
        const { data: serviceData, error: serviceError } = await supabase
          .from("bakrid_service")
          .select("*")
          .eq("enable", true)
          .single();

        if (serviceError) throw serviceError;

        setService(serviceData);

        // 2️⃣ Get Dates using service_id
        const { data: dateData, error: dateError } = await supabase
          .from("bakrid_service_date")
          .select("*");

        if (dateError) throw dateError;

        setDeliveryDays(dateData || []);

        // 3️⃣ Get Timings using service_id
        const { data: timingData, error: timingError } = await supabase
          .from("bakrid_service_timings")
          .select("*");

        if (timingError) throw timingError;

        setTimeSlots(timingData || []);
      } catch (error) {
        console.error("Supabase error:", error);
      }
    };
    fetchBakridData();
  }, []);
  const filteredSlots = useMemo(() => {
    if (!selectedDay) return [];
    return timeSlots.filter(
      (slot) => slot.bakrid_service_date_id === selectedDay
    );
  }, [selectedDay, timeSlots]);

  /* ---------- Madrasa: go to checkout ---------- */

  const handleMadrasaContinue = () => {
    if (!selectedDay || !selectedSlot) {
      toast.error("Please select a day and time slot");
      return;
    }
    if (!madrasaFullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!madrasaPhone.trim()) {
      toast.error("Please enter your contact number");
      return;
    }
    const names = qurbaniNames.map((n) => n.trim()).filter(Boolean);
    if (names.length === 0) {
      toast.error("Please enter at least one Qurbani name");
      return;
    }

    const checkoutData = {
      quantity,
      unitPrice: tierUnitPrice,
      totalPrice,
      selectedTier,
      serviceDateId: selectedDay,
      timingId: selectedSlot,
      deliveryPreference: preference,
      fullName: madrasaFullName.trim(),
      contactNumber: madrasaPhone.trim(),
      area: "",
      building: "",
      landmark: "",
      city: "",
      state: "",
      qurbaniNames: names,
      region,
      serviceWeightLow: service?.weight_low ?? 0,
      serviceWeightHigh: service?.weight_high ?? 0,
    };

    sessionStorage.setItem("qurbani_checkout_data", JSON.stringify(checkoutData));
    router.push("/checkout");
  };

  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-50" style={{ pointerEvents: "auto" }}>
        {/* Dark transparent overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "#0F0707", opacity: 0.66 }}
          onClick={(e) => { e.stopPropagation(); onClose(); }}
        />

        {/* Select Date & Time Panel - slides in from right */}
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
          <OrderPanelHeader onClose={onClose} title="Select Date & Time" />

          {/* Scrollable Content */}
          <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 py-6 sm:px-7 sm:py-7 md:px-8">
            {/* Select Type of Qurbani */}
            {region === "uk" ? (
            <TierSelector
              selectedTier={selectedTier}
              onSelectTier={setSelectedTier}
              service={service}
            />) : null}

            {/* Select Quantity */}
            <QuantitySelector
              quantity={quantity}
              updateQuantity={updateQuantity}
              totalPrice={totalPrice}
              service={service}
              packageFeatures={packageFeatures}
              isUk={region === "uk"}
            />

            {/* Select Day */}
            <DaySelector
              deliveryDays={deliveryDays}
              selectedDay={selectedDay}
              onSelectDay={(dayId) => {
                setSelectedDay(dayId);
                setSelectedSlot(null);
              }}
            />

            {/* Available Slots */}
            <TimeSlotSelector
              filteredSlots={filteredSlots}
              selectedSlot={selectedSlot}
              onSelectSlot={(slotId) => setSelectedSlot(slotId)}
            />

            {/* Delivery Preference */}
            {region !== "uk" && (
              <DeliveryPreferenceSelector
                preferenceOptions={preferenceOptions}
                preference={preference}
                onSelectPreference={(pref) => setPreference(pref)}
              />
            )}

            {/* Madrasa inline form — shown only when Madrasa / Needy is selected */}
            {isMadrasa && (
              <MadrasaForm
                fullName={madrasaFullName}
                setFullName={setMadrasaFullName}
                phone={madrasaPhone}
                setPhone={setMadrasaPhone}
                quantity={quantity}
                qurbaniNames={qurbaniNames}
                setQurbaniNames={setQurbaniNames}
                region={region}
              />
            )}

            {/* Info Box */}
            <OrderPanelInfoBox />
          </div>

          {/* Bottom Button — "Place Order" for Madrasa, "Continue" for Self/Family */}
          <div className="px-5 pb-6 sm:px-7 md:px-8">
            <button
              type="button"
              onClick={() => {
                if (isMadrasa) {
                  handleMadrasaContinue();
                } else {
                  if (!selectedDay || !selectedSlot) {
                    toast.error("Please select a day and time slot");
                    return;
                  }
                  setShowCustomerDetails(true);
                }
              }}
              className="flex h-16 w-full items-center justify-center rounded-[43px] text-white shadow-[4px_8px_24px_rgba(36,107,253,0.25)]"
              style={{
                background: "linear-gradient(90deg, #FF4B55 0%, #BA3139 100%)",
                fontFamily: "Fredoka, sans-serif",
                fontWeight: 500,
                fontSize: "24px",
                lineHeight: "28px",
                cursor: "pointer",
              }}
            >
              Continue
            </button>
          </div>
        </div>

        {/* Slide-in animation */}
        <style jsx>{`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
        `}</style>
      </div>

      {/* Order 2 - Customer Details Panel */}
      <OrderDetail
        isOpen={showCustomerDetails}
        onClose={() => setShowCustomerDetails(false)}
        orderData={{
          quantity,
          serviceDateId: selectedDay!,
          timingId: selectedSlot!,
          deliveryPreference: preference,
          service: service!,
          unitPrice: tierUnitPrice,
          selectedTier,
        }}
      />
    </>
  );
}
