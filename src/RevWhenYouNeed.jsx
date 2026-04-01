import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const NAVY = "#1e2d5a";
const RED  = "#e8182e";
const PINK = "#c2185b";
const GREEN = "#16a34a";
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, s, e, f, t) {
  return interpolate(frame, [s, e], [f, t], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

const ATTRIBUTES = [
  { label: "Deal Size",         simple: "$2K",    complex: "$85K",   simpleW: 80,  complexW: 380 },
  { label: "Sales Cycle",       simple: "7 days", complex: "90 days",simpleW: 60,  complexW: 340 },
  { label: "Stakeholders",      simple: "1",      complex: "6+",     simpleW: 40,  complexW: 300 },
  { label: "Team Size",         simple: "Solo",   complex: "8 reps", simpleW: 50,  complexW: 260 },
];

const THRESHOLD_X = 520;
const BAR_START_X = 160;
const BAR_H = 38;
const BAR_GAP = 62;
const BARS_TOP = 260;

export const RevWhenYouNeed = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (0–100): Simple deal builds up bar by bar
  // Phase 2 (80–180): Complex deal bars build — they cross the threshold
  // Phase 3 (160–240): RI activates above threshold
  // Payoff 245+

  const titleOp = fi(frame, 0, 18, 0, 1);
  const threshOp = fi(frame, 20, 38, 0, 1);

  const riActivate = fi(frame, 168, 198, 0, 1);
  const riGlow = fi(frame, 180, 210, 0, 1);

  const payoffOp = fi(frame, 248, 268, 0, 1);
  const payoffY  = fi(frame, 248, 268, 14, 0);

  return (
    <AbsoluteFill style={{ background: "#f8faff", fontFamily: FONT }}>

      {/* Title */}
      <div style={{
        position: "absolute", top: 52, left: 0, right: 0,
        textAlign: "center", opacity: titleOp,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(30,45,90,0.4)", letterSpacing: "2.5px" }}>CHAPTER 8</div>
        <div style={{ fontSize: 30, fontWeight: 900, color: NAVY, marginTop: 4 }}>
          When you need it — and when you don&apos;t.
        </div>
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>

        {/* Threshold line */}
        <line
          x1={THRESHOLD_X + BAR_START_X} y1={180}
          x2={THRESHOLD_X + BAR_START_X} y2={BARS_TOP + BAR_H * 4 + BAR_GAP * 3 + 60}
          stroke={RED} strokeWidth={2.5}
          strokeDasharray="8 5"
          opacity={threshOp * 0.7}
        />
        <text
          x={THRESHOLD_X + BAR_START_X + 10} y={198}
          fill={RED} fontSize={12} fontWeight="800" fontFamily={FONT}
          opacity={threshOp}
        >RI THRESHOLD →</text>

        {/* Bars */}
        {ATTRIBUTES.map((attr, i) => {
          const y = BARS_TOP + i * (BAR_H + BAR_GAP);
          const simpleDelay = 22 + i * 16;
          const complexDelay = 88 + i * 18;

          const simpleDrawn = fi(frame, simpleDelay, simpleDelay + 28, 0, attr.simpleW);
          const complexDrawn = fi(frame, complexDelay, complexDelay + 38, 0, attr.complexW);

          const simpleOp = fi(frame, simpleDelay, simpleDelay + 14, 0, 1);
          const complexOp = fi(frame, complexDelay, complexDelay + 14, 0, 1);

          const crossesThreshold = attr.complexW > THRESHOLD_X;

          return (
            <g key={i}>
              {/* Attribute label */}
              <text x={BAR_START_X - 10} y={y + BAR_H / 2 + 5}
                textAnchor="end" fill="rgba(30,45,90,0.55)"
                fontSize={13} fontWeight="700" fontFamily={FONT}
                opacity={simpleOp}
              >{attr.label}</text>

              {/* Simple bar (top, muted) */}
              <rect
                x={BAR_START_X} y={y}
                width={simpleDrawn} height={BAR_H / 2 - 3}
                rx={6}
                fill="rgba(30,45,90,0.12)"
                opacity={simpleOp}
              />
              <text x={BAR_START_X + simpleDrawn + 8} y={y + BAR_H / 4 + 4}
                fill="rgba(30,45,90,0.4)" fontSize={11} fontWeight="700" fontFamily={FONT}
                opacity={simpleOp}
              >{attr.simple}</text>

              {/* Complex bar (bottom, colored) */}
              <rect
                x={BAR_START_X} y={y + BAR_H / 2 + 1}
                width={complexDrawn} height={BAR_H / 2 - 3}
                rx={6}
                fill={crossesThreshold && complexDrawn > THRESHOLD_X
                  ? `url(#complexGrad${i})`
                  : "#2563eb"}
                opacity={complexOp}
              />
              <defs>
                <linearGradient id={`complexGrad${i}`} x1="0" x2="1">
                  <stop offset={`${(THRESHOLD_X / attr.complexW) * 100}%`} stopColor="#2563eb"/>
                  <stop offset={`${(THRESHOLD_X / attr.complexW) * 100}%`} stopColor={RED}/>
                  <stop offset="100%" stopColor={RED}/>
                </linearGradient>
              </defs>
              <text x={BAR_START_X + complexDrawn + 8} y={y + BAR_H - 3}
                fill={crossesThreshold && complexDrawn > THRESHOLD_X ? RED : "#2563eb"}
                fontSize={11} fontWeight="800" fontFamily={FONT}
                opacity={complexOp}
              >{attr.complex}</text>
            </g>
          );
        })}

        {/* RI activation zone — lights up right of threshold */}
        <rect
          x={THRESHOLD_X + BAR_START_X} y={180}
          width={700} height={BARS_TOP + BAR_H * 4 + BAR_GAP * 3 - 180 + 60}
          rx={0}
          fill={`rgba(232,24,46,${riActivate * 0.04})`}
          opacity={riActivate}
        />

      </svg>

      {/* Legend */}
      <div style={{
        position: "absolute", left: BAR_START_X, top: BARS_TOP - 60,
        display: "flex", gap: 28,
        opacity: fi(frame, 18, 34, 0, 1),
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 10, borderRadius: 3, background: "rgba(30,45,90,0.12)" }}/>
          <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(30,45,90,0.4)", letterSpacing: "1px" }}>SIMPLE DEAL</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 10, borderRadius: 3, background: "#2563eb" }}/>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", letterSpacing: "1px" }}>COMPLEX DEAL</span>
        </div>
      </div>

      {/* RI system activates label */}
      <div style={{
        position: "absolute",
        left: THRESHOLD_X + BAR_START_X + 20,
        top: 200,
        opacity: riActivate,
        transform: `scale(${fi(frame, 168, 195, 0.9, 1)})`,
        transformOrigin: "left top",
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${RED}, ${PINK})`,
          borderRadius: 14, padding: "14px 22px",
          boxShadow: `0 8px 32px rgba(232,24,46,${riGlow * 0.35})`,
          maxWidth: 380,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "2px", marginBottom: 6 }}>
            REVENUE INTELLIGENCE ACTIVE
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "white", lineHeight: 1.5 }}>
            Deal size &gt; $10K • Cycle &gt; 30 days
            <br/>Multiple stakeholders • Team of 3+
            <br/>Forecast accuracy &lt; 75%
          </div>
        </div>
      </div>

      {/* Payoff */}
      <div style={{
        position: "absolute", bottom: 56, left: 0, right: 0,
        textAlign: "center", opacity: payoffOp, transform: `translateY(${payoffY}px)`,
      }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: NAVY }}>
          Simple deals: don&apos;t bother.{" "}
          <span style={{ color: RED }}>Complex deals: you can&apos;t afford not to.</span>
        </div>
      </div>

    </AbsoluteFill>
  );
};
