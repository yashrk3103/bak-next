"use client";

interface DynamicQurbaniInputsProps {
  quantity: number;
  names: string[];
  onChange: (index: number, value: string) => void;
}

export default function DynamicQurbaniInputs({
  quantity,
  names,
  onChange,
}: DynamicQurbaniInputsProps) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: quantity }).map((_, index) => (
        <div
          key={index}
          className="flex items-center"
          style={{
            border: "1px solid #D8DADC",
            borderRadius: "10px",
            padding: "14px 16px",
            background: "#FFFFFF",
          }}
        >
          <input
            maxLength={30}
            type="text"
            value={names[index] || ""}
            onChange={(e) => onChange(index, e.target.value)}
            placeholder={`Qurbani Name ${index + 1}`}
            className="w-full border-none bg-transparent outline-none"
            style={{
              fontFamily: "Fredoka, sans-serif",
              fontSize: "16px",
              color: "#000000",
            }}
          />
        </div>
      ))}
    </div>
  );
}
