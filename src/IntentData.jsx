import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";

// ─── Design tokens ────────────────────────────────────────────────────────────
const NAVY       = "#1e2d5a";
const RED        = "#e8182e";
const PINK       = "#c2185b";
const LIGHT      = "#f8faff";
const ICON_COLOR = "#2D3A55";
const FONT       = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ─── Icons (Lucide/Heroicons style — single color, stroke) ────────────────────

// Search / research activity
const SearchIcon = ({ size = 56, color = ICON_COLOR }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="20" cy="20" r="13" stroke={color} strokeWidth="2.8"/>
    <line x1="30" y1="30" x2="43" y2="43" stroke={color} strokeWidth="2.8" strokeLinecap="round"/>
  </svg>
);

// File / content consumption
const FileTextIcon = ({ size = 56, color = ICON_COLOR }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M10 6 L32 6 L42 16 L42 44 L10 44 Z" stroke={color} strokeWidth="2.8" strokeLinejoin="round"/>
    <path d="M31 6 L31 17 L42 17" stroke={color} strokeWidth="2.8" strokeLinejoin="round"/>
    <line x1="17" y1="26" x2="35" y2="26" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="17" y1="33" x2="35" y2="33" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="17" y1="19" x2="27" y2="19" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

// Globe / website visits
const GlobeIcon = ({ size = 56, color = ICON_COLOR }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="2.8"/>
    <ellipse cx="24" cy="24" rx="8" ry="18" stroke={color} strokeWidth="2.8"/>
    <line x1="6"  y1="18" x2="42" y2="18" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="6"  y1="30" x2="42" y2="30" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

// Lightning bolt / buying signal
const ZapIcon = ({ size = 56, color = ICON_COLOR }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M28 4 L12 28 L22 28 L20 44 L36 20 L26 20 Z"
      stroke={color} strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round"/>
  </svg>
);

// Trending up / peak interest
const TrendingUpIcon = ({ size = 56, color = ICON_COLOR }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <polyline points="4,36 16,22 26,28 42,10"
      stroke={color} strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round" fill="none"/>
    <polyline points="32,10 42,10 42,20"
      stroke={color} strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round" fill="none"/>
  </svg>
);

// Bell / alert / prioritize
const BellIcon = ({ size = 56, color = ICON_COLOR }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M24 6 C16 6 12 13 12 20 L12 32 L6 38 L42 38 L36 32 L36 20 C36 13 32 6 24 6 Z"
      stroke={color} strokeWidth="2.8" strokeLinejoin="round"/>
    <path d="M20 38 C20 40.2 21.8 42 24 42 C26.2 42 28 40.2 28 38"
      stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

// ─── Dashed connector ─────────────────────────────────────────────────────────
function Connector({ x1, y1, x2, y2, progress = 1, color = "rgba(45,58,85,0.22)" }) {
  const dx = x2 - x1, dy = y2 - y1;
  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
      viewBox="0 0 1920 1080" width="1920" height="1080">
      <line
        x1={x1} y1={y1}
        x2={x1 + dx * progress} y2={y1 + dy * progress}
        stroke={color} strokeWidth="1.5" strokeDasharray="6 5" strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Signal pulse ring ────────────────────────────────────────────────────────
// Animated expanding ring to convey "live signal"
function PulseRing({ cx, cy, frame, delay = 0, color = RED }) {
  const t     = Math.max(0, frame - delay);
  const cycle = t % 60;                             // one pulse every 2s
  const r     = fi(cycle, 0, 55, 0, 90);
  const op    = fi(cycle, 0, 55, 0.5, 0);
  if (op <= 0) return null;
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      viewBox="0 0 1920 1080" width="1920" height="1080">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="2" opacity={op}/>
    </svg>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
// Three signal source tiles (top row) feed into center "Intent Data" hub
// Below hub: two outcome chips — Prioritize Accounts + Reach Out at Peak
//
// Canvas 1920×1080
// Title: y≈46
// Signal tiles row: y≈220, three tiles at x = 480, 960, 1440
// Hub center: (960, 520)
// Outcome chips: y≈700

const HUB_X = 960;
const HUB_Y = 520;
const HUB_S = 180;   // hub square size

const SIGNALS = [
  { label: "Search\nActivity",      Icon: SearchIcon,   x: 480,  y: 220 },
  { label: "Content\nConsumption",  Icon: FileTextIcon, x: 960,  y: 195 },
  { label: "Website\nVisits",       Icon: GlobeIcon,    x: 1440, y: 220 },
];

const OUTCOMES = [
  { label: "Prioritize accounts\nshowing buying signals", Icon: ZapIcon,         color: RED  },
  { label: "Reach out when\ninterest is at its peak",     Icon: TrendingUpIcon,  color: PINK },
];

const TILE = 148;

export const IntentData = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = fi(frame, 6, 24, 0, 1);
  const titleY  = fi(frame, 6, 24, 12, 0);

  const hubSp = spring({ frame: frame - 10, fps, config: { damping: 15, stiffness: 120 } });
  const hubOp = fi(frame, 10, 28, 0, 1);

  // "Intent data is…" sub label under hub
  const subOp = fi(frame, 20, 38, 0, 1);

  return (
    <AbsoluteFill style={{ background: LIGHT, fontFamily: FONT, overflow: "hidden" }}>
      <Img
        src={staticFile("explained/Background.png")}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
      />

      {/* ── Title ── */}
      <div style={{
        position: "absolute", top: 46, left: 0, right: 0,
        textAlign: "center",
        opacity: titleOp,
        transform: `translateY(${titleY}px)`,
        fontSize: 34, fontWeight: 800, color: NAVY, letterSpacing: "-0.4px",
      }}>
        What Is Intent Data?
      </div>

      {/* ── Pulse rings on hub (starts after hub appears) ── */}
      <PulseRing cx={HUB_X} cy={HUB_Y} frame={frame} delay={40} color={RED}/>
      <PulseRing cx={HUB_X} cy={HUB_Y} frame={frame} delay={60} color={PINK}/>

      {/* ── Connectors: signal tiles → hub ── */}
      {SIGNALS.map((sig, i) => {
        const tx = sig.x;
        const ty = sig.y + TILE / 2;
        // start point: bottom-center of tile
        // end point: top edge of hub
        const ex = HUB_X + (tx - HUB_X) * 0.08;
        const ey = HUB_Y - HUB_S / 2 - 4;
        const lp = fi(frame, 22 + i * 10, 38 + i * 10, 0, 1);
        return (
          <Connector key={i}
            x1={tx} y1={ty + TILE / 2 - 10}
            x2={ex} y2={ey}
            progress={lp}
          />
        );
      })}

      {/* ── 3 signal source tiles ── */}
      {SIGNALS.map((sig, i) => {
        const delay = 18 + i * 12;
        const sp  = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 150 } });
        const op  = fi(frame, delay, delay + 14, 0, 1);
        return (
          <div key={i} style={{
            position: "absolute",
            left: sig.x - TILE / 2,
            top:  sig.y,
            transform: `scale(${sp})`,
            opacity: op,
            transformOrigin: "center center",
          }}>
            <div style={{
              width: TILE, height: TILE,
              background: "#ffffff",
              borderRadius: 16,
              boxShadow: "0 4px 18px rgba(0,0,60,0.09)",
              border: "1.5px solid rgba(45,58,85,0.09)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
              padding: 12,
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Red top accent — signals flow toward red hub */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: 3, borderRadius: "16px 16px 0 0",
                background: `linear-gradient(90deg, ${RED}88, ${PINK}66)`,
              }}/>
              <sig.Icon size={54} color={ICON_COLOR} />
              <div style={{
                fontSize: 12, fontWeight: 600, color: NAVY,
                fontFamily: FONT, textAlign: "center", lineHeight: 1.3,
                whiteSpace: "pre-line",
              }}>{sig.label}</div>
            </div>
          </div>
        );
      })}

      {/* ── Center Intent Data hub ── */}
      <div style={{
        position: "absolute",
        left: HUB_X - HUB_S / 2,
        top:  HUB_Y - HUB_S / 2,
        transform: `scale(${hubSp})`,
        opacity: hubOp,
        zIndex: 10,
      }}>
        {/* Glow */}
        <div style={{
          position: "absolute", inset: -22,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(232,24,46,0.14) 0%, transparent 68%)`,
          pointerEvents: "none",
        }}/>
        <div style={{
          width: HUB_S, height: HUB_S,
          borderRadius: 24,
          background: `linear-gradient(140deg, ${RED}, #b5001f)`,
          boxShadow: `0 10px 36px rgba(200,0,40,0.38), 0 2px 8px rgba(200,0,40,0.18)`,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 10,
        }}>
          <ZapIcon size={68} color="white" />
          <div style={{
            fontSize: 11, fontWeight: 700,
            color: "rgba(255,255,255,0.82)",
            letterSpacing: "2.5px", textTransform: "uppercase",
          }}>Intent Data</div>
        </div>
      </div>

      {/* ── Connectors: hub → outcome chips ── */}
      {OUTCOMES.map((_, i) => {
        const ox = i === 0 ? HUB_X - 260 : HUB_X + 260;
        const oy = HUB_Y + HUB_S / 2 + 80;
        const lp = fi(frame, 72 + i * 10, 88 + i * 10, 0, 1);
        return (
          <Connector key={i}
            x1={HUB_X + (i === 0 ? -30 : 30)} y1={HUB_Y + HUB_S / 2 + 4}
            x2={ox} y2={oy - 4}
            progress={lp}
            color="rgba(45,58,85,0.18)"
          />
        );
      })}

      {/* ── 2 outcome chips ── */}
      {OUTCOMES.map((oc, i) => {
        const ox    = i === 0 ? HUB_X - 260 : HUB_X + 260;
        const oy    = HUB_Y + HUB_S / 2 + 80;
        const delay = 76 + i * 14;
        const sp    = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 130 } });
        const op    = fi(frame, delay, delay + 14, 0, 1);
        return (
          <div key={i} style={{
            position: "absolute",
            left: ox - 200,
            top: oy,
            transform: `scale(${sp})`,
            opacity: op,
            transformOrigin: "center top",
          }}>
            <div style={{
              width: 400,
              background: "white",
              borderRadius: 14,
              padding: "20px 24px",
              boxShadow: "0 4px 18px rgba(0,0,60,0.09)",
              border: "1.5px solid rgba(45,58,85,0.07)",
              borderTop: `3px solid ${oc.color}`,
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: oc.color + "12",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <oc.Icon size={28} color={oc.color} />
              </div>
              <div style={{
                fontSize: 16, fontWeight: 700, color: NAVY,
                fontFamily: FONT, lineHeight: 1.4,
                whiteSpace: "pre-line",
              }}>
                {oc.label}
              </div>
            </div>
          </div>
        );
      })}

      {/* ── "Behavioral signal data" caption below hub ── */}
      <div style={{
        position: "absolute",
        top: HUB_Y + HUB_S / 2 + 14,
        left: 0, right: 0,
        textAlign: "center",
        opacity: fi(frame, 30, 48, 0, 1),
        fontSize: 16, fontWeight: 500, color: "#7a82a0",
        letterSpacing: "0.1px",
        fontStyle: "italic",
      }}>
        Behavioral signal data — captured in real time
      </div>
    </AbsoluteFill>
  );
};
