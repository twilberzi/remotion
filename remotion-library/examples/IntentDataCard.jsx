import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

const CARD_BG = "#ffffff";
const DARK = "#111827";
const GRAY = "#6b7280";
const BLUE = "#3b82f6";
const GREEN = "#10b981";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// Acme pyramid logo — purple/pink stacked triangle stripes
function AcmeLogo({ size = 80 }) {
  const s = size;
  // Stacked horizontal stripes forming a triangle pyramid
  const stripes = [
    { y: 0.00, h: 0.10, w: 0.22, color: "#c026d3" },
    { y: 0.12, h: 0.10, w: 0.36, color: "#a855f7" },
    { y: 0.24, h: 0.10, w: 0.50, color: "#9333ea" },
    { y: 0.36, h: 0.10, w: 0.65, color: "#7c3aed" },
    { y: 0.48, h: 0.10, w: 0.80, color: "#6d28d9" },
    { y: 0.60, h: 0.10, w: 0.94, color: "#5b21b6" },
  ];
  // Small triangle top
  return (
    <svg width={s} height={s * 0.85} viewBox="0 0 100 85">
      {/* Apex triangle */}
      <polygon points="50,0 58,14 42,14" fill="#e879f9" />
      {/* Stripes */}
      {stripes.map((stripe, i) => {
        const cx = 50;
        const x = cx - (stripe.w * 100) / 2;
        return (
          <rect
            key={i}
            x={x}
            y={stripe.y * 100 * 0.8 + 16}
            width={stripe.w * 100}
            height={stripe.h * 100 * 0.8}
            rx={1}
            fill={stripe.color}
          />
        );
      })}
    </svg>
  );
}

// Animated counter
function Counter({ value, frame, startFrame, duration = 30, decimals = 0, prefix = "", suffix = "" }) {
  const n = fi(frame, startFrame, startFrame + duration, 0, value);
  const formatted = decimals > 0 ? n.toFixed(decimals) : Math.floor(n).toLocaleString();
  return <>{prefix}{formatted}{suffix}</>;
}

// Sparkline — two prominent peaks matching the reference
const SPARK_POINTS = [
  [0.00, 0.05],
  [0.06, 0.08],
  [0.12, 0.06],
  [0.18, 0.14],
  [0.24, 0.10],
  [0.30, 0.07],
  [0.36, 0.08],
  [0.42, 0.06],
  [0.48, 0.38],  // first peak
  [0.54, 0.75],  // tallest peak
  [0.58, 0.38],
  [0.63, 0.08],
  [0.68, 0.06],
  [0.72, 0.28],  // second peak
  [0.76, 0.52],
  [0.80, 0.28],
  [0.85, 0.08],
  [0.90, 0.06],
  [0.95, 0.10],
  [1.00, 0.08],
];

function Sparkline({ progress, width, height }) {
  if (progress <= 0) return null;

  const pts = SPARK_POINTS.filter(([x]) => x <= progress);
  if (pts.length < SPARK_POINTS.length) {
    const next = SPARK_POINTS[pts.length];
    const prev = SPARK_POINTS[pts.length - 1];
    if (prev && next) {
      const t = (progress - prev[0]) / (next[0] - prev[0]);
      pts.push([progress, prev[1] + t * (next[1] - prev[1])]);
    }
  }

  const toSvg = ([x, y]) => [x * width, height - y * height * 0.88 - height * 0.04];
  const svgPts = pts.map(toSvg);
  const linePath = svgPts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const fillPath = linePath + ` L ${svgPts[svgPts.length - 1][0].toFixed(1)} ${height} L 0 ${height} Z`;

  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BLUE} stopOpacity="0.30" />
          <stop offset="100%" stopColor={BLUE} stopOpacity="0.00" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill="url(#sparkFill)" />
      <path d={linePath} fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Person icon
function PersonIcon({ size = 20, color = DARK }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 20 26">
      <circle cx="10" cy="7" r="5" fill={color} />
      <path d="M1 24 C1 16 19 16 19 24" fill={color} />
    </svg>
  );
}

