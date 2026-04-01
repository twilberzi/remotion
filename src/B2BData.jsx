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

// ─── Lucide-style icons ───────────────────────────────────────────────────────

const DatabaseIcon = ({ size = 56, color = ICON_COLOR }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <ellipse cx="24" cy="13" rx="15" ry="6" stroke={color} strokeWidth="2.8" strokeLinejoin="round"/>
    <path d="M9 13 L9 35 C9 38.3 16 41 24 41 C32 41 39 38.3 39 35 L39 13" stroke={color} strokeWidth="2.8" strokeLinejoin="round"/>
    <path d="M9 24 C9 27.3 16 30 24 30 C32 30 39 27.3 39 24" stroke={color} strokeWidth="2.8"/>
  </svg>
);

const BuildingIcon = ({ size = 56, color = ICON_COLOR }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="10" y="16" width="28" height="26" rx="2" stroke={color} strokeWidth="2.8" strokeLinejoin="round"/>
    <path d="M17 42 L17 32 L24 32 L24 42" stroke={color} strokeWidth="2.8" strokeLinejoin="round"/>
    <rect x="16" y="21" width="5" height="5" rx="1" stroke={color} strokeWidth="2.2"/>
    <rect x="27" y="21" width="5" height="5" rx="1" stroke={color} strokeWidth="2.2"/>
    <path d="M10 16 L24 7 L38 16" stroke={color} strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round"/>
  </svg>
);

const TagIcon = ({ size = 56, color = ICON_COLOR }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M6 6 L26 6 L42 22 L26 42 L6 26 Z" stroke={color} strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round"/>
    <circle cx="16" cy="16" r="3.5" fill={color}/>
  </svg>
);

