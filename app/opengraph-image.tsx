import { ImageResponse } from "next/og";
import { site } from "@/lib/data";

export const size = { width: 1200, height: 630 };
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
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "90px",
          background: "#050505",
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(59,130,246,0.35), transparent 55%), radial-gradient(circle at 15% 85%, rgba(16,185,129,0.28), transparent 50%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 26,
            color: "#a1a1aa",
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 28,
          }}
        >
          Founder &amp; Software Engineer
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 600,
            color: "#f5f5f7",
            letterSpacing: -2,
            lineHeight: 1.05,
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 32,
            color: "#d4d4d8",
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          {site.statement}
        </div>
      </div>
    ),
    { ...size }
  );
}
