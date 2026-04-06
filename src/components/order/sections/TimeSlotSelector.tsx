"use client";

import { TimeSlot } from "../types";

interface TimeSlotSelectorProps {
  filteredSlots: TimeSlot[];
  selectedSlot: string | null;
  onSelectSlot: (slotId: string) => void;
}

export default function TimeSlotSelector({
  filteredSlots,
  selectedSlot,
  onSelectSlot,
}: TimeSlotSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <span
        className="text-sm uppercase tracking-[0.28px]"
        style={{ fontFamily: "Fredoka, sans-serif", color: "#47474A" }}
      >
        Available Slots
      </span>
      <div className="grid gap-3 md:grid-cols-2">
        {filteredSlots.map((slot) => {
          const active = slot.id === selectedSlot;

          const start = slot.start_time.slice(0, 5);
          const end = slot.end_time.slice(0, 5);

          return (
            <button
              key={slot.id}
              type="button"
              disabled={slot.is_sold_out}
              onClick={() => onSelectSlot(slot.id)}
              className="flex h-10 items-center justify-center rounded-lg border px-3 text-center"
              style={{
                background: active ? "#B21E24" : "#FFFFFF",
                borderColor: active ? "#B21E24" : "#000000",
                color: active ? "#FFFFFF" : "#6C6C6C",
                opacity: slot.is_sold_out ? 0.5 : 1,
              }}
            >
              {start} - {end}
              {slot.is_sold_out && " (Sold Out)"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
