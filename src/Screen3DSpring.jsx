import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
  staticFile,
  Img,
} from "remotion";
import { makeTransform, rotateX, rotateY, rotateZ, perspective } from "@remotion/animation-utils";

const FONT = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const RED = "#EA1815";
const PURPLE = "#9333ea";
const BG = "#08101f";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// Flowing sine wave background lines
function WavyLines({ frame }) {
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      viewBox="0 0 1920 1080"
      preserveAspectRatio="none"
    >
      {Array.from({ length: 18 }, (_, i) => {
        const amp = 55 + i * 11;
        const freq = 0.0028 + i * 0.00025;
        const phase = frame * 0.016 + i * 0.52;
        const yBase = 180 + i * 42;
        const color = i % 2 === 0 ? RED : PURPLE;
        const opacity = 0.05 + (i < 9 ? i : 18 - i) * 0.007;
        const pts = Array.from({ length: 80 }, (_, j) => {
          const x = (j / 79) * 1920;
          const y = yBase + Math.sin(x * freq + phase) * amp;
          return `${x},${y}`;
        }).join(" ");
        return (
          <polyline key={i} points={pts} fill="none"
            stroke={color} strokeWidth={1.2} opacity={opacity} />
        );
      })}
    </svg>
  );
}

// Parallax radial bg that shifts slightly with camera
function ParallaxBG({ frame }) {
  // Slow drift — feels like camera breathing
  const driftX = Math.sin(frame * 0.008) * 18;
  const driftY = Math.cos(frame * 0.006) * 10;
  return (
    <>
      {/* Deep bg glow — moves slowest (10%) */}
      <div style={{
        position: "absolute", inset: -60,
        background: `radial-gradient(ellipse at ${50 + driftX * 0.1}% ${55 + driftY * 0.1}%, ${PURPLE}44 0%, transparent 58%)`,
      }} />
      {/* Mid glow — 50% */}
      <div style={{
        position: "absolute", inset: -40,
        background: `radial-gradient(ellipse at ${72 + driftX * 0.5}% ${28 + driftY * 0.5}%, ${RED}28 0%, transparent 45%)`,
        transform: `translate(${driftX * 0.5}px, ${driftY * 0.5}px)`,
      }} />
      {/* Foreground vignette — static */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(8,16,31,0.7) 100%)",
      }} />
    </>
  );
}

