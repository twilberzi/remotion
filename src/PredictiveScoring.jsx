import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

const NAVY  = "#1e2d5a";
const RED   = "#e8182e";
const PINK  = "#c2185b";
const FONT  = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// Seeded deterministic random
function sr(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.toString().length; i++) {
    h ^= seed.toString().charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) / 4294967295);
}

const CX = 960;
const CY = 520;

// ─── Generate many particle "account" dots ────────────────────────────────────
// 120 dots spread across the canvas in concentric shells, each streaming toward center
const PARTICLE_COUNT = 120;
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const angle  = sr(i * 7 + 1) * Math.PI * 2;
  // Spread across 3 distance shells so they look like they're coming from everywhere
  const shell  = Math.floor(i / 40); // 0,1,2
  const minR   = 380 + shell * 130;
  const maxR   = 500 + shell * 130;
  const radius = minR + sr(i * 3 + 2) * (maxR - minR);
  const startX = CX + Math.cos(angle) * radius;
  const startY = CY + Math.sin(angle) * radius;
  const delay  = Math.floor(sr(i * 5 + 3) * 120); // spread over 4s
  const speed  = 0.6 + sr(i * 11 + 4) * 0.8;     // travel duration variance
  const size   = 3 + sr(i * 13 + 5) * 4;
  const isHighlight = i % 14 === 0; // ~8 highlighted dots (they're "accounts")
  return { startX, startY, angle, radius, delay, speed, size, isHighlight, i };
});

// ─── Named account cards (8) that pop in as highlights ───────────────────────
const ACCOUNT_CARDS = [
  { name: "Vertex Systems",    title: "VP Marketing",    score: 87, angle: 320, dist: 560, delay: 40  },
  { name: "GlobalTech Inc.",   title: "CRO",             score: 94, angle:  25, dist: 520, delay: 60  },
  { name: "Apex Solutions",    title: "VP Sales",        score: 71, angle: 200, dist: 580, delay: 55  },
  { name: "CloudBase",         title: "Dir. RevOps",     score: 82, angle:  80, dist: 540, delay: 75  },
  { name: "NovaCorp",          title: "SVP Marketing",   score: 65, angle: 250, dist: 550, delay: 50  },
  { name: "Aligned Networks",  title: "VP Marketing",    score: 38, angle: 145, dist: 530, delay: 70  },
  { name: "Ridgeline Data",    title: "CMO",             score: 91, angle: 290, dist: 560, delay: 65  },
  { name: "Stratos Ventures",  title: "CRO",             score: 58, angle: 115, dist: 545, delay: 80  },
];

// ─── Data type labels that orbit the center ───────────────────────────────────
const DATA_LABELS = [
  { text: "Web Activity",    angle:   0 },
  { text: "Email Signals",   angle:  45 },
  { text: "CRM Data",        angle:  90 },
  { text: "Firmographics",   angle: 135 },
  { text: "Job Title",       angle: 180 },
  { text: "Intent Signals",  angle: 225 },
  { text: "Events",          angle: 270 },
  { text: "Content DL",      angle: 315 },
];
const LABEL_R = 230;

