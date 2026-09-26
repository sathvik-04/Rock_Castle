"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface EyeTrackingProps {
  /** Additional CSS classes */
  className?: string;
  /** Size of each eye in pixels */
  eyeSize?: number;
  /** Gap between eyes in pixels */
  gap?: number;
  /** Color of the iris */
  irisColor?: string;
  /** Secondary iris color for gradient */
  irisColorSecondary?: string;
  /** Pupil color */
  pupilColor?: string;
  /** Sclera (white) color */
  scleraColor?: string;
  /** How far the pupil can travel (0-1) */
  pupilRange?: number;
  /** Enable the reflection/glint effect */
  showReflection?: boolean;
  /** Enable iris detail pattern */
  showIrisDetail?: boolean;
  /** Enable subtle idle animation when cursor is away */
  idleAnimation?: boolean;
  /** Blink interval in milliseconds (0 to disable) */
  blinkInterval?: number;
  /** Number of eyes */
  eyeCount?: number;
  /** Variant style */
  variant?: "realistic" | "cartoon" | "minimal" | "cyber";
  /** Enable reactive pupil dilation */
  reactivePupil?: boolean;
  /** Eyelid visibility */
  showEyelids?: boolean;
}

interface EyeProps {
  eyeSize: number;
  irisColor: string;
  irisColorSecondary: string;
  pupilColor: string;
  scleraColor: string;
  pupilRange: number;
  showReflection: boolean;
  showIrisDetail: boolean;
  blinkInterval: number;
  variant: "realistic" | "cartoon" | "minimal" | "cyber";
  reactivePupil: boolean;
  showEyelids: boolean;
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
  index: number;
}

