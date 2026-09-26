import * as React from "react";
import { EyeTracking } from "@/components/ui/eye-tracking";

export default function EyeTrackingDemo() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100vw",
        background: "#0c0c0e",
        overflow: "hidden",
        margin: 0,
        padding: 0,
      }}
    >
      <EyeTracking
        variant="cartoon"
        eyeSize={140}
        gap={40}
      />
    </div>
  );
}