const ContactIcon = ({ size = 56, color = ICON_COLOR }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="6" y="10" width="36" height="28" rx="3" stroke={color} strokeWidth="2.8" strokeLinejoin="round"/>
    <circle cx="19" cy="22" r="5" stroke={color} strokeWidth="2.5"/>
    <path d="M10 38 C10 32 28 32 28 38" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="32" y1="20" x2="40" y2="20" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="32" y1="26" x2="38" y2="26" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const StackIcon = ({ size = 56, color = ICON_COLOR }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M6 16 L24 8 L42 16 L24 24 Z" stroke={color} strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round"/>
    <path d="M6 24 L24 32 L42 24" stroke={color} strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round"/>
    <path d="M6 32 L24 40 L42 32" stroke={color} strokeWidth="2.8" strokeLinejoin="round" strokeLinecap="round"/>
  </svg>
);

const TargetIcon = ({ size = 56, color = ICON_COLOR }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="2.8"/>
    <circle cx="24" cy="24" r="10" stroke={color} strokeWidth="2.8"/>
    <circle cx="24" cy="24" r="3.5" fill={color}/>
    <line x1="24" y1="4"  x2="24" y2="10" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="24" y1="38" x2="24" y2="44" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="4"  y1="24" x2="10" y2="24" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="38" y1="24" x2="44" y2="24" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const UsersIcon = ({ size = 56, color = ICON_COLOR }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="18" cy="17" r="7" stroke={color} strokeWidth="2.8"/>
    <path d="M4 40 C4 30 32 30 32 40" stroke={color} strokeWidth="2.8" strokeLinecap="round"/>
    <circle cx="34" cy="19" r="5.5" stroke={color} strokeWidth="2.5"/>
    <path d="M26 40 C27 35 44 35 44 40" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const ClockIcon = ({ size = 56, color = ICON_COLOR }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="2.8"/>
    <line x1="24" y1="11" x2="24" y2="24" stroke={color} strokeWidth="2.8" strokeLinecap="round"/>
    <line x1="24" y1="24" x2="33" y2="30" stroke={color} strokeWidth="2.8" strokeLinecap="round"/>
    <circle cx="24" cy="24" r="2.5" fill={color}/>
  </svg>
);

// ─── Dashed connector ─────────────────────────────────────────────────────────
function Connector({ x1, y1, x2, y2, progress = 1 }) {
  const dx = x2 - x1, dy = y2 - y1;
  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
      viewBox="0 0 1920 1080" width="1920" height="1080">
      <line
        x1={x1} y1={y1}
        x2={x1 + dx * progress} y2={y1 + dy * progress}
        stroke="rgba(45,58,85,0.25)" strokeWidth="1.5"
        strokeDasharray="6 5" strokeLinecap="round"
      />
    </svg>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
// Canvas: 1920×1080
// Title at top ~110px
// Hub center at (960, 390) — shifted up from vertical center
// Orbit radius 260 → bottom of orbit = 390+260 = 650, tile extends to 650+70 = 720
// Use-case row at y≈780, chips ~60px tall → bottom edge ≈ 840 — well clear of 1080
const CX = 960;
const CY = 390;
const R  = 260;

const DATA_CARDS = [
  { label: "Company\nSize",    Icon: BuildingIcon, angle: -90 },
  { label: "Industry",         Icon: TagIcon,      angle:   0 },
  { label: "Contact\nDetails", Icon: ContactIcon,  angle:  90 },
  { label: "Tech\nStack",      Icon: StackIcon,    angle: 180 },
];

const USE_CASES = [
  { label: "Who to target",     Icon: TargetIcon, color: NAVY },
  { label: "Who to talk to",    Icon: UsersIcon,  color: RED  },
  { label: "When to reach out", Icon: ClockIcon,  color: PINK },
];

export const B2BData = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hubSp  = spring({ frame, fps, config: { damping: 16, stiffness: 120 } });
  const hubOp  = fi(frame, 0, 18, 0, 1);
  const titleOp = fi(frame, 8, 26, 0, 1);
  const titleY  = fi(frame, 8, 26, 12, 0);
  const rowOp  = fi(frame, 100, 118, 0, 1);
  const rowY   = fi(frame, 100, 118, 20, 0);

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
        What Is B2B Data?
      </div>

      {/* ── Orbit ring (dashed, subtle) ── */}
      <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        viewBox="0 0 1920 1080" width="1920" height="1080">
        <circle
          cx={CX} cy={CY} r={R + 38}
          fill="none"
          stroke="rgba(45,58,85,0.08)" strokeWidth="1.5" strokeDasharray="5 8"
          opacity={fi(frame, 10, 28, 0, 1)}
        />
      </svg>

      {/* ── Connectors ── */}
      {DATA_CARDS.map((card, i) => {
        const rad = ((card.angle - 90) * Math.PI) / 180;
        const nx  = CX + R * Math.cos(rad);
        const ny  = CY + R * Math.sin(rad);
        const lp  = fi(frame, 16 + i * 10, 32 + i * 10, 0, 1);
        return (
          <Connector key={i}
            x1={CX + 78 * Math.cos(rad)} y1={CY + 78 * Math.sin(rad)}
            x2={nx - 72 * Math.cos(rad)} y2={ny - 72 * Math.sin(rad)}
            progress={lp}
          />
        );
      })}

      {/* ── 4 data-type tiles ── */}
      {DATA_CARDS.map((card, i) => {
        const rad   = ((card.angle - 90) * Math.PI) / 180;
        const nx    = CX + R * Math.cos(rad);
        const ny    = CY + R * Math.sin(rad);
        const delay = 20 + i * 10;
        const sp    = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 160 } });
        const op    = fi(frame, delay, delay + 14, 0, 1);
        const TILE  = 140;

        return (
          <div key={i} style={{
            position: "absolute",
            left: nx - TILE / 2,
            top:  ny - TILE / 2,
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
              gap: 8,
              padding: 12,
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Navy top accent — visually links each tile back to the hub */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: 3, borderRadius: "16px 16px 0 0",
                background: `linear-gradient(90deg, ${NAVY}99, #3d5a9a88)`,
              }}/>
              <card.Icon size={54} color={ICON_COLOR} />
              <div style={{
                fontSize: 12, fontWeight: 600, color: NAVY,
                fontFamily: FONT, textAlign: "center", lineHeight: 1.3,
                whiteSpace: "pre-line",
              }}>{card.label}</div>
            </div>
          </div>
        );
      })}

      {/* ── Center hub ── */}
      <div style={{
        position: "absolute",
        left: CX - 84, top: CY - 84,
        transform: `scale(${hubSp})`, opacity: hubOp,
        zIndex: 10,
      }}>
        {/* Soft glow */}
        <div style={{
          position: "absolute", inset: -20,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(30,45,90,0.16) 0%, transparent 70%)",
          pointerEvents: "none",
        }}/>
        <div style={{
          width: 168, height: 168,
          borderRadius: 22,
          background: `linear-gradient(140deg, #2a3f7a, ${NAVY})`,
          boxShadow: "0 8px 32px rgba(30,45,90,0.36), 0 2px 8px rgba(30,45,90,0.18)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 10,
        }}>
          <DatabaseIcon size={64} color="white" />
          <div style={{
            fontSize: 11, fontWeight: 700,
            color: "rgba(255,255,255,0.80)",
            letterSpacing: "2.5px", textTransform: "uppercase",
          }}>B2B Data</div>
        </div>
      </div>

      {/* ── Thin divider ── */}
      <div style={{
        position: "absolute",
        top: CY + R + 76,
        left: "50%", transform: "translateX(-50%)",
        width: fi(frame, 92, 114, 0, 480),
        height: 1,
        background: "rgba(45,58,85,0.12)",
      }}/>

      {/* ── "Revenue teams use this to decide…" ── */}
      <div style={{
        position: "absolute",
        top: CY + R + 88,
        left: 0, right: 0,
        textAlign: "center",
        opacity: fi(frame, 92, 110, 0, 1),
        fontSize: 19, fontWeight: 600, color: "#4a5580",
      }}>
        Revenue teams use this to decide…
      </div>

      {/* ── 3 use-case chips ── */}
      <div style={{
        position: "absolute",
        top: CY + R + 130,
        left: 0, right: 0,
        display: "flex",
        justifyContent: "center",
        gap: 36,
        opacity: rowOp,
        transform: `translateY(${rowY}px)`,
      }}>
        {USE_CASES.map((uc, i) => {
          const delay = 106 + i * 14;
          const sp = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 130 } });
          const op = fi(frame, delay, delay + 14, 0, 1);
          return (
            <div key={i} style={{
              transform: `scale(${sp})`, opacity: op,
              transformOrigin: "center center",
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "white",
                borderRadius: 12,
                padding: "13px 22px",
                boxShadow: "0 3px 14px rgba(0,0,60,0.08)",
                border: "1.5px solid rgba(45,58,85,0.07)",
                borderLeft: `3px solid ${uc.color}`,
              }}>
                <uc.Icon size={26} color={uc.color} />
                <div style={{
                  fontSize: 17, fontWeight: 700, color: NAVY,
                  fontFamily: FONT, whiteSpace: "nowrap",
                }}>
                  {uc.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
