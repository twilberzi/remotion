import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const NAVY = "#1e2d5a";
const RED  = "#e8182e";
const PINK = "#c2185b";
const GREEN = "#16a34a";
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, s, e, f, t) {
  return interpolate(frame, [s, e], [f, t], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

// Closing — control room in full: pillars + gauge + deal stack
// Camera zoom-out effect via scale
// Each component pulses in sequence then final line appears

const GAUGE_CX = 320, GAUGE_CY = 480, GAUGE_R = 180;
const START_ANGLE = -210, END_ANGLE = 30;

function describeArc(cx, cy, r, startDeg, endDeg) {
  const s = { x: cx + r * Math.cos(startDeg * Math.PI / 180), y: cy + r * Math.sin(startDeg * Math.PI / 180) };
  const e = { x: cx + r * Math.cos(endDeg * Math.PI / 180), y: cy + r * Math.sin(endDeg * Math.PI / 180) };
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

const PILLAR_LABELS = ["Unification", "Analysis", "Guidance"];
const PILLAR_COLORS = ["#2563eb", RED, GREEN];

const DEALS = [
  { label: "Acme Corp",    score: 94, color: GREEN },
  { label: "BlueSky Inc",  score: 71, color: "#2563eb" },
  { label: "Contoso Ltd",  score: 48, color: "#d97706" },
  { label: "Dura Systems", score: 22, color: RED },
];

export const RevClosing = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Overall scale zoom out: starts slightly zoomed in, settles to 1.0
  const overallScale = fi(frame, 0, 80, 1.08, 1.0);

  // Components pulse in sequence
  const gaugeOp      = fi(frame, 10, 30, 0, 1);
  const pillarsOp    = fi(frame, 30, 52, 0, 1);
  const dealsOp      = fi(frame, 55, 78, 0, 1);

  // Pulse glow per component (sequence)
  const gaugePulse   = fi(frame, 80, 106, 0, 1) * fi(frame, 106, 130, 1, 0);
  const pillarPulse  = fi(frame, 110, 136, 0, 1) * fi(frame, 136, 160, 1, 0);
  const dealPulse    = fi(frame, 148, 172, 0, 1) * fi(frame, 172, 196, 1, 0);

  // Final line
  const finalOp = fi(frame, 185, 210, 0, 1);
  const finalY  = fi(frame, 185, 210, 20, 0);
  const finalScale = fi(frame, 185, 215, 0.92, 1);

  // Gauge needle at 82%
  const needleAngle = START_ANGLE + (END_ANGLE - START_ANGLE) * 0.82;
  const needleRad = (needleAngle * Math.PI) / 180;
  const arcDeg = needleAngle;

  return (
    <AbsoluteFill style={{ background: "#f8faff", fontFamily: FONT }}>

      <div style={{
        width: 1920, height: 1080,
        transform: `scale(${overallScale})`,
        transformOrigin: "center center",
        position: "absolute", inset: 0,
      }}>

        {/* ── LEFT: Gauge ── */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>

          {/* Gauge glow pulse */}
          <circle cx={GAUGE_CX} cy={GAUGE_CY} r={GAUGE_R + 40}
            fill={`rgba(22,163,74,${gaugePulse * 0.08})`}
            opacity={gaugePulse}
          />

          <path d={describeArc(GAUGE_CX, GAUGE_CY, GAUGE_R, START_ANGLE, END_ANGLE)}
            fill="none" stroke="rgba(30,45,90,0.08)" strokeWidth={22} strokeLinecap="round"
            opacity={gaugeOp}
          />
          <path d={describeArc(GAUGE_CX, GAUGE_CY, GAUGE_R, START_ANGLE, arcDeg)}
            fill="none" stroke={GREEN} strokeWidth={22} strokeLinecap="round"
            opacity={gaugeOp}
            style={{ filter: `drop-shadow(0 0 ${8 + gaugePulse * 16}px ${GREEN}88)` }}
          />
          <line
            x1={GAUGE_CX} y1={GAUGE_CY}
            x2={GAUGE_CX + (GAUGE_R - 14) * Math.cos(needleRad)}
            y2={GAUGE_CY + (GAUGE_R - 14) * Math.sin(needleRad)}
            stroke={NAVY} strokeWidth={3.5} strokeLinecap="round"
            opacity={gaugeOp}
          />
          <circle cx={GAUGE_CX} cy={GAUGE_CY} r={10} fill={NAVY} opacity={gaugeOp}/>

          <text x={GAUGE_CX} y={GAUGE_CY + 50}
            textAnchor="middle" fill={GREEN}
            fontSize={46} fontWeight="900" fontFamily={FONT}
            opacity={gaugeOp}
          >82%</text>
          <text x={GAUGE_CX} y={GAUGE_CY + 76}
            textAnchor="middle" fill="rgba(30,45,90,0.4)"
            fontSize={11} fontWeight="700" fontFamily={FONT} letterSpacing="2"
            opacity={gaugeOp}
          >FORECAST ACCURACY</text>

        </svg>

        {/* ── CENTER: Pillars ── */}
        <div style={{
          position: "absolute", left: 580, top: 280,
          display: "flex", flexDirection: "column", gap: 16,
          opacity: pillarsOp,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(30,45,90,0.4)", letterSpacing: "2.5px", marginBottom: 4 }}>
            THREE PILLARS ACTIVE
          </div>
          {PILLAR_LABELS.map((p, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 14, padding: "16px 22px",
              border: `1.5px solid ${PILLAR_COLORS[i]}33`,
              boxShadow: `0 4px 20px ${PILLAR_COLORS[i]}${Math.round(pillarPulse * 20 + 10).toString(16).padStart(2, '0')}`,
              display: "flex", alignItems: "center", gap: 14, width: 260,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: PILLAR_COLORS[i],
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, color: "white", fontWeight: 900, flexShrink: 0,
              }}>{i + 1}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>{p}</div>
              <div style={{ marginLeft: "auto", fontSize: 14, color: GREEN, fontWeight: 900 }}>✓</div>
            </div>
          ))}
        </div>

        {/* ── RIGHT: Deal stack ranked ── */}
        <div style={{
          position: "absolute", right: 100, top: 260,
          display: "flex", flexDirection: "column", gap: 12,
          opacity: dealsOp,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(30,45,90,0.4)", letterSpacing: "2.5px", marginBottom: 4 }}>
            PIPELINE — RANKED
          </div>
          {DEALS.map((d, i) => {
            const sp = spring({ frame: frame - (58 + i * 12), fps, config: { damping: 20, stiffness: 160 } });
            return (
              <div key={i} style={{
                transform: `scale(${sp})`,
                background: "#fff", borderRadius: 14, padding: "14px 18px",
                border: "1.5px solid rgba(30,45,90,0.08)",
                boxShadow: `0 4px 20px ${d.color}${Math.round(dealPulse * 20 + 8).toString(16).padStart(2, '0')}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: 280,
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{d.label}</div>
                  <div style={{ fontSize: 10, color: "rgba(30,45,90,0.4)", fontWeight: 600, marginTop: 1 }}>
                    #{i + 1} priority
                  </div>
                </div>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: d.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 900, color: "white",
                  boxShadow: `0 4px 14px ${d.color}44`,
                }}>{d.score}</div>
              </div>
            );
          })}
        </div>

        {/* Final line */}
        <div style={{
          position: "absolute", bottom: 80, left: 0, right: 0,
          textAlign: "center",
          opacity: finalOp,
          transform: `translateY(${finalY}px) scale(${finalScale})`,
          transformOrigin: "center bottom",
        }}>
          <div style={{
            display: "inline-block",
            background: `linear-gradient(135deg, ${RED}, ${PINK})`,
            borderRadius: 20, padding: "22px 60px",
            boxShadow: "0 16px 56px rgba(232,24,46,0.3)",
          }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: "white", lineHeight: 1.2 }}>
              Replace guessing with guidance.
            </div>
          </div>
        </div>

      </div>
    </AbsoluteFill>
  );
};
