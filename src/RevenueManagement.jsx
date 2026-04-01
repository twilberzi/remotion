import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";

const NAVY  = "#1e2d5a";
const RED   = "#e8182e";
const PINK  = "#c2185b";
const LIGHT = "#f8faff";
const FONT  = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ─── Card with red-pink gradient accent border ────────────────────────────────
function Card({ children, style = {}, width = 180, height = 180, gradient = false }) {
  return (
    <div style={{
      width, height,
      background: gradient
        ? `linear-gradient(135deg, ${RED}, ${PINK})`
        : "#ffffff",
      borderRadius: 20,
      border: gradient ? "none" : "1.5px solid rgba(232,24,46,0.10)",
      boxShadow: gradient
        ? "0 12px 40px rgba(200,0,60,0.30)"
        : "0 6px 24px rgba(0,0,60,0.09)",
      position: "relative",
      overflow: "visible",
      ...style,
    }}>
      {!gradient && (
        <>
          <div style={{
            position: "absolute", right: -1.5, top: "30%", bottom: -1.5,
            width: 3.5, borderRadius: "0 0 20px 0",
            background: `linear-gradient(180deg, transparent, ${RED} 40%, ${PINK})`,
          }}/>
          <div style={{
            position: "absolute", bottom: -1.5, left: "30%", right: -1.5,
            height: 3.5, borderRadius: "0 0 20px 0",
            background: `linear-gradient(90deg, transparent, ${RED} 40%, ${PINK})`,
          }}/>
        </>
      )}
      {children}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const ProductIcon = ({ size = 60, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 56 56">
    <rect x="8" y="24" width="40" height="24" rx="4" fill={color}/>
    <polygon points="28,6 6,22 50,22" fill={color}/>
    <rect x="20" y="32" width="16" height="16" rx="2" fill="white" opacity="0.8"/>
  </svg>
);

const CustomerIcon = ({ size = 60, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 56 56">
    <circle cx="22" cy="18" r="9" fill={color}/>
    <path d="M4 46 C4 32 40 32 40 46" fill={color}/>
    <circle cx="40" cy="24" r="7" fill={color} opacity="0.6"/>
    <path d="M28 46 C30 38 52 38 52 46" fill={color} opacity="0.6"/>
  </svg>
);

const TimeIcon = ({ size = 60, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 56 56">
    <circle cx="28" cy="28" r="22" fill="none" stroke={color} strokeWidth="4"/>
    <line x1="28" y1="10" x2="28" y2="28" stroke={color} strokeWidth="4" strokeLinecap="round"/>
    <line x1="28" y1="28" x2="40" y2="36" stroke={RED} strokeWidth="4" strokeLinecap="round"/>
    <circle cx="28" cy="28" r="3.5" fill={color}/>
    {[0,90,180,270].map((deg, i) => {
      const r = (deg * Math.PI) / 180;
      return <circle key={i} cx={28 + Math.cos(r) * 18} cy={28 + Math.sin(r) * 18} r="2.5" fill={color}/>;
    })}
  </svg>
);

const PriceIcon = ({ size = 60, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 56 56">
    <circle cx="28" cy="28" r="22" fill={color} opacity="0.08"/>
    <circle cx="28" cy="28" r="22" fill="none" stroke={color} strokeWidth="3.5"/>
    <text x="28" y="36" fontSize="26" fontWeight="900" fontFamily="Arial Black" fill={color} textAnchor="middle">$</text>
    {/* Up arrow */}
    <line x1="42" y1="14" x2="42" y2="6" stroke={RED} strokeWidth="3" strokeLinecap="round"/>
    <polygon points="42,4 38,10 46,10" fill={RED}/>
  </svg>
);

const ChannelIcon = ({ size = 60, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 56 56">
    {/* Hub */}
    <circle cx="28" cy="28" r="7" fill={color}/>
    {/* 4 channel nodes */}
    <circle cx="28" cy="8"  r="5" fill={color} opacity="0.7"/>
    <circle cx="48" cy="28" r="5" fill={color} opacity="0.7"/>
    <circle cx="28" cy="48" r="5" fill={color} opacity="0.7"/>
    <circle cx="8"  cy="28" r="5" fill={color} opacity="0.7"/>
    {/* Connecting lines */}
    <line x1="28" y1="21" x2="28" y2="13" stroke={color} strokeWidth="2.5"/>
    <line x1="35" y1="28" x2="43" y2="28" stroke={color} strokeWidth="2.5"/>
    <line x1="28" y1="35" x2="28" y2="43" stroke={color} strokeWidth="2.5"/>
    <line x1="21" y1="28" x2="13" y2="28" stroke={color} strokeWidth="2.5"/>
    {/* Signal arcs */}
    <path d="M20 8 A 12 12 0 0 1 36 8" fill="none" stroke={RED} strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M20 4 A 16 16 0 0 1 36 4" fill="none" stroke={RED} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

// ─── Spoke data ───────────────────────────────────────────────────────────────
// 5 spokes at 5 angles, nicely spaced around the center
const SPOKES = [
  { label: "Right\nProduct",  Icon: ProductIcon,  angle: -90,  color: "#3b5bdb", delay: 20  },
  { label: "Right\nCustomer", Icon: CustomerIcon, angle: -18,  color: "#0ea5e9", delay: 40  },
  { label: "Right\nTime",     Icon: TimeIcon,     angle:  54,  color: "#10b981", delay: 60  },
  { label: "Right\nPrice",    Icon: PriceIcon,    angle:  126, color: "#f59e0b", delay: 80  },
  { label: "Right\nChannel",  Icon: ChannelIcon,  angle:  198, color: "#8b5cf6", delay: 100 },
];

const CX = 960;
const CY = 520;
const SPOKE_R = 340; // center-to-icon-center distance

export const RevenueManagement = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Center hub
  const hubSpring = spring({ frame, fps, config: { damping: 16, stiffness: 120 } });
  const hubOp = fi(frame, 0, 18, 0, 1);

  // Bottom headline — builds in after all spokes are in (frame ~130+)
  const headlineOp = fi(frame, 135, 158, 0, 1);
  const headlineY  = fi(frame, 135, 158, 20, 0);

  return (
    <AbsoluteFill style={{ background: LIGHT, overflow: "hidden" }}>
      <Img src={staticFile("explained/Background.png")}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }}/>

      {/* ── Spoke connector lines ── */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        viewBox="0 0 1920 1080">
        {SPOKES.map((spoke, i) => {
          const rad = ((spoke.angle - 90) * Math.PI) / 180;
          const nx = CX + SPOKE_R * Math.cos(rad);
          const ny = CY + SPOKE_R * Math.sin(rad);
          // Line from hub edge to icon edge
          const startX = CX + 100 * Math.cos(rad);
          const startY = CY + 100 * Math.sin(rad);
          const endX   = nx - 95 * Math.cos(rad);
          const endY   = ny - 95 * Math.sin(rad);
          const lp = fi(frame, spoke.delay + 5, spoke.delay + 22, 0, 1);

          return (
            <g key={i}>
              <line
                x1={startX} y1={startY}
                x2={startX + (endX - startX) * lp}
                y2={startY + (endY - startY) * lp}
                stroke={spoke.color} strokeWidth="2.5"
                strokeDasharray="7 5" strokeLinecap="round"
                opacity={lp * 0.7}
              />
              {/* Dot at end */}
              {lp > 0.95 && (
                <circle cx={endX} cy={endY} r="5" fill={spoke.color} opacity="0.8"/>
              )}
            </g>
          );
        })}
      </svg>

      {/* ── Spoke icon cards ── */}
      {SPOKES.map((spoke, i) => {
        const rad = ((spoke.angle - 90) * Math.PI) / 180;
        const nx  = CX + SPOKE_R * Math.cos(rad);
        const ny  = CY + SPOKE_R * Math.sin(rad);
        const sp  = spring({ frame: frame - spoke.delay, fps, config: { damping: 13, stiffness: 180 } });
        const op  = fi(frame, spoke.delay, spoke.delay + 14, 0, 1);

        // Gentle float
        const floatY = Math.sin((frame / 30) * 0.9 + i * 1.2) * 4;

        return (
          <div key={i} style={{
            position: "absolute",
            left: nx - 95,
            top: ny - 95,
            transform: `scale(${sp}) translateY(${floatY}px)`,
            opacity: op,
            transformOrigin: "center center",
          }}>
            <Card width={190} height={190}>
              <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                height: "100%", gap: 14, padding: 16,
              }}>
                <div style={{
                  width: 64, height: 64,
                  borderRadius: 16,
                  background: spoke.color + "18",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <spoke.Icon size={42} color={spoke.color}/>
                </div>
                <div style={{
                  fontSize: 17, fontWeight: 700, color: NAVY, fontFamily: FONT,
                  textAlign: "center", lineHeight: 1.3, whiteSpace: "pre-line",
                }}>
                  {spoke.label}
                </div>
              </div>
              {/* Colored top accent bar */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: 4, borderRadius: "20px 20px 0 0",
                background: spoke.color,
              }}/>
            </Card>
          </div>
        );
      })}

      {/* ── Center hub ── */}
      <div style={{
        position: "absolute",
        left: CX - 100, top: CY - 100,
        transform: `scale(${hubSpring})`,
        opacity: hubOp,
        zIndex: 10,
      }}>
        <Card width={200} height={200} gradient>
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            height: "100%", gap: 8,
          }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.75)",
              fontFamily: FONT, letterSpacing: "2px", textTransform: "uppercase",
            }}>Revenue</div>
            <div style={{
              fontSize: 26, fontWeight: 900, color: "white",
              fontFamily: FONT, textAlign: "center", lineHeight: 1.15,
            }}>Manage-{"\n"}ment</div>
            {/* small ® symbol */}
            <div style={{
              width: 36, height: 2, borderRadius: 1,
              background: "rgba(255,255,255,0.5)", marginTop: 4,
            }}/>
          </div>
        </Card>
      </div>

      {/* ── Bottom definition line ── */}
      <div style={{
        position: "absolute",
        bottom: 72,
        left: 0, right: 0,
        textAlign: "center",
        opacity: headlineOp,
        transform: `translateY(${headlineY}px)`,
        padding: "0 200px",
      }}>
        <div style={{
          fontSize: 22, fontWeight: 400, color: "#4a5580",
          fontFamily: FONT, lineHeight: 1.6,
        }}>
          The strategic process of maximizing revenue by selling the{" "}
          {["right product", "right customer", "right time", "right price", "right channel"].map((phrase, i) => (
            <span key={i} style={{
              fontWeight: 800, color: SPOKES[i].color,
              opacity: fi(frame, 145 + i * 12, 162 + i * 12, 0, 1),
            }}>
              {phrase}{i < 4 ? <span style={{ color: "#4a5580", fontWeight: 400 }}>{i < 3 ? ", " : ", and "}</span> : "."}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
