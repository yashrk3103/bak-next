"use client";

import { BakridServiceData } from "../types";

interface QuantitySelectorProps {
  quantity: number;
  updateQuantity: (newQty: number) => void;
  totalPrice: number;
  service: BakridServiceData | null;
  packageFeatures: string[];
  isUk?: boolean;
}

export default function QuantitySelector({
  quantity,
  updateQuantity,
  totalPrice,
  service,
  packageFeatures,
  isUk = false,
}: QuantitySelectorProps) {
  const currency = isUk ? "GBP" : "INR";
  const locale = isUk ? "en-GB" : "en-IN";
  return (
    <div className="flex flex-col gap-2">
      <span
        className="text-sm uppercase tracking-[0.28px]"
        style={{ fontFamily: "Fredoka, sans-serif", color: "#47474A" }}
      >
        Select Quantity 
      </span>
      <div
        className="rounded-xl border bg-[#FEFEFE] p-3 shadow-[4px_4px_12px_rgba(0,0,0,0.18)]"
        style={{ borderColor: "#848181" }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4">
              <div>
                <div
                  style={{
                    fontFamily: "Fredoka, sans-serif",
                    fontWeight: 600,
                    fontSize: "24px",
                    lineHeight: "28px",
                    color: "#494949",
                  }}
                >
                  Qurban
                </div>
                <div
                  className="mt-3 flex flex-wrap items-center gap-2 text-sm"
                  style={{ fontFamily: "Fredoka, sans-serif", color: "#A3A3A3" }}
                >
                  {packageFeatures.map((feature, index) => (
                    <span key={feature} className="inline-flex items-center gap-2">
                      {index > 0 ? (
                        <span className="h-3.5 w-px bg-[#94949E]" aria-hidden="true" />
                      ) : null}
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-end gap-2" style={{ fontFamily: "Fredoka, sans-serif" }}>
                <span className="text-[20px] font-medium leading-none text-black">
                  {new Intl.NumberFormat(locale, {
                    style: "currency",
                    currency,
                    maximumFractionDigits: 0,
                  }).format(totalPrice)}
                </span>
                <span className="pb-0.5 text-xs text-[#94949E] line-through">
                  {service?.original_price &&
                    new Intl.NumberFormat(locale, {
                      style: "currency",
                      currency,
                      maximumFractionDigits: 0,
                    }).format(quantity * (service?.original_price || 0))}
                </span>
              </div>
            </div>

            <div className="flex items-center self-start rounded-[14px] bg-[#FF5A57] sm:self-auto">
              <button
                type="button"
                onClick={() => updateQuantity(Math.max(1, quantity - 1))}
                className="flex h-[34px] w-[34px] items-center justify-center rounded-l-[14px] text-white"
                aria-label="Decrease quantity"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path
                    d="M3.75 7.5h7.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <div className="flex h-[34px] min-w-[34px] items-center justify-center border-y border-[#D9D0E3] bg-white px-3 text-[18px] text-[#2D0C57]">
                {quantity}
              </div>
              <button
                type="button"
                onClick={() => updateQuantity(quantity + 1)}
                className="flex h-[34px] w-[34px] items-center justify-center rounded-r-[14px] text-white"
                aria-label="Increase quantity"
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path
                    d="M7.5 3.75v7.5M3.75 7.5h7.5"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