function Eye({
  eyeSize,
  irisColor,
  irisColorSecondary,
  pupilColor,
  scleraColor,
  pupilRange,
  showReflection,
  showIrisDetail,
  blinkInterval,
  variant,
  reactivePupil,
  showEyelids,
  mouseX,
  mouseY,
}: EyeProps) {
  const eyeRef = React.useRef<HTMLDivElement>(null);
  const [isBlinking, setIsBlinking] = React.useState(false);
  const [pupilScale, setPupilScale] = React.useState(1);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 22, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 220, damping: 22, mass: 0.6 });

  const irisSize = eyeSize * 0.46;
  const pupilSize = irisSize * 0.52;
  const maxOffset = (eyeSize / 2 - irisSize / 2) * pupilRange;

  // Blink animation
  React.useEffect(() => {
    if (blinkInterval <= 0) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;

    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 140);
    };

    const randomOffset = Math.random() * 250;
    timeoutId = setTimeout(() => {
      blink();
      intervalId = setInterval(blink, blinkInterval + Math.random() * 800);
    }, randomOffset);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [blinkInterval]);

  // Track mouse position and update pupil
  React.useEffect(() => {
    let animFrame: number;

    const update = () => {
      if (!eyeRef.current) {
        animFrame = requestAnimationFrame(update);
        return;
      }

      const rect = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const dx = mouseX.current - eyeCenterX;
      const dy = mouseY.current - eyeCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      // Smooth progressive tracking across full screen distance (up to 700px)
      const trackingRadius = 700;
      const normalized = Math.min(1, Math.pow(distance / trackingRadius, 0.52));
      const offset = normalized * maxOffset;

      x.set(Math.cos(angle) * offset);
      y.set(Math.sin(angle) * offset);

      // Reactive pupil dilation based on distance
      if (reactivePupil) {
        const proximityScale =
          distance < 180
            ? 1.25 - (distance / 180) * 0.25
            : 0.88 + (Math.min(distance, 800) / 800) * 0.14;
        setPupilScale(proximityScale);
      }

      animFrame = requestAnimationFrame(update);
    };

    animFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animFrame);
  }, [x, y, maxOffset, reactivePupil, mouseX, mouseY]);

  // Rotation transform for iris detail
  const irisRotation = useTransform(springX, [-maxOffset, maxOffset], [-15, 15]);

  const eyeAspect = variant === "cartoon" ? 1 : 0.88;
  const eyeWidth = eyeSize;
  const eyeHeight = eyeSize * eyeAspect;

  const scleraGradient =
    variant === "realistic"
      ? `radial-gradient(circle at 35% 35%, ${scleraColor} 0%, ${scleraColor}ee 65%, ${scleraColor}cc 100%)`
      : variant === "cyber"
        ? `radial-gradient(circle at 50% 50%, #0a0a1a 0%, #111128 100%)`
        : `radial-gradient(circle at 45% 45%, #ffffff 0%, ${scleraColor} 70%, #ece8db 100%)`;

  return (
    <motion.div
      ref={eyeRef}
      style={{
        position: "relative",
        overflow: "hidden",
        width: eyeWidth,
        height: eyeHeight,
        borderRadius: "50%",
        background: scleraGradient,
        boxShadow:
          variant === "cartoon"
            ? "inset 0 3px 10px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.35)"
            : "inset 0 2px 8px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.2)",
        border: "2px solid rgba(242, 239, 163, 0.35)",
        flexShrink: 0,
      }}
      animate={{
        scaleY: isBlinking ? 0.05 : 1,
      }}
      transition={{
        scaleY: { duration: 0.1, ease: "easeInOut" },
      }}
    >
      {/* Iris */}
      <motion.div
        style={{
          position: "absolute",
          width: irisSize,
          height: irisSize,
          borderRadius: "50%",
          left: (eyeWidth - irisSize) / 2,
          top: (eyeHeight - irisSize) / 2,
          x: springX,
          y: springY,
          background:
            variant === "cyber"
              ? `conic-gradient(from 0deg, ${irisColor}, ${irisColorSecondary}, ${irisColor})`
              : `radial-gradient(circle at 38% 38%, ${irisColorSecondary}, ${irisColor} 65%, #c8c366 100%)`,
          boxShadow: "inset 0 1px 5px rgba(0,0,0,0.25), 0 0 1px rgba(0,0,0,0.15)",
        }}
      >
        {/* Iris detail fibers */}
        {showIrisDetail && (
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              overflow: "hidden",
              rotate: irisRotation,
              pointerEvents: "none",
            }}
          >
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transformOrigin: "left center",
                  width: irisSize * 0.44,
                  height: "1px",
                  background: `linear-gradient(to right, transparent 15%, ${irisColor}66 50%, transparent 85%)`,
                  transform: `rotate(${i * 18}deg)`,
                  opacity: 0.35 + (i % 3) * 0.15,
                }}
              />
            ))}
            <div
              style={{
                position: "absolute",
                inset: "20%",
                borderRadius: "50%",
                border: `1px solid ${irisColor}44`,
              }}
            />
          </motion.div>
        )}

        {/* Pupil - 100% Round Circle (Never a square box) */}
        <motion.div
          style={{
            position: "absolute",
            width: pupilSize,
            height: pupilSize,
            borderRadius: "50%",
            left: (irisSize - pupilSize) / 2,
            top: (irisSize - pupilSize) / 2,
            backgroundColor: pupilColor,
            boxShadow: "0 0 4px rgba(0,0,0,0.45)",
          }}
          animate={{
            scale: reactivePupil ? pupilScale : 1,
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        />

        {/* Primary light reflection glint - Round */}
        {showReflection && (
          <>
            <div
              style={{
                position: "absolute",
                borderRadius: "50%",
                width: pupilSize * 0.36,
                height: pupilSize * 0.36,
                left: irisSize * 0.28,
                top: irisSize * 0.22,
                background: "radial-gradient(circle, rgba(255,255,255,0.98), rgba(255,255,255,0.7))",
                filter: "blur(0.4px)",
                pointerEvents: "none",
              }}
            />
            {/* Secondary subtle reflection glint - Round */}
            <div
              style={{
                position: "absolute",
                borderRadius: "50%",
                width: pupilSize * 0.18,
                height: pupilSize * 0.18,
                left: irisSize * 0.6,
                top: irisSize * 0.6,
                background: "rgba(255,255,255,0.75)",
                pointerEvents: "none",
              }}
            />
          </>
        )}
      </motion.div>

      {/* Top eyelid shadow */}
      {showEyelids && (
        <>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: eyeHeight * 0.32,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, transparent 100%)",
              borderRadius: "50% 50% 0 0",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: eyeHeight * 0.18,
              background: "linear-gradient(to top, rgba(0,0,0,0.06) 0%, transparent 100%)",
              borderRadius: "0 0 50% 50%",
              pointerEvents: "none",
            }}
          />
        </>
      )}
    </motion.div>
  );
}

