import Image from "next/image";
import Link from "next/link";
import EmailLink from "@/components/ui/EmailLink";

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(180deg, #E5E5E5 0%, #C67C7C 100%)",
        padding: "clamp(24px,4vw,40px) clamp(16px,5vw,60px)",
        width: "100%",
      }}
    >
      <div
        style={{
          maxWidth: "1488px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        {/* Top */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "40px",
            width: "100%",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              flex: "1 1 220px",
              maxWidth: "300px",
            }}
          >
            <Link href="/" aria-label="Go to homepage">
              <Image
                      draggable={false}

                src="/images/Zirwa.png"
                alt="Zirwa Qurbani Service"
                width={180}
                height={80}
                style={{ width: "160px", height: "auto" }}
              />
            </Link>

            <div style={{ position: "relative", width: "200px" }}>
              <Image
                      draggable={false}

src="/images/DOWNLAOD THE APP GRP.png"
                alt="Download App"
                width={200}
                height={42}
                style={{ width: "100%", height: "auto" }}
              />

              <Link
                href="https://apps.apple.com/in/app/chop-chicks/id6755097602"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download on App Store"
                style={{
                  position: "absolute",
                  top: 0,
                  right: "54px",
                  width: "52px",
                  height: "100%",
                }}
              />

              <Link
                href="https://play.google.com/store/apps/details?id=com.chopandchicks.consumer&hl=en_IN"
                target="_blank"
                rel="noopener noreferrer"
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
              gap: "12px",
              flex: "1 1 180px",
              minWidth: "160px",
            }}
          >
            <h3
              style={{
                fontWeight: 600,
                fontSize: "18px",
                color: "#670004",
                margin: 0,
              }}
            >
              Legal
            </h3>

            {["Terms of Use", "Privacy Policy", "FAQs"].map((item) => (
              <Link
                key={item}
                href={
                  item === "Terms of Use"
                    ? "/terms"
                    : item === "Privacy Policy"
                    ? "/privacy-policy"
                    : "/faq"
                }
                style={{
                  fontSize: "15px",
                  color: "#000",
                  textDecoration: "none",
                }}
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              flex: "1 1 260px",
              minWidth: "220px",
            }}
          >
            <h3
              style={{
                fontWeight: 600,
                fontSize: "18px",
                color: "#670004",
                margin: 0,
              }}
            >
              Contact
            </h3>

            {/* Phone */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <span >
                 09844611400
              </span>
            </div>

            {/* Email */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <EmailLink />
            </div>

            {/* Address */}
            <div style={{ display: "flex", gap: "12px" }}>
              <span style={{ lineHeight: "20px" }}>
                #17, 2nd floor II stage, Indiranagar, Bengaluru, Karnataka -
                560038.
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            borderTop: "1px solid #82131B",
          }}
        />

        {/* Copyright */}
        <p
          style={{
            fontWeight: 500,
            fontSize: "13px",
            color: "#670004",
            textAlign: "center",
            margin: 0,
          }}
        >
          © Copyright 2026 Zirwa Qurbani Service | All Rights Reserved
        </p>
      </div>
    </footer>
  );
}