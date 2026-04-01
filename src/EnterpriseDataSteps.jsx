import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence } from "remotion";

const NAVY = "#1e2d5a";
const RED  = "#e8182e";
const PINK = "#c2185b";
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, s, e, f, t) {
  return interpolate(frame, [s, e], [f, t], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

const STEPS = [
  {
    num: "01",
    title: "Assess Your Current State",
    bullets: ["Audit existing data sources & systems", "Identify silos & quality gaps", "Map data ownership across teams"],
  },
  {
    num: "02",
    title: "Define Business Objectives",
    bullets: ["Tie data goals to revenue outcomes", "Prioritize use cases with stakeholders", "Set measurable KPIs for data value"],
  },
  {
    num: "03",
    title: "Design Your Architecture",
    bullets: ["Choose cloud, on-prem, or hybrid", "Define data models & schema standards", "Plan for scale & performance"],
  },
  {
    num: "04",
    title: "Establish Governance",
    bullets: ["Assign data owners per domain", "Create policies for access & compliance", "Build your business glossary"],
  },
  {
    num: "05",
    title: "Build Integration Pipelines",
    bullets: ["Connect systems with ETL / API layers", "Implement real-time & batch flows", "Validate data at every handoff"],
  },
  {
    num: "06",
    title: "Enable Analytics & BI",
    bullets: ["Deploy self-service dashboards", "Train teams on data literacy", "Align definitions across departments"],
  },
  {
    num: "07",
    title: "Prepare for AI & ML",
    bullets: ["Curate clean, labeled data sets", "Build feature stores & model pipelines", "Establish feedback loops for improvement"],
  },
];

// ─── Scene: vertical timeline, one step per scene ────────────────────────────
// Shows all steps completed so far + animates the current one in
function StepScene({ frame, fps, stepIndex }) {
  const currentStep = STEPS[stepIndex];
  const prevSteps = STEPS.slice(0, stepIndex);

  // Current step entrance
  const stepSp = spring({ frame: frame - 10, fps, config: { damping: 18, stiffness: 130 } });
  const stepOp = fi(frame, 10, 30, 0, 1);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 60 }}>

      {/* Left: Progress track */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0, alignItems: "center" }}>
        {STEPS.map((s, i) => {
          const isDone = i < stepIndex;
          const isCurrent = i === stepIndex;
          const isFuture = i > stepIndex;
          const dotOp = isFuture ? 0.2 : 1;

          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* Dot */}
              <div style={{
                width: isCurrent ? 32 : 22,
                height: isCurrent ? 32 : 22,
                borderRadius: "50%",
                background: isCurrent
                  ? `linear-gradient(135deg, ${RED}, ${PINK})`
                  : isDone
                    ? NAVY
                    : "rgba(30,45,90,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: isCurrent ? `0 0 0 6px rgba(232,24,46,0.15)` : "none",
                opacity: dotOp,
                transition: "all 0.2s",
                zIndex: 2,
              }}>
                {isDone && (
                  <div style={{ fontSize: 11, color: "white", fontWeight: 900 }}>✓</div>
                )}
                {isCurrent && (
                  <div style={{ fontSize: 13, color: "white", fontWeight: 900 }}>{i + 1}</div>
                )}
              </div>
              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div style={{
                  width: 2, height: 28,
                  background: i < stepIndex
                    ? NAVY
                    : "rgba(30,45,90,0.12)",
                }}/>
              )}
            </div>
          );
        })}
      </div>

      {/* Right: Current step detail card */}
      <div style={{ width: 640 }}>
        <div style={{ opacity: stepOp, transform: `scale(${stepSp})`, transformOrigin: "left center" }}>
          <div style={{
            background: "#fff",
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: "0 12px 48px rgba(0,0,60,0.12)",
            border: "1.5px solid rgba(30,45,90,0.07)",
          }}>
            {/* Header */}
            <div style={{
              background: `linear-gradient(135deg, ${RED}, ${PINK})`,
              padding: "24px 32px",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", fontFamily: FONT, letterSpacing: "2.5px", marginBottom: 6 }}>
                STEP {currentStep.num}
              </div>
              <div style={{ fontSize: 30, fontWeight: 900, color: "white", fontFamily: FONT, lineHeight: 1.2 }}>
                {currentStep.title}
              </div>
            </div>

            {/* Bullets */}
            <div style={{ padding: "20px 32px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
              {currentStep.bullets.map((b, i) => {
                const delay = 38 + i * 16;
                return (
                  <div key={i} style={{
                    opacity: fi(frame, delay, delay + 16, 0, 1),
                    transform: `translateX(${fi(frame, delay, delay + 16, -12, 0)}px)`,
                    display: "flex", alignItems: "center", gap: 14,
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: `linear-gradient(135deg, ${RED}, ${PINK})`, flexShrink: 0 }}/>
                    <div style={{ fontSize: 17, fontWeight: 600, color: NAVY, fontFamily: FONT }}>{b}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step label below card */}
        <div style={{
          marginTop: 14, opacity: fi(frame, 30, 45, 0, 1),
          fontSize: 13, fontWeight: 600, color: "rgba(30,45,90,0.4)", fontFamily: FONT,
          letterSpacing: "0.5px",
        }}>
          Step {stepIndex + 1} of {STEPS.length}
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── Final Scene: Full timeline visible ──────────────────────────────────────
function AllStepsScene({ frame, fps }) {
  const titleOp = fi(frame, 0, 18, 0, 1);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <div style={{ opacity: titleOp, textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(30,45,90,0.4)", fontFamily: FONT, letterSpacing: "2.5px", marginBottom: 6 }}>IMPLEMENTATION ROADMAP</div>
        <div style={{ fontSize: 34, fontWeight: 900, color: NAVY, fontFamily: FONT }}>
          7 steps to a <span style={{ color: RED }}>data-driven</span> organization.
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", maxWidth: 1300 }}>
        {STEPS.map((s, i) => {
          const delay = 24 + i * 10;
          const sp = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 150 } });
          const op = fi(frame, delay, delay + 16, 0, 1);
          return (
            <div key={i} style={{ opacity: op, transform: `scale(${sp})` }}>
              <div style={{
                background: "#fff", borderRadius: 18,
                border: "1.5px solid rgba(30,45,90,0.08)",
                boxShadow: "0 4px 18px rgba(0,0,60,0.08)",
                padding: "16px 22px", width: 280,
                display: "flex", alignItems: "center", gap: 16,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                  background: i % 2 === 0 ? `linear-gradient(135deg, ${RED}, ${PINK})` : NAVY,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 900, color: "white", fontFamily: FONT,
                }}>{s.num}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, fontFamily: FONT, lineHeight: 1.2 }}>{s.title}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

const STEP_DUR = 90;
const ALL_DUR = 150;

export const EnterpriseDataSteps = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {STEPS.map((_, i) => (
        <Sequence key={i} from={i * STEP_DUR} durationInFrames={STEP_DUR}>
          <StepScene frame={frame - i * STEP_DUR} fps={fps} stepIndex={i} />
        </Sequence>
      ))}
      <Sequence from={STEPS.length * STEP_DUR} durationInFrames={ALL_DUR}>
        <AllStepsScene frame={frame - STEPS.length * STEP_DUR} fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};
