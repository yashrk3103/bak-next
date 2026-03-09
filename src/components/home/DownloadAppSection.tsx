import Image from "next/image";

function AppleStoreBadge() {
  return (
    <a
      href="#"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "190px",
        height: "64px",
        background: "#000",
        borderRadius: "12px",
        textDecoration: "none",
        gap: "10px",
        flexShrink: 0,
      }}
    >
      <svg width="28" height="34" viewBox="0 0 36 44" fill="none">
        <path
          d="M29.9 23.3c0-5.3 4.3-7.8 4.5-7.9-2.4-3.6-6.2-4-7.6-4.1-3.2-.3-6.3 1.9-7.9 1.9-1.6 0-4.1-1.9-6.8-1.8-3.5.1-6.7 2-8.5 5.1C-.6 22.8 1.6 32 5.2 37.1c1.8 2.6 3.9 5.4 6.7 5.3 2.7-.1 3.7-1.7 7-1.7 3.2 0 4.1 1.7 6.9 1.6 2.9-.1 4.7-2.6 6.5-5.2 2-2.9 2.9-5.8 2.9-5.9-.1-.1-5.3-2-5.3-8z"
          fill="#fff"
        />
        <path
          d="M25 8.3C26.5 6.5 27.5 4 27.2 1.5c-2.2.1-4.9 1.5-6.4 3.3-1.4 1.6-2.6 4.2-2.3 6.6 2.5.2 5-1.3 6.5-3.1z"
          fill="#fff"
        />
      </svg>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "9px",
            color: "#fff",
            opacity: 0.8,
          }}
        >
          Download on the
        </span>
        <span
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: "17px",
            color: "#fff",
            lineHeight: "20px",
          }}
        >
          App Store
        </span>
      </div>
    </a>
  );
}

function PlayStoreBadge() {
  return (
    <a
      href="#"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "200px",
        height: "64px",
        background: "#000",
        borderRadius: "12px",
        textDecoration: "none",
        gap: "10px",
        flexShrink: 0,
      }}
    >
      <svg width="28" height="32" viewBox="0 0 36 40" fill="none">
        <path d="M1 1.5L20.5 21 1 40.5V1.5z" fill="#32BBFF" />
        <path d="M1 1.5l26 13.2L20.5 21 1 1.5z" fill="#32BBFF" />
        <path d="M27 14.7L1 1.5l19.5 19.5L27 14.7z" fill="#32BBFF" opacity="0.7" />
        <path d="M1 40.5l19.5-19.5 6.5 6.3L1 40.5z" fill="#32BBFF" opacity="0.7" />
        <path d="M27 25.3L20.5 21l6.5-6.3 5.5 3.1a3 3 0 0 1 0 5.4L27 25.3z" fill="#FFBC00" />
        <path d="M1 40.5l25-12.3-5.5-7.2L1 40.5z" fill="#FF3333" />
        <path d="M1 1.5l25 12.3-5.5 7.2L1 1.5z" fill="#00EE76" />
      </svg>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "9px",
            color: "#fff",
            opacity: 0.8,
          }}
        >
          Get it on
        </span>
        <span
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: "17px",
            color: "#fff",
            lineHeight: "20px",
          }}
        >
          Google Play
        </span>
      </div>
    </a>
  );
}

export default function DownloadAppSection() {
  return (
    <section style={{ background: "#fff", padding: "80px 88px" }}>
      <div
        style={{
          maxWidth: "1336px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "162px",
        }}
      >
        {/* Left — text + badges */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "40px",
            width: "624px",
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: "64px",
              lineHeight: "96px",
              color: "#000000",
              margin: 0,
              alignSelf: "stretch",
            }}
          >
            Download the App
          </h2>

          <p
            style={{
              fontFamily: "'Fredoka', sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              lineHeight: "29px",
              color: "#828282",
              margin: 0,
              width: "566px",
            }}
          >
            Fresh meat delivered safely to your doorstep with easy ordering and
            real-time tracking. Enjoy premium quality cuts, carefully packed for
            the smartest and fastest meat shopping experience.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "22px",
            }}
          >
            <AppleStoreBadge />
            <PlayStoreBadge />
          </div>
        </div>

        {/* Right — app mockup image */}
        <div style={{ flexShrink: 0 }}>
          <Image
            src="/images/mobile.png"
            alt="Zirwa app preview"
            width={530}
            height={497}
            style={{ width: "530px", height: "auto", display: "block" }}
            priority
          />
        </div>
      </div>
    </section>
  );
}
