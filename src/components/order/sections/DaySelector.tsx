"use client";

import { DeliveryDay } from "../types";

interface DaySelectorProps {
  deliveryDays: DeliveryDay[];
  selectedDay: string | null;
  onSelectDay: (dayId: string) => void;
}

export default function DaySelector({
  deliveryDays,
  selectedDay,
  onSelectDay,
}: DaySelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <span
        className="text-sm uppercase tracking-[0.28px]"
        style={{ fontFamily: "Fredoka, sans-serif", color: "#47474A" }}
      >
        Select Day
      </span>
      <div className="grid gap-3 md:grid-cols-3">
        {deliveryDays.map((day) => {
          const active = day.id === selectedDay;

          return (
            <button
              key={day.id}
              type="button"
              onClick={() => onSelectDay(day.id)}
              disabled={day.is_sold_out}
              className="flex min-h-[100px] items-start justify-between rounded-xl border px-3 py-3 text-left"
              style={{
                background: active ? "#FEF2F2" : "#FFFFFF",
                borderColor: active ? "#ED0213" : "#D8D8D8",
                opacity: day.is_sold_out ? 0.5 : 1,
              }}
            >
              <div className="flex flex-col gap-2">
                <div className="font-semibold text-lg">{day.day}</div>

                <div className="text-sm text-gray-500">
                  {new Date(day.service_date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>

                {day.is_sold_out && (
                  <span className="text-xs text-red-500">Sold Out</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
