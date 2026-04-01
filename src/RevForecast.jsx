import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const NAVY = "#1e2d5a";
const RED  = "#e8182e";
const PINK = "#c2185b";
const GREEN = "#16a34a";
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, s, e, f, t) {
  return interpolate(frame, [s, e], [f, t], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

const CX = 660, CY = 500;
const GAUGE_R = 260;
const START_ANGLE = -210; // degrees
const END_ANGLE   = 30;

function describeArc(r, startDeg, endDeg) {
  const sx = CX + r * Math.cos(startDeg * Math.PI / 180);
  const sy = CY + r * Math.sin(startDeg * Math.PI / 180);
  const ex = CX + r * Math.cos(endDeg * Math.PI / 180);
  const ey = CY + r * Math.sin(endDeg * Math.PI / 180);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
}

const FIXES = [
  { label: "Contacts updated",        frame: 80,  pts: 10 },
  { label: "Engagement visible",      frame: 130, pts: 14 },
  { label: "Zombie deals removed",    frame: 180, pts: 18 },
];

// Zombie deals shown as grey cards, crossed out at their fix frame
const ZOMBIES = [
  { label: "Acme Corp",    x: 1100, y: 340, crossFrame: 190 },
  { label: "ProServ Ltd",  x: 1340, y: 440, crossFrame: 205 },
  { label: "OldLead Inc",  x: 1200, y: 560, crossFrame: 218 },
];

export const RevForecast = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Gauge starts at ~40%, jitters with noise, climbs as each fix fires
  let gaugeTarget = 40;
  FIXES.forEach(f => { if (frame >= f.frame) gaugeTarget += f.pts; });
  const gaugeSmooth = fi(frame, 0, 40, 40, 40); // starts at 40
  // Accumulate target smoothly
  const gauge = Math.min(gaugeTarget, 82);

  // Needle jitter via noise (only before full score)
  const jitterAmt = fi(frame, 170, 210, 1, 0); // dies as system stabilizes
  const jitterX = (Math.sin(frame * 0.41) * 0.6 + Math.sin(frame * 1.13) * 0.4) * 8 * jitterAmt;
  const jitterY = (Math.cos(frame * 0.37) * 0.6 + Math.cos(frame * 0.89) * 0.4) * 6 * jitterAmt;

  // Needle angle: maps 0–100 score to START_ANGLE–END_ANGLE
  const needleAngle = fi(frame, 20, 260, START_ANGLE, START_ANGLE + (END_ANGLE - START_ANGLE) * (gauge / 100));
  const needleRad = (needleAngle * Math.PI) / 180;
  const needleTip = { x: CX + (GAUGE_R - 20) * Math.cos(needleRad) + jitterX, y: CY + (GAUGE_R - 20) * Math.sin(needleRad) + jitterY };

  // Arc fill progress
  const arcDeg = START_ANGLE + (END_ANGLE - START_ANGLE) * (gauge / 100);
  const arcColor = gauge >= 75 ? GREEN : gauge >= 55 ? "#d97706" : RED;

  const gaugeOp = fi(frame, 10, 30, 0, 1);
  const payoffOp = fi(frame, 245, 265, 0, 1);
  const payoffY  = fi(frame, 245, 265, 14, 0);

  return (
    <AbsoluteFill style={{ background: "#f8faff", fontFamily: FONT }}>

      {/* Title */}
      <div style={{
        position: "absolute", top: 52, left: 80,
        opacity: fi(frame, 0, 18, 0, 1),
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(30,45,90,0.4)", letterSpacing: "2.5px" }}>CHAPTER 6</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: NAVY, marginTop: 4 }}>Forecast Accuracy</div>
        <div style={{ fontSize: 14, color: "rgba(30,45,90,0.5)", marginTop: 2 }}>starts with data quality</div>
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>

        {/* Gauge track (background arc) */}
        <path
          d={describeArc(GAUGE_R, START_ANGLE, END_ANGLE)}
          fill="none"
          stroke="rgba(30,45,90,0.08)"
          strokeWidth={28}
          strokeLinecap="round"
          opacity={gaugeOp}
        />

        {/* Gauge fill arc */}
        <path
          d={describeArc(GAUGE_R, START_ANGLE, arcDeg)}
          fill="none"
          stroke={arcColor}
          strokeWidth={28}
          strokeLinecap="round"
          opacity={gaugeOp}
          style={{ filter: gauge >= 75 ? `drop-shadow(0 0 12px ${GREEN}88)` : "none", transition: "stroke 0.6s" }}
        />

        {/* 75% threshold tick */}
        {(() => {
          const threshDeg = START_ANGLE + (END_ANGLE - START_ANGLE) * 0.75;
          const inner = polarToXY(threshDeg, GAUGE_R - 36);
          const outer = polarToXY(threshDeg, GAUGE_R + 36);
          return (
            <g opacity={fi(frame, 20, 40, 0, 1)}>
              <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
                stroke={GREEN} strokeWidth={3} strokeDasharray="5 3"/>
              <text
                x={outer.x + Math.cos(threshDeg * Math.PI / 180) * 18}
                y={outer.y + Math.sin(threshDeg * Math.PI / 180) * 18}
                fill={GREEN} fontSize={13} fontWeight="800" fontFamily={FONT} textAnchor="middle"
              >75%</text>
            </g>
          );
        })()}

        {/* Needle */}
        <g opacity={gaugeOp}>
          <line
            x1={CX} y1={CY}
            x2={needleTip.x} y2={needleTip.y}
            stroke={NAVY} strokeWidth={4} strokeLinecap="round"
          />
          <circle cx={CX} cy={CY} r={14} fill={NAVY}/>
          <circle cx={CX} cy={CY} r={6} fill="white"/>
        </g>

        {/* Gauge score label */}
        <text x={CX} y={CY + 60}
          textAnchor="middle" fill={arcColor}
          fontSize={52} fontWeight="900" fontFamily={FONT}
          opacity={gaugeOp}
        >{Math.round(gauge)}%</text>
        <text x={CX} y={CY + 88}
          textAnchor="middle" fill="rgba(30,45,90,0.4)"
          fontSize={13} fontWeight="700" fontFamily={FONT} letterSpacing="2"
          opacity={gaugeOp}
        >FORECAST ACCURACY</text>

      </svg>

      {/* Fix events — appear as resolve cards on the right */}
      <div style={{
        position: "absolute", right: 120, top: 200,
        display: "flex", flexDirection: "column", gap: 14,
      }}>
        {FIXES.map((fix, i) => {
          const fired = frame >= fix.frame;
          const op = fi(frame, fix.frame - 4, fix.frame + 18, 0, 1);
          return (
            <div key={i} style={{ opacity: op }}>
              <div style={{
                background: "#fff", borderRadius: 12, padding: "12px 18px",
                border: `1.5px solid ${fired ? GREEN : "rgba(30,45,90,0.1)"}`,
                boxShadow: fired ? `0 4px 20px ${GREEN}22` : "0 2px 10px rgba(0,0,60,0.06)",
                display: "flex", alignItems: "center", gap: 14,
                width: 280,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: fired ? GREEN : "rgba(30,45,90,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, color: "white", fontWeight: 900, flexShrink: 0,
                }}>✓</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{fix.label}</div>
                  <div style={{ fontSize: 11, color: GREEN, fontWeight: 700, marginTop: 1 }}>+{fix.pts} accuracy points</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Zombie deals */}
      {ZOMBIES.map((z, i) => {
        const crossed = frame >= z.crossFrame;
        const cardOp = fi(frame, 30 + i * 14, 50 + i * 14, 0, 1);
        const crossOp = fi(frame, z.crossFrame, z.crossFrame + 18, 0, 1);
        const fadeOp = fi(frame, z.crossFrame + 14, z.crossFrame + 38, 1, 0);
        return (
          <div key={i} style={{
            position: "absolute", left: z.x, top: z.y,
            opacity: cardOp * fadeOp,
          }}>
            <div style={{ position: "relative", width: 160 }}>
              <div style={{
                background: "#fff", borderRadius: 12, padding: "10px 16px",
                border: "1.5px solid rgba(30,45,90,0.1)",
                boxShadow: "0 2px 10px rgba(0,0,60,0.07)",
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(30,45,90,0.4)", letterSpacing: "1px", marginBottom: 2 }}>ZOMBIE DEAL</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(30,45,90,0.4)" }}>{z.label}</div>
              </div>
              {/* Cross-out line */}
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: crossOp,
              }}>
                <svg width={160} height={60} style={{ position: "absolute", inset: 0 }}>
                  <line x1={10} y1={10} x2={150} y2={50} stroke={RED} strokeWidth={3} strokeLinecap="round"/>
                  <line x1={150} y1={10} x2={10} y2={50} stroke={RED} strokeWidth={3} strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
        );
      })}

      {/* Payoff */}
      <div style={{
        position: "absolute", bottom: 56, left: 0, right: 0,
        textAlign: "center", opacity: payoffOp, transform: `translateY(${payoffY}px)`,
      }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: NAVY }}>
          Better signals. <span style={{ color: GREEN }}>Tighter ranges.</span>{" "}
          <span style={{ color: NAVY }}>Real confidence.</span>
        </div>
      </div>

    </AbsoluteFill>
  );
};