export function Screen3DSpring() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Phase 1: Spring tilt-to-flat entry (0–90 frames) ──────────────────────
  // Perspective on the PARENT (correct approach)
  // Starting angle: isometric SaaS hero style rotX(28) rotY(-16) rotZ(3)
  const springCfg = { fps, config: { damping: 30, stiffness: 155, mass: 1, overshootClamping: true } };

  const tiltX = spring({ frame, from: 28, to: 0, ...springCfg });
  const tiltY = spring({ frame, from: -16, to: 0, ...springCfg });
  const tiltZ = spring({ frame, from: 3, to: 0, ...springCfg });

  // Entry scale — spring up from 0.68
  const entryScale = spring({ frame, from: 0.68, to: 1.0,
    fps, config: { damping: 28, stiffness: 140, mass: 1, overshootClamping: true } });

  // Entry lift — slides up from below
  const entryY = spring({ frame, from: 70, to: 0,
    fps, config: { damping: 26, stiffness: 130, mass: 1.1, overshootClamping: true } });

  // Opacity
  const opacity = fi(frame, 0, 20, 0, 1);

  // ── Phase 2: Slow camera push + upward pan (frames 80–420) ────────────────
  // After spring settles, a gentle drift zoom and parallax pan
  const camZoom = fi(frame, 80, 420, 1.0, 1.18);
  const camPan = fi(frame, 80, 420, 0, -100);

  // ── Phase 3: Zoom to "Export to Outreach" (frames 420–475) ───────────────
  const ZOOM_START = 420;
  const ZOOM_END = 475;
  const PUSH_END = 580;

  const zoomT = Math.max(0, Math.min(1, (frame - ZOOM_START) / (ZOOM_END - ZOOM_START)));
  const zoomEased = 1 - Math.pow(1 - zoomT, 5); // ease-out quint — rockets in, glides to stop
  const zoomScale = frame >= ZOOM_START ? 1.18 + (2.05 - 1.18) * zoomEased : 1.18;
  const originX = frame >= ZOOM_START ? 50 + (88 - 50) * zoomEased : 50;
  const originY = frame >= ZOOM_START ? 50 + (63 - 50) * zoomEased : 50;

  // ── Phase 4: Gentle push-in hold (frames 475–580) ─────────────────────────
  const pushT = Math.max(0, Math.min(1, (frame - ZOOM_END) / (PUSH_END - ZOOM_END)));
  const pushEased = 1 - Math.pow(1 - pushT, 3);
  const pushScale = frame >= ZOOM_END ? 2.05 + (2.28 - 2.05) * pushEased : zoomScale;

  // ── Fade out ──────────────────────────────────────────────────────────────
  const fadeOut = fi(frame, 580, 630, 1, 0);

  // ── Combine scales ────────────────────────────────────────────────────────
  const baseScale = entryScale * camZoom;
  const finalScale = frame < ZOOM_START ? baseScale : frame < ZOOM_END ? zoomScale : pushScale;
  const finalPan = frame < ZOOM_START ? entryY + camPan : -100;

  // ── Screen transform — tilt via makeTransform, scale/pan via wrapper ──────
  const screenTransform = makeTransform([
    rotateX(tiltX),
    rotateY(tiltY),
    rotateZ(tiltZ),
  ]);

  // Chips fade out before zoom
  const chipsFadeOut = fi(frame, 395, 425, 1, 0);

  const CHIPS = [
    { label: "Trigger", text: "Competitor stack detected", color: RED,       x: 80,   y: 190 },
    { label: "Agent 1", text: "Intent signals layered",    color: PURPLE,    x: 1460, y: 210 },
    { label: "Output",  text: "Rep notified · email ready",color: "#22c55e", x: 100,  y: 790 },
  ];

  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      <ParallaxBG frame={frame} />
      <WavyLines frame={frame} />

      {/* Outer wrapper: perspective + scale + pan */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: opacity * fadeOut,
        // Perspective on PARENT — correct per remotion/animation-utils spec
        perspective: "1000px",
        perspectiveOrigin: "50% 50%",
      }}>
        {/* Scale + pan wrapper */}
        <div style={{
          position: "relative",
          transformOrigin: `${originX}% ${originY}%`,
          transform: `scale(${finalScale}) translateY(${finalPan}px)`,
        }}>
          {/* 3D tilt wrapper — makeTransform handles rotateX/Y/Z */}
          <div style={{
            position: "relative",
            width: 1520, height: 900,
            transform: screenTransform,
            transformStyle: "preserve-3d",
            willChange: "transform",
            borderRadius: 18,
            overflow: "hidden",
            boxShadow: `
              0 80px 180px rgba(0,0,0,0.6),
              0 0 0 1px rgba(255,255,255,0.09),
              0 0 80px ${PURPLE}33
            `,
          }}>
            <Img
              src={staticFile("gtmstudio/activate-screen.png")}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
            />

            {/* Flash to hide any seam */}
            <div style={{
              position: "absolute", inset: 0,
              background: "white",
              opacity: fi(frame, 18, 22, 0.6, 0),
              pointerEvents: "none",
            }} />

            {/* Glass sheen fades as tilt corrects */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 55%)",
              opacity: fi(frame, 0, 80, 1, 0),
              pointerEvents: "none",
            }} />
          </div>
        </div>

        {/* Floating signal chips — outside 3D wrapper so they float in screen space */}
        {CHIPS.map((chip, i) => {
          const d = 45 + i * 18;
          const chipOp = fi(frame, d, d + 16, 0, 1) * chipsFadeOut;
          const chipY = fi(frame, d, d + 20, 14, 0);
          return (
            <div key={i} style={{
              position: "absolute",
              left: chip.x, top: chip.y,
              opacity: chipOp,
              transform: `translateY(${chipY}px)`,
            }}>
              <div style={{
                background: "rgba(8,16,31,0.88)",
                border: `1px solid ${chip.color}66`,
                borderRadius: 12,
                padding: "10px 18px",
                backdropFilter: "blur(12px)",
                boxShadow: `0 4px 24px rgba(0,0,0,0.4), 0 0 12px ${chip.color}22`,
                minWidth: 180,
              }}>
                <div style={{
                  fontFamily: FONT, fontSize: 11, fontWeight: 700,
                  color: chip.color, letterSpacing: 1.5,
                  textTransform: "uppercase", marginBottom: 4,
                }}>{chip.label}</div>
                <div style={{
                  fontFamily: FONT, fontSize: 15, fontWeight: 500, color: "white",
                }}>{chip.text}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