export const PredictiveScoring = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Phases ────────────────────────────────────────────────────────────────
  // 0–20:    Title in
  // 10–180:  Particles stream in (120 dots fly from edges toward center)
  // 60–200:  Account cards pop up (8 named accounts)
  // 180–240: Center orb scales in + pulses
  // 200–270: Data label ring fades in around orb
  // 270–350: Counter ticks up "analyzing 1,000s of data points"
  // 350–420: Score output slides in right
  // 400–450: Subtitle fades in

  const titleOp = fi(frame, 0, 22, 0, 1);
  const titleY  = fi(frame, 0, 22, -18, 0);

  // Center orb
  const orbSp    = spring({ frame: frame - 175, fps, config: { damping: 14, stiffness: 95 } });
  const orbScale = 0.6 + 0.4 * orbSp;
  const orbPulse = 1 + 0.022 * Math.sin((frame / fps) * Math.PI * 2 * 0.7);
  const ORB_R    = 148;

  // Data labels ring
  const labelRingOp = fi(frame, 200, 230, 0, 1);

  // Ticker — "Analyzing X accounts…"
  const tickerOp  = fi(frame, 270, 290, 0, 1);
  const tickerVal = Math.floor(fi(frame, 270, 360, 0, 12847));
  const tickerY   = fi(frame, 270, 290, 10, 0);

  // Score output
  const scoreSp  = spring({ frame: frame - 352, fps, config: { damping: 10, stiffness: 160 } });
  const scoreOp  = fi(frame, 350, 368, 0, 1);
  const scoreVal = Math.round(87 * Math.min(scoreSp, 1));
  const barW     = fi(frame, 355, 410, 0, 87);

  // Subtitle
  const subOp = fi(frame, 402, 422, 0, 1);
  const subY  = fi(frame, 402, 422, 12, 0);

  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>

      {/* ── SVG: particle trails + connector lines ── */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }} viewBox="0 0 1920 1080">
        {particles.map((p) => {
          const travelFrames = Math.round(70 / p.speed);
          const progress = fi(frame, p.delay, p.delay + travelFrames, 0, 1);
          if (progress <= 0) return null;

          const cx = p.startX + (CX - p.startX) * progress;
          const cy = p.startY + (CY - p.startY) * progress;

          // Fade out as they arrive at center (last 20% of travel)
          const fadeOut = progress > 0.8 ? fi(frame, p.delay + travelFrames * 0.8, p.delay + travelFrames, 1, 0) : 1;
          const alpha = Math.min(progress * 3, 1) * fadeOut;

          // Connector line trailing behind the dot
          const trailProgress = Math.max(0, progress - 0.15);
          const tx = p.startX + (CX - p.startX) * trailProgress;
          const ty = p.startY + (CY - p.startY) * trailProgress;

          return (
            <g key={p.i}>
              <line
                x1={tx} y1={ty} x2={cx} y2={cy}
                stroke={p.isHighlight ? `rgba(232,24,46,${alpha * 0.5})` : `rgba(30,45,90,${alpha * 0.18})`}
                strokeWidth={p.isHighlight ? 1.5 : 0.8}
              />
              <circle
                cx={cx} cy={cy} r={p.isHighlight ? p.size * 1.4 : p.size * 0.7}
                fill={p.isHighlight ? `rgba(232,24,46,${alpha * 0.9})` : `rgba(30,45,90,${alpha * 0.35})`}
              />
            </g>
          );
        })}
      </svg>

      {/* ── Center orb ── */}
      <div style={{
        position: "absolute",
        left: CX - ORB_R * orbScale,
        top:  CY - ORB_R * orbScale,
        width:  ORB_R * 2 * orbScale,
        height: ORB_R * 2 * orbScale,
        borderRadius: "50%",
        background: `radial-gradient(circle at 36% 34%, #ff5555 0%, ${RED} 38%, #a80f20 100%)`,
        boxShadow: `
          0 0 0 ${18 * orbSp}px rgba(232,24,46,0.09),
          0 0 0 ${40 * orbSp}px rgba(232,24,46,0.06),
          0 0 0 ${68 * orbSp}px rgba(232,24,46,0.03),
          0 20px 80px rgba(232,24,46,0.5)
        `,
        transform: `scale(${orbPulse})`,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 6,
        zIndex: 2,
      }}>
        {/* Inner rings */}
        <div style={{ position: "absolute", inset: "15%", borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.1)" }}/>
        <div style={{ position: "absolute", inset: "32%", borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.15)" }}/>

        {/* Brain icon */}
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-3.16"/>
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24A2.5 2.5 0 0 0 18.5 2.1"/>
        </svg>
        <div style={{ fontSize: 11, fontWeight: 800, color: "white", fontFamily: FONT, letterSpacing: "1.5px", textAlign: "center" }}>ML ENGINE</div>

        {/* Ticker inside orb */}
        <div style={{
          opacity: tickerOp,
          background: "rgba(0,0,0,0.25)",
          borderRadius: 999, padding: "3px 12px",
          fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.85)", fontFamily: FONT,
          marginTop: 2,
        }}>
          {tickerVal.toLocaleString()} accounts
        </div>
      </div>

      {/* ── Data label ring ── */}
      {DATA_LABELS.map((lbl, i) => {
        const rad = ((lbl.angle - 90) * Math.PI) / 180;
        const lx  = CX + LABEL_R * Math.cos(rad);
        const ly  = CY + LABEL_R * Math.sin(rad);
        const delay = 200 + i * 8;
        const lOp = fi(frame, delay, delay + 18, 0, 1) * labelRingOp;
        return (
          <div key={i} style={{
            position: "absolute",
            left: lx, top: ly,
            transform: "translate(-50%, -50%)",
            opacity: lOp,
            background: "rgba(255,255,255,0.92)",
            borderRadius: 999,
            padding: "5px 14px",
            fontSize: 11, fontWeight: 700, color: NAVY, fontFamily: FONT,
            border: "1px solid rgba(30,45,90,0.1)",
            boxShadow: "0 2px 8px rgba(0,0,60,0.08)",
            whiteSpace: "nowrap",
            zIndex: 3,
          }}>{lbl.text}</div>
        );
      })}

      {/* ── Named account cards ── */}
      {ACCOUNT_CARDS.map((acc, i) => {
        const rad  = ((acc.angle - 90) * Math.PI) / 180;
        const ax   = CX + Math.cos(rad) * acc.dist;
        const ay   = CY + Math.sin(rad) * acc.dist;
        const aSp  = spring({ frame: frame - acc.delay, fps, config: { damping: 13, stiffness: 155 } });
        const aOp  = fi(frame, acc.delay, acc.delay + 20, 0, 1);
        // Cards travel inward with particles after frame 130
        const travelStart = 130 + i * 8;
        const travelEnd   = travelStart + 60;
        const travelP     = fi(frame, travelStart, travelEnd, 0, 1);
        const cx2 = ax + (CX - ax) * travelP * 0.55; // move 55% toward center
        const cy2 = ay + (CY - ay) * travelP * 0.55;
        const fadeOnTravel = fi(frame, travelEnd - 10, travelEnd + 10, 1, 0);
        const isHot = acc.score >= 80;
        const CARD_W = 178;

        return (
          <div key={i} style={{
            position: "absolute",
            left: cx2 - CARD_W / 2,
            top:  cy2 - 32,
            width: CARD_W,
            background: "#ffffff",
            borderRadius: 12,
            border: `1.5px solid ${isHot ? "rgba(232,24,46,0.2)" : "rgba(30,45,90,0.1)"}`,
            boxShadow: isHot
              ? "0 4px 20px rgba(232,24,46,0.2)"
              : "0 4px 16px rgba(0,0,60,0.1)",
            padding: "8px 12px",
            display: "flex", alignItems: "center", gap: 10,
            transform: `scale(${0.85 + 0.15 * aSp})`,
            opacity: aOp * fadeOnTravel,
            zIndex: 4,
          }}>
            {/* Avatar */}
            <div style={{
              width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
              background: isHot ? `linear-gradient(135deg, ${RED}, ${PINK})` : "rgba(30,45,90,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 800, color: isHot ? "white" : NAVY, fontFamily: FONT,
            }}>{acc.name[0]}</div>
            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, fontFamily: FONT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{acc.name}</div>
              <div style={{ fontSize: 10, color: "rgba(30,45,90,0.45)", fontFamily: FONT }}>{acc.title}</div>
            </div>
            {/* Score */}
            <div style={{
              width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
              background: isHot ? `linear-gradient(135deg, ${RED}, ${PINK})` : "rgba(30,45,90,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 900, color: isHot ? "white" : "rgba(30,45,90,0.4)", fontFamily: FONT,
            }}>{acc.score}</div>
          </div>
        );
      })}

      {/* ── Score output ── */}
      <div style={{
        position: "absolute",
        right: 100, top: "50%",
        transform: `translateY(-50%) translateX(${fi(frame, 350, 380, 30, 0)}px)`,
        opacity: scoreOp,
        width: 210,
        zIndex: 5,
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(30,45,90,0.4)", fontFamily: FONT, letterSpacing: "1.2px", marginBottom: 10 }}>PREDICTED SCORE</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 68, height: 68, borderRadius: "50%", flexShrink: 0,
            background: `linear-gradient(135deg, ${RED}, ${PINK})`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            transform: `scale(${Math.min(scoreSp, 1)})`,
            boxShadow: "0 8px 28px rgba(232,24,46,0.5)",
          }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: "white", fontFamily: FONT, lineHeight: 1 }}>{scoreVal}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", fontFamily: FONT }}>/100</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ height: 8, borderRadius: 99, background: "rgba(30,45,90,0.08)", overflow: "hidden", marginBottom: 7 }}>
              <div style={{ height: "100%", width: `${barW}%`, borderRadius: 99, background: `linear-gradient(90deg, ${RED}, ${PINK})` }}/>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: RED, fontFamily: FONT }}>🔥 Hot Lead</div>
          </div>
        </div>
      </div>

      {/* ── Title ── */}
      <div style={{
        position: "absolute",
        top: 60, left: 0, right: 0,
        textAlign: "center",
        opacity: titleOp,
        transform: `translateY(${titleY}px)`,
        zIndex: 6,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(30,45,90,0.4)", fontFamily: FONT, letterSpacing: "2px", marginBottom: 8 }}>PREDICTIVE LEAD SCORING</div>
        <div style={{ fontSize: 46, fontWeight: 800, color: NAVY, fontFamily: FONT, lineHeight: 1.1 }}>
          Machine learning analyzes{" "}
          <span style={{ color: RED }}>thousands of accounts</span>
        </div>
      </div>

      {/* ── Ticker label below orb ── */}
      <div style={{
        position: "absolute",
        top: CY + ORB_R + 30,
        left: 0, right: 0,
        textAlign: "center",
        opacity: tickerOp,
        transform: `translateY(${tickerY}px)`,
        zIndex: 6,
      }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: "rgba(30,45,90,0.5)", fontFamily: FONT }}>
          Analyzing <strong style={{ color: NAVY }}>{tickerVal.toLocaleString()}</strong> data points across your customer base…
        </div>
      </div>

      {/* ── Subtitle ── */}
      <div style={{
        position: "absolute",
        bottom: 60, left: 0, right: 0,
        textAlign: "center",
        opacity: subOp,
        transform: `translateY(${subY}px)`,
        zIndex: 6,
      }}>
        <div style={{ fontSize: 19, fontWeight: 500, color: "rgba(30,45,90,0.55)", fontFamily: FONT }}>
          Every closed-won deal trains the model.{" "}
          <strong style={{ color: NAVY }}>Scores improve over time.</strong>
        </div>
      </div>

    </AbsoluteFill>
  );
};
