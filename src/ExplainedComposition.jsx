import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Sequence,
  Img,
  staticFile,
} from "remotion";

// ─── Design tokens ────────────────────────────────────────────────────────────
const NAVY   = "#1e2d5a";
const RED    = "#e8182e";
const PINK   = "#c2185b";
const FONT   = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ─── Shared card style ────────────────────────────────────────────────────────
function Card({ children, style = {}, width = 180, height = 180 }) {
  return (
    <div style={{
      width, height,
      background: "#ffffff",
      borderRadius: 18,
      border: "1.5px solid rgba(232,24,46,0.12)",
      boxShadow: `
        0 4px 20px rgba(0,0,60,0.08),
        inset 0 0 0 1px rgba(255,255,255,0.8)
      `,
      position: "relative",
      overflow: "visible",
      ...style,
    }}>
      {/* Red-pink gradient corner accent */}
      <div style={{
        position: "absolute",
        right: -1.5, top: "25%", bottom: -1.5,
        width: 4,
        borderRadius: "0 0 18px 0",
        background: `linear-gradient(180deg, transparent, ${RED} 40%, ${PINK})`,
      }}/>
      <div style={{
        position: "absolute",
        bottom: -1.5, left: "25%", right: -1.5,
        height: 4,
        borderRadius: "0 0 18px 0",
        background: `linear-gradient(90deg, transparent, ${RED} 40%, ${PINK})`,
      }}/>
      {children}
    </div>
  );
}

// ─── Icon box card (icon-box-blank.png canonical style) ───────────────────────
function IconBoxCard({ label, Icon, width = 220, height = 240, scale = 1, opacity = 1 }) {
  const hasLabel = label && label.length > 0;
  return (
    <div style={{ width, height, position: "relative", transform: `scale(${scale})`, opacity, transformOrigin: "center center" }}>
      <Img
        src={staticFile("icon-box-blank.png")}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "fill" }}
      />
      {/* Icon area */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        bottom: hasLabel ? 80 : 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={hasLabel ? 88 : Math.round(height * 0.55)} />
      </div>
      {/* Label */}
      {hasLabel && (
        <div style={{ position: "absolute", bottom: 38, left: 0, right: 0, textAlign: "center", fontSize: 23, fontWeight: 700, color: NAVY, fontFamily: FONT, letterSpacing: 0, lineHeight: 1.3, whiteSpace: "pre-line" }}>
          {label}
        </div>
      )}
    </div>
  );
}

// ─── Icon card (label + icon, matching sample style) ─────────────────────────
function IconCard({ label, Icon, size = 180, scale = 1, opacity = 1 }) {
  return (
    <div style={{ transform: `scale(${scale})`, opacity, transformOrigin: "center center" }}>
      <Card width={size} height={size}>
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          height: "100%", gap: 10, padding: 16,
        }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: NAVY, fontFamily: FONT, textAlign: "center", lineHeight: 1.3, whiteSpace: "pre-line" }}>{label}</div>
          <Icon size={size * 0.38} />
        </div>
      </Card>
    </div>
  );
}

// ─── SVG Icons (navy, matching the reference) ─────────────────────────────────

