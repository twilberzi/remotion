import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const NAVY = "#1e2d5a";
const RED  = "#e8182e";
const PINK = "#c2185b";
const GREEN = "#16a34a";
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, s, e, f, t) {
  return interpolate(frame, [s, e], [f, t], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

// Three chambers: Unification, Analysis, Guidance
const CHAMBERS = [
  {
    num: "01", label: "Unification", sub: "One view",
    color: "#2563eb", icon: "⬡",
    desc: "CRM + Marketing\n+ Conversations",
  },
  {
    num: "02", label: "Analysis", sub: "Pattern detection",
    color: RED, icon: "⟳",
    desc: "What predicts wins.\nWhat signals risk.",
  },
  {
    num: "03", label: "Guidance", sub: "Workflow actions",
    color: GREEN, icon: "→",
    desc: "Which deals. Which\nstakeholders. What next.",
  },
];

const CHAMBER_W = 300;
const CHAMBER_H = 260;
const CHAMBER_GAP = 60;
const START_X = 240;
const CHAMBER_Y = 360;

export const RevPillars = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Data enters left at frame 0 as a dot stream
  // Chamber 1 activates ~30, pipes to Chamber 2 ~80, Chamber 3 ~140
  // Scan lines sweep Chamber 2 during analysis
  // Output card ejects from Chamber 3 at ~180
  // Payoff at ~220

  const payoffOp = fi(frame, 222, 242, 0, 1);
  const payoffY  = fi(frame, 222, 242, 14, 0);

  // Pipe flow progress between chambers
  const pipe1Progress = fi(frame, 52, 82, 0, 1);
  const pipe2Progress = fi(frame, 112, 142, 0, 1);

  // Scan line in chamber 2
  const scanY = fi(frame, 85, 135, CHAMBER_Y + 20, CHAMBER_Y + CHAMBER_H - 20);
  const scanOp = fi(frame, 85, 100, 0, 1) * fi(frame, 130, 145, 1, 0);

  // Output card
  const outputSp = spring({ frame: frame - 175, fps, config: { damping: 16, stiffness: 180 } });
  const outputOp = fi(frame, 175, 192, 0, 1);

  return (
    <AbsoluteFill style={{ background: "#f8faff", fontFamily: FONT }}>

      {/* Title */}
      <div style={{
        position: "absolute", top: 60, left: 0, right: 0,
        textAlign: "center", opacity: fi(frame, 0, 18, 0, 1),
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(30,45,90,0.4)", letterSpacing: "2.5px" }}>
          THE THREE PILLARS
        </div>
        <div style={{ fontSize: 32, fontWeight: 900, color: NAVY, marginTop: 6 }}>
          One system. Three chambers.
        </div>
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>

        {/* Input arrow / data entering from left */}
        <g opacity={fi(frame, 8, 24, 0, 1)}>
          <line
            x1={80} y1={CHAMBER_Y + CHAMBER_H / 2}
            x2={START_X - 10} y2={CHAMBER_Y + CHAMBER_H / 2}
            stroke="rgba(30,45,90,0.25)" strokeWidth={3} strokeDasharray="8 5"
          />
          <polygon
            points={`${START_X - 10},${CHAMBER_Y + CHAMBER_H / 2 - 8} ${START_X + 8},${CHAMBER_Y + CHAMBER_H / 2} ${START_X - 10},${CHAMBER_Y + CHAMBER_H / 2 + 8}`}
            fill="rgba(30,45,90,0.3)"
          />
          <text x={100} y={CHAMBER_Y + CHAMBER_H / 2 - 16}
            fill="rgba(30,45,90,0.4)" fontSize={11} fontWeight="700" fontFamily={FONT} letterSpacing="2">
            RAW DEAL DATA
          </text>
        </g>

        {/* Pipe between Chamber 1 and 2 */}
        {(() => {
          const x1 = START_X + CHAMBER_W;
          const x2 = START_X + CHAMBER_W + CHAMBER_GAP;
          const cy = CHAMBER_Y + CHAMBER_H / 2;
          const drawn = (x2 - x1) * pipe1Progress;
          return (
            <g>
              <line x1={x1} y1={cy} x2={x1 + drawn} y2={cy}
                stroke={CHAMBERS[0].color} strokeWidth={4} opacity={0.6}/>
              {pipe1Progress > 0.8 && (
                <polygon
                  points={`${x2 - 10},${cy - 8} ${x2 + 8},${cy} ${x2 - 10},${cy + 8}`}
                  fill={CHAMBERS[0].color} opacity={pipe1Progress}
                />
              )}
            </g>
          );
        })()}

        {/* Pipe between Chamber 2 and 3 */}
        {(() => {
          const x1 = START_X + CHAMBER_W * 2 + CHAMBER_GAP;
          const x2 = START_X + CHAMBER_W * 2 + CHAMBER_GAP * 2;
          const cy = CHAMBER_Y + CHAMBER_H / 2;
          const drawn = (x2 - x1) * pipe2Progress;
          return (
            <g>
              <line x1={x1} y1={cy} x2={x1 + drawn} y2={cy}
                stroke={RED} strokeWidth={4} opacity={0.6}/>
              {pipe2Progress > 0.8 && (
                <polygon
                  points={`${x2 - 10},${cy - 8} ${x2 + 8},${cy} ${x2 - 10},${cy + 8}`}
                  fill={RED} opacity={pipe2Progress}
                />
              )}
            </g>
          );
        })()}

        {/* Scan line in Chamber 2 */}
        <line
          x1={START_X + CHAMBER_W + CHAMBER_GAP + 10}
          y1={scanY}
          x2={START_X + CHAMBER_W * 2 + CHAMBER_GAP - 10}
          y2={scanY}
          stroke={RED} strokeWidth={2}
          opacity={scanOp * 0.7}
          strokeDasharray="12 6"
        />

        {/* Chamber boxes */}
        {CHAMBERS.map((ch, i) => {
          const cx = START_X + i * (CHAMBER_W + CHAMBER_GAP);
          const activateDelay = i * 52 + 18;
          const op = fi(frame, activateDelay, activateDelay + 22, 0, 1);
          const sp = spring({ frame: frame - activateDelay, fps, config: { damping: 18, stiffness: 130 } });
          return (
            <g key={i} opacity={op} transform={`scale(${sp}) translate(${cx * (1 - sp)}, ${(CHAMBER_Y + CHAMBER_H / 2) * (1 - sp)})`}>
              <rect x={cx} y={CHAMBER_Y} width={CHAMBER_W} height={CHAMBER_H} rx={20}
                fill="white"
                stroke={ch.color}
                strokeWidth={2}
                style={{ filter: `drop-shadow(0 8px 28px ${ch.color}22)` }}
              />
              {/* Top accent bar */}
              <rect x={cx} y={CHAMBER_Y} width={CHAMBER_W} height={8} rx={4}
                fill={ch.color}
              />
            </g>
          );
        })}
      </svg>

      {/* Chamber labels & content */}
      {CHAMBERS.map((ch, i) => {
        const cx = START_X + i * (CHAMBER_W + CHAMBER_GAP);
        const activateDelay = i * 52 + 18;
        const op = fi(frame, activateDelay, activateDelay + 22, 0, 1);
        const bulletDelay = activateDelay + 24;
        return (
          <div key={i} style={{
            position: "absolute",
            left: cx + 20, top: CHAMBER_Y + 28,
            width: CHAMBER_W - 40,
            opacity: op,
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: ch.color, letterSpacing: "2px", marginBottom: 6 }}>
              PILLAR {ch.num}
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: NAVY, marginBottom: 2 }}>{ch.label}</div>
            <div style={{ fontSize: 12, color: "rgba(30,45,90,0.45)", fontWeight: 600, marginBottom: 18 }}>{ch.sub}</div>
            <div style={{
              fontSize: 14, color: "rgba(30,45,90,0.6)", fontWeight: 500, lineHeight: 1.6,
              opacity: fi(frame, bulletDelay, bulletDelay + 20, 0, 1),
              whiteSpace: "pre-line",
            }}>{ch.desc}</div>
          </div>
        );
      })}

      {/* Output card ejects from Chamber 3 */}
      <div style={{
        position: "absolute",
        left: START_X + CHAMBER_W * 3 + CHAMBER_GAP * 2 + 20,
        top: CHAMBER_Y + 60,
        opacity: outputOp,
        transform: `scale(${outputSp}) translateX(${fi(frame, 175, 200, -20, 0)}px)`,
      }}>
        <div style={{
          width: 220,
          background: "#fff",
          borderRadius: 16,
          border: `2px solid ${GREEN}`,
          boxShadow: `0 12px 40px ${GREEN}33`,
          overflow: "hidden",
        }}>
          <div style={{ background: GREEN, padding: "12px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "2px" }}>GUIDED ACTION</div>
          </div>
          <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {["Acme Corp — call today", "BlueSky — add stakeholder", "Contoso — risk: going dark"].map((line, li) => (
              <div key={li} style={{
                fontSize: 12, fontWeight: 600, color: NAVY,
                opacity: fi(frame, 180 + li * 12, 196 + li * 12, 0, 1),
                display: "flex", gap: 8, alignItems: "center",
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN, flexShrink: 0 }}/>
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payoff */}
      <div style={{
        position: "absolute", bottom: 60, left: 0, right: 0,
        textAlign: "center", opacity: payoffOp, transform: `translateY(${payoffY}px)`,
      }}>
        <div style={{ fontSize: 26, fontWeight: 800, color: NAVY }}>
          Miss one pillar.{" "}
          <span style={{ color: RED }}>The whole system falls apart.</span>
        </div>
      </div>

    </AbsoluteFill>
  );
};
