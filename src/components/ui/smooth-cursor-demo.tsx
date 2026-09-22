import { SmoothCursor } from "@/components/ui/smooth-cursor";

export default function SmoothCursorDemo() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0c0c0e",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <span style={{ fontSize: "20px", letterSpacing: "0.05em" }}>
        Move your mouse around to feel the smooth spring cursor
      </span>
      <SmoothCursor />
    </div>
  );
}
