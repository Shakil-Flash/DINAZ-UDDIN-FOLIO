import { ImageResponse } from "next/og";

export const alt = "Dinaz Uddin — Electrical Diploma Engineer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#090a0f",
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(180, 255, 57, 0.08) 0%, transparent 60%), linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 48px 48px, 48px 48px",
          padding: "64px 72px",
          fontFamily: "sans-serif",
          color: "#f8fafc",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {/* Border accent */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            right: 24,
            bottom: 24,
            border: "1px solid rgba(180, 255, 57, 0.2)",
            borderRadius: 16,
            pointerEvents: "none",
          }}
        />

        {/* Top bar with category badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              backgroundColor: "rgba(180, 255, 57, 0.1)",
              border: "1px solid rgba(180, 255, 57, 0.3)",
              padding: "8px 18px",
              borderRadius: 8,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: "#b4ff39",
              }}
            />
            <span
              style={{
                color: "#b4ff39",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              TECHNICAL PORTFOLIO & SCHEMATICS
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#64748b",
              fontSize: 14,
              fontFamily: "monospace",
            }}
          >
            <span>SYSTEM SPEC: 415V / 11kV</span>
            <span>•</span>
            <span>REV 2026.05</span>
          </div>
        </div>

        {/* Center content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            maxWidth: 900,
          }}
        >
          <h1
            style={{
              fontSize: 68,
              fontWeight: 900,
              lineHeight: 1.05,
              color: "#ffffff",
              margin: 0,
              letterSpacing: -1.5,
            }}
          >
            Dinaz Uddin
          </h1>

          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#b4ff39",
              letterSpacing: -0.5,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span>Electrical Diploma Engineer</span>
            <span style={{ color: "#475569" }}>—</span>
            <span style={{ color: "#94a3b8", fontSize: 22, fontWeight: 400 }}>
              Systems & Digital Infrastructure
            </span>
          </div>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.5,
              color: "#94a3b8",
              margin: 0,
              marginTop: 8,
              maxWidth: 780,
            }}
          >
            Electrical circuit analysis, industrial motor control schematics,
            11kV/415V substation distribution diagrams, and resilient digital architectures.
          </p>
        </div>

        {/* Bottom Technical Indicators */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: 24,
            width: "100%",
          }}
        >
          <div style={{ display: "flex", gap: 12 }}>
            {[
              "Circuit Theory",
              "Power Distribution",
              "Motor Control (Star-Delta)",
              "Next.js Systems",
            ].map((skill) => (
              <div
                key={skill}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "6px 14px",
                  borderRadius: 6,
                  fontSize: 13,
                  color: "#cbd5e1",
                  fontFamily: "monospace",
                }}
              >
                {skill}
              </div>
            ))}
          </div>

          <div
            style={{
              fontSize: 14,
              fontFamily: "monospace",
              color: "#b4ff39",
              fontWeight: 600,
            }}
          >
            dinazuddin.dev
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