export const IntentDataCard = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Timing ────────────────────────────────────────────────
  // 0–20:   card slides up + fades in
  // 20–40:  logo circle pops in
  // 26–44:  company name slides up
  // 34–48:  URL fades in
  // 48–70:  employees counts up
  // 58–78:  revenue counts up
  // 68–86:  industry fades in
  // 86–100: divider + intent topic label
  // 90–106: badge springs in
  // 108–124: inner card row fades in
  // 116–130: score springs
  // 128–188: sparkline draws right
  // 188–338: HOLD (5 seconds @ 30fps)

  const cardY = fi(frame, 0, 20, 60, 0);
  const cardOpacity = fi(frame, 0, 16, 0, 1);
  const cardScale = spring({ frame, fps, config: { damping: 20, stiffness: 110 } });

  const logoOpacity = fi(frame, 20, 36, 0, 1);
  const logoScale = spring({ frame: frame - 20, fps, config: { damping: 14, stiffness: 150 } });

  const nameOpacity = fi(frame, 26, 42, 0, 1);
  const nameY = fi(frame, 26, 42, 16, 0);
  const urlOpacity = fi(frame, 34, 48, 0, 1);

  const stat1Op = fi(frame, 48, 60, 0, 1);
  const stat2Op = fi(frame, 58, 70, 0, 1);
  const stat3Op = fi(frame, 68, 80, 0, 1);

  const dividerOp = fi(frame, 84, 94, 0, 1);
  const intentLabelOp = fi(frame, 86, 98, 0, 1);
  const badgeScale = spring({ frame: frame - 90, fps, config: { damping: 13, stiffness: 170 } });
  const badgeOpacity = fi(frame, 90, 102, 0, 1);

  const rowOpacity = fi(frame, 108, 122, 0, 1);
  const scoreScale = spring({ frame: frame - 116, fps, config: { damping: 11, stiffness: 160 } });

  const sparkProgress = fi(frame, 128, 188, 0, 1);

  const CARD_W = 860;
  const LOGO_SIZE = 120; // circle diameter
  const LOGO_OVERLAP = 30; // how much logo overlaps above card top

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #dde8ff 0%, #edf2ff 50%, #e8eeff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Outer wrapper — positions logo overlapping card */}
      <div
        style={{
          width: CARD_W,
          opacity: cardOpacity,
          transform: `translateY(${cardY}px) scale(${0.93 + cardScale * 0.07})`,
          position: "relative",
        }}
      >
        {/* ── Logo circle — floats above/overlapping card top-left ── */}
        <div
          style={{
            position: "absolute",
            top: -LOGO_OVERLAP,
            left: 40,
            zIndex: 10,
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            width: LOGO_SIZE,
            height: LOGO_SIZE,
            borderRadius: "50%",
            background: "#f4f4fa",
            boxShadow: "0 4px 24px rgba(0,0,60,0.13)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AcmeLogo size={72} />
        </div>

        {/* ── Card ── */}
        <div
          style={{
            background: CARD_BG,
            borderRadius: 20,
            boxShadow: "0 16px 64px rgba(0,0,60,0.10), 0 2px 12px rgba(0,0,60,0.06)",
            overflow: "hidden",
            paddingTop: LOGO_SIZE - LOGO_OVERLAP + 10,
          }}
        >
          {/* Name + URL — indented to sit beside where logo overlaps */}
          <div style={{ padding: "0 44px 28px", display: "flex", alignItems: "center" }}>
            <div style={{ paddingLeft: LOGO_SIZE + 20 }}>
              <div style={{
                opacity: nameOpacity,
                transform: `translateY(${nameY}px)`,
                fontSize: 38,
                fontWeight: 800,
                color: DARK,
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                letterSpacing: "-0.5px",
                lineHeight: 1.1,
                marginBottom: 6,
              }}>
                Acme Inc.
              </div>
              <div style={{
                opacity: urlOpacity,
                fontSize: 20,
                color: BLUE,
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontWeight: 500,
              }}>
                www.acme.com
              </div>
            </div>
          </div>

          {/* ── Stats row ── */}
          <div style={{ padding: "0 44px 28px", display: "flex", gap: 48 }}>
            {[
              { label: "EMPLOYEES", op: stat1Op, content: <><Counter value={1543} frame={frame} startFrame={48} duration={26} /></> },
              { label: "REVENUE", op: stat2Op, content: <><Counter value={125.8} frame={frame} startFrame={58} duration={26} decimals={1} prefix="$" suffix="M" /></> },
              { label: "INDUSTRY", op: stat3Op, content: <>Professional Services</> },
            ].map((s, i) => (
              <div key={i} style={{ opacity: s.op }}>
                <div style={{
                  fontSize: 11,
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  color: GRAY,
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontWeight: 600,
                  marginBottom: 5,
                }}>
                  {s.label}
                </div>
                <div style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: DARK,
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                }}>
                  {s.content}
                </div>
              </div>
            ))}
          </div>

          {/* ── Divider ── */}
          <div style={{ height: 1, background: "#e5e7eb", margin: "0 44px", opacity: dividerOp }} />

          {/* ── Intent Topic ── */}
          <div style={{ padding: "22px 44px 18px" }}>
            <div style={{
              fontSize: 11,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              color: GRAY,
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontWeight: 600,
              marginBottom: 12,
              opacity: intentLabelOp,
            }}>
              Intent Topic
            </div>
            <div style={{
              display: "inline-block",
              opacity: badgeOpacity,
              transform: `scale(${badgeScale})`,
              transformOrigin: "left center",
            }}>
              <div style={{
                display: "inline-block",
                border: `2px solid ${BLUE}`,
                borderRadius: 50,
                padding: "8px 26px",
                fontSize: 20,
                fontWeight: 700,
                color: DARK,
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              }}>
                Cyber Security
              </div>
            </div>
          </div>

          {/* ── Inner card ── */}
          <div style={{
            margin: "0 28px 28px",
            background: "#f8fafc",
            borderRadius: 14,
            border: "1px solid #e5e7eb",
            overflow: "hidden",
          }}>
            {/* Source / Score / Audience row */}
            <div style={{
              padding: "18px 26px 14px",
              display: "flex",
              gap: 56,
              opacity: rowOpacity,
            }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: "2.5px", textTransform: "uppercase", color: GRAY, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 600, marginBottom: 7 }}>Source</div>
                <div style={{ fontSize: 20, fontWeight: 600, color: DARK, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>Seattle, USA</div>
              </div>
              <div>
                <div style={{ fontSize: 11, letterSpacing: "2.5px", textTransform: "uppercase", color: GRAY, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 600, marginBottom: 7 }}>Score</div>
                <div style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: GREEN,
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  transform: `scale(${scoreScale})`,
                  display: "inline-block",
                  transformOrigin: "left center",
                }}>
                  98
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, letterSpacing: "2.5px", textTransform: "uppercase", color: GRAY, fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", fontWeight: 600, marginBottom: 7 }}>Audience Strength</div>
                <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                  {[0, 1, 2, 3].map(i => <PersonIcon key={i} size={18} color={DARK} />)}
                </div>
              </div>
            </div>

            {/* Sparkline */}
            <div style={{ height: 110 }}>
              <Sparkline progress={sparkProgress} width={CARD_W - 56} height={110} />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
