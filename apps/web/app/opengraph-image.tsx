import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background: "#0b0b0c",
          color: "#f4f4f5",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 40,
          }}
        >
          {["#7f77dd", "#1d9e75", "#d85a30", "#d4537e", "#378add"].map((color) => (
            <div key={color} style={{ width: 60, height: 84, background: color, borderRadius: 8 }} />
          ))}
        </div>
        <div style={{ fontSize: 64, fontWeight: 600 }}>Kaeru</div>
        <div style={{ fontSize: 28, color: "#a1a1aa", marginTop: 16, maxWidth: 800, textAlign: "center" }}>
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    { ...size },
  );
}
