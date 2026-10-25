import { ImageResponse } from "next/og";
import { SITE } from "@/constants/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
          color: "#f8fafc",
          fontFamily: "system-ui, sans-serif",
          padding: 64,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "linear-gradient(135deg, #5b5bd6, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 800,
            }}
          >
            C
          </div>
          <span style={{ fontSize: 56, fontWeight: 800 }}>{SITE.name}</span>
        </div>
        <p style={{ fontSize: 32, color: "#cbd5e1", textAlign: "center", maxWidth: 900, lineHeight: 1.4 }}>
          {SITE.tagline}
        </p>
      </div>
    ),
    { ...size },
  );
}
