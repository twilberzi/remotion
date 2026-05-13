import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Img,
  staticFile,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Figtree";
loadFont();

// ─── Design tokens ────────────────────────────────────────────────────────────
const NAVY  = "#1e2d5a";
const RED   = "#e8182e";
const LIGHT = "#f8faff";
const FONT  = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ─── Shared background ───────────────────────────────────────────────────────
function Background() {
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: LIGHT,
    }} />
  );
}

// ─── Scene 0: Hook — Before / After split ────────────────────────────────────
// Left: 2019 chaos — grey noise grid of mismatched icons/labels, muted
// Right: 2025 precision — clean white card, red orb, sharp label
// Divider line slices in from center, then camera pulls back to reveal both sides
// Duration: 240 frames (8s)

// Static noise grid for the "chaos" side — deterministic positions
const NOISE_ITEMS = Array.from({ length: 28 }, (_, i) => ({
  x: 60 + (i % 7) * 110 + (i % 3) * 18,
  y: 80 + Math.floor(i / 7) * 190 + (i % 5) * 22,
  w: 70 + (i % 4) * 22,
  label: ["Email list", "Leads", "Contacts", "Prospects", "Accounts", "Visitors", "Clicks"][i % 7],
  opacity: 0.25 + (i % 4) * 0.1,
}));

