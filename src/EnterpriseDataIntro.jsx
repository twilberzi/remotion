import {
  AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence,
} from "remotion";

const NAVY = "#1e2d5a";
const RED  = "#e8182e";
const PINK = "#c2185b";
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, s, e, f, t) {
  return interpolate(frame, [s, e], [f, t], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

// ─── Scene A: The Question (0–120f) ──────────────────────────────────────────
// "What's the difference between a company that collects data… and one that profits from it?"
function SceneA({ frame, fps }) {
  const leftOp  = fi(frame, 0, 22, 0, 1);
  const leftX   = fi(frame, 0, 22, -30, 0);
  const rightOp = fi(frame, 18, 40, 0, 1);
  const rightX  = fi(frame, 18, 40, 30, 0);
  const vsOp    = fi(frame, 32, 50, 0, 1);
  const subOp   = fi(frame, 55, 75, 0, 1);
  const subY    = fi(frame, 55, 75, 12, 0);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40 }}>
      {/* Two cards side by side */}
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        {/* Collects data */}
        <div style={{ opacity: leftOp, transform: `translateX(${leftX}px)` }}>
          <div style={{
            background: "#fff", borderRadius: 20, padding: "32px 40px", width: 360,
            border: "1.5px solid rgba(30,45,90,0.1)", boxShadow: "0 8px 36px rgba(0,0,60,0.1)",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(30,45,90,0.38)", fontFamily: FONT, letterSpacing: "2px", marginBottom: 14 }}>COMPANY A</div>
            <div style={{ fontSize: 52, marginBottom: 12 }}>📊</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: NAVY, fontFamily: FONT }}>Collects Data</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: "rgba(30,45,90,0.5)", fontFamily: FONT, marginTop: 8 }}>Lots of it.</div>
          </div>
        </div>

        {/* VS */}
        <div style={{ opacity: vsOp, fontSize: 28, fontWeight: 900, color: "rgba(30,45,90,0.2)", fontFamily: FONT }}>VS</div>

        {/* Profits from data */}
        <div style={{ opacity: rightOp, transform: `translateX(${rightX}px)` }}>
          <div style={{
            background: `linear-gradient(135deg, ${RED}, ${PINK})`,
            borderRadius: 20, padding: "32px 40px", width: 360,
            boxShadow: "0 12px 48px rgba(232,24,46,0.3)",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", fontFamily: FONT, letterSpacing: "2px", marginBottom: 14 }}>COMPANY B</div>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🚀</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: "white", fontFamily: FONT }}>Profits From Data</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.65)", fontFamily: FONT, marginTop: 8 }}>Consistently.</div>
          </div>
        </div>
      </div>

      {/* Sub question */}
      <div style={{ opacity: subOp, transform: `translateY(${subY}px)`, textAlign: "center" }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: NAVY, fontFamily: FONT }}>What's the difference?</div>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene B: Wrong Answers (120–240f) ───────────────────────────────────────
