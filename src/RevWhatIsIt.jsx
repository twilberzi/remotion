import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

const NAVY = "#1e2d5a";
const RED  = "#e8182e";
const FONT = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, s, e, f, t) {
  return interpolate(frame, [s, e], [f, t], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

const W = 1920, H = 1080;
const HUB_CX  = W / 2;
const HUB_CY  = H / 2 + 10;
const HUB_W   = 220;
const HUB_H   = 240;
const CARD_W  = 196;
const CARD_H  = 74;
const GAP     = 16;
const LEFT_CX  = HUB_CX - 340;
const RIGHT_CX = HUB_CX + 340;

// Camera phases:
// Phase 1: 0–80    sources appear — zoomed in, panned right (sources centered on screen)
// Phase 2: 80–145  lines draw to hub — camera slides left + zooms out to see hub
// Phase 3: 145–230 outputs appear — camera zooms out to full view

const SOURCES = [
  { label: "CRM",        icon: "crm"      },
  { label: "Emails",     icon: "email"    },
  { label: "Calls",      icon: "calls"    },
  { label: "Meetings",   icon: "meetings" },
  { label: "Engagement", icon: "engage"   },
];

const OUTPUTS = [
  { line1: "Which deals",   line2: "to prioritize", color: "#16a34a" },
  { line1: "What risks",    line2: "exist",          color: RED       },
  { line1: "What to",       line2: "do next",        color: "#2563eb" },
];

function cardTopY(i, n, cardH, gap) {
  const total = n * cardH + (n - 1) * gap;
  return HUB_CY - total / 2 + i * (cardH + gap);
}

function SourceIcon({ type }) {
  const s = { width: 28, height: 28 };
  const c = NAVY;
  if (type === "crm") return (
    <svg {...s} viewBox="0 0 28 28" fill="none">
      <rect x="3" y="7" width="22" height="16" rx="3" stroke={c} strokeWidth="2"/>
      <path d="M3 11h22" stroke={c} strokeWidth="2"/>
      <circle cx="9" cy="17" r="2" fill={c}/>
      <rect x="13" y="15.5" width="8" height="2" rx="1" fill={c}/>
    </svg>
  );
  if (type === "email") return (
    <svg {...s} viewBox="0 0 28 28" fill="none">
      <rect x="3" y="6" width="22" height="16" rx="3" stroke={c} strokeWidth="2"/>
      <path d="M3 9l11 8 11-8" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
  if (type === "calls") return (
    <svg {...s} viewBox="0 0 28 28" fill="none">
      <path d="M6 5h5l2 5-3 2a14 14 0 006 6l2-3 5 2v5c0 1-1 2-2 2C9 24 4 15 4 7c0-1 1-2 2-2z" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
  if (type === "meetings") return (
    <svg {...s} viewBox="0 0 28 28" fill="none">
      <rect x="4" y="6" width="20" height="18" rx="3" stroke={c} strokeWidth="2"/>
      <path d="M4 11h20" stroke={c} strokeWidth="2"/>
      <path d="M9 4v4M19 4v4" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      <rect x="8" y="15" width="4" height="4" rx="1" fill={c}/>
      <rect x="16" y="15" width="4" height="4" rx="1" fill={c}/>
    </svg>
  );
  if (type === "engage") return (
    <svg {...s} viewBox="0 0 28 28" fill="none">
      <path d="M14 4l2.5 5 5.5.8-4 3.9.9 5.5L14 17l-4.9 2.2.9-5.5-4-3.9 5.5-.8z" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  );
  return null;
}

// Canonical Explained card style (B2BDataExplained)
// Plain secondary card — no accent
function PlainCard({ width, height, children, style = {} }) {
  return (
    <div style={{
      width, height,
      background: "white",
      borderRadius: 16,
      border: "1.5px solid rgba(30,45,90,0.08)",
      boxShadow: "0 3px 12px rgba(30,45,90,0.06)",
      position: "relative",
      overflow: "hidden",
      ...style,
    }}>
      {children}
    </div>
  );
}

// Hub card — uses Icon-box-BLANK asset with icon + label overlaid
function HubCard({ scale, opacity }) {
  return (
    <div style={{
      width: HUB_W, height: HUB_H,
      position: "relative",
      transform: `scale(${scale})`,
      opacity,
      transformOrigin: "center center",
    }}>
      {/* Icon-box-BLANK as the card background */}
      <Img
        src={staticFile("icon-box-blank.png")}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "fill" }}
      />
      {/* Lightning bolt icon — navy, centered upper portion */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 80,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width={88} height={88} viewBox="0 0 48 48" fill="none">
          <polygon points="28,4 12,28 22,28 18,44 36,20 26,20" fill={NAVY}/>
        </svg>
      </div>
      {/* Label */}
      <div style={{
        position: "absolute", bottom: 38, left: 0, right: 0,
        textAlign: "center",
        fontSize: 23, fontWeight: 700, color: NAVY,
        letterSpacing: "0px", lineHeight: 1.3,
      }}>
        Revenue<br/>Intelligence
      </div>
    </div>
  );
}

export const RevWhatIsIt = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Camera — spring-driven for smooth organic transitions ─────────────────
  // Phase 1 (0–80):   sources centered, zoomed in (scale 1.55, pan +340px right)
  // Phase 2 (80–145): lines draw to hub — spring slides left, pulls back to 1.2
  // Phase 3 (145–230): outputs appear — spring eases to full view (scale 1.0, pan 0)

  // Scale: two springs chained. sp1 fires at frame 82 (1.55→1.2), sp2 fires at 147 (→1.0)
  const camSp1 = spring({ frame: frame - 82,  fps, config: { damping: 22, stiffness: 55 } });
  const camSp2 = spring({ frame: frame - 147, fps, config: { damping: 22, stiffness: 48 } });
  const camScale = 1.55 - camSp1 * 0.35 - camSp2 * 0.2;

  // Pan X: spring from +340 → 0 starting at frame 82, very slow and smooth
  const camPanSp = spring({ frame: frame - 82, fps, config: { damping: 26, stiffness: 42 } });
  const camX = 340 * (1 - camPanSp);

  const camY = 0;

  // headline fades out before phase 2 zoom, back in at phase 3
  const headOp = interpolate(frame, [0, 16, 60, 80, 145, 165], [0, 1, 1, 0, 0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const headY  = fi(frame, 0, 16, 12, 0);

  const hubSp  = spring({ frame: frame - 80, fps, config: { damping: 18, stiffness: 140 } });
  const hubOp  = fi(frame, 80, 96, 0, 1);
  const hubRight = HUB_CX + HUB_W / 2;

  const payoffOp = fi(frame, 232, 248, 0, 1);
  const payoffY  = fi(frame, 232, 248, 12, 0);

  return (
    <AbsoluteFill style={{ background: "#f8faff", fontFamily: FONT, overflow: "hidden" }}>

      {/* ── Headline — outside camera wrapper so it stays fixed ─────── */}
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

      {/* ── Camera wrapper — everything inside moves with the camera ─── */}
      <div style={{
        position: "absolute", inset: 0,
        transform: `scale(${camScale}) translateX(${camX / camScale}px) translateY(${camY}px)`,
        transformOrigin: "center center",
        willChange: "transform",
      }}>

        {/* ── SVG lines + hub ──────────────────────────────────────── */}
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}>

          {/* Left connector lines → hub center */}
          {SOURCES.map((_src, i) => {
            const cy    = cardTopY(i, SOURCES.length, CARD_H, GAP) + CARD_H / 2;
            const srcX  = LEFT_CX + CARD_W / 2;
            const lineDelay = 88 + i * 11;
            const progress  = fi(frame, lineDelay, lineDelay + 34, 0, 1);
            const x2 = srcX + (HUB_CX - srcX) * progress;
            const y2 = cy   + (HUB_CY - cy)   * progress;
            const op = fi(frame, lineDelay, lineDelay + 10, 0, 0.35);
            return (
              <line key={i}
                x1={srcX} y1={cy} x2={x2} y2={y2}
                stroke="rgba(30,45,90,0.7)" strokeWidth={1.5}
                strokeDasharray="5 4" opacity={op}
              />
            );
          })}

          {/* Right connector lines hub → output cards */}
          {OUTPUTS.map((out, i) => {
            const cy       = cardTopY(i, OUTPUTS.length, CARD_H, GAP) + CARD_H / 2;
            const endX     = RIGHT_CX - CARD_W / 2;
            const totalLen = endX - hubRight;
            const lineDelay = 155 + i * 14;
            const drawn = fi(frame, lineDelay, lineDelay + 32, 0, totalLen);
            const op    = fi(frame, lineDelay, lineDelay + 10, 0, 0.65);
            return (
              <g key={i}>
                <line
                  x1={hubRight} y1={cy}
                  x2={hubRight + drawn} y2={cy}
                  stroke={out.color} strokeWidth={2} opacity={op}
                />
                <polygon
                  points={`${hubRight + drawn},${cy} ${hubRight + drawn - 9},${cy - 5} ${hubRight + drawn - 9},${cy + 5}`}
                  fill={out.color}
                  opacity={fi(frame, lineDelay + 28, lineDelay + 36, 0, 0.85)}
                />
              </g>
            );
          })}

        </svg>

        {/* Hub card — Explained icon card style */}
        <div style={{
          position: "absolute",
          left: HUB_CX - HUB_W / 2,
          top: HUB_CY - HUB_H / 2,
        }}>
          <HubCard scale={hubSp} opacity={hubOp} />
        </div>

        {/* ── Source cards ─────────────────────────────────────────── */}
        {SOURCES.map((src, i) => {
          const y = cardTopY(i, SOURCES.length, CARD_H, GAP);
          const x = LEFT_CX - CARD_W / 2;
          const delay = 8 + i * 11;
          const sp = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 155 } });
          const op = fi(frame, delay, delay + 14, 0, 1);
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, transformOrigin: "center center", transform: `scale(${sp})`, opacity: op }}>
              <PlainCard width={CARD_W} height={CARD_H}>
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", gap: 14, padding: "0 18px",
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: "#f0f2f8",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <SourceIcon type={src.icon} />
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>{src.label}</div>
                </div>
              </PlainCard>
            </div>
          );
        })}

        {/* ── Output cards ─────────────────────────────────────────── */}
        {OUTPUTS.map((out, i) => {
          const y = cardTopY(i, OUTPUTS.length, CARD_H, GAP);
          const x = RIGHT_CX - CARD_W / 2;
          const delay = 168 + i * 16;
          const sp = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 150 } });
          const op = fi(frame, delay, delay + 16, 0, 1);
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, transformOrigin: "center center", transform: `scale(${sp})`, opacity: op }}>
              <div style={{
                width: CARD_W, height: CARD_H,
                background: out.color,
                borderRadius: 24,
                boxShadow: `0 6px 20px ${out.color}40`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column", gap: 2,
              }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "white", lineHeight: 1.35 }}>{out.line1}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "white", lineHeight: 1.35 }}>{out.line2}</div>
              </div>
            </div>
          );
        })}

      </div>{/* end camera wrapper */}

      {/* ── Payoff line — fixed, outside camera ──────────────────────── */}
      <div style={{
        position: "absolute", bottom: 56, left: 0, right: 0,
        textAlign: "center", zIndex: 10,
        opacity: payoffOp, transform: `translateY(${payoffY}px)`,
      }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: NAVY, opacity: 0.72 }}>
          Not more data.{" "}
          <span style={{ color: RED, opacity: 1 }}>Better decisions with the data you already have.</span>
        </div>
      </div>

    </AbsoluteFill>
  );
};
