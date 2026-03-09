import Image from "next/image";

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(180deg, #E5E5E5 0%, #C67C7C 100%)",
        padding: "16px 12px",
        width: "100%",
      }}
    >
      <div
        style={{
          maxWidth: "1488px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            padding: "0 40px",
            width: "100%",
            gap: "24px",
          }}
        >
          {/* Logo + download */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: "8px",
              flexShrink: 0,
              width: "354px",
            }}
          >
            <Image
              src="/images/Zirwa.png"
              alt="Zirwa Qurbani Service"
              width={354}
              height={180}
              style={{ width: "180px", height: "auto" }}
            />

            {/* Download the app */}
            <div style={{ position: "relative", width: "354px" }}>
              <Image
                src="/images/DOWNLAOD THE APP GRP.png"
                alt="Download on App Store and Google Play"
                width={200}
                height={42}
                style={{ width: "200px", height: "auto", display: "block" }}
              />
              {/* App Store clickandable overlay (left ~51px icon area) */}
              <a
                href="#"
                aria-label="Download on the App Store"
                style={{
                  position: "absolute",
                  top: 0,
                  right: "54px",
                  width: "52px",
                  height: "100%",
                }}
              />
              {/* Google Play clickable overlay (rightmost ~51px icon area) */}
              <a
                href="#"
                aria-label="Get it on Google Play"
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "52px",
                  height: "100%",
                }}
              />
            </div>

          </div>

          {/* Legal */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "12px",
              width: "240px",
              flexShrink: 0,
            }}
          >
            <h3
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: "18px",
                lineHeight: "24px",
                color: "#670004",
                margin: 0,
              }}
            >
              Legal
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "8px",
              }}
            >
              {["Terms of Use", "Privacy Policy", "FAQs"].map((item) => (
                <a
                  key={item}
                  href={item === "Terms of Use" ? "/terms" : item === "Privacy Policy" ? "/privacy-policy" : "/faq"}
                  style={{
                    fontFamily: "'Fredoka', sans-serif",
                    fontWeight: 400,
                    fontSize: "15px",
                    lineHeight: "20px",
                    color: "#000000",
                    textDecoration: "none",
                  }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "12px",
              width: "287px",
              flexShrink: 0,
            }}
          >
            <h3
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: "18px",
                lineHeight: "24px",
                color: "#670004",
                margin: 0,
              }}
            >
              Contact
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "8px",
              }}
            >
              {/* Phone */}
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "12px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6.6 10.8a15.7 15.7 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.3c1.1.4 2.3.6 3.6.6a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C9.6 21 3 14.4 3 6a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.2 2.5.6 3.6a1 1 0 0 1-.3 1L6.6 10.8z"
                    fill="#670004"
                  />
                </svg>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: "100%", color: "#000" }}>
                  +91 7829916082
                </span>
              </div>

              {/* Email */}
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "12px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"
                    fill="#670004"
                  />
                </svg>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: "20px", color: "#000" }}>
                  mdkaleem@zirwafoods.com
                </span>
              </div>

              {/* Address */}
              <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "12px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
                  <path
                    d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
                    fill="#670004"
                  />
                </svg>
                <span style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: 400, fontSize: "15px", lineHeight: "20px", color: "#000" }}>
                  #17, 2nd floor II stage, Indiranagar, Bengaluru, Karnataka - 560038.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider + copyright */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
            width: "100%",
            padding: "0 40px",
            boxSizing: "border-box",
          }}
        >
          <div style={{ width: "100%", height: "0px", borderTop: "1.05px solid #82131B" }} />
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 500,
              fontSize: "13px",
              lineHeight: "18px",
              color: "#670004",
              textAlign: "center",
              margin: 0,
            }}
          >
            © Copyright 2026 Zirwa Qurbani Service | All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