function HookScene({ frame, fps }) {
  // Phase 1 (0–40):   start zoomed into LEFT side (chaos) — fills frame
  // Phase 2 (40–110): pull back to reveal full split
  // Phase 3 (110–180): divider already in place, right side content builds in
  // Phase 4 (180–240): text labels slam in bottom, hold

  // Camera pull-back: scale from 1.9 (zoomed left) → 1.0 (full frame)
  const pullScale = spring({ frame: frame - 20, fps,
    config: { damping: 26, stiffness: 80, mass: 1.2, overshootClamping: true } });
  const camScale = fi(frame, 0, 20, 1.9, 1.9) * (frame < 20 ? 1 : 2 - Math.min(pullScale, 1));
  // Pull shifts from left-center origin toward center
  const camOriginX = fi(frame, 20, 90, 25, 50);

  // Divider line slices down from top
  const divH = fi(frame, 35, 80, 0, 1080);

  // Right side content fades in after divider
  const rightFade = fi(frame, 70, 110, 0, 1);

  // Orb pulse on right
  const orbPulse = 1 + 0.025 * Math.sin(frame * 0.1);
  const orbScale = spring({ frame: frame - 75, fps,
    config: { damping: 28, stiffness: 160, mass: 1, overshootClamping: true } });
  const orbS = frame < 75 ? 0 : Math.min(orbScale, 1);

  // Bottom labels
  const leftLabel  = fi(frame, 130, 155, 0, 1);
  const rightLabel = fi(frame, 150, 175, 0, 1);

  // Fade out
  const fadeOut = fi(frame, 220, 240, 1, 0);

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: LIGHT }}>
      {/* Camera wrapper */}
      <div style={{
        position: "absolute", inset: 0,
        transform: `scale(${camScale})`,
        transformOrigin: `${camOriginX}% 50%`,
      }}>

        {/* ── LEFT SIDE: chaos (2019) ── */}
        <div style={{
          position: "absolute",
          left: 0, top: 0, width: 960, height: 1080,
          background: "#f0f2f5",
          overflow: "hidden",
        }}>
          {/* Noise label cards */}
          {NOISE_ITEMS.map((item, i) => (
            <div key={i} style={{
              position: "absolute",
              left: item.x, top: item.y,
              width: item.w, height: 32,
              background: "white",
              borderRadius: 6,
              border: "1px solid rgba(30,45,90,0.1)",
              display: "flex", alignItems: "center",
              paddingLeft: 10,
              opacity: item.opacity,
              transform: `rotate(${(i % 5 - 2) * 1.5}deg)`,
            }}>
              <div style={{
                fontFamily: FONT, fontSize: 11, fontWeight: 600,
                color: "#94a3b8",
              }}>{item.label}</div>
            </div>
          ))}
          {/* Diagonal grey lines (noise texture) */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06 }}>
            {Array.from({ length: 20 }, (_, i) => (
              <line key={i} x1={i * 55 - 200} y1={0} x2={i * 55 + 800} y2={1080}
                stroke={NAVY} strokeWidth={1} />
            ))}
          </svg>
          {/* "2019" watermark */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            fontFamily: FONT, fontSize: 120, fontWeight: 900,
            color: "rgba(30,45,90,0.06)", userSelect: "none",
          }}>2019</div>
        </div>

        {/* ── RIGHT SIDE: precision (2025) ── */}
        <div style={{
          position: "absolute",
          left: 960, top: 0, width: 960, height: 1080,
          background: "white",
          overflow: "hidden",
          opacity: rightFade,
        }}>
          {/* Clean grid lines */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }}>
            {Array.from({ length: 10 }, (_, i) => (
              <line key={i} x1={i * 110} y1={0} x2={i * 110} y2={1080}
                stroke={NAVY} strokeWidth={1} />
            ))}
          </svg>

          {/* Central orb */}
          {orbS > 0 && (
            <div style={{
              position: "absolute",
              width: 120, height: 120,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${RED} 0%, #ff6b35 100%)`,
              left: 480 - 60, top: 540 - 60,
              transform: `scale(${orbS * orbPulse})`,
              transformOrigin: "center center",
              boxShadow: `0 0 60px rgba(232,24,46,0.35), 0 0 120px rgba(232,24,46,0.12)`,
            }} />
          )}

          {/* Concentric rings */}
          {orbS > 0.4 && [180, 280, 390].map((r, i) => (
            <div key={i} style={{
              position: "absolute",
              width: r, height: r, borderRadius: "50%",
              border: `1.5px solid rgba(232,24,46,${0.2 - i * 0.05})`,
              left: 480 - r / 2, top: 540 - r / 2,
              opacity: fi(frame, 90 + i * 10, 115 + i * 10, 0, 1),
            }} />
          ))}

          {/* Three precision label chips */}
          {[
            { label: "Right person",  y: 340, delay: 100 },
            { label: "Right time",    y: 490, delay: 115 },
            { label: "Right message", y: 640, delay: 130 },
          ].map((chip, i) => (
            <div key={i} style={{
              position: "absolute",
              left: 480 + 170, top: chip.y,
              opacity: fi(frame, chip.delay, chip.delay + 20, 0, 1),
              transform: `translateX(${fi(frame, chip.delay, chip.delay + 20, 16, 0)}px)`,
            }}>
              <div style={{
                background: "white",
                border: `1.5px solid rgba(232,24,46,0.2)`,
                borderRadius: 10, padding: "8px 16px",
                boxShadow: "0 2px 12px rgba(30,45,90,0.08)",
                fontFamily: FONT, fontSize: 15, fontWeight: 700, color: NAVY,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: RED }} />
                {chip.label}
              </div>
            </div>
          ))}

          {/* "2025" watermark */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%) translateX(-60px)",
            fontFamily: FONT, fontSize: 120, fontWeight: 900,
            color: "rgba(232,24,46,0.05)", userSelect: "none",
          }}>2025</div>
        </div>

        {/* ── Divider line ── */}
        <div style={{
          position: "absolute",
          left: 959, top: 0,
          width: 2, height: divH,
          background: `linear-gradient(to bottom, transparent, ${NAVY}40, ${NAVY}60, ${NAVY}40, transparent)`,
        }} />

      </div>{/* end camera wrapper */}

      {/* ── Bottom labels (outside camera so they stay sharp) ── */}
      <div style={{
        position: "absolute", bottom: 80, left: 120,
        opacity: leftLabel,
        transform: `translateY(${fi(frame, 130, 155, 10, 0)}px)`,
      }}>
        <div style={{
          fontFamily: FONT, fontSize: 22, fontWeight: 800,
          color: "rgba(30,45,90,0.35)",
        }}>Spray and pray</div>
        <div style={{
          fontFamily: FONT, fontSize: 13, fontWeight: 500,
          color: "rgba(30,45,90,0.3)", marginTop: 4, letterSpacing: 1,
          textTransform: "uppercase",
        }}>2019 playbook</div>
      </div>

      <div style={{
        position: "absolute", bottom: 80, left: 1080,
        opacity: rightLabel,
        transform: `translateY(${fi(frame, 150, 175, 10, 0)}px)`,
      }}>
        <div style={{
          fontFamily: FONT, fontSize: 22, fontWeight: 800, color: NAVY,
        }}>Precision. Data. Timing.</div>
        <div style={{
          fontFamily: FONT, fontSize: 13, fontWeight: 600,
          color: RED, marginTop: 4, letterSpacing: 1,
          textTransform: "uppercase",
        }}>Modern audience development</div>
      </div>

      {/* Fade out */}
      <div style={{
        position: "absolute", inset: 0,
        background: LIGHT, opacity: 1 - fadeOut, pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
}

// ─── Scene 1: What Is Audience Development? ──────────────────────────────────
// Funnel: Prospects → Customers → Advocates
// Three tiers narrow down, dots flow through, data cards pop in at end
// Duration: 270 frames (9s)

const TIER_DATA = [
  { label: "Prospects",  count: 80, color: "rgba(30,45,90,0.12)", textColor: "rgba(30,45,90,0.45)", width: 880 },
  { label: "Customers",  count: 40, color: "rgba(232,24,46,0.12)", textColor: RED,                   width: 560 },
  { label: "Advocates",  count: 16, color: "rgba(232,24,46,0.22)", textColor: RED,                   width: 320 },
];

// Deterministic dot positions per tier
function makeDots(count, w, h, seed) {
  return Array.from({ length: count }, (_, i) => {
    const col = i % Math.ceil(Math.sqrt(count * (w / h)));
    const row = Math.floor(i / Math.ceil(Math.sqrt(count * (w / h))));
    const cols = Math.ceil(Math.sqrt(count * (w / h)));
    const rows = Math.ceil(count / cols);
    const jx = ((i * 37 + seed * 13) % 14) - 7;
    const jy = ((i * 53 + seed * 7)  % 10) - 5;
    return {
      x: (w / (cols + 1)) * (col + 1) + jx,
      y: (h / (rows + 1)) * (row + 1) + jy,
    };
  });
}

const DATA_CARDS = [
  { label: "1st-Party Data",  sub: "Your CRM, web, product",  delay: 195, x: 240 },
  { label: "3rd-Party Data",  sub: "Market intent signals",   delay: 215, x: 690 },
  { label: "Intent Data",     sub: "Who's researching now",   delay: 235, x: 1140 },
];

function FunnelScene({ frame, fps }) {
  // Phase 1 (0–60): title fades in
  // Phase 2 (20–140): funnel tiers build in sequentially
  // Phase 3 (60–180): dots populate each tier with stagger
  // Phase 4 (165–220): "Volume → Quality" label animates
  // Phase 5 (195–260): three data cards pop in
  // Fade out: 250–270

  const titleOp = fi(frame, 0, 30, 0, 1);
  const fadeOut = fi(frame, 252, 270, 1, 0);

  const FUNNEL_TOP = 180;
  const TIER_H = 200;
  const TIER_GAP = 18;
  const CX = 960;

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: LIGHT }}>
      <Background />

      {/* Title */}
      <div style={{
        position: "absolute", top: 60, left: 0, right: 0, textAlign: "center",
        opacity: titleOp * fadeOut,
        transform: `translateY(${fi(frame, 0, 30, 10, 0)}px)`,
      }}>
        <div style={{
          fontFamily: FONT, fontSize: 28, fontWeight: 800, color: NAVY, letterSpacing: -0.5,
        }}>What Is Audience Development?</div>
        <div style={{
          fontFamily: FONT, fontSize: 16, fontWeight: 500, color: "rgba(30,45,90,0.5)",
          marginTop: 8, letterSpacing: 0.5,
        }}>Moving the right people from awareness to advocacy</div>
      </div>

      {/* Funnel tiers */}
      {TIER_DATA.map((tier, ti) => {
        const tierStart = 20 + ti * 32;
        const tierW = fi(frame, tierStart, tierStart + 28, 0, tier.width);
        const tierOp = fi(frame, tierStart, tierStart + 20, 0, 1);
        const dotDelay = 65 + ti * 30;
        const dots = makeDots(tier.count, tier.width, TIER_H, ti * 17);
        const topY = FUNNEL_TOP + ti * (TIER_H + TIER_GAP);

        return (
          <div key={ti} style={{
            position: "absolute",
            left: CX - tierW / 2, top: topY,
            width: tierW, height: TIER_H,
            background: tier.color,
            borderRadius: ti === 2 ? "0 0 16px 16px" : "8px",
            overflow: "hidden",
            opacity: tierOp,
          }}>
            {/* Dots */}
            {dots.map((dot, di) => {
              const dotFrame = dotDelay + di * 1.2;
              const dotOp = fi(frame, dotFrame, dotFrame + 12, 0, 1);
              if (dotOp <= 0) return null;
              const isRed = ti > 0;
              return (
                <div key={di} style={{
                  position: "absolute",
                  left: dot.x - 4, top: dot.y - 4,
                  width: 8, height: 8, borderRadius: "50%",
                  background: isRed ? RED : NAVY,
                  opacity: dotOp * (isRed ? 0.55 : 0.25),
                  transform: `scale(${fi(frame, dotFrame, dotFrame + 10, 0.3, 1)})`,
                }} />
              );
            })}

            {/* Tier label */}
            <div style={{
              position: "absolute", bottom: 14, right: 18,
              fontFamily: FONT, fontSize: 14, fontWeight: 700,
              color: tier.textColor,
              opacity: fi(frame, tierStart + 20, tierStart + 36, 0, 1),
              letterSpacing: 0.5, textTransform: "uppercase",
            }}>{tier.label}</div>

            {/* Count */}
            <div style={{
              position: "absolute", bottom: 14, left: 18,
              fontFamily: FONT, fontSize: 22, fontWeight: 900,
              color: tier.textColor,
              opacity: fi(frame, dotDelay + tier.count * 1.2, dotDelay + tier.count * 1.2 + 20, 0, 1),
            }}>{tier.count.toLocaleString()}×</div>
          </div>
        );
      })}

      {/* Funnel connector lines */}
      {[0, 1].map(i => {
        const t0 = TIER_DATA[i];
        const t1 = TIER_DATA[i + 1];
        const top = FUNNEL_TOP + (i + 1) * (TIER_H + TIER_GAP) - TIER_GAP;
        const lineOp = fi(frame, 20 + (i + 1) * 32, 20 + (i + 1) * 32 + 20, 0, 1);
        const x0Left  = CX - t0.width / 2;
        const x0Right = CX + t0.width / 2;
        const x1Left  = CX - t1.width / 2;
        const x1Right = CX + t1.width / 2;
        return (
          <svg key={i} style={{
            position: "absolute", left: 0, top: 0, width: 1920, height: 1080,
            overflow: "visible", opacity: lineOp, pointerEvents: "none",
          }}>
            <path
              d={`M ${x0Left} ${top} L ${x1Left} ${top + TIER_GAP} L ${x1Right} ${top + TIER_GAP} L ${x0Right} ${top} Z`}
              fill={`rgba(30,45,90,0.06)`}
            />
          </svg>
        );
      })}

      {/* Volume → Quality label */}
      <div style={{
        position: "absolute",
        top: FUNNEL_TOP - 4,
        right: CX - TIER_DATA[0].width / 2 - 160,
        opacity: fi(frame, 165, 190, 0, 1) * fadeOut,
        transform: `translateX(${fi(frame, 165, 190, -10, 0)}px)`,
        textAlign: "right",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "rgba(30,45,90,0.45)", letterSpacing: 0.3,
          }}>Volume</div>
          <svg width="48" height="16" viewBox="0 0 48 16">
            <line x1="2" y1="8" x2="40" y2="8" stroke={`rgba(30,45,90,0.3)`} strokeWidth="1.5" />
            <polygon points="36,4 46,8 36,12" fill="rgba(30,45,90,0.3)" />
          </svg>
          <div style={{
            fontFamily: FONT, fontSize: 16, fontWeight: 700, color: RED, letterSpacing: 0.3,
          }}>Quality</div>
        </div>
      </div>

      {/* Data type cards */}
      {DATA_CARDS.map((card, ci) => {
        const sp = spring({ frame: frame - card.delay, fps,
          config: { damping: 30, stiffness: 160, mass: 0.9, overshootClamping: true } });
        const cardS = frame < card.delay ? 0 : Math.min(sp, 1);
        return (
          <div key={ci} style={{
            position: "absolute",
            left: card.x, bottom: 72,
            width: 380, height: 108,
            background: "white",
            borderRadius: 14,
            boxShadow: "0 4px 28px rgba(30,45,90,0.10)",
            border: "1.5px solid rgba(30,45,90,0.07)",
            padding: "0 28px",
            display: "flex", flexDirection: "column", justifyContent: "center",
            opacity: cardS,
            transform: `scale(${0.88 + 0.12 * cardS}) translateY(${(1 - cardS) * 14}px)`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: RED }} />
              <div style={{
                fontFamily: FONT, fontSize: 16, fontWeight: 800, color: NAVY,
              }}>{card.label}</div>
            </div>
            <div style={{
              fontFamily: FONT, fontSize: 13, fontWeight: 500, color: "rgba(30,45,90,0.5)",
            }}>{card.sub}</div>
          </div>
        );
      })}

      {/* Fade out overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: LIGHT, opacity: 1 - fadeOut, pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
}

// ─── Scene 2: Why It Needs a Reboot ──────────────────────────────────────────
// Old channels shrink, new channels rise — animated bar chart
// Duration: 270 frames (9s)

const OLD_BARS = [
  { label: "Cold Email",    from: 0.82, to: 0.28, color: "rgba(30,45,90,0.18)" },
  { label: "Banner Ads",   from: 0.74, to: 0.22, color: "rgba(30,45,90,0.15)" },
  { label: "Trade Shows",  from: 0.68, to: 0.18, color: "rgba(30,45,90,0.13)" },
  { label: "Spray Lists",  from: 0.60, to: 0.14, color: "rgba(30,45,90,0.11)" },
];

const NEW_BARS = [
  { label: "Intent Data",     from: 0.12, to: 0.84, color: RED },
  { label: "Communities",     from: 0.10, to: 0.72, color: "#e8182e" },
  { label: "AI Personalize",  from: 0.08, to: 0.65, color: "#c0101f" },
  { label: "Multi-Channel",   from: 0.06, to: 0.58, color: "#a00c1a" },
];

const BAR_MAX_H = 380;
const BAR_W = 110;
const BAR_BOTTOM = 640;

function RebootScene({ frame, fps }) {
  // Phase 1 (0–30): title in
  // Phase 2 (30–120): old bars shown, then shrink (30–130)
  // Phase 3 (80–200): new bars grow in
  // Phase 4 (200–240): annotation labels pop
  // Fade out: 252–270

  const titleOp = fi(frame, 0, 28, 0, 1);
  const fadeOut = fi(frame, 252, 270, 1, 0);

  const OLD_X_START = 200;
  const NEW_X_START = 1100;
  const BAR_GAP = 140;

  // Old bars: hold at 'from' until frame 60, then animate to 'to' by frame 160
  const oldT = Math.max(0, Math.min(1, (frame - 60) / 100));
  const oldE  = 1 - Math.pow(1 - oldT, 3); // ease-out cubic

  // New bars: grow from frame 80 to 200
  const newT = Math.max(0, Math.min(1, (frame - 80) / 120));
  const newE  = 1 - Math.pow(1 - newT, 3);

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: LIGHT }}>
      <Background />

      {/* Title */}
      <div style={{
        position: "absolute", top: 60, left: 0, right: 0, textAlign: "center",
        opacity: titleOp * fadeOut,
        transform: `translateY(${fi(frame, 0, 28, 10, 0)}px)`,
      }}>
        <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 800, color: NAVY, letterSpacing: -0.5 }}>
          Why Audience Development Needs a Reboot
        </div>
        <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 500, color: "rgba(30,45,90,0.5)", marginTop: 8 }}>
          Old playbooks are losing effectiveness — new signals are winning
        </div>
      </div>

      {/* Section labels */}
      <div style={{
        position: "absolute", top: 155, left: OLD_X_START + BAR_GAP * 1.1, textAlign: "center",
        opacity: fi(frame, 25, 45, 0, 1) * fadeOut,
        fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "rgba(30,45,90,0.35)",
        textTransform: "uppercase", letterSpacing: 2,
      }}>Fading Out</div>

      <div style={{
        position: "absolute", top: 155, left: NEW_X_START + BAR_GAP * 1.1, textAlign: "center",
        opacity: fi(frame, 75, 95, 0, 1) * fadeOut,
        fontFamily: FONT, fontSize: 15, fontWeight: 700, color: RED,
        textTransform: "uppercase", letterSpacing: 2,
      }}>Rising Fast</div>

      {/* Baseline */}
      <div style={{
        position: "absolute",
        left: 120, top: BAR_BOTTOM,
        width: 1680, height: 2,
        background: "rgba(30,45,90,0.1)",
        opacity: fi(frame, 20, 35, 0, 1) * fadeOut,
      }} />

      {/* Old bars */}
      {OLD_BARS.map((bar, i) => {
        const x = OLD_X_START + i * BAR_GAP;
        const barH = BAR_MAX_H * (bar.from + (bar.to - bar.from) * oldE);
        const barOp = fi(frame, 25 + i * 6, 45 + i * 6, 0, 1);
        const labelOp = fi(frame, 40 + i * 6, 58 + i * 6, 0, 1);
        // Cross-out line appears as bar shrinks
        const crossOp = fi(frame, 80, 120, 0, 1);
        return (
          <div key={i}>
            <div style={{
              position: "absolute",
              left: x, top: BAR_BOTTOM - barH,
              width: BAR_W, height: barH,
              background: bar.color,
              borderRadius: "6px 6px 0 0",
              opacity: barOp * fadeOut,
            }} />
            <div style={{
              position: "absolute",
              left: x, top: BAR_BOTTOM + 12,
              width: BAR_W,
              fontFamily: FONT, fontSize: 11, fontWeight: 600,
              color: "rgba(30,45,90,0.35)",
              textAlign: "center",
              opacity: labelOp * fadeOut,
              textTransform: "uppercase", letterSpacing: 0.5,
            }}>{bar.label}</div>
            {/* Down arrow */}
            <svg style={{
              position: "absolute",
              left: x + BAR_W / 2 - 8, top: BAR_BOTTOM - barH - 28,
              opacity: crossOp * barOp * fadeOut,
            }} width="16" height="20" viewBox="0 0 16 20">
              <polyline points="8,2 8,16" stroke="rgba(30,45,90,0.3)" strokeWidth="2" fill="none" />
              <polygon points="3,12 8,18 13,12" fill="rgba(30,45,90,0.3)" />
            </svg>
          </div>
        );
      })}

      {/* New bars */}
      {NEW_BARS.map((bar, i) => {
        const x = NEW_X_START + i * BAR_GAP;
        const barH = BAR_MAX_H * (bar.from + (bar.to - bar.from) * newE);
        const barOp = fi(frame, 75 + i * 8, 100 + i * 8, 0, 1);
        const labelOp = fi(frame, 90 + i * 8, 115 + i * 8, 0, 1);
        const arrowOp = fi(frame, 140, 175, 0, 1);
        const glowInt = 0.3 + 0.08 * Math.sin(frame * 0.08 + i * 1.1);
        return (
          <div key={i}>
            <div style={{
              position: "absolute",
              left: x, top: BAR_BOTTOM - barH,
              width: BAR_W, height: barH,
              background: bar.color,
              borderRadius: "6px 6px 0 0",
              opacity: barOp * fadeOut,
              boxShadow: `0 0 ${20 + i * 6}px ${bar.color}88`,
            }} />
            <div style={{
              position: "absolute",
              left: x, top: BAR_BOTTOM + 12,
              width: BAR_W,
              fontFamily: FONT, fontSize: 11, fontWeight: 600,
              color: RED,
              textAlign: "center",
              opacity: labelOp * fadeOut,
              textTransform: "uppercase", letterSpacing: 0.5,
            }}>{bar.label}</div>
            {/* Up arrow */}
            <svg style={{
              position: "absolute",
              left: x + BAR_W / 2 - 8, top: BAR_BOTTOM - barH - 28,
              opacity: arrowOp * barOp * fadeOut,
            }} width="16" height="20" viewBox="0 0 16 20">
              <polyline points="8,18 8,4" stroke={RED} strokeWidth="2" fill="none" />
              <polygon points="3,8 8,2 13,8" fill={RED} />
            </svg>
          </div>
        );
      })}

      {/* Bottom annotation */}
      <div style={{
        position: "absolute", bottom: 56, left: 0, right: 0, textAlign: "center",
        opacity: fi(frame, 205, 230, 0, 1) * fadeOut,
        transform: `translateY(${fi(frame, 205, 230, 8, 0)}px)`,
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 12,
          background: "white", borderRadius: 40, padding: "10px 28px",
          boxShadow: "0 2px 20px rgba(30,45,90,0.08)",
          border: "1.5px solid rgba(232,24,46,0.15)",
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: RED }} />
          <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: NAVY }}>
            Buyers changed. Your audience strategy should too.
          </div>
        </div>
      </div>

      {/* Fade out */}
      <div style={{
        position: "absolute", inset: 0,
        background: LIGHT, opacity: 1 - fadeOut, pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
}

// ─── Scene 3: Strategy 1 — Intent + Third-Party Data ─────────────────────────
// Three source pipes (Behavioral, Firmographic, Intent) flow down and merge
// into one unified signal, then a targeting card slides in
// Duration: 270 frames (9s)

const PIPES = [
  { label: "Behavioral Data",    sub: "Site visits, content",   x: 360,  color: "#3b6cff", delay: 20  },
  { label: "Firmographic Data",  sub: "Industry, size, role",   x: 960,  color: NAVY,      delay: 40  },
  { label: "Intent Signals",     sub: "Active research topics", x: 1560, color: RED,        delay: 60  },
];

const MERGE_Y = 620;
const PIPE_TOP = 200;
const PIPE_H = 340;
const PIPE_W = 180;

function IntentDataScene({ frame, fps }) {
  const fadeOut = fi(frame, 252, 270, 1, 0);
  const titleOp = fi(frame, 0, 28, 0, 1);

  // Pipes fill downward
  // Merge lines draw in after all pipes visible
  const mergeLineOp = fi(frame, 110, 140, 0, 1);
  const mergeDotS = spring({ frame: frame - 130, fps,
    config: { damping: 30, stiffness: 160, mass: 0.9, overshootClamping: true } });
  const mergeDot = frame < 130 ? 0 : Math.min(mergeDotS, 1);

  // Output card springs in
  const cardS = spring({ frame: frame - 180, fps,
    config: { damping: 32, stiffness: 150, mass: 1, overshootClamping: true } });
  const card = frame < 180 ? 0 : Math.min(cardS, 1);

  // Pulse on merge dot
  const pulse = 1 + 0.04 * Math.sin(frame * 0.12);

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: LIGHT }}>
      <Background />

      {/* Title */}
      <div style={{
        position: "absolute", top: 60, left: 0, right: 0, textAlign: "center",
        opacity: titleOp * fadeOut,
        transform: `translateY(${fi(frame, 0, 28, 10, 0)}px)`,
      }}>
        <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 800, color: NAVY, letterSpacing: -0.5 }}>
          Strategy 1: Unified Data Intelligence
        </div>
        <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 500, color: "rgba(30,45,90,0.5)", marginTop: 8 }}>
          Combine intent, firmographic, and behavioral signals to find buyers in-market
        </div>
      </div>

      {/* Pipes */}
      {PIPES.map((pipe, pi) => {
        const pipeOp = fi(frame, pipe.delay, pipe.delay + 20, 0, 1);
        const fillH = fi(frame, pipe.delay + 10, pipe.delay + 80, 0, PIPE_H);

        return (
          <div key={pi}>
            {/* Pipe shell */}
            <div style={{
              position: "absolute",
              left: pipe.x - PIPE_W / 2, top: PIPE_TOP,
              width: PIPE_W, height: PIPE_H,
              borderRadius: 12,
              border: `2px solid ${pipe.color}30`,
              background: `${pipe.color}08`,
              opacity: pipeOp * fadeOut,
            }} />
            {/* Pipe fill (grows downward) */}
            <div style={{
              position: "absolute",
              left: pipe.x - PIPE_W / 2 + 2, top: PIPE_TOP + 2,
              width: PIPE_W - 4, height: fillH,
              borderRadius: "10px 10px 0 0",
              background: `linear-gradient(to bottom, ${pipe.color}55, ${pipe.color}22)`,
              opacity: pipeOp * fadeOut,
            }} />
            {/* Pipe header chip */}
            <div style={{
              position: "absolute",
              left: pipe.x - PIPE_W / 2, top: PIPE_TOP - 52,
              width: PIPE_W,
              opacity: pipeOp * fadeOut,
              transform: `translateY(${fi(frame, pipe.delay, pipe.delay + 20, -8, 0)}px)`,
            }}>
              <div style={{
                background: "white",
                border: `1.5px solid ${pipe.color}40`,
                borderRadius: 10,
                padding: "8px 14px",
                boxShadow: "0 2px 12px rgba(30,45,90,0.07)",
                textAlign: "center",
              }}>
                <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 800, color: pipe.color }}>
                  {pipe.label}
                </div>
                <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 500, color: "rgba(30,45,90,0.45)", marginTop: 2 }}>
                  {pipe.sub}
                </div>
              </div>
            </div>

            {/* Flow line from pipe bottom to merge point */}
            <svg style={{
              position: "absolute", left: 0, top: 0, width: 1920, height: 1080,
              overflow: "visible", pointerEvents: "none",
              opacity: mergeLineOp * pipeOp * fadeOut,
            }}>
              <path
                d={`M ${pipe.x} ${PIPE_TOP + PIPE_H} C ${pipe.x} ${MERGE_Y - 20}, 960 ${MERGE_Y - 60}, 960 ${MERGE_Y}`}
                fill="none"
                stroke={pipe.color}
                strokeWidth={2.5}
                strokeDasharray="6 4"
                opacity={0.5}
              />
            </svg>
          </div>
        );
      })}

      {/* Merge node */}
      {mergeDot > 0 && (
        <>
          {/* Outer ring */}
          <div style={{
            position: "absolute",
            left: 960 - 44, top: MERGE_Y - 44,
            width: 88, height: 88, borderRadius: "50%",
            border: `2px solid ${RED}30`,
            opacity: mergeDot * fadeOut,
            transform: `scale(${pulse})`,
          }} />
          {/* Inner orb */}
          <div style={{
            position: "absolute",
            left: 960 - 28, top: MERGE_Y - 28,
            width: 56, height: 56, borderRadius: "50%",
            background: `radial-gradient(circle, ${RED} 0%, #c0101f 100%)`,
            boxShadow: `0 0 32px ${RED}55`,
            opacity: mergeDot * fadeOut,
            transform: `scale(${mergeDot})`,
          }} />
          {/* Label */}
          <div style={{
            position: "absolute",
            left: 960 + 44, top: MERGE_Y - 12,
            opacity: fi(frame, 145, 165, 0, 1) * fadeOut,
            transform: `translateX(${fi(frame, 145, 165, 10, 0)}px)`,
          }}>
            <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 800, color: RED }}>Unified Signal</div>
            <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 500, color: "rgba(30,45,90,0.45)", marginTop: 2 }}>
              In-market buyer identified
            </div>
          </div>
        </>
      )}

      {/* Output targeting card */}
      {card > 0 && (
        <div style={{
          position: "absolute",
          left: 960 - 290, top: MERGE_Y + 80,
          width: 580, height: 140,
          background: "white",
          borderRadius: 16,
          boxShadow: "0 6px 40px rgba(30,45,90,0.11)",
          border: `1.5px solid ${RED}25`,
          padding: "0 36px",
          display: "flex", flexDirection: "column", justifyContent: "center",
          opacity: card * fadeOut,
          transform: `scale(${0.9 + 0.1 * card}) translateY(${(1 - card) * 16}px)`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: RED }} />
            <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 800, color: NAVY }}>
              Target: Acme Corp — VP of Sales
            </div>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Researching CRM tools", "Series B funded", "Visited pricing page 3×"].map((tag, ti) => (
              <div key={ti} style={{
                fontFamily: FONT, fontSize: 12, fontWeight: 600,
                color: "rgba(30,45,90,0.5)",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: RED, opacity: 0.6 }} />
                {tag}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fade out */}
      <div style={{
        position: "absolute", inset: 0,
        background: LIGHT, opacity: 1 - fadeOut, pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
}

// ─── Root composition ─────────────────────────────────────────────────────────
const SCENE0 = 240;
const SCENE1 = 270;
const SCENE2 = 270;
const SCENE3 = 270;

export function AudienceDevelopment() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: LIGHT }}>
      <Sequence from={0} durationInFrames={SCENE0}>
        <HookScene frame={frame} fps={fps} />
      </Sequence>
      <Sequence from={SCENE0} durationInFrames={SCENE1}>
        <FunnelScene frame={frame - SCENE0} fps={fps} />
      </Sequence>
      <Sequence from={SCENE0 + SCENE1} durationInFrames={SCENE2}>
        <RebootScene frame={frame - SCENE0 - SCENE1} fps={fps} />
      </Sequence>
      <Sequence from={SCENE0 + SCENE1 + SCENE2} durationInFrames={SCENE3}>
        <IntentDataScene frame={frame - SCENE0 - SCENE1 - SCENE2} fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
}