const PersonIcon = ({ size = 56, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx="24" cy="16" r="9" fill={color}/>
    <path d="M6 42 C6 30 42 30 42 42" fill={color}/>
  </svg>
);

const BuildingIcon = ({ size = 56, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <rect x="8" y="14" width="32" height="28" rx="3" fill={color}/>
    <rect x="14" y="20" width="6" height="6" rx="1" fill="white"/>
    <rect x="26" y="20" width="6" height="6" rx="1" fill="white"/>
    <rect x="14" y="30" width="6" height="6" rx="1" fill="white"/>
    <rect x="26" y="30" width="6" height="6" rx="1" fill="white"/>
    <rect x="18" y="36" width="12" height="6" rx="1" fill="white"/>
    <polygon points="4,16 24,4 44,16" fill={color}/>
  </svg>
);

const TagIcon = ({ size = 56, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path d="M6 6 L26 6 L42 22 L26 42 L6 22 Z" rx="3" fill="none" stroke={color} strokeWidth="4" strokeLinejoin="round"/>
    <path d="M6 6 L28 6 L44 22 L28 42 L6 22 Z" fill={color}/>
    <circle cx="18" cy="17" r="4" fill="white"/>
  </svg>
);

const GearIcon = ({ size = 56, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="7" fill={color}/>
    {[0,45,90,135,180,225,270,315].map((deg, i) => {
      const r = (deg * Math.PI) / 180;
      const x = 24 + Math.cos(r) * 14;
      const y = 24 + Math.sin(r) * 14;
      return <circle key={i} cx={x} cy={y} r="4.5" fill={color}/>;
    })}
    <circle cx="24" cy="24" r="5" fill="white"/>
  </svg>
);

const PersonClockIcon = ({ size = 56, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx="18" cy="15" r="8" fill={color}/>
    <path d="M4 38 C4 28 32 28 32 38" fill={color}/>
    <circle cx="36" cy="32" r="10" fill="white" stroke={color} strokeWidth="3"/>
    <line x1="36" y1="26" x2="36" y2="32" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="36" y1="32" x2="40" y2="34" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const PersonCheckIcon = ({ size = 56, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx="20" cy="15" r="8" fill={color}/>
    <path d="M4 40 C4 28 36 28 36 40" fill={color}/>
    <polyline points="30,28 36,36 44,22" stroke={RED} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MegaphoneIcon = ({ size = 56, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path d="M6 18 L6 30 L14 30 L14 18 Z" fill={color}/>
    <path d="M14 18 L38 8 L38 40 L14 30 Z" fill={color}/>
    <rect x="6" y="30" width="8" height="10" rx="2" fill={color}/>
    <line x1="40" y1="16" x2="46" y2="14" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    <line x1="40" y1="24" x2="46" y2="24" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    <line x1="40" y1="32" x2="46" y2="30" stroke={color} strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const DatabaseIcon = ({ size = 56, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <ellipse cx="24" cy="12" rx="16" ry="6" fill={color}/>
    <rect x="8" y="12" width="32" height="12" fill={color}/>
    <ellipse cx="24" cy="24" rx="16" ry="6" fill={color}/>
    <rect x="8" y="24" width="32" height="12" fill={color}/>
    <ellipse cx="24" cy="36" rx="16" ry="6" fill={color}/>
    <ellipse cx="24" cy="12" rx="16" ry="6" fill="none" stroke="white" strokeWidth="1.5"/>
    <ellipse cx="24" cy="24" rx="16" ry="6" fill="none" stroke="white" strokeWidth="1.5"/>
    <ellipse cx="24" cy="36" rx="16" ry="6" fill="none" stroke="white" strokeWidth="1.5"/>
  </svg>
);

const DollarIcon = ({ size = 56, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <text x="24" y="38" fontSize="42" fontWeight="900" fontFamily="Arial Black" fill={color} textAnchor="middle">$</text>
  </svg>
);

const PinIcon = ({ size = 56, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path d="M24 4 C14 4 8 12 8 20 C8 32 24 46 24 46 C24 46 40 32 40 20 C40 12 34 4 24 4 Z" fill={color}/>
    <circle cx="24" cy="20" r="7" fill="white"/>
  </svg>
);

const CalcIcon = ({ size = 56, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <rect x="8" y="6" width="32" height="36" rx="4" fill={color}/>
    <rect x="12" y="10" width="24" height="10" rx="2" fill="white"/>
    {[0,1,2,3].map(c => [0,1,2].map(r => (
      <rect key={`${c}-${r}`} x={12+c*7} y={24+r*6} width="5" height="4" rx="1" fill="white"/>
    )))}
  </svg>
);

const EnvelopeIcon = ({ size = 56, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <rect x="4" y="12" width="40" height="28" rx="4" fill={color}/>
    <polyline points="4,12 24,28 44,12" stroke="white" strokeWidth="3" fill="none"/>
  </svg>
);

const NoteIcon = ({ size = 56, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <rect x="8" y="4" width="32" height="40" rx="4" fill={color}/>
    <line x1="14" y1="14" x2="34" y2="14" stroke="white" strokeWidth="2.5"/>
    <line x1="14" y1="22" x2="34" y2="22" stroke="white" strokeWidth="2.5"/>
    <line x1="14" y1="30" x2="26" y2="30" stroke="white" strokeWidth="2.5"/>
  </svg>
);

// ─── Dashed connector line ────────────────────────────────────────────────────
function DashedLine({ x1, y1, x2, y2, progress = 1, color = "#cccccc" }) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const dashTotal = 8;
  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
      viewBox="0 0 1920 1080" width="1920" height="1080">
      <line
        x1={x1} y1={y1} x2={x1 + dx * progress} y2={y1 + dy * progress}
        stroke={color} strokeWidth="2.5" strokeDasharray="8 6"
        strokeLinecap="round"
      />
      {progress >= 0.98 && (
        <circle cx={x2} cy={y2} r="6" fill={RED}/>
      )}
    </svg>
  );
}

// ─── Scene 1: Account Circle ──────────────────────────────────────────────────
// Center "Account" circle, 5 buyer types evenly spaced around it
// Animation: center pops first → camera pulls back → nodes slide out from center
function AccountCircleScene({ frame, fps }) {
  const CX = 960, CY = 540, R = 310;

  const centerSpring = spring({ frame, fps, config: { damping: 32, stiffness: 140 } });
  const centerOp = fi(frame, 0, 18, 0, 1);

  // Evenly spaced: 360/5 = 72° apart, starting from top (-90°)
  const nodes = [
    { label: "Economic\nBuyer",  Icon: TagIcon,         angle: -90              },
    { label: "Influencer",       Icon: PersonIcon,      angle: -90 + 72         },
    { label: "Decision\nMaker",  Icon: PersonClockIcon, angle: -90 + 72 * 2     },
    { label: "Champion",         Icon: PersonCheckIcon, angle: -90 + 72 * 3     },
    { label: "Technical\nBuyer", Icon: GearIcon,        angle: -90 + 72 * 4     },
  ];

  // Camera pull-back: starts at frame 20, zoomed in 1.3 → 1.0
  const camSp = spring({ frame: frame - 20, fps, config: { damping: 36, stiffness: 60 } });
  const camScale = 1.3 - camSp * 0.3;

  const circleOp = fi(frame, 25, 40, 0, 1);

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {/* Camera wrapper */}
      <div style={{
        position: "absolute", inset: 0,
        transform: `scale(${camScale})`,
        transformOrigin: "center center",
      }}>
        {/* Circle ring */}
        <svg style={{ position: "absolute", inset: 0 }} viewBox="0 0 1920 1080">
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#e0e4ef" strokeWidth="2"
            opacity={circleOp}/>
        </svg>

        {/* Connector lines — draw out from center as nodes appear */}
        {nodes.map((node, i) => {
          const rad = ((node.angle - 90) * Math.PI) / 180;
          const nx = CX + R * Math.cos(rad);
          const ny = CY + R * Math.sin(rad);
          const lineStart = 35 + i * 8;
          const lp = fi(frame, lineStart, lineStart + 18, 0, 1);
          return (
            <DashedLine key={i}
              x1={CX + 85 * Math.cos(rad)} y1={CY + 85 * Math.sin(rad)}
              x2={nx - 90 * Math.cos(rad)} y2={ny - 90 * Math.sin(rad)}
              progress={lp} color="#c8cce0"
            />
          );
        })}

        {/* Outer nodes — slide out from center */}
        {nodes.map((node, i) => {
          const rad = ((node.angle - 90) * Math.PI) / 180;
          const nx = CX + R * Math.cos(rad);
          const ny = CY + R * Math.sin(rad);
          const popStart = 42 + i * 8;
          const sp = spring({ frame: frame - popStart, fps, config: { damping: 30, stiffness: 160 } });
          const op = fi(frame, popStart, popStart + 14, 0, 1);
          // Slide out from center position
          const tx = CX + (nx - CX) * sp;
          const ty = CY + (ny - CY) * sp;
          return (
            <div key={i} style={{
              position: "absolute",
              left: tx - 90,
              top: ty - 90,
              opacity: op,
            }}>
              <IconCard label={node.label} Icon={node.Icon} size={180}/>
            </div>
          );
        })}

        {/* Center — red gradient circle */}
        <div style={{
          position: "absolute",
          left: CX - 90, top: CY - 90,
          width: 180, height: 180,
          transform: `scale(${centerSpring})`,
          opacity: centerOp,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${RED}, ${PINK})`,
          boxShadow: "0 8px 40px rgba(232,24,46,0.35)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 10,
        }}>
          <BuildingIcon size={70} color="white"/>
          <div style={{ fontSize: 18, fontWeight: 800, color: "white", fontFamily: FONT }}>Account</div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 2: Outreach Tree ───────────────────────────────────────────────────
function OutreachTreeScene({ frame, fps }) {
  const LEFT_X = 240, CX = 780;
  const rows = [
    { label: "CFO",            Icon: PersonIcon,      y: 280, items: ["ROI", "Financial Benefits"] },
    { label: "Technical\nBuyer", Icon: GearIcon,      y: 540, items: ["Demo", "Product Features"] },
    { label: "End-User",       Icon: PersonCheckIcon, y: 800, items: ["Use Cases", "User Experience"] },
  ];

  const rootSpring = spring({ frame, fps, config: { damping: 30, stiffness: 120 } });
  const rootOp = fi(frame, 0, 16, 0, 1);

  return (
    <AbsoluteFill>
      {/* Vertical trunk line */}
      <svg style={{ position: "absolute", inset: 0 }} viewBox="0 0 1920 1080">
        <line x1={CX} y1={280} x2={CX} y2={800}
          stroke="#c8cce0" strokeWidth="2.5" strokeDasharray="8 6"
          opacity={fi(frame, 20, 40, 0, 1)}/>
      </svg>

      {/* Root: Outreach */}
      <div style={{
        position: "absolute", left: LEFT_X - 95, top: 445,
      }}>
        <IconBoxCard label="Outreach" Icon={MegaphoneIcon} width={190} height={190} scale={rootSpring} opacity={rootOp}/>
      </div>

      {/* Horizontal branch from root to trunk */}
      <svg style={{ position: "absolute", inset: 0 }} viewBox="0 0 1920 1080">
        <line x1={LEFT_X + 95} y1={540} x2={CX} y2={540}
          stroke="#c8cce0" strokeWidth="2.5" strokeDasharray="8 6"
          opacity={fi(frame, 25, 42, 0, 1)}/>
      </svg>

      {rows.map((row, i) => {
        const sp1 = spring({ frame: frame - (20 + i * 15), fps, config: { damping: 30, stiffness: 150 } });
        const op1 = fi(frame, 20 + i * 15, 36 + i * 15, 0, 1);
        const lp  = fi(frame, 28 + i * 15, 46 + i * 15, 0, 1);

        return (
          <div key={i}>
            {/* Branch line to persona */}
            <svg style={{ position:"absolute",inset:0 }} viewBox="0 0 1920 1080">
              <line x1={CX} y1={row.y} x2={CX + 120} y2={row.y}
                stroke="#c8cce0" strokeWidth="2.5" strokeDasharray="8 6"
                opacity={op1 * 0.8}/>
            </svg>

            {/* Persona card */}
            <div style={{
              position: "absolute", left: CX + 120, top: row.y - 95,
            }}>
              <IconBoxCard label={row.label} Icon={row.Icon} width={190} height={190} scale={sp1} opacity={op1}/>
            </div>

            {/* Outcome tags */}
            {row.items.map((item, j) => {
              const tagSp = spring({ frame: frame - (36 + i * 15 + j * 10), fps, config: { damping: 28, stiffness: 160 } });
              const tagOp = fi(frame, 36 + i * 15 + j * 10, 50 + i * 15 + j * 10, 0, 1);
              const ITEM_X = CX + 370;
              const ITEM_Y = row.y - 60 + j * 90;
              return (
                <div key={j}>
                  <svg style={{ position:"absolute",inset:0 }} viewBox="0 0 1920 1080">
                    <line x1={CX + 310} y1={row.y} x2={ITEM_X} y2={ITEM_Y + 35}
                      stroke="#c8cce0" strokeWidth="2" strokeDasharray="6 5"
                      opacity={tagOp * 0.7}/>
                  </svg>
                  <div style={{
                    position:"absolute", left: ITEM_X, top: ITEM_Y,
                    transform: `scale(${tagSp})`, opacity: tagOp,
                  }}>
                    <div style={{
                      background: "white",
                      border: `1.5px solid rgba(232,24,46,0.15)`,
                      borderRadius: 12,
                      padding: "12px 28px",
                      fontSize: 18, fontWeight: 700, color: NAVY, fontFamily: FONT,
                      boxShadow: "0 4px 16px rgba(0,0,60,0.08)",
                      whiteSpace: "nowrap",
                      borderRight: `4px solid ${RED}`,
                      borderBottom: `4px solid ${PINK}`,
                    }}>{item}</div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

// ─── Scene 3: Lead Score Grid ─────────────────────────────────────────────────
// Script: "blog subscribers get 2 points. Whitepaper downloads get 25 points.
//   look at historical data and see which actions actually correlate with revenue."
export function LeadScoreScene({ frame, fps }) {
  const rows = [
    {
      label: "Behavioral",
      items: [
        { label: "Whitepaper\nDownload",  img: "lead-scoring-icons/Whitepaper download.png",   pts: "+25" },
        { label: "Webinar\nAttendance",   img: "lead-scoring-icons/Webinar Attendance.png",     pts: "+15" },
        { label: "Email\nOpen",           img: "lead-scoring-icons/Email Open.png",             pts: "+1"  },
        { label: "Blog\nSubscribe",       img: "lead-scoring-icons/Blog Subscription.png",      pts: "+2"  },
      ]
    },
    {
      label: "Firmographic",
      items: [
        { label: "Job Title /\nPosition",  img: "lead-scoring-icons/Job Title/Position.png",   pts: "+20" },
        { label: "Company\nSize",          img: "lead-scoring-icons/Company Size.png",          pts: "+15" },
        { label: "Company\nRevenue",       img: "lead-scoring-icons/Company Revenue.png",       pts: "+5"  },
        { label: "Company\nLocation",      img: "lead-scoring-icons/Company Location.png",      pts: "+1"  },
      ]
    },
  ];

  // Bottom callout: "Use historical data to assign point values"
  const hintOp = fi(frame, 100, 120, 0, 1);
  const hintY  = fi(frame, 100, 120, 12, 0);

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 0 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
        {rows.map((row, ri) => {
          const rowOp = fi(frame, ri * 22, ri * 22 + 20, 0, 1);
          return (
            <div key={ri} style={{ display: "flex", alignItems: "center", gap: 44 }}>
              {/* Row label */}
              <div style={{
                width: 220, fontSize: 34, fontWeight: 800, color: NAVY,
                fontFamily: FONT, opacity: rowOp,
              }}>{row.label}</div>

              {/* Icon cards */}
              <div style={{ display: "flex", gap: 28 }}>
                {row.items.map((item, ci) => {
                  const delay = ri * 22 + ci * 10;
                  const sp = spring({ frame: frame - delay, fps, config: { damping: 28, stiffness: 170 } });
                  const op = fi(frame, delay, delay + 14, 0, 1);
                  return (
                    <div key={ci} style={{ position: "relative", transform: `scale(${sp})`, opacity: op }}>
                      <Img
                        src={staticFile(item.img)}
                        style={{ width: 190, height: 190, objectFit: "contain", display: "block" }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom hint: use historical data */}
      <div style={{
        marginTop: 52,
        opacity: hintOp,
        transform: `translateY(${hintY}px)`,
        fontSize: 18, fontWeight: 500, color: "rgba(30,45,90,0.72)", fontFamily: FONT,
        textAlign: "center",
      }}>
        Look at historical data — which actions actually correlate with revenue.{" "}
        <strong style={{ color: NAVY }}>Be ready to adjust as you learn more.</strong>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 4: B2B Reality Check — 3 panels ───────────────────────────────────
// Panel timing: panel 1 @ 0, panel 2 @ 60, panel 3 @ 120, hold through 200

// Clock icon — long cycle (Muze-style solid)
const ClockLongIcon = ({ size = 80, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* Solid clock face */}
    <circle cx="24" cy="24" r="22" fill={color}/>
    {/* Clock hands — white cutout */}
    <line x1="24" y1="8" x2="24" y2="24" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
    <line x1="24" y1="24" x2="35" y2="31" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    {/* Center dot */}
    <circle cx="24" cy="24" r="3" fill="white"/>
  </svg>
);

// Recurring subscription — Muze-style solid
const RecurringIcon = ({ size = 80, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* Solid circle bg */}
    <circle cx="24" cy="24" r="22" fill={color}/>
    {/* Two circular arrows — white */}
    <path d="M14 18 A12 12 0 0 1 34 18" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
    <polygon points="34,12 38,20 30,20" fill="white"/>
    <path d="M34 30 A12 12 0 0 1 14 30" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
    <polygon points="14,36 10,28 18,28" fill="white"/>
  </svg>
);

// Rising bar chart — Muze-style solid
const RocketUpIcon = ({ size = 80, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    {/* Solid background pill */}
    <rect x="2" y="2" width="44" height="44" rx="8" fill={color}/>
    {/* Rising bars — white, cleanly separated */}
    <rect x="7"  y="34" width="7" height="8"  rx="2" fill="white" opacity="0.35"/>
    <rect x="17" y="26" width="7" height="16" rx="2" fill="white" opacity="0.6"/>
    <rect x="27" y="17" width="7" height="25" rx="2" fill="white" opacity="0.85"/>
    <rect x="37" y="8"  width="7" height="34" rx="2" fill="white"/>
  </svg>
);

function B2BRealityScene({ frame, fps }) {
  const panels = [
    {
      icon: ClockLongIcon,
      headline: "B2B sales cycles\nare longer.",
      sub: "More stakeholders. More scrutiny.\nMore time to win—or lose.",
      accentColor: NAVY,
      delay: 0,
    },
    {
      icon: RecurringIcon,
      headline: "Subscription models\nare the norm.",
      sub: "Revenue is earned every month,\nnot just at the close.",
      accentColor: RED,
      delay: 60,
    },
    {
      icon: RocketUpIcon,
      headline: "Buyer expectations\nare through the roof.",
      sub: "Personalization, speed, and trust\naren't optional anymore.",
      accentColor: PINK,
      delay: 120,
    },
  ];

  return (
    <AbsoluteFill style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 0,
    }}>
      <div style={{ display: "flex", gap: 56, alignItems: "stretch" }}>
        {panels.map((panel, i) => {
          const sp  = spring({ frame: frame - panel.delay, fps, config: { damping: 30, stiffness: 120 } });
          const op  = fi(frame, panel.delay, panel.delay + 22, 0, 1);
          const txtY = fi(frame, panel.delay + 8, panel.delay + 28, 18, 0);
          const txtOp = fi(frame, panel.delay + 8, panel.delay + 28, 0, 1);

          return (
            <div key={i} style={{
              transform: `scale(${sp})`,
              opacity: op,
              transformOrigin: "center bottom",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: 460,
            }}>
              {/* Icon card */}
              <div style={{ marginBottom: 36 }}>
                <IconBoxCard label="" Icon={panel.icon}/>
              </div>

              {/* Headline */}
              <div style={{
                fontSize: 32, fontWeight: 800, color: NAVY, fontFamily: FONT,
                textAlign: "center", lineHeight: 1.25, whiteSpace: "pre-line",
                marginBottom: 18,
                opacity: txtOp, transform: `translateY(${txtY}px)`,
              }}>
                {panel.headline}
              </div>

              {/* Sub-text */}
              <div style={{
                fontSize: 19, fontWeight: 400, color: "#4a5580", fontFamily: FONT,
                textAlign: "center", lineHeight: 1.5, whiteSpace: "pre-line",
                opacity: fi(frame, panel.delay + 18, panel.delay + 36, 0, 1),
              }}>
                {panel.sub}
              </div>

              {/* Bottom accent line */}
              <div style={{
                marginTop: 28,
                height: 4, borderRadius: 2,
                width: fi(frame, panel.delay + 20, panel.delay + 50, 0, 180),
                background: `linear-gradient(90deg, ${panel.accentColor}, ${PINK})`,
                opacity: fi(frame, panel.delay + 20, panel.delay + 38, 0, 1),
              }}/>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 5: Ready / Nurture / Noise ─────────────────────────────────────────
function ReadyNurtureNoiseScene({ frame, fps }) {
  const panels = [
    {
      label: "Ready to Buy",
      sub: "High fit · High intent\nRoute to sales now",
      icon: (
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <circle cx="26" cy="26" r="24" stroke="white" strokeWidth="3"/>
          <polyline points="15,27 23,35 37,19" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bg: `linear-gradient(135deg, ${RED}, ${PINK})`,
      textColor: "white",
      delay: 0,
    },
    {
      label: "Needs Nurturing",
      sub: "Good fit · Low intent\nKeep engaging",
      icon: (
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <circle cx="26" cy="26" r="24" stroke={NAVY} strokeWidth="3"/>
          <line x1="26" y1="14" x2="26" y2="28" stroke={NAVY} strokeWidth="3.5" strokeLinecap="round"/>
          <circle cx="26" cy="35" r="2.5" fill={NAVY}/>
        </svg>
      ),
      bg: "#ffffff",
      textColor: NAVY,
      delay: 18,
    },
    {
      label: "Just Noise",
      sub: "Poor fit · No intent\nRemove or ignore",
      icon: (
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <circle cx="26" cy="26" r="24" stroke="rgba(30,45,90,0.3)" strokeWidth="3"/>
          <line x1="18" y1="18" x2="34" y2="34" stroke="rgba(30,45,90,0.3)" strokeWidth="3.5" strokeLinecap="round"/>
          <line x1="34" y1="18" x2="18" y2="34" stroke="rgba(30,45,90,0.3)" strokeWidth="3.5" strokeLinecap="round"/>
        </svg>
      ),
      bg: "#ffffff",
      textColor: "rgba(30,45,90,0.6)",
      delay: 36,
    },
  ];

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", gap: 56, alignItems: "stretch" }}>
        {panels.map((p, i) => {
          const sp = spring({ frame: frame - p.delay, fps, config: { damping: 30, stiffness: 160 } });
          const op = fi(frame, p.delay, p.delay + 16, 0, 1);
          const isHot = i === 0;
          return (
            <div key={i} style={{
              transform: `scale(${sp})`, opacity: op,
              width: 360, borderRadius: 22,
              background: p.bg,
              border: isHot ? "none" : `1.5px solid rgba(30,45,90,0.12)`,
              boxShadow: isHot
                ? "0 12px 48px rgba(232,24,46,0.35)"
                : "0 4px 20px rgba(0,0,60,0.08)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "52px 36px", gap: 22,
            }}>
              {p.icon}
              <div style={{ fontSize: 32, fontWeight: 800, color: p.textColor, fontFamily: FONT, textAlign: "center", letterSpacing: "-0.5px" }}>
                {p.label}
              </div>
              <div style={{ fontSize: 19, fontWeight: 500, color: isHot ? "rgba(255,255,255,0.85)" : "rgba(30,45,90,0.65)", fontFamily: FONT, textAlign: "center", lineHeight: 1.5, whiteSpace: "pre-line" }}>
                {p.sub}
              </div>
              {isHot && (
                <div style={{
                  marginTop: 8,
                  background: RED,
                  borderRadius: 6, padding: "10px 16px",
                  fontSize: 16, fontWeight: 600, color: "white", fontFamily: FONT,
                  letterSpacing: "0.5px",
                }}>
                  PRIORITY
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 6: Scoring Matrix ──────────────────────────────────────────────────
function ScoringMatrixScene({ frame, fps }) {
  // Columns: Behavior score bands
  const colHeaders = ["50+", "25–50", "2–24", "<2"];
  // Rows: Demographic score bands
  const rowHeaders = ["50+", "25–50", "2–24", "<2"];

  // Cell content + highlight color
  // highlight: "hot" = red/pink, "warm" = blue, "nurture" = yellow, "cold" = pink/purge
  const cells = [
    [{ text: "Send to\nsales", h: "hot" },  { text: "Send to\nsales", h: "hot" },  { text: "Sales-oriented\nnurturing", h: "warm" }, { text: "General\nnurturing", h: "none" }],
    [{ text: "Send to\nsales", h: "hot" },  { text: "Sales-oriented\nnurturing", h: "warm" }, { text: "Sales-oriented\nnurturing", h: "warm" }, { text: "General\nnurturing", h: "none" }],
    [{ text: "Sales-oriented\nnurturing", h: "warm" }, { text: "Sales-oriented\nnurturing", h: "warm" }, { text: "Sales-oriented\nnurturing", h: "warm" }, { text: "General\nnurturing", h: "none" }],
    [{ text: "General\nnurturing", h: "none" }, { text: "General\nnurturing", h: "none" }, { text: "General\nnurturing", h: "none" }, { text: "Possibly purge /\ncheck for spam", h: "purge" }],
  ];

  const cellBg = { hot: `linear-gradient(135deg, ${RED}, ${PINK})`, warm: "#dbeafe", none: "#f0f4ff", purge: "#fce7f3" };
  const cellText = { hot: "white", warm: NAVY, none: NAVY, purge: NAVY };

  const CELL_W = 190;
  const CELL_H = 100;
  const HEADER_W = 110;
  const HEADER_H = 48;
  const GAP = 6;

  // Grid animates in row by row
  const gridDelay = 20;

  // Highlight phase: after frame 110, pulse the hot cells
  const highlightPhase = frame > 110;
  const pulse = highlightPhase
    ? 0.85 + 0.15 * Math.sin(((frame - 110) / 20) * Math.PI * 2)
    : 1;

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative" }}>

        {/* Axis labels */}
        <div style={{
          position: "absolute", left: -28, top: "50%",
          transform: "translateX(-100%) translateY(-50%) rotate(-90deg)",
          transformOrigin: "right center",
          fontSize: 16, fontWeight: 700, color: NAVY, fontFamily: FONT,
          letterSpacing: "1px", opacity: fi(frame, 0, 20, 0, 1),
          whiteSpace: "nowrap",
        }}>DEMOGRAPHICS SCORE</div>
        <div style={{
          position: "absolute", top: -38, left: HEADER_W + 20, right: 0,
          textAlign: "center", fontSize: 16, fontWeight: 700, color: NAVY,
          fontFamily: FONT, letterSpacing: "1px", opacity: fi(frame, 0, 20, 0, 1),
        }}>BEHAVIOR SCORE</div>

        {/* Column headers */}
        <div style={{ display: "flex", marginLeft: HEADER_W + GAP, gap: GAP, marginBottom: GAP }}>
          {colHeaders.map((h, ci) => {
            const op = fi(frame, ci * 8, ci * 8 + 18, 0, 1);
            return (
              <div key={ci} style={{
                width: CELL_W, height: HEADER_H, opacity: op,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: NAVY, borderRadius: 10,
                fontSize: 17, fontWeight: 800, color: "white", fontFamily: FONT,
              }}>{h}</div>
            );
          })}
        </div>

        {/* Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>
          {cells.map((row, ri) => {
            const rowOp = fi(frame, gridDelay + ri * 16, gridDelay + ri * 16 + 20, 0, 1);
            return (
              <div key={ri} style={{ display: "flex", gap: GAP, opacity: rowOp }}>
                {/* Row header */}
                <div style={{
                  width: HEADER_W, height: CELL_H,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: NAVY, borderRadius: 10,
                  fontSize: 17, fontWeight: 800, color: "white", fontFamily: FONT,
                }}>{rowHeaders[ri]}</div>

                {/* Cells */}
                {row.map((cell, ci) => {
                  const isHot = cell.h === "hot";
                  const cellSp = spring({ frame: frame - gridDelay - ri * 16 - ci * 6, fps, config: { damping: 28, stiffness: 170 } });
                  return (
                    <div key={ci} style={{
                      width: CELL_W, height: CELL_H,
                      background: cellBg[cell.h],
                      borderRadius: 10,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transform: `scale(${cellSp}) ${isHot && highlightPhase ? `scale(${pulse})` : ""}`,
                      boxShadow: isHot && highlightPhase
                        ? `0 0 ${20 * pulse}px rgba(232,24,46,0.5)`
                        : "0 2px 8px rgba(0,0,60,0.07)",
                      border: isHot ? "none" : "1px solid rgba(30,45,90,0.08)",
                    }}>
                      <div style={{
                        fontSize: 14, fontWeight: isHot ? 700 : 600,
                        color: cellText[cell.h], fontFamily: FONT,
                        textAlign: "center", lineHeight: 1.4, whiteSpace: "pre-line",
                      }}>{cell.text}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 7: Assign → Total → Prioritize ────────────────────────────────────
function AssignTotalPrioritizeScene({ frame, fps }) {
  // Step 1: cluster of lead circles with point badges
  // Step 2: score card totalling up
  // Step 3: phone call / rep action

  const STEP1_IN = 0;
  const STEP2_IN = 45;
  const STEP3_IN = 90;

  // Animated score counter for step 2
  const scoreVal = Math.round(fi(frame, STEP2_IN, STEP2_IN + 50, 0, 87));

  // Arrow line widths
  const arrow1W = fi(frame, STEP1_IN + 20, STEP2_IN, 0, 120);
  const arrow2W = fi(frame, STEP2_IN + 20, STEP3_IN, 0, 120);

  // Lead circles for step 1
  const leads = [
    { label: "+20", x: -30, y: -44, delay: STEP1_IN },
    { label: "+15", x: 44, y: -20, delay: STEP1_IN + 6 },
    { label: "+5",  x: 50, y: 44,  delay: STEP1_IN + 12 },
    { label: "+10", x: -44, y: 40, delay: STEP1_IN + 18 },
    { label: "+8",  x: 0,   y: 60, delay: STEP1_IN + 24 },
  ];

  const cardStyle = {
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 16, width: 280,
  };

  const labelStyle = {
    fontSize: 20, fontWeight: 700, color: NAVY, fontFamily: FONT,
    textAlign: "center", lineHeight: 1.3,
  };

  const subStyle = {
    fontSize: 18, fontWeight: 500, color: "rgba(30,45,90,0.72)",
    fontFamily: FONT, textAlign: "center", lineHeight: 1.4, whiteSpace: "pre-line",
  };

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>

        {/* ── Step 1: Lead cluster ── */}
        <div style={{ ...cardStyle, opacity: fi(frame, STEP1_IN, STEP1_IN + 16, 0, 1) }}>
          {/* Cluster container */}
          <div style={{ position: "relative", width: 180, height: 180 }}>
            {leads.map((lead, i) => {
              const sp = spring({ frame: frame - lead.delay, fps, config: { damping: 28, stiffness: 180 } });
              return (
                <div key={i} style={{
                  position: "absolute",
                  left: 90 + lead.x - 36,
                  top: 90 + lead.y - 36,
                  width: 72, height: 72, borderRadius: "50%",
                  background: "#ffffff",
                  border: `2px solid rgba(30,45,90,0.12)`,
                  boxShadow: "0 4px 16px rgba(0,0,60,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transform: `scale(${sp})`,
                }}>
                  <span style={{
                    fontSize: 16, fontWeight: 800, color: RED,
                    fontFamily: FONT,
                  }}>{lead.label}</span>
                </div>
              );
            })}
          </div>
          <div style={labelStyle}>Assign Points</div>
          <div style={subStyle}>{"Attributes & behaviors\nto signal buying intent"}</div>
        </div>

        {/* Arrow 1 */}
        <div style={{ display: "flex", alignItems: "center", width: 120, overflow: "hidden" }}>
          <svg width={arrow1W} height="24" viewBox={`0 0 120 24`}>
            <line x1="0" y1="12" x2="100" y2="12" stroke={RED} strokeWidth="3" strokeLinecap="round"/>
            <polyline points="94,5 108,12 94,19" fill="none" stroke={RED} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* ── Step 2: Score card ── */}
        <div style={{ ...cardStyle, opacity: fi(frame, STEP2_IN, STEP2_IN + 16, 0, 1), transform: `scale(${spring({ frame: frame - STEP2_IN, fps, config: { damping: 30, stiffness: 160 } })})` }}>
          <div style={{
            width: 200, borderRadius: 20,
            background: "#ffffff",
            border: "1.5px solid rgba(232,24,46,0.12)",
            boxShadow: "0 8px 32px rgba(0,0,60,0.1)",
            overflow: "hidden",
          }}>
            {/* Header */}
            <div style={{
              background: `linear-gradient(135deg, ${RED}, ${PINK})`,
              padding: "12px 20px",
              fontSize: 15, fontWeight: 700, color: "white", fontFamily: FONT,
              letterSpacing: "0.5px",
            }}>LEAD SCORE</div>
            {/* Score number */}
            <div style={{
              padding: "20px", textAlign: "center",
              fontSize: 72, fontWeight: 900, color: NAVY, fontFamily: FONT,
              lineHeight: 1, letterSpacing: "-2px",
            }}>{scoreVal}</div>
            {/* Bar */}
            <div style={{ padding: "0 20px 20px" }}>
              <div style={{ height: 8, borderRadius: 4, background: "#f0f0f5", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 4,
                  width: `${Math.min(scoreVal, 100)}%`,
                  background: `linear-gradient(90deg, ${RED}, ${PINK})`,
                }}/>
              </div>
            </div>
          </div>
          <div style={labelStyle}>Total the Score</div>
          <div style={subStyle}>{"Every action adds up\nto a single number"}</div>
        </div>

        {/* Arrow 2 */}
        <div style={{ display: "flex", alignItems: "center", width: 120, overflow: "hidden" }}>
          <svg width={arrow2W} height="24" viewBox="0 0 120 24">
            <line x1="0" y1="12" x2="100" y2="12" stroke={RED} strokeWidth="3" strokeLinecap="round"/>
            <polyline points="94,5 108,12 94,19" fill="none" stroke={RED} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* ── Step 3: Phone call ── */}
        <div style={{ ...cardStyle, opacity: fi(frame, STEP3_IN, STEP3_IN + 16, 0, 1), transform: `scale(${spring({ frame: frame - STEP3_IN, fps, config: { damping: 30, stiffness: 160 } })})` }}>
          <div style={{
            width: 160, height: 160, borderRadius: "50%",
            background: `linear-gradient(135deg, ${RED}, ${PINK})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 12px 48px rgba(232,24,46,0.4)",
            position: "relative",
          }}>
            {/* Phone icon */}
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
              <path d="M20 14h10l4 12-7 4a32 32 0 0 0 15 15l4-7 12 4v10a4 4 0 0 1-4 4C22 56 16 34 16 18a4 4 0 0 1 4-4z" fill="white" stroke="white" strokeWidth="1"/>
            </svg>
            {/* Pulse rings */}
            {[1, 2].map(r => (
              <div key={r} style={{
                position: "absolute",
                width: 160 + r * 40, height: 160 + r * 40,
                borderRadius: "50%",
                border: `2px solid rgba(232,24,46,${0.3 - r * 0.1})`,
                opacity: 0.4 + 0.3 * Math.sin((frame / 15 + r) * Math.PI),
                top: -(r * 20), left: -(r * 20),
              }}/>
            ))}
          </div>
          <div style={labelStyle}>Call First</div>
          <div style={subStyle}>{"Highest scores get\nyour reps' attention first"}</div>
        </div>

      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 8: Demographic + Behavioral = Complete Picture ────────────────────
function DemoVsBehaviorScene({ frame, fps }) {
  const demographic = [
    { label: "Job Title", icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="4" y="8" width="20" height="16" rx="3" stroke={NAVY} strokeWidth="2"/><path d="M10 8V6a4 4 0 0 1 8 0v2" stroke={NAVY} strokeWidth="2"/><line x1="9" y1="14" x2="19" y2="14" stroke={NAVY} strokeWidth="1.5" strokeLinecap="round"/><line x1="9" y1="18" x2="15" y2="18" stroke={NAVY} strokeWidth="1.5" strokeLinecap="round"/></svg> },
    { label: "Company Size", icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="3" y="10" width="14" height="14" rx="2" stroke={NAVY} strokeWidth="2"/><path d="M17 8h6v16h-6" stroke={NAVY} strokeWidth="2" strokeLinejoin="round"/><rect x="7" y="14" width="3" height="3" fill={NAVY}/><rect x="12" y="14" width="3" height="3" fill={NAVY}/><rect x="7" y="19" width="3" height="3" fill={NAVY}/></svg> },
    { label: "Industry", icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="10" stroke={NAVY} strokeWidth="2"/><line x1="14" y1="4" x2="14" y2="24" stroke={NAVY} strokeWidth="1.5"/><ellipse cx="14" cy="14" rx="5" ry="10" stroke={NAVY} strokeWidth="1.5"/><line x1="4" y1="14" x2="24" y2="14" stroke={NAVY} strokeWidth="1.5"/></svg> },
    { label: "Location", icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 3a8 8 0 0 1 8 8c0 6-8 14-8 14S6 17 6 11a8 8 0 0 1 8-8z" stroke={NAVY} strokeWidth="2"/><circle cx="14" cy="11" r="3" stroke={NAVY} strokeWidth="2"/></svg> },
  ];

  const behavioral = [
    { label: "Website Visits", icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="3" y="5" width="22" height="18" rx="3" stroke={NAVY} strokeWidth="2"/><line x1="3" y1="10" x2="25" y2="10" stroke={NAVY} strokeWidth="1.5"/><circle cx="7" cy="7.5" r="1.2" fill={NAVY}/><circle cx="11" cy="7.5" r="1.2" fill={NAVY}/><line x1="8" y1="15" x2="20" y2="15" stroke={NAVY} strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="19" x2="16" y2="19" stroke={NAVY} strokeWidth="1.5" strokeLinecap="round"/></svg> },
    { label: "Email Opens", icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="3" y="7" width="22" height="16" rx="3" stroke={NAVY} strokeWidth="2"/><polyline points="3,7 14,16 25,7" stroke={NAVY} strokeWidth="2" strokeLinejoin="round"/></svg> },
    { label: "Content Downloads", icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke={NAVY} strokeWidth="2"/><line x1="14" y1="17" x2="14" y2="25" stroke={NAVY} strokeWidth="2" strokeLinecap="round"/><polyline points="10,22 14,26 18,22" stroke={NAVY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="8" y1="9" x2="16" y2="9" stroke={NAVY} strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="13" x2="14" y2="13" stroke={NAVY} strokeWidth="1.5" strokeLinecap="round"/></svg> },
    { label: "Pricing Page Views", icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="10" stroke={NAVY} strokeWidth="2"/><line x1="14" y1="8" x2="14" y2="10" stroke={NAVY} strokeWidth="2" strokeLinecap="round"/><line x1="14" y1="18" x2="14" y2="20" stroke={NAVY} strokeWidth="2" strokeLinecap="round"/><path d="M10.5 11.5a3.5 3.5 0 0 1 7 0c0 2-3.5 3-3.5 5" stroke={NAVY} strokeWidth="2" strokeLinecap="round"/></svg> },
    { label: "Webinar Attendance", icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="3" y="5" width="22" height="16" rx="3" stroke={NAVY} strokeWidth="2"/><polygon points="11,9 11,17 19,13" fill={NAVY}/><line x1="8" y1="23" x2="20" y2="23" stroke={NAVY} strokeWidth="2" strokeLinecap="round"/></svg> },
  ];

  // Equation appears after both columns are mostly in
  const eqDelay = 110;
  const eqSp = spring({ frame: frame - eqDelay, fps, config: { damping: 28, stiffness: 150 } });
  const eqOp = fi(frame, eqDelay, eqDelay + 20, 0, 1);

  const renderColumn = (title, items, baseDelay, accentColor) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 340 }}>
      {/* Column header */}
      <div style={{
        opacity: fi(frame, baseDelay, baseDelay + 18, 0, 1),
        transform: `translateY(${fi(frame, baseDelay, baseDelay + 18, 12, 0)}px)`,
        marginBottom: 6,
      }}>
        <div style={{
          display: "inline-block",
          padding: "10px 16px", borderRadius: 6,
          background: accentColor === "gradient"
            ? RED
            : NAVY,
          fontSize: 16, fontWeight: 600, color: "white", fontFamily: FONT,
          letterSpacing: "0.3px",
        }}>{title}</div>
        <div style={{
          fontSize: 18, fontWeight: 500, color: "rgba(30,45,90,0.75)",
          fontFamily: FONT, marginTop: 6, paddingLeft: 4,
        }}>{accentColor === "gradient" ? "Explicit — what they tell you" : "Implicit — what they do"}</div>
      </div>

      {items.map((item, i) => {
        const d = baseDelay + 16 + i * 12;
        const sp = spring({ frame: frame - d, fps, config: { damping: 28, stiffness: 170 } });
        const op = fi(frame, d, d + 14, 0, 1);
        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 16,
            background: "#ffffff",
            border: "1.5px solid rgba(30,45,90,0.08)",
            borderRadius: 14, padding: "14px 18px",
            boxShadow: "0 2px 12px rgba(0,0,60,0.06)",
            transform: `scale(${sp})`, opacity: op,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10, flexShrink: 0,
              background: "#F4F5F7",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{item.icon}</div>
            <div style={{ fontSize: 17, fontWeight: 600, color: NAVY, fontFamily: FONT }}>{item.label}</div>
          </div>
        );
      })}
    </div>
  );

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40 }}>

      {/* Equation banner */}
      <div style={{
        opacity: eqOp, transform: `scale(${eqSp})`,
        background: RED,
        borderRadius: 6, padding: "14px 48px",
        fontSize: 26, fontWeight: 600, color: "white", fontFamily: FONT,
        letterSpacing: "-0.3px", boxShadow: "0 8px 32px rgba(232,24,46,0.35)",
      }}>
        Demographic + Behavioral = Complete Picture
      </div>

      {/* Two columns */}
      <div style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>
        {renderColumn("Demographic", demographic, 0, "gradient")}
        {renderColumn("Behavioral", behavioral, 20, "navy")}
      </div>

    </AbsoluteFill>
  );
}

// ─── Scene titles ─────────────────────────────────────────────────────────────
function SceneTitle({ text, frame, startFrame = 0 }) {
  const op = fi(frame, startFrame, startFrame + 18, 0, 1);
  const y  = fi(frame, startFrame, startFrame + 18, 20, 0);
  return (
    <div style={{
      position: "absolute", top: 52, left: 0, right: 0,
      textAlign: "center", opacity: op,
      transform: `translateY(${y}px)`,
      fontSize: 36, fontWeight: 800, color: NAVY, fontFamily: FONT,
      letterSpacing: "-0.5px",
    }}>
      {text}
    </div>
  );
}

// ─── Scene 9: Lead A vs Lead B ───────────────────────────────────────────────
function LeadAvsLeadBScene({ frame, fps }) {
  // TIMELINE (600 frames = 20s)
  //
  // ACT 1 — Lead A story (0–150f / 0–5s)
  //   0–30:   Lead A company card slides in from left
  //   35–130: Lead A activity items stagger in (pricing ×3, webinar, ROI calc, perfect-fit)
  //
  // ACT 2 — Lead B arrives (150–300f / 5–10s)
  //   150–180: Lead B company card slides in from right (same company info)
  //   185–280: Lead B activity items stagger in (blog sub, 6mo no engagement)
  //
  // ACT 3 — "Without lead scoring, they look identical." (300–390f / 10–13s)
  //   300–330: Score/activity boxes FADE OUT on both cards — only company tops remain
  //   340–370: "Without lead scoring — they look identical." line appears
  //   Both company tops look the same
  //
  // ACT 4 — "With lead scoring?" shift (390–510f / 13–17s)
  //   390–420: "With lead scoring?" line appears
  //   420–460: Score boxes FADE BACK IN
  //   450–480: Lead A card glows red, score badge pops
  //   470–500: Lead B card fades/dims
  //
  // ACT 5 — Outcomes (510–600f / 17–20s)
  //   510–540: "Lead A gets called today." pill
  //   540–570: "Lead B goes into nurture." pill

  // ── Company data per lead ──
  const companyRowsA = [
    { label: "Company",    val: "Vertex Systems"  },
    { label: "Industry",   val: "SaaS / Tech"     },
    { label: "Employees",  val: "800–2,000"        },
    { label: "Revenue",    val: "$80M–$150M"       },
    { label: "Title",      val: "VP of Marketing"  },
  ];
  const companyRowsB = [
    { label: "Company",    val: "Aligned Networks" },
    { label: "Industry",   val: "SaaS / Tech"      },
    { label: "Employees",  val: "1,500–2,500"       },
    { label: "Revenue",    val: "$100M–$150M"       },
    { label: "Title",      val: "VP of Marketing"   },
  ];

  // ── Lead A activity items ──
  const aItems = [
    { text: "Visited pricing page ×3",       delay: 38  },
    { text: "Attended product webinar",       delay: 62  },
    { text: "Downloaded ROI calculator",      delay: 86  },
    { text: "Perfect-fit company profile",    delay: 110 },
  ];

  // ── Lead B activity items ──
  const bItems = [
    { text: "Subscribed to blog",             delay: 188 },
    { text: "Last activity: 6 months ago",    delay: 212 },
    { text: "No engagement since",            delay: 236 },
  ];

  // ─ ACT 1: Lead A card entrance ─
  const cardASp  = spring({ frame: frame - 0,   fps, config: { damping: 30, stiffness: 130 } });
  const cardAOp  = fi(frame, 0, 22, 0, 1);

  // ─ ACT 2: Lead B card entrance ─
  const cardBSp  = spring({ frame: frame - 150, fps, config: { damping: 30, stiffness: 130 } });
  const cardBOp  = fi(frame, 150, 172, 0, 1);

  // ─ ACT 3: Score boxes fade out (only company tops remain) ─
  const activityFadeOut = fi(frame, 300, 326, 1, 0);  // activity sections fade out
  const activityFadeIn  = fi(frame, 420, 452, 0, 1);  // fade back in for act 4
  const activityOp      = frame < 300 ? 1 : frame < 420 ? activityFadeOut : activityFadeIn;

  // ─ "Without lead scoring" line ─
  const withoutOp = fi(frame, 342, 362, 0, 1);
  const withoutY  = fi(frame, 342, 362, 14, 0);

  // ─ "With lead scoring?" line ─
  const withScoringOp = fi(frame, 392, 412, 0, 1);
  const withScoringY  = fi(frame, 392, 412, 14, 0);

  // ─ Lead A highlight (after "with lead scoring") ─
  const aHighlight    = fi(frame, 452, 480, 0, 1);
  const aGlowPulse    = frame > 452 ? 0.5 + 0.5 * Math.sin(((frame - 452) / 18) * Math.PI * 2) : 0;
  const scoreASp      = spring({ frame: frame - 452, fps, config: { damping: 32, stiffness: 180 } });
  const scoreAVal     = Math.round(87 * Math.min(scoreASp, 1));
  const barAW         = fi(frame, 455, 495, 0, 87);

  // ─ Lead B dims ─
  const bDim          = fi(frame, 470, 500, 1, 0.35);

  // ─ Score badge for B (faint, appears alongside A's) ─
  const scoreBSp      = spring({ frame: frame - 465, fps, config: { damping: 30, stiffness: 170 } });
  const scoreBVal     = Math.round(3 * Math.min(scoreBSp, 1));
  const barBW         = fi(frame, 468, 500, 0, 3);

  // ─ ACT 5: Outcome pills ─
  const outAOp = fi(frame, 512, 530, 0, 1);
  const outAY  = fi(frame, 512, 530, 14, 0);
  const outBOp = fi(frame, 542, 560, 0, 1);
  const outBY  = fi(frame, 542, 560, 14, 0);

  const renderActivityItem = (item, isA) => {
    const iOp = fi(frame, item.delay, item.delay + 18, 0, 1);
    const iX  = fi(frame, item.delay, item.delay + 18, isA ? -20 : 20, 0);
    return (
      <div key={item.text} style={{
        display: "flex", alignItems: "center", gap: 10,
        opacity: iOp * activityOp,
        transform: `translateX(${iX}px)`,
      }}>
        <div style={{
          width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
          background: isA ? `linear-gradient(135deg, ${RED}, ${PINK})` : "rgba(30,45,90,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {isA
            ? <svg width="12" height="12" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            : <svg width="12" height="12" viewBox="0 0 10 10"><line x1="2.5" y1="2.5" x2="7.5" y2="7.5" stroke="rgba(30,45,90,0.55)" strokeWidth="1.8" strokeLinecap="round"/><line x1="7.5" y1="2.5" x2="2.5" y2="7.5" stroke="rgba(30,45,90,0.55)" strokeWidth="1.8" strokeLinecap="round"/></svg>
          }
        </div>
        <div style={{ fontSize: 18, fontWeight: 500, color: isA ? NAVY : "rgba(30,45,90,0.65)", fontFamily: FONT }}>{item.text}</div>
      </div>
    );
  };

  const renderCard = (isA) => {
    const cardSp   = isA ? cardASp  : cardBSp;
    const cardOp   = isA ? cardAOp  : cardBOp;
    const items    = isA ? aItems   : bItems;
    const scoreVal = isA ? scoreAVal : scoreBVal;
    const scoreSp  = isA ? scoreASp : scoreBSp;
    const barW     = isA ? barAW    : barBW;
    const dimOp    = isA ? 1        : bDim;
    const highlightBorder = isA ? aHighlight : 0;
    const outOp    = isA ? outAOp   : outBOp;
    const outY     = isA ? outAY    : outBY;
    const scoreRevealOp = isA ? fi(frame, 452, 468, 0, 1) : fi(frame, 465, 480, 0, 1);

    return (
      <div style={{
        width: 440,
        display: "flex", flexDirection: "column", gap: 12,
        transform: `translateX(${fi(frame, isA ? 0 : 150, isA ? 22 : 172, isA ? -40 : 40, 0)}px) scale(${0.94 + 0.06 * cardSp})`,
        opacity: cardOp * dimOp,
      }}>

        {/* TOP BOX — Company Info (always visible) */}
        <div style={{
          background: "#ffffff",
          borderRadius: 18,
          border: `1.5px solid ${highlightBorder > 0 ? `rgba(232,24,46,${0.4 * highlightBorder})` : "rgba(30,45,90,0.09)"}`,
          boxShadow: highlightBorder > 0
            ? `0 0 0 ${4 * highlightBorder}px rgba(232,24,46,${0.15 * highlightBorder}), 0 8px 36px rgba(232,24,46,${0.18 * highlightBorder})`
            : "0 4px 20px rgba(0,0,60,0.07)",
          overflow: "hidden",
        }}>
          {/* Card header */}
          <div style={{
            background: highlightBorder > 0
              ? `linear-gradient(135deg, rgba(232,24,46,${highlightBorder}), rgba(194,24,91,${highlightBorder})), ${NAVY}`
              : NAVY,
            padding: "16px 22px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "rgba(255,255,255,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 900, color: "white", fontFamily: FONT,
            }}>{isA ? "A" : "B"}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "white", fontFamily: FONT }}>Lead {isA ? "A" : "B"}</div>
              <div style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", fontFamily: FONT }}>{isA ? "sarah@vertexsystems.com" : "darnell@alignednetworks.com"}</div>
            </div>
          </div>

          {/* Company rows */}
          <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(30,45,90,0.75)", fontFamily: FONT, letterSpacing: "1px", marginBottom: 6 }}>COMPANY</div>
            {(isA ? companyRowsA : companyRowsB).map((r, i) => {
              const rows = isA ? companyRowsA : companyRowsB;
              const rOp = fi(frame, 8 + i * 10, 22 + i * 10, 0, 1);
              return (
                <div key={r.label} style={{
                  display: "flex", justifyContent: "space-between",
                  padding: "8px 0", borderBottom: i < rows.length - 1 ? "1px solid rgba(30,45,90,0.05)" : "none",
                  opacity: rOp,
                }}>
                  <span style={{ fontSize: 16, color: "rgba(30,45,90,0.6)", fontWeight: 500, fontFamily: FONT }}>{r.label}</span>
                  <span style={{ fontSize: 16, color: NAVY, fontWeight: 700, fontFamily: FONT }}>{r.val}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM BOX — Activity / Scoring */}
        <div style={{
          background: "#ffffff",
          borderRadius: 18,
          border: `1.5px solid ${isA && highlightBorder > 0 ? `rgba(232,24,46,${0.3 * highlightBorder})` : "rgba(30,45,90,0.09)"}`,
          boxShadow: "0 4px 20px rgba(0,0,60,0.07)",
          overflow: "hidden",
          opacity: activityOp,
        }}>
          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(30,45,90,0.75)", fontFamily: FONT, letterSpacing: "1px" }}>
              ACTIVITY & SIGNALS
            </div>
            {items.map(item => renderActivityItem(item, isA))}

            {/* Score bar — only after act 4 */}
            <div style={{ marginTop: 4, opacity: scoreRevealOp }}>
              <div style={{ height: "1px", background: "rgba(30,45,90,0.08)", marginBottom: 12 }}/>
              <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(30,45,90,0.75)", fontFamily: FONT, letterSpacing: "1px", marginBottom: 8 }}>LEAD SCORE</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 68, height: 68, borderRadius: "50%", flexShrink: 0,
                  background: isA ? `linear-gradient(135deg, ${RED}, ${PINK})` : "rgba(30,45,90,0.1)",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  transform: `scale(${Math.min(scoreSp, 1)})`,
                  boxShadow: isA ? `0 0 0 ${6 * aGlowPulse * (isA ? 1 : 0)}px rgba(232,24,46,0.25), 0 4px 16px rgba(232,24,46,0.4)` : "none",
                }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: isA ? "white" : "rgba(30,45,90,0.55)", fontFamily: FONT, lineHeight: 1 }}>{scoreVal}</div>
                  <div style={{ fontSize: 13, color: isA ? "rgba(255,255,255,0.65)" : "rgba(30,45,90,0.5)", fontFamily: FONT }}>/100</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 8, borderRadius: 99, background: "rgba(30,45,90,0.07)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${barW}%`, borderRadius: 99, background: isA ? `linear-gradient(90deg, ${RED}, ${PINK})` : "rgba(30,45,90,0.18)" }}/>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 16, fontWeight: 700, color: isA ? RED : "rgba(30,45,90,0.5)", fontFamily: FONT }}>
                    {isA ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <svg width={14} height={14} viewBox="0 0 24 24" fill={RED}><path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5 0.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/></svg>
                        Hot Lead
                      </span>
                    ) : (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <svg width={14} height={14} viewBox="0 0 24 24" fill="rgba(30,45,90,0.5)"><path d="M22 9V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2zm-4 10H4V5h14v14zM6 13h5v4H6zm6-6h4v3h-4zM6 7h5v5H6zm6 4h4v6h-4z"/></svg>
                        Cold — No urgency
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Outcome pill */}
            <div style={{ opacity: outOp, transform: `translateY(${outY}px)`, marginTop: 4 }}>
              <div style={{
                padding: "10px 16px", borderRadius: 6, textAlign: "center",
                background: isA ? RED : "rgba(30,45,90,0.07)",
                fontSize: 18, fontWeight: 600,
                color: isA ? "white" : NAVY, fontFamily: FONT,
                boxShadow: isA ? "0 4px 16px rgba(232,24,46,0.35)" : "none",
              }}>{isA ? "→ Call today" : "→ Add to nurture"}</div>
            </div>
          </div>
        </div>

      </div>
    );
  };

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>

      {/* Cards row */}
      <div style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>
        {renderCard(true)}
        {renderCard(false)}
      </div>

      {/* "Without lead scoring — they look identical." */}
      <div style={{ opacity: withoutOp, transform: `translateY(${withoutY}px)`, textAlign: "center" }}>
        <span style={{ fontSize: 30, fontWeight: 600, color: "rgba(30,45,90,0.55)", fontFamily: FONT }}>
          Without lead scoring —&nbsp;<strong style={{ color: NAVY }}>they look identical.</strong>
        </span>
      </div>

      {/* "With lead scoring?" */}
      <div style={{ opacity: withScoringOp, transform: `translateY(${withScoringY}px)`, textAlign: "center" }}>
        <span style={{ fontSize: 30, fontWeight: 700, color: NAVY, fontFamily: FONT }}>
          With lead scoring? <span style={{ color: RED }}>Lead A gets called today.</span> Lead B goes into nurture.
        </span>
      </div>

    </AbsoluteFill>
  );
}

// ─── Scene 11: Explicit vs Implicit Data ─────────────────────────────────────
// ─── Scene 11: Demographic / Explicit ────────────────────────────────────────
function DemographicExplicitScene({ frame, fps }) {
  // Phase 1: header (0-30)
  // Phase 2: "what is explicit" definition row (30-80)
  // Phase 3: Enterprise card (80-130)
  // Phase 4: SMB card (130-190)
  // Phase 5: score tally bars (190-250)
  // Phase 6: tagline (250-280)

  const headerOp  = fi(frame, 0, 22, 0, 1);
  const headerY   = fi(frame, 0, 22, -16, 0);

  // Definition pills
  const pills = ["Job Title", "Company Size", "Industry", "Location", "Revenue"];
  const pillsOp = fi(frame, 30, 48, 0, 1);

  // Cards
  const card1Sp   = spring({ frame: frame - 80,  fps, config: { damping: 30, stiffness: 155 } });
  const badge1Sp  = spring({ frame: frame - 108, fps, config: { damping: 32, stiffness: 180 } });
  const card2Sp   = spring({ frame: frame - 140, fps, config: { damping: 30, stiffness: 155 } });
  const badge2Sp  = spring({ frame: frame - 168, fps, config: { damping: 32, stiffness: 180 } });

  // Score bars
  const bar1W = fi(frame, 195, 230, 0, 100);
  const bar2W = fi(frame, 215, 245, 0, 100);
  const barsOp = fi(frame, 190, 205, 0, 1);

  const taglineOp = fi(frame, 252, 272, 0, 1);
  const taglineY  = fi(frame, 252, 272, 12, 0);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36 }}>

      {/* Header */}
      <div style={{ opacity: headerOp, transform: `translateY(${headerY}px)`, textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "10px 16px", borderRadius: 6, background: RED, fontSize: 22, fontWeight: 600, color: "white", fontFamily: FONT }}>Demographic Data — Explicit</div>
        <div style={{ fontSize: 19, color: "rgba(30,45,90,0.65)", fontFamily: FONT, marginTop: 10 }}>Information leads give you directly</div>
      </div>

      {/* Definition pills */}
      <div style={{ display: "flex", gap: 12, opacity: pillsOp, flexWrap: "wrap", justifyContent: "center" }}>
        {pills.map((p, i) => (
          <div key={i} style={{
            padding: "9px 22px", borderRadius: 6,
            background: "rgba(30,45,90,0.06)", border: "1.5px solid rgba(30,45,90,0.12)",
            fontSize: 17, fontWeight: 600, color: NAVY, fontFamily: FONT,
            transform: `translateY(${fi(frame, 30 + i * 6, 48 + i * 6, 8, 0)}px)`,
          }}>{p}</div>
        ))}
      </div>

      {/* Two company cards */}
      <div style={{ display: "flex", gap: 56, alignItems: "flex-start" }}>

        {/* Enterprise — HIGH FIT */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ position: "relative", transform: `scale(${card1Sp})`, opacity: fi(frame, 80, 96, 0, 1) }}>
            <div style={{ width: 380, background: "#fff", border: "2px solid rgba(232,24,46,0.18)", borderRadius: 22, padding: "26px 30px", boxShadow: "0 8px 32px rgba(232,24,46,0.1)" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(30,45,90,0.75)", fontFamily: FONT, letterSpacing: "1.2px", marginBottom: 10 }}>ENTERPRISE · FORTUNE 500</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: NAVY, fontFamily: FONT, marginBottom: 14 }}>GlobalTech Inc.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[["Industry", "SaaS / Tech ✓"], ["Employees", "12,000+"], ["Revenue", "$3.5B"], ["Title", "VP of Sales ✓"]].map(([k, v], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 17, fontFamily: FONT }}>
                    <span style={{ color: "rgba(30,45,90,0.6)", fontWeight: 500 }}>{k}</span>
                    <span style={{ color: NAVY, fontWeight: 700 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{
              position: "absolute", top: -22, right: -22,
              width: 90, height: 90, borderRadius: "50%",
              background: `linear-gradient(135deg, ${RED}, ${PINK})`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              boxShadow: "0 6px 20px rgba(232,24,46,0.45)",
              transform: `scale(${badge1Sp})`,
            }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: "white", fontFamily: FONT, lineHeight: 1 }}>+40</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.85)", fontFamily: FONT }}>pts</div>
            </div>
          </div>
          {/* Score bar */}
          <div style={{ opacity: barsOp, width: 380 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 600, color: NAVY, fontFamily: FONT, marginBottom: 6 }}>
              <span>Demographic Fit</span><span style={{ color: RED }}>High</span>
            </div>
            <div style={{ height: 10, borderRadius: 99, background: "rgba(30,45,90,0.08)" }}>
              <div style={{ height: "100%", width: `${bar1W}%`, borderRadius: 99, background: `linear-gradient(90deg, ${RED}, ${PINK})` }}/>
            </div>
          </div>
        </div>

        {/* SMB — LOW FIT */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ position: "relative", transform: `scale(${card2Sp})`, opacity: fi(frame, 140, 156, 0, 1) }}>
            <div style={{ width: 380, background: "#fff", border: "1.5px solid rgba(30,45,90,0.07)", borderRadius: 22, padding: "26px 30px", boxShadow: "0 4px 16px rgba(0,0,60,0.05)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(30,45,90,0.45)", fontFamily: FONT, letterSpacing: "1.2px", marginBottom: 10 }}>SMB · STARTUP</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "rgba(30,45,90,0.5)", fontFamily: FONT, marginBottom: 14 }}>Tiny Co.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[["Industry", "Retail (off-target)"], ["Employees", "8"], ["Revenue", "Early stage"], ["Title", "Co-founder"]].map(([k, v], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 17, fontFamily: FONT }}>
                    <span style={{ color: "rgba(30,45,90,0.6)", fontWeight: 500 }}>{k}</span>
                    <span style={{ color: "rgba(30,45,90,0.6)", fontWeight: 700 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{
              position: "absolute", top: -14, right: -14,
              width: 62, height: 62, borderRadius: "50%",
              background: "rgba(30,45,90,0.1)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              transform: `scale(${badge2Sp})`,
            }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: "rgba(30,45,90,0.55)", fontFamily: FONT, lineHeight: 1 }}>+5</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(30,45,90,0.45)", fontFamily: FONT }}>pts</div>
            </div>
          </div>
          {/* Score bar */}
          <div style={{ opacity: barsOp, width: 380 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 600, color: "rgba(30,45,90,0.55)", fontFamily: FONT, marginBottom: 6 }}>
              <span>Demographic Fit</span><span>Low</span>
            </div>
            <div style={{ height: 10, borderRadius: 99, background: "rgba(30,45,90,0.08)" }}>
              <div style={{ height: "100%", width: `${bar2W * 0.12}%`, borderRadius: 99, background: "rgba(30,45,90,0.2)" }}/>
            </div>
          </div>
        </div>

      </div>

      {/* Tagline */}
      <div style={{ opacity: taglineOp, transform: `translateY(${taglineY}px)`, fontSize: 24, fontWeight: 600, color: "rgba(30,45,90,0.75)", fontFamily: FONT, textAlign: "center" }}>
        Demographic fit tells you <strong style={{ color: NAVY }}>which companies belong in your pipeline.</strong>
      </div>

    </AbsoluteFill>
  );
}

// ─── Scene 12: Behavioral / Implicit ─────────────────────────────────────────
// ─── Behavioral signal icons — solid navy silhouette, Font Awesome / Muze style ─
function SignalIcon({ type, size = 20 }) {
  const c = NAVY;
  const s = { width: size, height: size };
  if (type === "pricing") return (
    <svg {...s} viewBox="0 0 24 24" fill={c}><path d="M12 1C5.93 1 1 5.93 1 12s4.93 11 11 11 11-4.93 11-11S18.07 1 12 1zm.5 16.5v1.5h-1v-1.52C9.74 17.24 8.5 16.03 8.5 14.5h1.5c0 .83.9 1.5 2 1.5s2-.67 2-1.5c0-.9-.72-1.5-2-1.5-2.21 0-3.5-1.12-3.5-3 0-1.49 1.21-2.72 3-2.98V5.5h1v1.53c1.74.28 2.5 1.48 2.5 2.97h-1.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5c0 .9.72 1.5 2 1.5 2.21 0 3.5 1.12 3.5 3 0 1.5-1.24 2.74-3 2.99z"/></svg>
  );
  if (type === "download") return (
    <svg {...s} viewBox="0 0 24 24" fill={c}><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
  );
  if (type === "target") return (
    <svg {...s} viewBox="0 0 24 24" fill={c}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-12.5c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 5.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>
  );
  if (type === "email") return (
    <svg {...s} viewBox="0 0 24 24" fill={c}><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
  );
  if (type === "web") return (
    <svg {...s} viewBox="0 0 24 24" fill={c}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
  );
  if (type === "search") return (
    <svg {...s} viewBox="0 0 24 24" fill={c}><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
  );
  return null;
}

function BehavioralImplicitScene({ frame, fps }) {
  // Phase 1: header (0-25)
  // Phase 2: subtitle explanation (25-50)
  // Phase 3: activity rows stagger in (50-190)
  // Phase 4: total score tally animates (200-240)
  // Phase 5: tagline (255-280)

  const items = [
    { text: "Visited pricing page",         pts: "+25", icon: "pricing",  delay: 50  },
    { text: "Downloaded buyer's guide",     pts: "+20", icon: "download", delay: 75  },
    { text: "Attended live demo webinar",   pts: "+15", icon: "target",   delay: 100 },
    { text: "Opened 3 emails this week",    pts: "+10", icon: "email",    delay: 125 },
    { text: "Visited website 5x in 7 days", pts: "+10", icon: "web",      delay: 150 },
    { text: "Clicked competitor comparison", pts: "+5", icon: "search",   delay: 175 },
  ];

  const totalScore = 85;
  const totalSp = spring({ frame: frame - 200, fps, config: { damping: 30, stiffness: 140 } });
  const totalOp = fi(frame, 200, 216, 0, 1);

  const taglineOp = fi(frame, 255, 275, 0, 1);
  const taglineY  = fi(frame, 255, 275, 12, 0);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 60 }}>

      {/* Left: activity list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 560 }}>

        {/* Header */}
        <div style={{ opacity: fi(frame, 0, 22, 0, 1), transform: `translateY(${fi(frame, 0, 22, -14, 0)}px)`, marginBottom: 6 }}>
          <div style={{ display: "inline-block", padding: "10px 16px", borderRadius: 6, background: NAVY, fontSize: 17, fontWeight: 600, color: "white", fontFamily: FONT }}>Behavioral Data — Implicit</div>
          <div style={{ fontSize: 18, color: "rgba(30,45,90,0.72)", fontFamily: FONT, marginTop: 7 }}>Actions that signal buying intent — even without a form fill</div>
        </div>

        {items.map((item, i) => {
          const sp = spring({ frame: frame - item.delay, fps, config: { damping: 28, stiffness: 165 } });
          const op = fi(frame, item.delay, item.delay + 18, 0, 1);
          const x  = fi(frame, item.delay, item.delay + 18, -24, 0);
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "#fff", border: "1.5px solid rgba(30,45,90,0.07)",
              borderRadius: 14, padding: "14px 20px",
              boxShadow: "0 2px 12px rgba(0,0,60,0.06)",
              transform: `scale(${sp}) translateX(${x}px)`, opacity: op,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <SignalIcon type={item.icon} size={20} />
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: NAVY, fontFamily: FONT }}>{item.text}</div>
              </div>
              <div style={{
                padding: "5px 12px", borderRadius: 6,
                background: RED,
                fontSize: 15, fontWeight: 600, color: "white", fontFamily: FONT,
                boxShadow: "0 2px 8px rgba(232,24,46,0.28)",
                transform: `scale(${sp})`,
              }}>{item.pts}</div>
            </div>
          );
        })}
      </div>

      {/* Right: total score card */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{
          opacity: totalOp,
          transform: `scale(${totalSp})`,
          width: 220, height: 220, borderRadius: "50%",
          background: `linear-gradient(135deg, ${RED}, ${PINK})`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          boxShadow: "0 16px 60px rgba(232,24,46,0.4)",
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.8)", fontFamily: FONT, letterSpacing: "1px", marginBottom: 4 }}>BEHAVIOR SCORE</div>
          <div style={{ fontSize: 68, fontWeight: 900, color: "white", fontFamily: FONT, lineHeight: 1 }}>{Math.round(totalScore * Math.min(totalSp, 1))}</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.75)", fontFamily: FONT }}>out of 100</div>
        </div>

        <div style={{
          opacity: totalOp,
          transform: `translateY(${fi(frame, 200, 220, 10, 0)}px)`,
          padding: "10px 16px", borderRadius: 6,
          background: RED,
          fontSize: 14, fontWeight: 600, color: "white", fontFamily: FONT,
          display: "flex", alignItems: "center", gap: 7,
        }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0 }}>
            <path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5 0.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
          </svg>
          HOT LEAD — Route to Sales</div>

        {/* Tagline */}
        <div style={{ opacity: taglineOp, transform: `translateY(${taglineY}px)`, fontSize: 17, fontWeight: 600, color: "rgba(30,45,90,0.6)", fontFamily: FONT, textAlign: "center", maxWidth: 240 }}>
          Behavior tells you <strong style={{ color: NAVY }}>who's ready to buy right now.</strong>
        </div>
      </div>

    </AbsoluteFill>
  );
}

