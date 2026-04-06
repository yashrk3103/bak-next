"use client";

import { BakridServiceData } from "../types";

export type Tier = "basic" | "standard" | "premium";

interface TierSelectorProps {
  selectedTier: Tier;
  onSelectTier: (tier: Tier) => void;
  service: BakridServiceData | null;
}

const TIERS: { id: Tier; label: string }[] = [
  { id: "basic", label: "Basic" },
  { id: "standard", label: "Standard" },
  { id: "premium", label: "Premium" },
];

function isSoldOut(tier: Tier, service: BakridServiceData | null): boolean {
  if (tier === "basic") return service?.basic_uk_sold_out ?? false;
  if (tier === "standard") return service?.standard_uk_sold_out ?? false;
  if (tier === "premium") return service?.premium_uk_sold_out ?? false;
  return false;
}

export default function TierSelector({
  selectedTier,
  onSelectTier,
  service,
}: TierSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <span
        className="text-sm uppercase tracking-[0.28px]"
        style={{ fontFamily: "Fredoka, sans-serif", color: "#47474A" }}
      >
        Select Type of Qurbani
      </span>

      <div className="grid grid-cols-3 gap-3">
        {TIERS.map((tier) => {
          const active = selectedTier === tier.id;
          const soldOut = isSoldOut(tier.id, service);

          return (
            <button
              key={tier.id}
              type="button"
              disabled={soldOut}
              onClick={() => !soldOut && onSelectTier(tier.id)}
              className="relative flex min-h-auto flex-col items-start justify-between rounded-xl border px-3 py-2.5 text-left transition"
              style={{
                background: active ? "#FEF2F2" : "#FFFFFF",
                borderColor: active ? "#ED0213" : "#D8D8D8",
                opacity: soldOut ? 0.6 : 1,
                cursor: soldOut ? "not-allowed" : "pointer",
              }}
            >
              {/* Checkbox top-right */}
              {!soldOut && (
              <div className="absolute top-2.5 right-2.5">
                {active ? (
                  /* Filled red checkbox */
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect width="18" height="18" rx="4" fill="#ED0213" />
                    <path
                      d="M4.5 9l3 3 6-6"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  /* Empty checkbox */
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="0.5" y="0.5" width="17" height="17" rx="3.5" stroke="#D8D8D8" />
                  </svg>
                )}
              </div> )}

              {/* Tier label */}
              <span
                className="text-sm font-semibold uppercase pr-6"
                style={{
                  fontFamily: "Fredoka, sans-serif",
                  color: active ? "#ED0213" : "#494949",
                }}
              >
                {tier.label}
              </span>

              {/* Sold Out badge */}
              {soldOut && (
                <span
                  className="absolute top-2.5 right-2.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white"
                  style={{ background: "#A3A3A3" }}
                >
                  Sold Out
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
