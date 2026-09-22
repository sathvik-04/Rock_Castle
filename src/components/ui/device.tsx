"use client";

import React from "react";
import { cn } from "@/lib/utils";
import "./device.css";

export interface DeviceProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Source URL for the screen image. Defaults to "/rockcastle-logo.jpg" */
  src?: string;
  /** Alt text for the screen image */
  alt?: string;
  /** Custom children to render inside the mobile screen */
  children?: React.ReactNode;
  /** Target device width (e.g. 320, "320px", "360px") */
  width?: number | string;
  /** Mode for rendering default screen image: "cover" | "contain" | "branded" */
  mode?: "cover" | "contain" | "branded";
  /** Optional custom class for screen container */
  screenClassName?: string;
  /** Optional custom class for the image element */
  imageClassName?: string;
  /** Show the Dynamic Island cutout (default true) */
  showDynamicIsland?: boolean;
  /** Show the top status bar: time, wifi, battery (default true) */
  showStatusBar?: boolean;
  /** Show the bottom home indicator pill (default true) */
  showHomeIndicator?: boolean;
  /** Show hardware buttons on the sides (default true) */
  showButtons?: boolean;
  /** Show realistic glass glare reflection (default true) */
  showReflection?: boolean;
  /** Clock time displayed in status bar (default "9:41") */
  time?: string;
  /** Frame finish tint (default "titanium") */
  frameColor?: "titanium" | "black" | "silver";
}

export const Device = React.forwardRef<HTMLDivElement, DeviceProps>(
  (
    {
      src = "/rockcastle-logo.jpg",
      alt = "Rockcastle",
      children,
      width = 320,
      mode = "cover",
      className,
      screenClassName,
      imageClassName,
      showDynamicIsland = true,
      showStatusBar = true,
      showHomeIndicator = true,
      showButtons = true,
      showReflection = true,
      time = "9:41",
      frameColor = "titanium",
      style,
      ...props
    },
    ref
  ) => {
    const formattedWidth = typeof width === "number" ? `${width}px` : width;

    return (
      <div
        ref={ref}
        className={cn("rc-device-wrapper", className)}
        style={
          {
            "--device-w": formattedWidth,
            ...(frameColor === "black"
              ? { "--frame-color": "#111113", "--frame-edge": "#1e1e22" }
              : frameColor === "silver"
              ? { "--frame-color": "#2c2d33", "--frame-edge": "#70737f" }
              : {}),
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {/* Phone hardware body */}
        <div className="rc-device-body">
          {/* Top speaker grill */}
          <div className="rc-device-speaker" aria-hidden="true" />

          {/* Left hardware buttons & antenna bands */}
          {showButtons && (
            <div className="rc-device-buttons-left" aria-hidden="true">
              <div className="rc-device-btn-action" title="Action Button" />
              <div className="rc-device-btn-volup" title="Volume Up" />
              <div className="rc-device-btn-voldown" title="Volume Down" />
              <div className="rc-device-antenna rc-device-antenna-tl" />
              <div className="rc-device-antenna rc-device-antenna-bl" />
            </div>
          )}

          {/* Right hardware button & antenna bands */}
          {showButtons && (
            <div className="rc-device-buttons-right" aria-hidden="true">
              <div className="rc-device-btn-power" title="Side Button" />
              <div className="rc-device-antenna rc-device-antenna-tr" />
              <div className="rc-device-antenna rc-device-antenna-br" />
            </div>
          )}

          {/* Mobile Screen */}
          <div className={cn("rc-device-screen", screenClassName)}>
            {/* Dynamic Island pill */}
            {showDynamicIsland && (
              <div className="rc-device-dynamic-island" aria-hidden="true">
                <div className="rc-device-sensor" />
                <div className="rc-device-lens" />
              </div>
            )}

            {/* iOS Status Bar */}
            {showStatusBar && (
              <div className="rc-device-status-bar" aria-hidden="true">
                <span className="rc-device-status-time">{time}</span>
                <div className="rc-device-status-icons">
                  {/* Cellular Signal Icon */}
                  <svg
                    className="rc-device-icon-signal"
                    width="14"
                    height="10"
                    viewBox="0 0 17 11"
                    fill="none"
                  >
                    <rect x="0" y="8" width="2.5" height="3" rx="0.5" fill="currentColor" />
                    <rect x="4" y="5.5" width="2.5" height="5.5" rx="0.5" fill="currentColor" />
                    <rect x="8" y="3" width="2.5" height="8" rx="0.5" fill="currentColor" />
                    <rect x="12" y="0.5" width="2.5" height="10.5" rx="0.5" fill="currentColor" />
                  </svg>
                  {/* Wi-Fi Icon */}
                  <svg
                    className="rc-device-icon-wifi"
                    width="13"
                    height="10"
                    viewBox="0 0 14 10"
                    fill="currentColor"
                  >
                    <path d="M7 8.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zm4.07-2.93a5.75 5.75 0 0 0-8.14 0 .62.62 0 1 1-.88-.88 7 7 0 0 1 9.9 0 .62.62 0 1 1-.88.88zm2.47-2.48a9.25 9.25 0 0 0-13.08 0 .62.62 0 0 1-.88-.88 10.5 10.5 0 0 1 14.84 0 .62.62 0 1 1-.88.88z" />
                  </svg>
                  {/* Battery Icon */}
                  <svg
                    className="rc-device-icon-battery"
                    width="20"
                    height="10"
                    viewBox="0 0 24 12"
                    fill="none"
                  >
                    <rect
                      x="0.75"
                      y="0.75"
                      width="19.5"
                      height="10.5"
                      rx="3.25"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <rect x="2.5" y="2.5" width="13" height="7" rx="1.5" fill="currentColor" />
                    <path
                      d="M22 4.2C22.6 4.6 23 5.3 23 6C23 6.7 22.6 7.4 22 7.8"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            )}

            {/* Screen Inner Content */}
            <div
              className="rc-device-screen-content"
              style={src.includes("rockcastle-logo") ? { backgroundColor: "#e8590c" } : undefined}
            >
              {children ? (
                children
              ) : mode === "branded" ? (
                <div className="rc-device-rockcastle-screen">
                  <img
                    src={src}
                    alt={alt}
                    className={cn("rc-device-rockcastle-logo", imageClassName)}
                  />
                  <span className="rc-device-rockcastle-tag">Experiences Un-Ltd</span>
                </div>
              ) : (
                <img
                  src={src}
                  alt={alt}
                  className={cn("rc-device-screen-img", imageClassName)}
                  style={{
                    objectFit: src.includes("rockcastle-logo") ? "contain" : (mode === "contain" ? "contain" : "cover"),
                    width: "100%",
                    height: "100%",
                  }}
                />
              )}
            </div>

            {/* Glass sheen / reflection */}
            {showReflection && <div className="rc-device-reflection" aria-hidden="true" />}

            {/* Bottom Home Indicator Bar */}
            {showHomeIndicator && <div className="rc-device-home-bar" aria-hidden="true" />}
          </div>
        </div>
      </div>
    );
  }
);

Device.displayName = "Device";

export default Device;