// ─── Scene 13: Lead Scoring Example (full walkthrough) ───────────────────────
// Script: Sarah, VP of Marketing, 500-person company, target industry.
//   Attended webinar last week (+15). Downloaded ROI calculator yesterday (+20).
//   Visited pricing page twice today (+15). Total = 50 points.
function LeadScoringExampleScene({ frame, fps }) {
  // Phase 1: Lead card arrives (0-40)
  // Phase 2: Behavioral rows light up + score ticks (40-200)
  // Phase 3: Final total ring fills + priority label (200-280)
  // Phase 4: Outcome CTA (280-320)

  const behavRows = [
    { label: "Attended webinar last week",        pts: 15, delay: 45  },
    { label: "Downloaded ROI calculator yesterday", pts: 20, delay: 82  },
    { label: "Visited pricing page (×2 today)",   pts: 15, delay: 119 },
  ];

  const fullTotal = 50;

  // Score circle fill (0→fullTotal over frames 200→270)
  const scoreFill = fi(frame, 200, 270, 0, fullTotal);
  const ringOp = fi(frame, 198, 215, 0, 1);
  const ringSp = spring({ frame: frame - 198, fps, config: { damping: 30, stiffness: 140 } });

  const ctaOp = fi(frame, 285, 305, 0, 1);
  const ctaY  = fi(frame, 285, 305, 14, 0);

  // Card entrance
  const cardSp = spring({ frame: frame - 0, fps, config: { damping: 30, stiffness: 130 } });
  const cardOp = fi(frame, 0, 20, 0, 1);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 80 }}>

      {/* Left: scoring rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 650, transform: `scale(${cardSp})`, opacity: cardOp }}>

        {/* Lead card header */}
        <div style={{ background: "#fff", borderRadius: 18, padding: "24px 32px", border: "2px solid rgba(232,24,46,0.15)", boxShadow: "0 6px 28px rgba(30,45,90,0.1)", marginBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(30,45,90,0.55)", fontFamily: FONT, letterSpacing: "1.2px", marginBottom: 10 }}>INBOUND LEAD &middot; SCORING NOW</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: NAVY, fontFamily: FONT }}>Sarah</div>
          <div style={{ fontSize: 19, color: "rgba(30,45,90,0.7)", fontFamily: FONT, marginTop: 6 }}>VP of Marketing &middot; 500-person company &middot; Target industry</div>
        </div>

        {/* Behavioral section label */}
        <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(30,45,90,0.55)", fontFamily: FONT, letterSpacing: "1.2px", marginBottom: 2, paddingLeft: 4, opacity: fi(frame, 38, 52, 0, 1) }}>BEHAVIORAL SIGNALS</div>

        {behavRows.map((row, i) => {
          const rowOp = fi(frame, row.delay, row.delay + 16, 0, 1);
          const rowX  = fi(frame, row.delay, row.delay + 16, -20, 0);
          const ptsSp = spring({ frame: frame - row.delay - 8, fps, config: { damping: 30, stiffness: 200 } });
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "#fff", border: "1.5px solid rgba(232,24,46,0.1)",
              borderRadius: 14, padding: "18px 24px",
              boxShadow: "0 2px 10px rgba(232,24,46,0.07)",
              opacity: rowOp, transform: `translateX(${rowX}px)`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: `linear-gradient(135deg, ${RED}, ${PINK})`, flexShrink: 0 }}/>
                <div style={{ fontSize: 20, fontWeight: 600, color: NAVY, fontFamily: FONT }}>{row.label}</div>
              </div>
              <div style={{
                padding: "7px 16px", borderRadius: 6,
                background: RED,
                fontSize: 16, fontWeight: 600, color: "white", fontFamily: FONT,
                transform: `scale(${ptsSp})`,
                whiteSpace: "nowrap",
              }}>+{row.pts} pts</div>
            </div>
          );
        })}
      </div>

      {/* Right: score circle + outcome */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>

        {/* Score ring */}
        <div style={{ opacity: ringOp, transform: `scale(${ringSp})`, position: "relative", width: 280, height: 280 }}>
          <svg width={280} height={280} style={{ position: "absolute", top: 0, left: 0 }}>
            <circle cx={140} cy={140} r={112} fill="none" stroke="rgba(30,45,90,0.08)" strokeWidth={16}/>
            <circle
              cx={140} cy={140} r={112}
              fill="none"
              stroke="url(#scoreGrad13)"
              strokeWidth={16}
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 112}`}
              strokeDashoffset={`${2 * Math.PI * 112 * (1 - scoreFill / 100)}`}
              transform="rotate(-90 140 140)"
            />
            <defs>
              <linearGradient id="scoreGrad13" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={RED}/>
                <stop offset="100%" stopColor={PINK}/>
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(30,45,90,0.6)", fontFamily: FONT, letterSpacing: "1px" }}>LEAD SCORE</div>
            <div style={{ fontSize: 76, fontWeight: 900, color: NAVY, fontFamily: FONT, lineHeight: 1 }}>{Math.round(scoreFill)}</div>
            <div style={{ fontSize: 19, fontWeight: 600, color: "rgba(30,45,90,0.6)", fontFamily: FONT }}>/ 100</div>
          </div>
        </div>

        {/* Total breakdown */}
        <div style={{ opacity: ringOp, transform: `scale(${ringSp})`, background: "#fff", borderRadius: 14, padding: "18px 28px", border: "1.5px solid rgba(30,45,90,0.08)", boxShadow: "0 4px 16px rgba(0,0,60,0.08)", textAlign: "center", width: 280 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "rgba(30,45,90,0.6)", fontFamily: FONT, marginBottom: 6 }}>15 + 20 + 15</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: NAVY, fontFamily: FONT }}>= 50 points total</div>
        </div>

        {/* CTA */}
        <div style={{ opacity: ctaOp, transform: `translateY(${ctaY}px)`, fontSize: 19, fontWeight: 600, color: "rgba(30,45,90,0.65)", fontFamily: FONT, textAlign: "center", maxWidth: 280 }}>
          Hits your threshold —{" "}
          <strong style={{ color: RED }}>route to sales immediately.</strong>
        </div>
      </div>

    </AbsoluteFill>
  );
}

// ─── Scene 13b: Lead A vs Lead B Outcome ─────────────────────────────────────
// Script: Lead A hits threshold → routed to sales immediately.
//   Lead B: John, intern, 20-person startup, blog sub (2pts) + email open (1pt) = 3 pts.
//   After 5s Lead B fades with "NURTURE" label.
function LeadABOutcomeScene({ frame, fps }) {
  // Phase 1 (0–60): Lead A card appears + "Routed to sales" badge
  // Phase 2 (70–160): Lead B card appears with score 3
  // Phase 3 (160–200): "Lead B → Nurture" — card dims + nurture stamp fades in

  const leadASp  = spring({ frame: frame - 0,  fps, config: { damping: 30, stiffness: 140 } });
  const leadAOp  = fi(frame, 0, 18, 0, 1);
  const routedSp = spring({ frame: frame - 38, fps, config: { damping: 32, stiffness: 170 } });
  const routedOp = fi(frame, 38, 55, 0, 1);

  const leadBSp  = spring({ frame: frame - 70,  fps, config: { damping: 30, stiffness: 140 } });
  const leadBOp  = fi(frame, 70, 88, 0, 1);

  // Lead B nurture overlay
  const nurtureFade = fi(frame, 165, 195, 0, 1);
  const leadBDim    = fi(frame, 160, 195, 1, 0.28);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 80 }}>

      {/* ── Lead A ── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, transform: `scale(${leadASp})`, opacity: leadAOp }}>
        <div style={{
          background: "#fff", borderRadius: 20,
          border: "2.5px solid rgba(232,24,46,0.25)",
          boxShadow: "0 8px 40px rgba(232,24,46,0.18)",
          padding: "28px 36px", width: 340,
        }}>
          {/* Header */}
          <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(30,45,90,0.75)", fontFamily: FONT, letterSpacing: "1.2px", marginBottom: 10 }}>LEAD A</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: NAVY, fontFamily: FONT }}>Sarah</div>
          <div style={{ fontSize: 18, color: "rgba(30,45,90,0.75)", fontFamily: FONT, marginTop: 4 }}>VP of Marketing &middot; 500-person co.</div>
          <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 12 }}>
            {/* Score bubble */}
            <div style={{
              width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
              background: `linear-gradient(135deg, ${RED}, ${PINK})`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              boxShadow: "0 6px 20px rgba(232,24,46,0.4)",
            }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: "white", fontFamily: FONT, lineHeight: 1 }}>50</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontFamily: FONT }}>pts</div>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(30,45,90,0.75)", fontFamily: FONT }}>Threshold reached</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: RED, fontFamily: FONT, marginTop: 2 }}>Routed to sales</div>
            </div>
          </div>
        </div>

        {/* Routed badge */}
        <div style={{
          transform: `scale(${routedSp})`, opacity: routedOp,
          background: RED,
          borderRadius: 6, padding: "12px 32px",
          fontSize: 18, fontWeight: 600, color: "white", fontFamily: FONT,
          boxShadow: "0 6px 24px rgba(232,24,46,0.4)",
          letterSpacing: "0.5px",
        }}>
          Call today &#x2192;
        </div>
      </div>

      {/* ── Lead B ── */}
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 20, transform: `scale(${leadBSp})`, opacity: leadBOp }}>
        <div style={{
          background: "#fff", borderRadius: 20,
          border: "1.5px solid rgba(30,45,90,0.1)",
          boxShadow: "0 4px 20px rgba(0,0,60,0.08)",
          padding: "28px 36px", width: 340,
          opacity: leadBDim,
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(30,45,90,0.75)", fontFamily: FONT, letterSpacing: "1.2px", marginBottom: 10 }}>LEAD B</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: NAVY, fontFamily: FONT }}>John</div>
          <div style={{ fontSize: 18, color: "rgba(30,45,90,0.75)", fontFamily: FONT, marginTop: 4 }}>Intern &middot; 20-person startup &middot; Outside target market</div>
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, color: "rgba(30,45,90,0.75)", fontFamily: FONT, opacity: fi(frame, 88, 104, 0, 1), transform: `translateX(${fi(frame, 88, 104, -14, 0)}px)` }}>
              <span>Blog subscribe (3 mo. ago)</span>
              <span style={{ fontWeight: 700, color: NAVY }}>+2 pts</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, color: "rgba(30,45,90,0.75)", fontFamily: FONT, opacity: fi(frame, 104, 120, 0, 1), transform: `translateX(${fi(frame, 104, 120, -14, 0)}px)` }}>
              <span>Opened 1 email last month</span>
              <span style={{ fontWeight: 700, color: NAVY }}>+1 pt</span>
            </div>
            <div style={{
              marginTop: 6, padding: "8px 14px", borderRadius: 10,
              background: "rgba(30,45,90,0.05)",
              fontSize: 15, fontWeight: 800, color: NAVY, fontFamily: FONT, textAlign: "center",
              opacity: fi(frame, 128, 144, 0, 1),
              transform: `scale(${spring({ frame: frame - 128, fps, config: { damping: 32, stiffness: 200 } })})`,
            }}>
              Total: 3 points
            </div>
          </div>
        </div>

        {/* Nurture overlay */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: nurtureFade,
          pointerEvents: "none",
        }}>
          <div style={{
            background: NAVY,
            borderRadius: 16, padding: "16px 40px",
            fontSize: 28, fontWeight: 900, color: "white", fontFamily: FONT,
            letterSpacing: "3px",
            boxShadow: "0 8px 32px rgba(30,45,90,0.35)",
            transform: `rotate(-8deg)`,
          }}>
            NURTURE
          </div>
        </div>
      </div>

    </AbsoluteFill>
  );
}

// ─── Scene 14: ZI Product UI — Lead Score List ───────────────────────────────
function LeadScoreProductUIScene({ frame, fps }) {
  // Recreates the ZI "NYC Event Sign-Ups" lead scoring list UI
  // Phase 1: Card panel slides up (0-35)
  // Phase 2: Header + count badge fade in (15-45)
  // Phase 3: Column headers appear (40-55)
  // Phase 4: Rows stagger in left→right (55-200)
  // Phase 5: Score badges pop + glow pulse (staggered after rows)
  // Phase 6: Top row re-highlights (240-280) — "best lead" callout

  const rows = [
    { name: "Knotwise",  url: "knotwise.com",  locs: 230, crm: "Salesforce", state: "CO", score: 90,  color: "#22c55e", delay: 60  },
    { name: "Acme",      url: "acme.com",       locs: 35,  crm: "Pipedrive",  state: "MA", score: 98,  color: "#16a34a", delay: 82  },
    { name: "Newex",     url: "newex.com",       locs: 100, crm: "Hubspot",    state: "CA", score: 88,  color: "#22c55e", delay: 104 },
    { name: "Doncon",    url: "doncon.com",      locs: 7,   crm: "Salesforce", state: "TX", score: 72,  color: "#f59e0b", delay: 126 },
    { name: "Solis",     url: "solis.com",       locs: 23,  crm: "Hubspot",    state: "MA", score: 80,  color: "#22c55e", delay: 148 },
  ];

  // Card panel entrance
  const panelSp = spring({ frame: frame - 0, fps, config: { damping: 30, stiffness: 130 } });
  const panelY  = fi(frame, 0, 35, 60, 0);
  const panelOp = fi(frame, 0, 20, 0, 1);

  // Header
  const headerOp = fi(frame, 15, 38, 0, 1);
  const headerY  = fi(frame, 15, 38, -10, 0);

  // Col headers
  const colOp = fi(frame, 40, 56, 0, 1);

  // Best lead callout (Acme, score 98)
  const calloutSp = spring({ frame: frame - 240, fps, config: { damping: 30, stiffness: 150 } });
  const calloutOp = fi(frame, 238, 255, 0, 1);

  // Salesforce logo path (simple SF cloud shape in SVG)
  const SFCloud = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M10 6.5C10 4.567 11.567 3 13.5 3c1.406 0 2.623.82 3.214 2.014C17.1 4.735 17.537 4.5 18 4.5c1.105 0 2 .895 2 2 0 .173-.022.34-.063.5H20c1.105 0 2 .895 2 2s-.895 2-2 2H6c-1.105 0-2-.895-2-2 0-.94.648-1.727 1.528-1.938A2.5 2.5 0 0 1 10 6.5z" fill="#00A1E0"/>
    </svg>
  );

  const HubspotDot = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill="#FF7A59"/>
      <circle cx="12" cy="12" r="4" fill="white"/>
    </svg>
  );

  const PipedriveDot = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill="#1F9B52"/>
      <circle cx="12" cy="9" r="3.5" fill="white"/>
      <rect x="8.5" y="12" width="3" height="6" rx="1.5" fill="white"/>
    </svg>
  );

  const CRMIcon = ({ crm }) => {
    if (crm === "Salesforce") return <SFCloud />;
    if (crm === "Hubspot") return <HubspotDot />;
    return <PipedriveDot />;
  };

  // Company initial avatar
  const Avatar = ({ name, color }) => (
    <div style={{
      width: 32, height: 32, borderRadius: "50%",
      background: `${color}22`, border: `1.5px solid ${color}44`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 13, fontWeight: 800, color, fontFamily: FONT,
      flexShrink: 0,
    }}>{name[0]}</div>
  );

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>

      {/* Main UI card */}
      <div style={{
        width: 1100,
        background: "#ffffff",
        borderRadius: 20,
        boxShadow: "0 20px 80px rgba(0,0,60,0.14), 0 4px 20px rgba(0,0,60,0.08)",
        border: "1px solid rgba(0,0,60,0.07)",
        overflow: "hidden",
        transform: `translateY(${panelY}px) scale(${0.94 + 0.06 * panelSp})`,
        opacity: panelOp,
      }}>

        {/* Top bar — Salesforce-ish branding */}
        <div style={{ height: 48, background: "#0070d2", display: "flex", alignItems: "center", padding: "0 20px", gap: 10 }}>
          <div style={{ width: 20, height: 20, borderRadius: 4, background: "rgba(255,255,255,0.3)" }}/>
          <div style={{ width: 60, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.4)" }}/>
          <div style={{ flex: 1 }}/>
          <div style={{ width: 80, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.25)" }}/>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }}/>
        </div>

        <div style={{ padding: "28px 32px" }}>

          {/* Header row */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, opacity: headerOp, transform: `translateY(${headerY}px)` }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: NAVY, fontFamily: FONT }}>NYC Event Sign-Ups</div>
            <div style={{
              padding: "4px 14px", borderRadius: 6,
              background: "rgba(30,45,90,0.07)", border: "1px solid rgba(30,45,90,0.12)",
              fontSize: 13, fontWeight: 700, color: NAVY, fontFamily: FONT,
            }}>5,000 Accounts</div>
          </div>

          {/* Column headers */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.8fr 1fr 1.4fr 0.7fr 1fr",
            gap: 0, paddingBottom: 10, borderBottom: "1.5px solid rgba(30,45,90,0.08)",
            opacity: colOp,
          }}>
            {["Name", "URL", "Locations", "CRM", "State", "Lead Score"].map((col) => (
              <div key={col} style={{ fontSize: 14, fontWeight: 700, color: "rgba(30,45,90,0.6)", fontFamily: FONT, letterSpacing: "0.5px" }}>{col}</div>
            ))}
          </div>

          {/* Data rows */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {rows.map((row, i) => {
              const rowOp  = fi(frame, row.delay, row.delay + 20, 0, 1);
              const rowX   = fi(frame, row.delay, row.delay + 20, -18, 0);
              const badgeSp = spring({ frame: frame - (row.delay + 25), fps, config: { damping: 32, stiffness: 190 } });
              const scoreVal = Math.round(row.score * Math.min(badgeSp, 1));

              // Pulse glow for Acme (best lead)
              const isPriority = row.score === 98;

              const glowPulse = isPriority ? 0.5 + 0.5 * Math.sin(((frame - 240) / 15) * Math.PI * 2) : 0;
              const rowHighlight = isPriority ? fi(frame, 240, 260, 0, 1) : 0;

              return (
                <div key={i} style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.8fr 1fr 1.4fr 0.7fr 1fr",
                  alignItems: "center",
                  padding: "14px 0",
                  borderBottom: "1px solid rgba(30,45,90,0.05)",
                  opacity: rowOp,
                  transform: `translateX(${rowX}px)`,
                  background: `rgba(232,24,46,${rowHighlight * 0.04})`,
                  borderRadius: rowHighlight > 0 ? 10 : 0,
                  transition: "background 0.2s",
                }}>
                  {/* Name */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar name={row.name} color={row.color} />
                    <span style={{ fontSize: 15, fontWeight: 700, color: NAVY, fontFamily: FONT }}>{row.name}</span>
                  </div>
                  {/* URL */}
                  <div style={{ fontSize: 14, color: "#0070d2", fontFamily: FONT, fontWeight: 500 }}>{row.url}</div>
                  {/* Locations */}
                  <div style={{ fontSize: 14, color: NAVY, fontFamily: FONT, fontWeight: 500 }}>{row.locs}</div>
                  {/* CRM */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <CRMIcon crm={row.crm} />
                    <span style={{ fontSize: 14, color: NAVY, fontFamily: FONT, fontWeight: 500 }}>{row.crm}</span>
                  </div>
                  {/* State */}
                  <div style={{ fontSize: 14, color: NAVY, fontFamily: FONT, fontWeight: 500 }}>{row.state}</div>
                  {/* Score badge */}
                  <div style={{
                    width: 46, height: 46, borderRadius: "50%",
                    background: row.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, fontWeight: 900, color: "white", fontFamily: FONT,
                    transform: `scale(${Math.min(badgeSp, 1)})`,
                    boxShadow: isPriority
                      ? `0 0 0 ${4 + glowPulse * 8}px ${row.color}44, 0 4px 16px ${row.color}66`
                      : `0 3px 12px ${row.color}55`,
                  }}>{scoreVal}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating "Best Lead" callout for Acme */}
      <div style={{
        position: "absolute",
        top: "50%", right: 140,
        transform: `translateY(-50%) translateX(${fi(frame, 238, 258, 24, 0)}px) scale(${calloutSp})`,
        opacity: calloutOp,
        background: "#ffffff",
        borderRadius: 16,
        padding: "14px 20px",
        boxShadow: "0 8px 40px rgba(0,0,60,0.18)",
        border: "2px solid #16a34a",
        display: "flex", flexDirection: "column", gap: 4,
        minWidth: 180,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#16a34a" }}/>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#16a34a", fontFamily: FONT, letterSpacing: "0.5px" }}>TOP PRIORITY</div>
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: NAVY, fontFamily: FONT }}>Acme — Score 98</div>
        <div style={{ fontSize: 17, fontWeight: 500, color: "rgba(30,45,90,0.75)", fontFamily: FONT }}>Route to sales now →</div>
      </div>

    </AbsoluteFill>
  );
}

// ─── Scene 10: Predictive Lead Scoring ───────────────────────────────────────
function PredictiveLeadScoringScene({ frame, fps }) {
  // Data point nodes flowing into the center ML brain
  const dataPoints = [
    { label: "Page Views",      x: -420, y: -120, delay: 0  },
    { label: "Email Opens",     x: -420, y:  60,  delay: 10 },
    { label: "Job Title",       x: -420, y: -280, delay: 20 },
    { label: "Company Size",    x:  420, y: -120, delay: 5  },
    { label: "Intent Signals",  x:  420, y:  60,  delay: 15 },
    { label: "Revenue",         x:  420, y: -280, delay: 25 },
  ];

  const platforms = [
    { name: "ZoomInfo Marketing", delay: 160 },
    { name: "Salesforce Pardot",  delay: 185 },
  ];

  // Center brain pulse
  const pulse = 0.96 + 0.04 * Math.sin((frame / 18) * Math.PI * 2);
  const brainIn = spring({ frame, fps, config: { damping: 30, stiffness: 140 } });

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 48 }}>

      {/* Top label */}
      <div style={{
        opacity: fi(frame, 0, 20, 0, 1),
        transform: `translateY(${fi(frame, 0, 20, -16, 0)}px)`,
        fontSize: 18, fontWeight: 700, color: "rgba(30,45,90,0.5)",
        fontFamily: FONT, letterSpacing: "2px", textTransform: "uppercase",
      }}>Predictive Lead Scoring</div>

      {/* Main diagram */}
      <div style={{ position: "relative", width: 900, height: 320 }}>

        {/* Connector lines from data points to center */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
          {dataPoints.map((dp, i) => {
            const t = fi(frame, dp.delay + 10, dp.delay + 35, 0, 1);
            const cx = 450, cy = 160;
            const sx = cx + dp.x * 0.85, sy = cy + dp.y * 0.7;
            return (
              <line key={i}
                x1={sx} y1={sy} x2={cx} y2={cy}
                stroke={`rgba(232,24,46,${t * 0.25})`}
                strokeWidth="1.5"
                strokeDasharray="6 4"
                strokeDashoffset={frame * -1}
              />
            );
          })}
        </svg>

        {/* Data point nodes */}
        {dataPoints.map((dp, i) => {
          const sp = spring({ frame: frame - dp.delay, fps, config: { damping: 28, stiffness: 160 } });
          const op = fi(frame, dp.delay, dp.delay + 16, 0, 1);
          return (
            <div key={i} style={{
              position: "absolute",
              left: 450 + dp.x * 0.85 - 72,
              top:  160 + dp.y * 0.7  - 22,
              transform: `scale(${sp})`, opacity: op,
            }}>
              <div style={{
                background: "#ffffff",
                border: "1.5px solid rgba(30,45,90,0.1)",
                borderRadius: 10,
                padding: "10px 18px",
                fontSize: 14, fontWeight: 600, color: NAVY, fontFamily: FONT,
                boxShadow: "0 2px 12px rgba(0,0,60,0.07)",
                whiteSpace: "nowrap",
              }}>{dp.label}</div>
            </div>
          );
        })}

        {/* Center ML brain */}
        <div style={{
          position: "absolute", left: 450 - 90, top: 160 - 90,
          width: 180, height: 180, borderRadius: "50%",
          background: `linear-gradient(135deg, ${RED}, ${PINK})`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          transform: `scale(${brainIn * pulse})`,
          boxShadow: "0 12px 48px rgba(232,24,46,0.4)",
          gap: 6,
        }}>
          {/* Brain / ML icon */}
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="12" stroke="white" strokeWidth="2.5"/>
            <circle cx="28" cy="28" r="5"  fill="white"/>
            <line x1="28" y1="8"  x2="28" y2="16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="28" y1="40" x2="28" y2="48" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="8"  y1="28" x2="16" y2="28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="40" y1="28" x2="48" y2="28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="14" y1="14" x2="20" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="36" y1="36" x2="42" y2="42" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="42" y1="14" x2="36" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="14" y1="42" x2="20" y2="36" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div style={{ fontSize: 14, fontWeight: 800, color: "white", fontFamily: FONT, letterSpacing: "0.5px" }}>ML ENGINE</div>
        </div>

      </div>

      {/* Description line */}
      <div style={{
        opacity: fi(frame, 80, 100, 0, 1),
        transform: `translateY(${fi(frame, 80, 100, 12, 0)}px)`,
        fontSize: 20, fontWeight: 500, color: "rgba(30,45,90,0.6)",
        fontFamily: FONT, textAlign: "center", maxWidth: 700, lineHeight: 1.5,
      }}>
        Analyzes <strong style={{ color: NAVY }}>thousands of data points</strong> across your customer base —<br/>
        surfacing patterns you could never see manually.
      </div>

      {/* Platform pills */}
      <div style={{ display: "flex", gap: 20 }}>
        {platforms.map((p, i) => {
          const sp = spring({ frame: frame - p.delay, fps, config: { damping: 28, stiffness: 160 } });
          const op = fi(frame, p.delay, p.delay + 18, 0, 1);
          return (
            <div key={i} style={{
              transform: `scale(${sp})`, opacity: op,
              padding: "14px 28px", borderRadius: 6,
              background: i === 0 ? RED : NAVY,
              fontSize: 16, fontWeight: 600, color: "white", fontFamily: FONT,
              boxShadow: i === 0 ? "0 6px 24px rgba(232,24,46,0.35)" : "0 6px 24px rgba(30,45,90,0.25)",
            }}>{p.name}</div>
          );
        })}
      </div>

    </AbsoluteFill>
  );
}

// ─── Scene durations ─────────────────────────────────────────────────────────
const SCENE1 = 150;
const SCENE2 = 170;
const SCENE3 = 160;
const SCENE4 = 200;
const SCENE5 = 180;
const SCENE6 = 210;
const SCENE7 = 180;
const SCENE8 = 220;
const SCENE9  = 600;
const SCENE10 = 220;
const SCENE11 = 300;
const SCENE12 = 300;
const SCENE13 = 390;
const SCENE13B = 240;
const SCENE14 = 330;

// ─── Root composition ─────────────────────────────────────────────────────────
export const ExplainedComposition = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {/* Scale wrapper: 3840×2160 canvas, all content designed at 1920×1080, scaled 2× */}
      <div style={{
        position: "absolute",
        width: 1920, height: 1080,
        top: 0, left: 0,
        transform: "scale(2)",
        transformOrigin: "top left",
      }}>
      {/* Scene 1: Account → Buyers */}
      <Sequence from={0} durationInFrames={SCENE1}>
        <AbsoluteFill>
          <SceneTitle text="Account-Based Buying Committee" frame={frame}/>
          <AccountCircleScene frame={frame} fps={fps}/>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 2: Outreach Tree */}
      <Sequence from={SCENE1} durationInFrames={SCENE2}>
        <AbsoluteFill>
          <SceneTitle text="Personalized Outreach by Persona" frame={frame - SCENE1}/>
          <OutreachTreeScene frame={frame - SCENE1} fps={fps}/>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 3: Lead Scoring Grid */}
      <Sequence from={SCENE1 + SCENE2} durationInFrames={SCENE3}>
        <AbsoluteFill>
          <SceneTitle text="Lead Scoring Model" frame={frame - SCENE1 - SCENE2}/>
          <LeadScoreScene frame={frame - SCENE1 - SCENE2} fps={fps}/>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 4: B2B Reality Check */}
      <Sequence from={SCENE1 + SCENE2 + SCENE3} durationInFrames={SCENE4}>
        <AbsoluteFill>
          <SceneTitle text="The New B2B Reality" frame={frame - SCENE1 - SCENE2 - SCENE3}/>
          <B2BRealityScene frame={frame - SCENE1 - SCENE2 - SCENE3} fps={fps}/>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 5: Ready / Nurture / Noise */}
      <Sequence from={SCENE1 + SCENE2 + SCENE3 + SCENE4} durationInFrames={SCENE5}>
        <AbsoluteFill>
          <SceneTitle text="Who's Ready to Buy?" frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4}/>
          <ReadyNurtureNoiseScene frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4} fps={fps}/>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 6: Scoring Matrix */}
      <Sequence from={SCENE1 + SCENE2 + SCENE3 + SCENE4 + SCENE5} durationInFrames={SCENE6}>
        <AbsoluteFill>
          <SceneTitle text="Lead Scoring Matrix" frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5}/>
          <ScoringMatrixScene frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5} fps={fps}/>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 7: Assign → Total → Prioritize */}
      <Sequence from={SCENE1 + SCENE2 + SCENE3 + SCENE4 + SCENE5 + SCENE6} durationInFrames={SCENE7}>
        <AbsoluteFill>
          <SceneTitle text="How Lead Scoring Works" frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5 - SCENE6}/>
          <AssignTotalPrioritizeScene frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5 - SCENE6} fps={fps}/>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 8: Demographic + Behavioral */}
      <Sequence from={SCENE1 + SCENE2 + SCENE3 + SCENE4 + SCENE5 + SCENE6 + SCENE7} durationInFrames={SCENE8}>
        <AbsoluteFill>
          <SceneTitle text="What Gets Scored?" frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5 - SCENE6 - SCENE7}/>
          <DemoVsBehaviorScene frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5 - SCENE6 - SCENE7} fps={fps}/>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 9: Lead A vs Lead B */}
      <Sequence from={SCENE1 + SCENE2 + SCENE3 + SCENE4 + SCENE5 + SCENE6 + SCENE7 + SCENE8} durationInFrames={SCENE9}>
        <AbsoluteFill>
          <SceneTitle text="200 Leads. Two Outcomes." frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5 - SCENE6 - SCENE7 - SCENE8}/>
          <LeadAvsLeadBScene frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5 - SCENE6 - SCENE7 - SCENE8} fps={fps}/>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 10: Predictive Lead Scoring */}
      <Sequence from={SCENE1 + SCENE2 + SCENE3 + SCENE4 + SCENE5 + SCENE6 + SCENE7 + SCENE8 + SCENE9} durationInFrames={SCENE10}>
        <AbsoluteFill>
          <SceneTitle text="Predictive Lead Scoring" frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5 - SCENE6 - SCENE7 - SCENE8 - SCENE9}/>
          <PredictiveLeadScoringScene frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5 - SCENE6 - SCENE7 - SCENE8 - SCENE9} fps={fps}/>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 11: Demographic / Explicit Data */}
      <Sequence from={SCENE1 + SCENE2 + SCENE3 + SCENE4 + SCENE5 + SCENE6 + SCENE7 + SCENE8 + SCENE9 + SCENE10} durationInFrames={SCENE11}>
        <AbsoluteFill>
          <SceneTitle text="Demographic Data (Explicit)" frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5 - SCENE6 - SCENE7 - SCENE8 - SCENE9 - SCENE10}/>
          <DemographicExplicitScene frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5 - SCENE6 - SCENE7 - SCENE8 - SCENE9 - SCENE10} fps={fps}/>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 12: Behavioral / Implicit Data */}
      <Sequence from={SCENE1 + SCENE2 + SCENE3 + SCENE4 + SCENE5 + SCENE6 + SCENE7 + SCENE8 + SCENE9 + SCENE10 + SCENE11} durationInFrames={SCENE12}>
        <AbsoluteFill>
          <SceneTitle text="Behavioral Data (Implicit)" frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5 - SCENE6 - SCENE7 - SCENE8 - SCENE9 - SCENE10 - SCENE11}/>
          <BehavioralImplicitScene frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5 - SCENE6 - SCENE7 - SCENE8 - SCENE9 - SCENE10 - SCENE11} fps={fps}/>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 13: Lead Scoring Example */}
      <Sequence from={SCENE1 + SCENE2 + SCENE3 + SCENE4 + SCENE5 + SCENE6 + SCENE7 + SCENE8 + SCENE9 + SCENE10 + SCENE11 + SCENE12} durationInFrames={SCENE13}>
        <AbsoluteFill>
          <SceneTitle text="Lead Scoring in Action" frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5 - SCENE6 - SCENE7 - SCENE8 - SCENE9 - SCENE10 - SCENE11 - SCENE12}/>
          <LeadScoringExampleScene frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5 - SCENE6 - SCENE7 - SCENE8 - SCENE9 - SCENE10 - SCENE11 - SCENE12} fps={fps}/>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 13b: Lead A/B Outcome */}
      <Sequence from={SCENE1 + SCENE2 + SCENE3 + SCENE4 + SCENE5 + SCENE6 + SCENE7 + SCENE8 + SCENE9 + SCENE10 + SCENE11 + SCENE12 + SCENE13} durationInFrames={SCENE13B}>
        <AbsoluteFill>
          <SceneTitle text="Who Gets Routed to Sales?" frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5 - SCENE6 - SCENE7 - SCENE8 - SCENE9 - SCENE10 - SCENE11 - SCENE12 - SCENE13}/>
          <LeadABOutcomeScene frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5 - SCENE6 - SCENE7 - SCENE8 - SCENE9 - SCENE10 - SCENE11 - SCENE12 - SCENE13} fps={fps}/>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 14: ZI Product UI — Lead Score List */}
      <Sequence from={SCENE1 + SCENE2 + SCENE3 + SCENE4 + SCENE5 + SCENE6 + SCENE7 + SCENE8 + SCENE9 + SCENE10 + SCENE11 + SCENE12 + SCENE13 + SCENE13B} durationInFrames={SCENE14}>
        <AbsoluteFill>
          <SceneTitle text="Lead Scores at a Glance" frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5 - SCENE6 - SCENE7 - SCENE8 - SCENE9 - SCENE10 - SCENE11 - SCENE12 - SCENE13 - SCENE13B}/>
          <LeadScoreProductUIScene frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5 - SCENE6 - SCENE7 - SCENE8 - SCENE9 - SCENE10 - SCENE11 - SCENE12 - SCENE13 - SCENE13B} fps={fps}/>
        </AbsoluteFill>
      </Sequence>
      </div>{/* end scale wrapper */}
    </AbsoluteFill>
  );
};
