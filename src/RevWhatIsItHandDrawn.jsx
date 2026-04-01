import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

const NAVY = "#1e2d5a";
const RED  = "#e8182e";
const CREAM = "#faf8f3";
const FONT = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";
const HAND_FONT = "'Figtree', Georgia, serif";

function fi(frame, s, e, f, t) {
  return interpolate(frame, [s, e], [f, t], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

const W = 1920, H = 1080;
const HUB_CX  = W / 2;
const HUB_CY  = H / 2 + 10;
const HUB_W   = 230;
const HUB_H   = 180;
const CARD_W  = 210;
const CARD_H  = 80;
const GAP     = 18;
const LEFT_CX  = HUB_CX - 360;
const RIGHT_CX = HUB_CX + 360;

const SOURCES = [
  { label: "CRM"        },
  { label: "Emails"     },
  { label: "Calls"      },
  { label: "Meetings"   },
  { label: "Engagement" },
];

const OUTPUTS = [
  { line1: "Which deals",   line2: "to prioritize", color: "#2a7a3b" },
  { line1: "What risks",    line2: "exist",          color: RED       },
  { line1: "What to",       line2: "do next",        color: "#1d4fad" },
];

function cardTopY(i, n, cardH, gap) {
  const total = n * cardH + (n - 1) * gap;
  return HUB_CY - total / 2 + i * (cardH + gap);
}

// Hand-drawn source card using box.png as border
function SketchCard({ width, height, children, useGroup = false }) {
  return (
    <div style={{ width, height, position: "relative" }}>
      <Img
        src={staticFile(useGroup ? "new-hand/Group.png" : "new-hand/box.png")}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "fill",
          opacity: 0.85,
        }}
      />
      <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
        {children}
      </div>
    </div>
  );
}

// Hub circle using circle.png
function HubCircle({ scale, opacity }) {
  return (
    <div style={{
      width: HUB_W, height: HUB_H,
      position: "relative",
      transform: `scale(${scale})`,
      opacity,
      transformOrigin: "center center",
    }}>
      <Img
        src={staticFile("new-hand/circle.png")}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "fill" }}
      />
      {/* Lightning bolt */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 6,
      }}>
        <svg width={44} height={44} viewBox="0 0 48 48" fill="none">
          <polygon points="28,4 12,28 22,28 18,44 36,20 26,20" fill={NAVY}/>
        </svg>
        <div style={{
          fontSize: 16, fontWeight: 800, color: NAVY,
          fontFamily: HAND_FONT, textAlign: "center", lineHeight: 1.25,
          letterSpacing: "0.5px",
        }}>
          Revenue<br/>Intelligence
        </div>
      </div>
    </div>
  );
}

// Animated connector line using line.png — rotated to point at hub
function SketchConnectorLine({ x1, y1, x2, y2, progress, opacity }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const drawnLen = len * progress;

  return (
    <div style={{
      position: "absolute",
      left: x1,
      top: y1 - 6,
      width: drawnLen,
      height: 12,
      overflow: "hidden",
      transform: `rotate(${angle}deg)`,
      transformOrigin: "0 50%",
      opacity,
    }}>
      <Img
        src={staticFile("new-hand/line.png")}
        style={{
          position: "absolute",
          left: 0, top: 0,
          width: len, // full length so it clips
          height: 12,
          objectFit: "fill",
        }}
      />
    </div>
  );
}

