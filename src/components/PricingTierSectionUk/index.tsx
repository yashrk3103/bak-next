"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { BakridServiceData } from "@/components/order/types";
import { useRegion } from "../layout/RegionContext";

type Tier = "basic" | "standard" | "premium";

interface PricingTierSectionUkProps {
  onBookNow?: (tier: Tier) => void;
}

export default function PricingTierSectionUk({ onBookNow }: PricingTierSectionUkProps) {
  const { region } = useRegion();
  const [service, setService] = useState<BakridServiceData | null>(null);
  const [selectedTier, setSelectedTier] = useState<Tier>("standard");

  useEffect(() => {
    async function fetchService() {
      const { data, error } = await supabase
        .from("bakrid_service")
        .select("*")
        .eq("enable", true)
        .single();
      if (!error && data) setService(data);
    }
    fetchService();
  }, []);

  const isUk = region === "uk";

  const tiers: { id: Tier; label: string; price: number | null; soldOut: boolean }[] = [
    {
      id: "basic",
      label: "Basic",
      price: isUk ? (service?.basic_price_uk ?? null) : (service?.sale_price ?? null),
      soldOut: isUk ? (service?.basic_uk_sold_out ?? false) : false,
    },
    {
      id: "standard",
      label: "Standard",
      price: isUk ? (service?.standard_price_uk ?? null) : (service?.sale_price ?? null),
      soldOut: isUk ? (service?.standard_uk_sold_out ?? false) : false,
    },
    {
      id: "premium",
      label: "Premium",
      price: isUk ? (service?.premium_price_uk ?? null) : (service?.sale_price ?? null),
      soldOut: isUk ? (service?.premium_uk_sold_out ?? false) : false,
    },
  ];

  const activeTier = tiers.find((t) => t.id === selectedTier)!;

  const formatPrice = (price: number | null) => {
    if (price === null) return "—";
    return new Intl.NumberFormat(isUk ? "en-GB" : "en-IN", {
      style: "currency",
      currency: isUk ? "GBP" : "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ── First Sidebar: Featured price card ── */}
      <div
        className="rounded-2xl p-6 shadow-lg text-white"
        style={{ background: "linear-gradient(135deg, #FF4B55 0%, #BA3139 100%)" }}
      >
        <p className="text-xs uppercase tracking-widest opacity-75 mb-1">Qurbani Package</p>
        <h2
          className="text-2xl font-bold"
          style={{ fontFamily: "Fredoka, sans-serif" }}
        >
          {activeTier.label}
        </h2>

        <div className="mt-3 flex items-end gap-2">
          <span className="text-4xl font-semibold leading-none">
            {formatPrice(activeTier.price)}
          </span>
          {service?.original_price && (
            <span className="text-sm line-through opacity-60 pb-1">
              {formatPrice(service.original_price)}
            </span>
          )}
        </div>

        {service?.is_free_delivery && (
          <p className="mt-2 text-xs opacity-80">Free delivery included</p>
        )}

        {activeTier.soldOut ? (
          <div className="mt-4 w-full rounded-full bg-white/20 py-2.5 text-center text-sm font-semibold opacity-80">
            Sold Out
          </div>
        ) : (
          <button
            onClick={() => onBookNow?.(selectedTier)}
            className="mt-4 w-full rounded-full bg-white py-2.5 text-sm font-semibold text-red-700 hover:opacity-90 transition"
          >
            Book Now
          </button>
        )}
      </div>

      {/* ── Tier Buttons: Basic · Standard · Premium ── */}
      <div className="grid grid-cols-3 gap-3">
        {tiers.map((tier) => {
          const isActive = selectedTier === tier.id;
          return (
            <button
              key={tier.id}
              onClick={() => !tier.soldOut && setSelectedTier(tier.id)}
              disabled={tier.soldOut}
              className={`relative flex flex-col items-center gap-1 rounded-xl border-2 py-3 px-2 transition
                ${
                  isActive
                    ? "border-red-600 bg-red-50"
                    : tier.soldOut
                    ? "cursor-not-allowed border-gray-200 bg-gray-50 opacity-55"
                    : "border-gray-200 bg-white hover:border-red-300"
                }`}
            >
              {tier.soldOut && (
                <span className="absolute -top-2.5 right-1 rounded-full bg-gray-400 px-1.5 py-0.5 text-[10px] text-white leading-tight">
                  Sold Out
                </span>
              )}
              {isActive && !tier.soldOut && (
                <span className="absolute -top-2.5 right-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] text-white leading-tight">
                  Selected
                </span>
              )}
              <span
                className={`text-sm font-semibold ${isActive ? "text-red-700" : "text-gray-700"}`}
                style={{ fontFamily: "Fredoka, sans-serif" }}
              >
                {tier.label}
              </span>
              <span className={`text-xs ${isActive ? "text-red-500" : "text-gray-500"}`}>
                {formatPrice(tier.price)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
