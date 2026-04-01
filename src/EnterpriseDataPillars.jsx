import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence } from "remotion";

const NAVY = "#1e2d5a";
const RED  = "#e8182e";
const PINK = "#c2185b";
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, s, e, f, t) {
  return interpolate(frame, [s, e], [f, t], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

const PILLARS = [
  {
    num: "01",
    name: "Data Governance",
    city: "City laws & zoning",
    emoji: "⚖️",
    bullets: [
      "Who owns which data sets",
      "Policies for access & security",
      "Accountability structures across teams",
      "Compliance & regulatory alignment",
    ],
    grad: `linear-gradient(135deg, ${RED}, ${PINK})`,
  },
  {
    num: "02",
    name: "Data Architecture",
    city: "City infrastructure",
    emoji: "🏗️",
    bullets: [
      "How systems are designed & connected",
      "Data models & schema standards",
      "Cloud, on-prem, or hybrid layout",
      "Scalability & performance planning",
    ],
    grad: `linear-gradient(135deg, ${NAVY}, #2d4a8a)`,
  },
  {
    num: "03",
    name: "Integration & Orchestration",
    city: "Roads & transport networks",
    emoji: "🔗",
    bullets: [
      "How data moves between systems",
      "ETL / ELT pipelines",
      "API standards & event streaming",
      "Real-time vs batch processing",
    ],
    grad: `linear-gradient(135deg, ${RED}, ${PINK})`,
  },
  {
    num: "04",
    name: "Data Quality",
    city: "Clean water & public health",
    emoji: "✅",
    bullets: [
      "Accuracy, completeness & consistency",
      "Automated quality checks",
      "Deduplication & standardization",
      "Trust scores for critical data sets",
    ],
    grad: `linear-gradient(135deg, ${NAVY}, #2d4a8a)`,
  },
  {
    num: "05",
    name: "Metadata & Lineage",
    city: "Maps & street signs",
    emoji: "🗺️",
    bullets: [
      "What every data element means",
      "Where data comes from & how it changes",
      "Business glossary & taxonomy",
      "Impact analysis for changes",
    ],
    grad: `linear-gradient(135deg, ${RED}, ${PINK})`,
  },
  {
    num: "06",
    name: "Analytics & Business Intelligence",
    city: "City hall & reporting",
    emoji: "📊",
    bullets: [
      "Self-service dashboards & reports",
      "KPIs tied to business outcomes",
      "Data literacy across departments",
      "Consistent definitions org-wide",
    ],
    grad: `linear-gradient(135deg, ${NAVY}, #2d4a8a)`,
  },
  {
    num: "07",
    name: "AI & ML Readiness",
    city: "Smart city infrastructure",
    emoji: "🤖",
    bullets: [
      "Clean, labeled training data",
      "Feature stores & model pipelines",
      "Governance for AI outputs",
      "Feedback loops for continuous learning",
    ],
    grad: `linear-gradient(135deg, ${RED}, ${PINK})`,
  },
];

// ─── Single Pillar Scene ──────────────────────────────────────────────────────
function PillarScene({ frame, fps, pillar, index }) {
  const headerSp = spring({ frame: frame - 8, fps, config: { damping: 18, stiffness: 130 } });
  const headerOp = fi(frame, 8, 28, 0, 1);
  const cityOp   = fi(frame, 28, 44, 0, 1);
  const cityY    = fi(frame, 28, 44, 8, 0);

  const isRed = index % 2 === 0;

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>
      {/* Header card */}
      <div style={{ opacity: headerOp, transform: `scale(${headerSp})` }}>
        <div style={{
          background: pillar.grad,
          borderRadius: 24, padding: "28px 60px",
          boxShadow: isRed ? "0 16px 60px rgba(232,24,46,0.3)" : "0 16px 60px rgba(30,45,90,0.35)",
          textAlign: "center", minWidth: 560,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.55)", fontFamily: FONT, letterSpacing: "2.5px", marginBottom: 10 }}>
            PILLAR {pillar.num}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginBottom: 4 }}>
            <span style={{ fontSize: 44 }}>{pillar.emoji}</span>
            <div style={{ fontSize: 36, fontWeight: 900, color: "white", fontFamily: FONT }}>{pillar.name}</div>
          </div>
        </div>
      </div>

      {/* City analogy badge */}
      <div style={{ opacity: cityOp, transform: `translateY(${cityY}px)` }}>
        <div style={{
          background: "#fff", borderRadius: 99, padding: "8px 22px",
          border: "1.5px solid rgba(30,45,90,0.1)", boxShadow: "0 2px 10px rgba(0,0,60,0.07)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 16 }}>🏙️</span>
          <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(30,45,90,0.55)", fontFamily: FONT }}>
            Think of it as: <strong style={{ color: NAVY }}>{pillar.city}</strong>
          </div>
        </div>
      </div>

      {/* Bullet rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 640 }}>
        {pillar.bullets.map((b, i) => {
          const delay = 52 + i * 16;
          return (
            <div key={i} style={{
              opacity: fi(frame, delay, delay + 16, 0, 1),
              transform: `translateX(${fi(frame, delay, delay + 16, -14, 0)}px)`,
            }}>
              <div style={{
                background: "#fff", borderRadius: 14, padding: "13px 22px",
                border: "1.5px solid rgba(30,45,90,0.08)", boxShadow: "0 3px 12px rgba(0,0,60,0.07)",
                display: "flex", alignItems: "center", gap: 14,
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: isRed ? `linear-gradient(135deg, ${RED}, ${PINK})` : NAVY,
                  flexShrink: 0,
                }}/>
                <div style={{ fontSize: 17, fontWeight: 600, color: NAVY, fontFamily: FONT }}>{b}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

// ─── Wrap Scene: all 7 pillar cards in a grid ────────────────────────────────
function WrapScene({ frame, fps }) {
  const titleOp = fi(frame, 0, 18, 0, 1);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>
      <div style={{ opacity: titleOp, textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(30,45,90,0.4)", fontFamily: FONT, letterSpacing: "2.5px", marginBottom: 8 }}>THE 7 PILLARS</div>
        <div style={{ fontSize: 36, fontWeight: 900, color: NAVY, fontFamily: FONT }}>
          Your complete <span style={{ color: RED }}>data strategy</span> foundation.
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center", maxWidth: 1200 }}>
        {PILLARS.map((p, i) => {
          const delay = 28 + i * 12;
          const sp = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 150 } });
          const op = fi(frame, delay, delay + 16, 0, 1);
          return (
            <div key={i} style={{ opacity: op, transform: `scale(${sp})` }}>
              <div style={{
                background: p.grad, borderRadius: 18, padding: "18px 24px", width: 240,
                boxShadow: i % 2 === 0 ? "0 8px 28px rgba(232,24,46,0.22)" : "0 8px 28px rgba(30,45,90,0.22)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.5)", fontFamily: FONT, letterSpacing: "2px", marginBottom: 8 }}>PILLAR {p.num}</div>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{p.emoji}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "white", fontFamily: FONT, lineHeight: 1.2 }}>{p.name}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

// Each pillar gets 120 frames, wrap gets 150
const PILLAR_DUR = 120;
const WRAP_DUR = 150;
const TOTAL = PILLAR_DUR * 7 + WRAP_DUR; // 990

export const EnterpriseDataPillars = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {PILLARS.map((pillar, i) => (
        <Sequence key={i} from={i * PILLAR_DUR} durationInFrames={PILLAR_DUR}>
          <PillarScene frame={frame - i * PILLAR_DUR} fps={fps} pillar={pillar} index={i} />
        </Sequence>
      ))}
      <Sequence from={PILLAR_DUR * 7} durationInFrames={WRAP_DUR}>
        <WrapScene frame={frame - PILLAR_DUR * 7} fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};