export function EyeTracking({
  className = "",
  eyeSize = 96,
  gap = 24,
  irisColor = "#f2efa3",
  irisColorSecondary = "#dfdc85",
  pupilColor = "#0d0e0c",
  scleraColor = "#faf9eb",
  pupilRange = 0.72,
  showReflection = true,
  showIrisDetail = true,
  idleAnimation = true,
  blinkInterval = 3800,
  eyeCount = 2,
  variant = "cartoon",
  reactivePupil = true,
  showEyelids = true,
}: EyeTrackingProps) {
  const mouseX = React.useRef(typeof window !== "undefined" ? window.innerWidth / 2 : 0);
  const mouseY = React.useRef(typeof window !== "undefined" ? window.innerHeight / 2 : 0);
  const isMounted = typeof window !== "undefined";

  // Global mouse tracker with robust coordinates and clean idle glance
  React.useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    let idleInterval: ReturnType<typeof setInterval> | null = null;
    let isUserActive = false;

    const onUserMove = (clientX: number, clientY: number) => {
      isUserActive = true;
      if (idleInterval) {
        clearInterval(idleInterval);
        idleInterval = null;
      }
      if (idleTimer) {
        clearTimeout(idleTimer);
      }

      mouseX.current = clientX;
      mouseY.current = clientY;

      if (idleAnimation) {
        // Only trigger gentle curiosity after 3.5s of no cursor activity
        idleTimer = setTimeout(() => {
          isUserActive = false;
          const baseX = clientX;
          const baseY = clientY;
          idleInterval = setInterval(() => {
            if (isUserActive) return;
            const glanceAngle = Math.random() * Math.PI * 2;
            const glanceDist = 30 + Math.random() * 50;
            mouseX.current = baseX + Math.cos(glanceAngle) * glanceDist;
            mouseY.current = baseY + Math.sin(glanceAngle) * glanceDist;
          }, 2400);
        }, 3500);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      onUserMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        onUserMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      if (idleTimer) clearTimeout(idleTimer);
      if (idleInterval) clearInterval(idleInterval);
    };
  }, [idleAnimation]);

  if (!isMounted) {
    return (
      <div
        className={className}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap,
        }}
      >
        {[...Array(eyeCount)].map((_, i) => (
          <div
            key={i}
            style={{
              width: eyeSize,
              height: eyeSize * 0.88,
              borderRadius: "50%",
              backgroundColor: "#2a2a28",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap,
        userSelect: "none",
      }}
    >
      {[...Array(eyeCount)].map((_, i) => (
        <Eye
          key={i}
          index={i}
          eyeSize={eyeSize}
          irisColor={irisColor}
          irisColorSecondary={irisColorSecondary}
          pupilColor={pupilColor}
          scleraColor={scleraColor}
          pupilRange={pupilRange}
          showReflection={showReflection}
          showIrisDetail={showIrisDetail}
          blinkInterval={blinkInterval}
          variant={variant}
          reactivePupil={reactivePupil}
          showEyelids={showEyelids}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      ))}
    </div>
  );
}

export default EyeTracking;
