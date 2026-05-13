import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Sequence,
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

const LockIcon = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="8" y="22" width="32" height="22" rx="5" fill="white"/>
    <path d="M14 22V16a10 10 0 0 1 20 0v6" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none"/>
    <circle cx="24" cy="33" r="3.5" fill={NAVY}/>
  </svg>
);

// ─── FunnelSecretScene ────────────────────────────────────────────────────────
function FunnelSecretScene({ frame, fps }) {
  const stages = [
    { label: "Awareness",     sub: "Top of funnel"        },
    { label: "Interest",      sub: "Content engagement"   },
    { label: "Consideration", sub: "Comparison research"  },
    { label: "Intent",        sub: "Pricing page visits",  secret: true },
    { label: "Evaluation",    sub: "Trial / demo"          },
    { label: "Decision",      sub: "Negotiation"           },
    { label: "Purchase",      sub: "Closed won"            },
  ];

  const N          = stages.length;
  const TOP_W      = 700;
  const BOT_W      = 200;
  const STAGE_H    = 70;
  const GAP        = 5;
  const TOTAL_H    = N * STAGE_H + (N - 1) * GAP;
  const CX         = 960;
  const TOP_Y      = 540 - TOTAL_H / 2;

  const titleOp = fi(frame, 0, 14, 0, 1);
  const titleY  = fi(frame, 0, 14, -16, 0);

  const blurAmt = frame > 140
    ? 7 + 2 * Math.sin(((frame - 140) / 20) * Math.PI * 2)
    : 7;

  const lockSp = spring({ frame: frame - 110, fps, config: { damping: 13, stiffness: 160 } });
  const lockOp = fi(frame, 110, 125, 0, 1);

  const questionOp = fi(frame, 190, 210, 0, 1);
  const questionY  = fi(frame, 190, 210, 14, 0);

  return (
    <AbsoluteFill>

      {/* Title */}
      <div style={{
        position: "absolute", top: 52, left: 0, right: 0,
        textAlign: "center", opacity: titleOp,
        transform: `translateY(${titleY}px)`, zIndex: 10,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(30,45,90,0.4)", fontFamily: FONT, letterSpacing: "2px", marginBottom: 8 }}>YOUR FUNNEL</div>
        <div style={{ fontSize: 44, fontWeight: 800, color: NAVY, fontFamily: FONT, lineHeight: 1.1 }}>
          One signal predicts conversion{" "}
          <span style={{ color: RED }}>better than anything else</span>
        </div>
      </div>

      {/* SVG funnel shapes */}
      <svg
        width={1920} height={1080}
        style={{ position: "absolute", inset: 0 }}
        viewBox="0 0 1920 1080"
      >
        {stages.map((stage, i) => {
          const t0 = i / (N - 1);
          const t1 = (i + 1) / (N - 1);
          const w0 = TOP_W + (BOT_W - TOP_W) * t0;
          const w1 = TOP_W + (BOT_W - TOP_W) * Math.min(t1, 1);
          const y0 = TOP_Y + i * (STAGE_H + GAP);
          const y1 = y0 + STAGE_H;
          const x0L = CX - w0 / 2;
          const x0R = CX + w0 / 2;
          const x1L = CX - w1 / 2;
          const x1R = CX + w1 / 2;

          const delay = 20 + i * 10;
          const op = fi(frame, delay, delay + 14, 0, 1);
          const scaleY = fi(frame, delay, delay + 14, 0.3, 1);

          const isSecret = stage.secret === true;
          const isEnd    = i === 0 || i === N - 1;
          const fill = isSecret
            ? `url(#secretGrad)`
            : isEnd ? NAVY : "rgba(30,45,90,0.10)";

          // For last stage use rect with rounded bottom
          const points = i < N - 1
            ? `${x0L},${y0} ${x0R},${y0} ${x1R},${y1} ${x1L},${y1}`
            : `${x0L},${y0} ${x0R},${y0} ${x0R},${y1} ${x0L},${y1}`;

          return (
            <g key={i} opacity={op} style={{ transformOrigin: `${CX}px ${y0 + STAGE_H / 2}px`, transform: `scaleY(${scaleY})` }}>
              <polygon points={points} fill={fill} rx={i === N - 1 ? 10 : 0}/>
            </g>
          );
        })}
        <defs>
          <linearGradient id="secretGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={RED}/>
            <stop offset="100%" stopColor={PINK}/>
          </linearGradient>
        </defs>
      </svg>

      {/* Stage labels — HTML overlaid on SVG */}
      {stages.map((stage, i) => {
        const t0    = i / (N - 1);
        const w0    = TOP_W + (BOT_W - TOP_W) * t0;
        const y0    = TOP_Y + i * (STAGE_H + GAP);
        const delay = 20 + i * 10;
        const op    = fi(frame, delay + 5, delay + 18, 0, 1);
        const isSecret = stage.secret === true;
        const isEnd    = i === 0 || i === N - 1;
        const textColor = (isSecret || isEnd) ? "white" : NAVY;
        const subColor  = (isSecret || isEnd) ? "rgba(255,255,255,0.65)" : "rgba(30,45,90,0.45)";

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: CX - w0 / 2,
              top: y0,
              width: w0,
              height: STAGE_H,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: op,
              filter: isSecret ? `blur(${blurAmt}px)` : "none",
              pointerEvents: "none",
              zIndex: 2,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 800, color: textColor, fontFamily: FONT }}>{stage.label}</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: subColor, fontFamily: FONT, marginTop: 2 }}>{stage.sub}</div>
          </div>
        );
      })}

      {/* Lock icon over secret stage */}
      {(() => {
        const si     = stages.findIndex(s => s.secret);
        const t0     = si / (N - 1);
        const y0     = TOP_Y + si * (STAGE_H + GAP);
        return (
          <div style={{
            position: "absolute",
            left: CX - 24,
            top: y0 + STAGE_H / 2 - 24,
            opacity: lockOp,
            transform: `scale(${lockSp})`,
            zIndex: 5,
            pointerEvents: "none",
          }}>
            <LockIcon size={48}/>
          </div>
        );
      })()}

      {/* Bottom question */}
      <div style={{
        position: "absolute", bottom: 64, left: 0, right: 0,
        textAlign: "center", opacity: questionOp,
        transform: `translateY(${questionY}px)`, zIndex: 10,
      }}>
        <div style={{ fontSize: 22, fontWeight: 500, color: "rgba(30,45,90,0.55)", fontFamily: FONT }}>
          Most teams don&apos;t even track it.{" "}
          <strong style={{ color: NAVY }}>Are you?</strong>
        </div>
      </div>

    </AbsoluteFill>
  );
}

const S1 = 300;

export const ExplainedComposition2 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Sequence from={0} durationInFrames={S1}>
        <FunnelSecretScene frame={frame} fps={fps}/>
      </Sequence>
    </AbsoluteFill>
  );
};
