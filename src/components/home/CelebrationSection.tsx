import { WHATSAPP_NUMBER } from "@/lib/constants";
import Image from "next/image";


function ArrowButton({ bgColor }: { bgColor: string }) {
  return (
    <div
      style={{
        position: "relative",
        width: "clamp(36px,4vw,46px)",
        height: "clamp(36px,4vw,46px)",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: bgColor,
        }}
      />

      <svg
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
      >
        <path
          d="M3 15L15 3M15 3H7M15 3V11"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

interface CtaButtonProps {
  label: string;
  labelColor: string;
  buttonText: string;
  circleColor: string;
  width?: number;
  href?: string;
  onClick?: () => void;
}

function CtaButton({
  label,
  labelColor,
  buttonText,
  circleColor,
  width,
  href,
  onClick,
}: CtaButtonProps) {
  const Tag = href ? "a" : "button";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "12px",
        width: "100%",
        maxWidth: width ? `${width}px` : "100%",
      }}
    >
      <p
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 500,
          fontSize: "clamp(14px,1.3vw,20px)",
          lineHeight: "1.6",
          color: labelColor,
          margin: 0,
        }}
      >
        {label}
      </p>

      <Tag
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0px 8px 0px 18px",
          gap: "16px",
          width: "100%",
          height: "clamp(46px,5vw,56px)",
          background: "#FFE4E4",
          border: "1.43px solid #82131B",
          borderRadius: "60px",
          cursor: "pointer",
          textDecoration: "none",
        }}
      >
        <span
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 500,
            fontSize: "clamp(13px,1.1vw,20px)",
            lineHeight: "1.2",
            color: "#000",
            whiteSpace: "nowrap",
          }}
        >
          {buttonText}
        </span>

        <ArrowButton bgColor={circleColor} />
      </Tag>
    </div>
  );
}

interface CelebrationSectionProps {
  onBookNow: () => void;
}

export default function CelebrationSection({ onBookNow }: CelebrationSectionProps) {
  return (
    <section
      style={{
        background: "#fff",
        padding: "clamp(40px,8vw,80px) clamp(20px,6vw,88px)",
      }}
    >
      <div
        style={{
          maxWidth: "1336px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "clamp(40px,6vw,120px)",
        }}
      >
        {/* LEFT TEXT */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            flex: "1 1 500px",
            maxWidth: "738px",
          }}
        >
          <h2
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(28px,3.5vw,48px)",
              lineHeight: "1.15",
              letterSpacing: "-1px",
              color: "#82131B",
              margin: 0,
            }}
          >
            Your Qurbani, Their Celebration
          </h2>

          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              fontSize: "clamp(14px,1.3vw,20px)",
              lineHeight: "1.75",
              color: "#313131",
              margin: 0,
            }}
          >
            For many families, Bakrid is the only time in the year they taste
            meat. Your Qurbani brings joy to their homes, nourishment to their
            children, and dignity to their celebration. When you outsource your
            Qurbani responsibly and with sincerity, you multiply its reward.
          </p>
        </div>

        {/* RIGHT BUTTONS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            flex: "1 1 280px",
            maxWidth: "360px",
            width: "100%",
          }}
        >
          <CtaButton
            label="Ready to Proceed?"
            labelColor="#670004"
            buttonText="Book Qurbani Now"
            circleColor="#000"
            onClick={onBookNow}
          />

          <CtaButton
            label="Have Questions or Need Clarification?"
            labelColor="#05700D"
            buttonText="Chat on WhatsApp"
            circleColor="#60D669"

            href={`https://wa.me/${WHATSAPP_NUMBER}`}
          />
        </div>
      </div>


      {/*
        Gallery Grid
        ┌──────────┬──────────┬──────────┐
        │    A     │    C     │    D     │
        ├──────────┼──────────┴──────────┤
        │    B     │         E           │
        └──────────┴─────────────────────┘
      */}
      <div
        style={{
          maxWidth: "1336px",
          margin: "clamp(32px,5vw,60px) auto 0",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: "clamp(10px,1.2vw,16px)",
          gridTemplateAreas: `
            "a c d"
            "b e e"
          `,
          height: "clamp(420px,50vw,660px)",
        }}
      >
        {/* A — top left */}
        <div
          style={{
            gridArea: "a",
            borderRadius: "clamp(14px,1.4vw,22px)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Image
            draggable={false}
            src="/images/hero-bg-6.png"
            alt="Qurbani family"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        {/* B — bottom left */}
        <div
          style={{
            gridArea: "b",
            borderRadius: "clamp(14px,1.4vw,22px)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Image
            draggable={false}
            src="/images/hero_slide.png"
            alt="Qurbani recipient"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: "cover", objectPosition: "center top" }}
          />
        </div>

        {/* C — top center */}
        <div
          style={{
            gridArea: "c",
            borderRadius: "clamp(14px,1.4vw,22px)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Image
            draggable={false}
            src="/images/hero-bg-4.png"
            alt="Qurbani celebration"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        {/* D — top right */}
        <div
          style={{
            gridArea: "d",
            borderRadius: "clamp(14px,1.4vw,22px)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Image
            draggable={false}
            src="/images/hero-bg-5.png"
            alt="Qurbani distribution"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>

        {/* E — bottom center + right, spans 2 columns */}
        <div
          style={{
            gridArea: "e",
            borderRadius: "clamp(14px,1.4vw,22px)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Image
            draggable={false}
            src="/images/hero-bg-2.png"
            alt="Qurbani joy"
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            style={{ objectFit: "cover", objectPosition: "top" }}
          />
        </div>
      </div>
    </section>
  );
}