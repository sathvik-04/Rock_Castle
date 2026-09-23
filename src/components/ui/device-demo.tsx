import { Device } from "@/components/ui/device";

export default function DeviceDemo() {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "48px",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px",
        background: "#0c0c0e",
        minHeight: "100vh",
      }}
    >
      {/* 1. Default with Rockcastle Video */}
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#aaa", marginBottom: "16px", fontSize: "14px", letterSpacing: "0.05em" }}>
          DEFAULT — ROCKCASTLE VIDEO
        </p>
        <Device width={320} src="/images/video1.mp4" alt="Rockcastle" />
      </div>

      {/* 2. Branded Wallpaper Presentation */}
      <div style={{ textAlign: "center" }}>
        <p style={{ color: "#aaa", marginBottom: "16px", fontSize: "14px", letterSpacing: "0.05em" }}>
          BRANDED PRESENTATION
        </p>
        <Device width={320} mode="branded" src="/images/video1.mp4" alt="Rockcastle" />
      </div>
    </div>
  );
}
