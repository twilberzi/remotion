import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const NAVY = "#1e2d5a";
const RED  = "#e8182e";
const PINK = "#c2185b";
const GREEN = "#16a34a";
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, s, e, f, t) {
  return interpolate(frame, [s, e], [f, t], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

// Seeded pseudo-random for deterministic layout
function seededRand(seed) {
  let h = 2166136261;
  for (let i = 0; i < String(seed).length; i++) {
    h ^= String(seed).charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return (h >>> 0) / 4294967295;
}

const LEFT_DEALS = [
  { label: "Acme Corp",    value: "??",  color: "rgba(30,45,90,0.15)" },
  { label: "BlueSky Inc",  value: "??",  color: "rgba(30,45,90,0.1)"  },
  { label: "Contoso Ltd",  value: "??",  color: "rgba(30,45,90,0.2)"  },
  { label: "Dura Systems", value: "??",  color: "rgba(30,45,90,0.12)" },
  { label: "Ecotel",       value: "??",  color: "rgba(30,45,90,0.18)" },
];

const RIGHT_DEALS = [
  { label: "Acme Corp",    score: 94, status: "Close",    color: `linear-gradient(135deg, ${GREEN}, #15803d)` },
  { label: "BlueSky Inc",  score: 71, status: "Nurture",  color: `linear-gradient(135deg, #2563eb, #1d4ed8)` },
  { label: "Contoso Ltd",  score: 58, status: "At Risk",  color: `linear-gradient(135deg, ${RED}, ${PINK})` },
  { label: "Dura Systems", score: 42, status: "Stalled",  color: `linear-gradient(135deg, #d97706, #b45309)` },
  { label: "Ecotel",       score: 18, status: "Drop",     color: "linear-gradient(135deg, rgba(30,45,90,0.4), rgba(30,45,90,0.3))" },
];

export const RevIntro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (0–60): left side chaos appears
  // Phase 2 (60–120): right side appears, sharp and ranked
  // Phase 3 (120–180): RI label appears, blur lifts on left, left cards reorder
  // Phase 4 (180–240): payoff line

  const dividerOp = fi(frame, 5, 25, 0, 1);

  // Left label
  const leftLabelOp = fi(frame, 8, 24, 0, 1);
  const rightLabelOp = fi(frame, 65, 80, 0, 1);

  // RI force label
  const riOp   = fi(frame, 118, 138, 0, 1);
  const riScale = fi(frame, 118, 138, 0.85, 1);

  // Payoff
  const payoffOp = fi(frame, 185, 205, 0, 1);
  const payoffY  = fi(frame, 185, 205, 16, 0);

  return (
    <AbsoluteFill style={{ background: "#f8faff", fontFamily: FONT, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

      {/* Top labels */}
      <div style={{ display: "flex", width: 1400, justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ opacity: leftLabelOp, fontSize: 11, fontWeight: 700, color: "rgba(30,45,90,0.35)", letterSpacing: "2.5px", width: 600, textAlign: "center" }}>
          GUT FEEL — AVERAGE TEAM
        </div>
        <div style={{ opacity: rightLabelOp, fontSize: 11, fontWeight: 700, color: RED, letterSpacing: "2.5px", width: 600, textAlign: "center" }}>
          REVENUE INTELLIGENCE — TOP TEAM
        </div>
      </div>

      {/* Two-column arena */}
      <div style={{ display: "flex", gap: 0, alignItems: "flex-start", width: 1400, position: "relative" }}>

        {/* LEFT — chaotic, blurry pipeline */}
        <div style={{ width: 600, position: "relative" }}>
          {/* blur lifts after RI appears */}
          <div style={{ filter: `blur(${fi(frame, 120, 175, 6, 0)}px)`, transition: "none" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {LEFT_DEALS.map((d, i) => {
                const delay = 12 + i * 12;
                const op  = fi(frame, delay, delay + 18, 0, 1);
                // Drift: random Y offset oscillates
                const drift = Math.sin((frame + i * 40) / 18) * (seededRand(i + 1) * 12 + 4);
                const driftX = Math.cos((frame + i * 27) / 22) * (seededRand(i + 10) * 6 + 2);
                return (
                  <div key={i} style={{
                    opacity: op * (0.55 + seededRand(i + 5) * 0.35),
                    transform: `translateY(${drift}px) translateX(${driftX}px)`,
                  }}>
                    <div style={{
                      background: "#fff",
                      borderRadius: 14,
                      padding: "14px 20px",
                      border: "1.5px solid rgba(30,45,90,0.1)",
                      boxShadow: "0 2px 10px rgba(0,0,60,0.07)",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "rgba(30,45,90,0.5)" }}>{d.label}</div>
                      <div style={{
                        width: 42, height: 42, borderRadius: "50%",
                        background: d.color,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18, fontWeight: 900, color: "rgba(30,45,90,0.3)",
                      }}>?</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center divider */}
        <div style={{
          width: 2, alignSelf: "stretch", background: "rgba(30,45,90,0.1)",
          opacity: dividerOp, margin: "0 40px", minHeight: 340,
        }}/>

        {/* RIGHT — sharp, ranked, scored */}
        <div style={{ width: 600 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {RIGHT_DEALS.map((d, i) => {
              const delay = 68 + i * 14;
              const sp  = spring({ frame: frame - delay, fps, config: { damping: 22, stiffness: 180 } });
              const op  = fi(frame, delay, delay + 18, 0, 1);
              return (
                <div key={i} style={{
                  opacity: op,
                  transform: `scale(${sp}) translateX(${fi(frame, delay, delay + 20, 20, 0)}px)`,
                }}>
                  <div style={{
                    background: "#fff",
                    borderRadius: 14,
                    padding: "14px 20px",
                    border: "1.5px solid rgba(30,45,90,0.08)",
                    boxShadow: "0 4px 20px rgba(0,0,60,0.09)",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>{d.label}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(30,45,90,0.4)", marginTop: 2, letterSpacing: "1px" }}>{d.status}</div>
                    </div>
                    <div style={{
                      width: 48, height: 48, borderRadius: "50%",
                      background: d.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 17, fontWeight: 900, color: "white",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                    }}>{d.score}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RI Force label — appears between the two sides */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: `translate(-50%, -50%) scale(${riScale})`,
        opacity: riOp,
        zIndex: 10,
        textAlign: "center",
      }}>
        <div style={{
          background: `linear-gradient(135deg, ${RED}, ${PINK})`,
          borderRadius: 99, padding: "10px 28px",
          boxShadow: "0 8px 32px rgba(232,24,46,0.35)",
          fontSize: 13, fontWeight: 800, color: "white", letterSpacing: "1.5px",
        }}>REVENUE INTELLIGENCE</div>
        <div style={{ marginTop: 6, fontSize: 11, color: "rgba(30,45,90,0.45)", fontWeight: 600 }}>↑ the force that sorts the right side</div>
      </div>

      {/* Payoff */}
      <div style={{
        position: "absolute", bottom: 64, left: 0, right: 0,
        textAlign: "center", opacity: payoffOp, transform: `translateY(${payoffY}px)`,
      }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: NAVY }}>
          The difference isn&apos;t talent. It&apos;s{" "}
          <span style={{ color: RED }}>how they use their data.</span>
        </div>
      </div>

    </AbsoluteFill>
  );
};
