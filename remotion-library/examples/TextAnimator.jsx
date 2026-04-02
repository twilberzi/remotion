import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Figtree";
loadFont();

/**
 * TextAnimator — Remotion port of "Text Animators [Timed].aegraphic"
 *
 * Props:
 *   bullets      — array of { text: string, endFrame: number }
 *                  endFrame = the frame at which the bullet is fully visible
 *                  animation plays from (endFrame - animFrames) → endFrame
 *   animStyle    — "rise" | "scaleUp" | "shiftLeft" | "shiftRight" | "cut"
 *   fontSize     — number, default 36
 *   fontWeight   — string/number, default 800 (Figtree Bold)
 *   lineHeight   — number, default 1.2
 *   color        — text color, default "#1e2d5a"
 *   align        — "left" | "center" | "right", default "left"
 *   animFrames   — duration of each bullet's animation in frames, default 17 (0.7s @ 23.976fps)
 *   x            — left offset in px, default 0
 *   y            — top offset in px, default 0
 *   lineGap      — extra gap between lines in px, default 12
 */

// quartInOut — matches the AE expression exactly
// t=0→0, t=0.5→0.5, t=1→1, very aggressive ease in and out
function quartInOut(t) {
  t = Math.max(0, Math.min(1, t));
  if (t < 0.5) return 8 * t * t * t * t;
  const u = 1 - t;
  return 1 - 8 * u * u * u * u;
}

// Per-bullet progress: 0 before start, 0→1 during animation, 1 after complete
function bulletProgress(frame, endFrame, animFrames) {
  const startFrame = endFrame - animFrames;
  if (frame >= endFrame) return 1;
  if (frame < startFrame) return 0;
  const raw = (frame - startFrame) / animFrames;
  return quartInOut(raw);
}

// Animation style → transform/opacity given progress 0→1
function getStyle(animStyle, progress, fontSize) {
  const inv = 1 - progress;

  switch (animStyle) {
    case "rise": {
      // Rise to the Right: translate up+right while fading in
      const tx = -inv * fontSize * 0.3;
      const ty =  inv * fontSize * 1.0;
      return {
        opacity: progress,
        transform: `translate(${tx}px, ${ty}px)`,
      };
    }
    case "scaleUp": {
      // Scale Up: grow from ~40% + fade in, anchored left
      const scale = 0.4 + 0.6 * progress;
      return {
        opacity: progress,
        transform: `scale(${scale})`,
        transformOrigin: "left center",
      };
    }
    case "shiftLeft": {
      // Shift Left: slide in from the right
      const tx = inv * fontSize * 2.5;
      return {
        opacity: progress < 0.15 ? progress / 0.15 : 1,
        transform: `translateX(${tx}px)`,
      };
    }
    case "shiftRight": {
      // Shift Right: slide in from the left
      const tx = -inv * fontSize * 2.5;
      return {
        opacity: progress < 0.15 ? progress / 0.15 : 1,
        transform: `translateX(${tx}px)`,
      };
    }
    case "cut":
    default: {
      // Straight Cut: instant pop-on at startFrame
      return {
        opacity: progress > 0 ? 1 : 0,
        transform: "none",
      };
    }
  }
}

export function TextAnimator({
  bullets = [],
  animStyle = "rise",
  fontSize = 36,
  fontWeight = 800,
  lineHeight = 1.2,
  color = "#1e2d5a",
  align = "left",
  animFrames = 17,
  byWord = false,       // when true, each word animates individually with a stagger
  wordStagger = 4,      // frames between each word's animation start
  x = 0,
  y = 0,
  lineGap = 12,
  frame: frameProp,
}) {
  const currentFrame = useCurrentFrame();
  const frame = frameProp !== undefined ? frameProp : currentFrame;

  return (
    <div style={{
      position: "absolute",
      left: x,
      top: y,
      textAlign: align,
      fontFamily: "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    }}>
      {bullets.map((bullet, i) => {
        const words = bullet.text.split(" ");

        return (
          <div
            key={i}
            style={{
              fontSize,
              fontWeight,
              lineHeight,
              color,
              marginBottom: i < bullets.length - 1 ? lineGap : 0,
              overflow: "hidden",
              display: "block",
            }}
          >
            {byWord ? (
              // Per-word animation — each word has its own staggered endFrame
              <span style={{ display: "inline" }}>
                {words.map((word, wi) => {
                  // Last word lands at bullet.endFrame, earlier words land earlier
                  const wordEnd = bullet.endFrame - (words.length - 1 - wi) * wordStagger;
                  const progress = bulletProgress(frame, wordEnd, animFrames);
                  const animatedStyle = getStyle(animStyle, progress, fontSize);
                  return (
                    <span key={wi} style={{ display: "inline-block", ...animatedStyle }}>
                      {word}{wi < words.length - 1 ? "\u00A0" : ""}
                    </span>
                  );
                })}
              </span>
            ) : (
              // Whole-line animation
              <div style={{
                display: "inline-block",
                width: align === "left" ? undefined : "100%",
                ...getStyle(animStyle, bulletProgress(frame, bullet.endFrame, animFrames), fontSize),
              }}>
                {bullet.text}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * TextAnimatorDemo — standalone composition for previewing all styles
 * Matches AE comp: 23.976fps, bullet stagger ~3 frames, big text
 * Register in Root.jsx as id="TextAnimatorDemo", 600 frames, 30fps, 1920×1080
 */
export function TextAnimatorDemo() {
  const NAVY  = "#1e2d5a";
  const RED   = "#e8182e";
  const LIGHT = "#f8faff";

  // AE comp bullet timings (frames): 11, 14.2, 17.1, 23, 26, 29, 30
  // Normalized to start at 0: stagger of ~3 frames each
  const BULLETS = [
    { text: "Leveraging intent data",       endFrame: 30  },
    { text: "Personalizing outreach with AI", endFrame: 48 },
    { text: "Building engaged communities", endFrame: 66  },
    { text: "Multi-channel orchestration",  endFrame: 84  },
    { text: "Measuring what matters",       endFrame: 102 },
  ];

  const STYLES = ["rise", "scaleUp", "shiftLeft", "shiftRight", "cut"];
  const LABELS = ["Rise to the Right", "Scale Up", "Shift Left", "Shift Right", "Straight Cut"];

  const frame = useCurrentFrame();
  // Each style plays for 180 frames
  const styleIdx = Math.floor(frame / 180) % STYLES.length;
  const localFrame = frame % 180;

  const adjustedBullets = BULLETS.map(b => ({ ...b, endFrame: b.endFrame }));

  return (
    <div style={{
      width: 1920, height: 1080,
      background: NAVY,
      fontFamily: "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      position: "relative",
    }}>
      {/* Style label */}
      <div style={{
        position: "absolute", top: 52, left: 80,
        fontSize: 16, fontWeight: 700, color: RED,
        textTransform: "uppercase", letterSpacing: "2.5px",
      }}>
        {LABELS[styleIdx]}
      </div>

      <TextAnimator
        bullets={adjustedBullets}
        animStyle={STYLES[styleIdx]}
        fontSize={72}
        fontWeight={800}
        lineHeight={1.15}
        color={LIGHT}
        align="left"
        animFrames={17}
        x={80}
        y={140}
        lineGap={16}
        frame={localFrame}
      />
    </div>
  );
}