// Output arrow using arrow.png — rotated to point right
function SketchArrow({ cx, cy, progress, color }) {
  // Arrow points up by default — rotate 90° to point right
  const size = 32 * progress;
  return (
    <div style={{
      position: "absolute",
      left: cx - size / 2,
      top: cy - size / 2,
      width: size,
      height: size,
      transform: "rotate(90deg)",
      opacity: progress,
      // Tint the arrow using a color filter approach — use CSS hue-rotate for the colored outputs
    }}>
      <Img
        src={staticFile("new-hand/arrow.png")}
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
}

export const RevWhatIsItHandDrawn = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Camera — same phases as original ──────────────────────────────────────
  const camSp1 = spring({ frame: frame - 82,  fps, config: { damping: 22, stiffness: 55 } });
  const camSp2 = spring({ frame: frame - 147, fps, config: { damping: 22, stiffness: 48 } });
  const camScale = 1.55 - camSp1 * 0.35 - camSp2 * 0.2;

  const camPanSp = spring({ frame: frame - 82, fps, config: { damping: 26, stiffness: 42 } });
  const camX = 340 * (1 - camPanSp);

  const headOp = interpolate(frame, [0, 16, 60, 80, 145, 165], [0, 1, 1, 0, 0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const headY  = fi(frame, 0, 16, 12, 0);

  const hubSp  = spring({ frame: frame - 80, fps, config: { damping: 18, stiffness: 140 } });
  const hubOp  = fi(frame, 80, 96, 0, 1);
  const hubRight = HUB_CX + HUB_W / 2;

  const payoffOp = fi(frame, 232, 248, 0, 1);
  const payoffY  = fi(frame, 232, 248, 12, 0);

  return (
    <AbsoluteFill style={{ background: CREAM, fontFamily: FONT, overflow: "hidden" }}>

      {/* ── Headline — outside camera ──────────────────────────────── */}
      <div style={{
        position: "absolute", top: 52, left: 0, right: 0, textAlign: "center",
        opacity: headOp, transform: `translateY(${headY}px)`,
        zIndex: 10,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, letterSpacing: "3px", textTransform: "uppercase", opacity: 0.38 }}>
          Revenue Intelligence
        </div>
        <div style={{ fontSize: 36, fontWeight: 800, color: NAVY, marginTop: 6, lineHeight: 1.2 }}>
          Scattered signals <span style={{ color: RED }}>turned into</span> actionable guidance
        </div>
      </div>

      {/* ── Camera wrapper ─────────────────────────────────────────── */}
      <div style={{
        position: "absolute", inset: 0,
        transform: `scale(${camScale}) translateX(${camX / camScale}px)`,
        transformOrigin: "center center",
        willChange: "transform",
      }}>

        {/* ── Connector lines — SVG layer under cards ──────────────── */}
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}>
          {/* Right side — output lines with colored arrows */}
          {OUTPUTS.map((out, i) => {
            const cy       = cardTopY(i, OUTPUTS.length, CARD_H, GAP) + CARD_H / 2;
            const endX     = RIGHT_CX - CARD_W / 2;
            const lineDelay = 155 + i * 14;
            const progress  = fi(frame, lineDelay, lineDelay + 32, 0, 1);
            const op = fi(frame, lineDelay, lineDelay + 10, 0, 0.7);
            const totalLen = endX - hubRight;
            return (
              <line key={i}
                x1={hubRight} y1={cy}
                x2={hubRight + totalLen * progress} y2={cy}
                stroke={out.color} strokeWidth={2.5}
                strokeLinecap="round"
                opacity={op}
                strokeDasharray="none"
              />
            );
          })}
        </svg>

        {/* ── Left connector lines (positioned divs using line.png) ── */}
        {SOURCES.map((_src, i) => {
          const cy    = cardTopY(i, SOURCES.length, CARD_H, GAP) + CARD_H / 2;
          const srcX  = LEFT_CX + CARD_W / 2;
          const lineDelay = 88 + i * 11;
          const progress  = fi(frame, lineDelay, lineDelay + 34, 0, 1);
          const op = fi(frame, lineDelay, lineDelay + 10, 0, 0.55);
          return (
            <SketchConnectorLine
              key={i}
              x1={srcX} y1={cy}
              x2={HUB_CX - HUB_W / 2} y2={HUB_CY}
              progress={progress}
              opacity={op}
            />
          );
        })}

        {/* ── Output arrows (hand-drawn) ──────────────────────────── */}
        {OUTPUTS.map((out, i) => {
          const cy        = cardTopY(i, OUTPUTS.length, CARD_H, GAP) + CARD_H / 2;
          const endX      = RIGHT_CX - CARD_W / 2;
          const arrowDelay = 155 + i * 14 + 28;
          const progress   = fi(frame, arrowDelay, arrowDelay + 14, 0, 1);
          return (
            <SketchArrow
              key={i}
              cx={endX - 4}
              cy={cy}
              progress={progress}
              color={out.color}
            />
          );
        })}

        {/* ── Hub ──────────────────────────────────────────────────── */}
        <div style={{
          position: "absolute",
          left: HUB_CX - HUB_W / 2,
          top: HUB_CY - HUB_H / 2,
        }}>
          <HubCircle scale={hubSp} opacity={hubOp} />
        </div>

        {/* ── Source cards ──────────────────────────────────────────── */}
        {SOURCES.map((src, i) => {
          const y = cardTopY(i, SOURCES.length, CARD_H, GAP);
          const x = LEFT_CX - CARD_W / 2;
          const delay = 8 + i * 11;
          const sp = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 155 } });
          const op = fi(frame, delay, delay + 14, 0, 1);
          return (
            <div key={i} style={{
              position: "absolute", left: x, top: y,
              transformOrigin: "center center",
              transform: `scale(${sp})`, opacity: op,
            }}>
              <SketchCard width={CARD_W} height={CARD_H}>
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{
                    fontSize: 17, fontWeight: 700, color: NAVY,
                    fontFamily: HAND_FONT, letterSpacing: "0.3px",
                  }}>{src.label}</div>
                </div>
              </SketchCard>
            </div>
          );
        })}

        {/* ── Output cards ──────────────────────────────────────────── */}
        {OUTPUTS.map((out, i) => {
          const y = cardTopY(i, OUTPUTS.length, CARD_H, GAP);
          const x = RIGHT_CX - CARD_W / 2;
          const delay = 168 + i * 16;
          const sp = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 150 } });
          const op = fi(frame, delay, delay + 16, 0, 1);
          return (
            <div key={i} style={{
              position: "absolute", left: x, top: y,
              transformOrigin: "center center",
              transform: `scale(${sp})`, opacity: op,
            }}>
              <SketchCard width={CARD_W} height={CARD_H} useGroup={true}>
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  gap: 1,
                }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: out.color, fontFamily: HAND_FONT, lineHeight: 1.35 }}>{out.line1}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: out.color, fontFamily: HAND_FONT, lineHeight: 1.35 }}>{out.line2}</div>
                </div>
              </SketchCard>
            </div>
          );
        })}

      </div>{/* end camera wrapper */}

      {/* ── Payoff line — fixed ───────────────────────────────────────── */}
      <div style={{
        position: "absolute", bottom: 56, left: 0, right: 0,
        textAlign: "center", zIndex: 10,
        opacity: payoffOp, transform: `translateY(${payoffY}px)`,
      }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: NAVY, opacity: 0.75 }}>
          Not more data.{" "}
          <span style={{ color: RED, opacity: 1 }}>Better decisions with the data you already have.</span>
        </div>
      </div>

    </AbsoluteFill>
  );
};
