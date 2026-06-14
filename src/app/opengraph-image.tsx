import { ImageResponse } from "next/og";

// Imagen Open Graph / Twitter por defecto para todo el sitio (1200x630).
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "TuChat — Chat gratis en español";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 38, opacity: 0.85, display: "flex" }}>💬 tuchat.org</div>
        <div style={{ fontSize: 92, fontWeight: 800, marginTop: 24, lineHeight: 1.05 }}>
          Chat gratis en español
        </div>
        <div style={{ fontSize: 40, opacity: 0.9, marginTop: 28, maxWidth: 900 }}>
          Salas por países, ciudades y temáticas. Conoce gente y conversa en tiempo real, sin
          registro.
        </div>
      </div>
    ),
    size,
  );
}