// "Most think: AI / Dashboards / More tools" — crossed out
function SceneB({ frame, fps }) {
  const titleOp = fi(frame, 0, 18, 0, 1);
  const wrongs = [
    { label: "More AI",         emoji: "🤖", delay: 20 },
    { label: "More Dashboards", emoji: "📈", delay: 38 },
    { label: "More Tools",      emoji: "🔧", delay: 56 },
  ];
  const crossOp = fi(frame, 75, 92, 0, 1);
  const answerOp = fi(frame, 88, 108, 0, 1);
  const answerY  = fi(frame, 88, 108, 14, 0);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 }}>
      <div style={{ opacity: titleOp, fontSize: 20, fontWeight: 700, color: "rgba(30,45,90,0.4)", fontFamily: FONT, letterSpacing: "1.5px" }}>MOST PEOPLE THINK THE ANSWER IS…</div>

      <div style={{ display: "flex", gap: 28 }}>
        {wrongs.map((w, i) => {
          const sp = spring({ frame: frame - w.delay, fps, config: { damping: 18, stiffness: 150 } });
          const op = fi(frame, w.delay, w.delay + 18, 0, 1);
          return (
            <div key={i} style={{ opacity: op, transform: `scale(${sp})`, position: "relative" }}>
              <div style={{
                background: "#fff", borderRadius: 18, padding: "24px 32px", width: 240,
                border: "1.5px solid rgba(30,45,90,0.1)", boxShadow: "0 6px 24px rgba(0,0,60,0.08)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>{w.emoji}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: NAVY, fontFamily: FONT }}>{w.label}</div>
              </div>
              {/* Red X overlay */}
              <div style={{
                position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                opacity: crossOp,
              }}>
                <div style={{ fontSize: 100, fontWeight: 900, color: RED, lineHeight: 1, opacity: 0.85 }}>✕</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real answer */}
      <div style={{ opacity: answerOp, transform: `translateY(${answerY}px)`, textAlign: "center" }}>
        <div style={{ fontSize: 36, fontWeight: 900, color: NAVY, fontFamily: FONT }}>
          The real difference is{" "}
          <span style={{ color: RED }}>strategy.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene C: Statement Card (240–360f) ──────────────────────────────────────
// "Data without strategy = wasted potential" + "every company says they're data-driven but stuck"
function SceneC({ frame, fps }) {
  const cardSp = spring({ frame: frame - 8, fps, config: { damping: 18, stiffness: 130 } });
  const cardOp = fi(frame, 8, 28, 0, 1);
  const row1Op = fi(frame, 38, 55, 0, 1);
  const row2Op = fi(frame, 55, 72, 0, 1);
  const row3Op = fi(frame, 72, 89, 0, 1);
  const subOp  = fi(frame, 88, 108, 0, 1);
  const subY   = fi(frame, 88, 108, 12, 0);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36 }}>
      {/* Statement card */}
      <div style={{ opacity: cardOp, transform: `scale(${cardSp})` }}>
        <div style={{
          background: `linear-gradient(135deg, ${RED}, ${PINK})`,
          borderRadius: 24, padding: "36px 60px",
          boxShadow: "0 16px 60px rgba(232,24,46,0.35)",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", fontFamily: FONT, letterSpacing: "2.5px", marginBottom: 14 }}>THE TRUTH</div>
          <div style={{ fontSize: 46, fontWeight: 900, color: "white", fontFamily: FONT, lineHeight: 1.15 }}>
            Data without strategy
            <br/>
            = wasted potential
          </div>
        </div>
      </div>

      {/* Reality rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 680 }}>
        {[
          { op: row1Op, text: "Every company says they're \u201cdata-driven\u201d" },
          { op: row2Op, text: "Most are stuck — tons of data, very little clarity" },
          { op: row3Op, text: "The cycle repeats: collect more, understand less" },
        ].map((r, i) => (
          <div key={i} style={{
            opacity: r.op, display: "flex", alignItems: "center", gap: 16,
            background: "#fff", borderRadius: 14, padding: "14px 22px",
            border: "1.5px solid rgba(30,45,90,0.08)", boxShadow: "0 3px 12px rgba(0,0,60,0.07)",
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: RED, flexShrink: 0 }}/>
            <div style={{ fontSize: 18, fontWeight: 600, color: NAVY, fontFamily: FONT }}>{r.text}</div>
          </div>
        ))}
      </div>

      <div style={{ opacity: subOp, transform: `translateY(${subY}px)`, textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 500, color: "rgba(30,45,90,0.5)", fontFamily: FONT }}>
          Today you&apos;ll learn how to break that cycle.
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene D: Payoff (360–480f) ──────────────────────────────────────────────
// "The companies winning aren't collecting the most data — they're the ones building strategies"
function SceneD({ frame, fps }) {
  const card1Sp = spring({ frame: frame - 8,  fps, config: { damping: 18, stiffness: 130 } });
  const card1Op = fi(frame, 8, 28, 0, 1);
  const card2Sp = spring({ frame: frame - 38, fps, config: { damping: 18, stiffness: 130 } });
  const card2Op = fi(frame, 38, 58, 0, 1);
  const payOp   = fi(frame, 72, 92, 0, 1);
  const payY    = fi(frame, 72, 92, 14, 0);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 36 }}>
      <div style={{ display: "flex", gap: 32, alignItems: "stretch" }}>
        {/* Losing side */}
        <div style={{ opacity: card1Op, transform: `scale(${card1Sp})` }}>
          <div style={{
            background: "#fff", borderRadius: 20, padding: "28px 32px", width: 320,
            border: "1.5px solid rgba(30,45,90,0.1)", boxShadow: "0 6px 28px rgba(0,0,60,0.09)",
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(30,45,90,0.35)", fontFamily: FONT, letterSpacing: "2px", marginBottom: 12 }}>COLLECTING MORE DATA</div>
            <div style={{ fontSize: 36, marginBottom: 14 }}>🗄️</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["More reports", "More storage", "More confusion"].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "rgba(30,45,90,0.5)", fontFamily: FONT }}>
                  <span style={{ color: "rgba(30,45,90,0.3)", fontWeight: 700 }}>—</span> {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div style={{ display: "flex", alignItems: "center", opacity: card1Op }}>
          <div style={{ fontSize: 32, color: RED }}>→</div>
        </div>

        {/* Winning side */}
        <div style={{ opacity: card2Op, transform: `scale(${card2Sp})` }}>
          <div style={{
            background: `linear-gradient(135deg, ${NAVY}, #2d4a8a)`,
            borderRadius: 20, padding: "28px 32px", width: 320,
            boxShadow: "0 12px 48px rgba(30,45,90,0.35)",
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", fontFamily: FONT, letterSpacing: "2px", marginBottom: 12 }}>BUILDING A STRATEGY</div>
            <div style={{ fontSize: 36, marginBottom: 14 }}>⚡</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["Clear direction", "Trusted data", "Real outcomes"].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, color: "rgba(255,255,255,0.8)", fontFamily: FONT, fontWeight: 600 }}>
                  <span style={{ color: PINK, fontWeight: 700 }}>✓</span> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ opacity: payOp, transform: `translateY(${payY}px)`, textAlign: "center", maxWidth: 800 }}>
        <div style={{ fontSize: 32, fontWeight: 800, color: NAVY, fontFamily: FONT, lineHeight: 1.3 }}>
          The winners aren&apos;t collecting the most data.
          <br/>
          <span style={{ color: RED }}>They&apos;re turning information into action.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
const SA = 120, SB = 120, SC = 120, SD = 120;

export const EnterpriseDataIntro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Sequence from={0} durationInFrames={SA}>
        <SceneA frame={frame} fps={fps}/>
      </Sequence>
      <Sequence from={SA} durationInFrames={SB}>
        <SceneB frame={frame - SA} fps={fps}/>
      </Sequence>
      <Sequence from={SA + SB} durationInFrames={SC}>
        <SceneC frame={frame - SA - SB} fps={fps}/>
      </Sequence>
      <Sequence from={SA + SB + SC} durationInFrames={SD}>
        <SceneD frame={frame - SA - SB - SC} fps={fps}/>
      </Sequence>
    </AbsoluteFill>
  );
};
