"use client";

interface OrderPanelHeaderProps {
  onClose: () => void;
  title: string;
}

export default function OrderPanelHeader({ onClose, title }: OrderPanelHeaderProps) {
  return (
    <div
      className="flex items-center gap-6 border-b border-black/20 px-4 py-5 sm:px-[22px] sm:py-[17px]"
      style={{
        background: "#FFBABC",
        borderRadius: "24px 0px 0px 0px",
        minHeight: "90px",
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="inline-flex h-auto w-10 flex-shrink-0 items-center justify-center hover:opacity-80"
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
          fontSize: "clamp(22px, 2vw, 28px)",
          lineHeight: "1.1",
          color: "#494949",
          textAlign: "center",
          flex: 1,
          paddingRight: "40px",
        }}
      >
        {title}
      </h2>
    </div>
  );
}
