"use client";

interface DeliveryPreferenceSelectorProps {
  preferenceOptions: string[];
  preference: string;
  onSelectPreference: (preference: string) => void;
}

export default function DeliveryPreferenceSelector({
  preferenceOptions,
  preference,
  onSelectPreference,
}: DeliveryPreferenceSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <span
        className="text-sm uppercase tracking-[0.28px]"
        style={{ fontFamily: "Fredoka, sans-serif", color: "#47474A" }}
      >
        Delivery Preference
      </span>
      <div className="flex flex-col gap-3">
        {preferenceOptions.map((option) => {
          const active = option === preference;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelectPreference(option)}
              className="flex h-10 items-center gap-3 rounded-[10px] border px-4 text-left"
              style={{
                background: active ? "#FEF2F2" : "#FFFFFF",
                borderColor: active ? "#ED0213" : "#000000",
              }}
            >
              <span
                className="flex h-4 w-4 items-center justify-center rounded-full border"
                style={{ borderColor: active ? "#ED0213" : "#D8DADC" }}
              >
                {active ? (
                  <span className="h-[8.69px] w-[8.69px] rounded-full bg-[#ED0213]" />
                ) : null}
              </span>
              <span
                style={{
                  fontFamily: "Fredoka, sans-serif",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "1.25",
                  color: "#535353",
                }}
              >
                {option}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
