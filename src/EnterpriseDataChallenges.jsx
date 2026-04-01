import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence } from "remotion";

const NAVY = "#1e2d5a";
const RED  = "#e8182e";
const PINK = "#c2185b";
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, s, e, f, t) {
  return interpolate(frame, [s, e], [f, t], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

const CHALLENGES = [
  {
    num: "01",
    problem: "Data Silos",
    problemDesc: "Teams hoard data in isolated systems. Marketing doesn't talk to Sales. Finance doesn't share with Product.",
    solution: "Unified Data Platform",
    solutionDesc: "Centralize data access with a shared lake or warehouse — one source of truth, role-based permissions.",
    vignette: "\"Sales can't see Marketing attribution data. The deal closes and nobody knows why.\"",
  },
  {
    num: "02",
    problem: "Poor Data Quality",
    problemDesc: "Duplicate records, missing fields, inconsistent formats. Reports contradict each other. Nobody trusts the numbers.",
    solution: "Automated Quality Gates",
    solutionDesc: "Validation rules at ingestion, data profiling dashboards, and a data steward role per domain.",
    vignette: "\"We have 3 different revenue numbers depending on which dashboard you open.\"",
  },
  {
    num: "03",
    problem: "No Data Governance",
    problemDesc: "No one knows who owns the customer table. Access is ad hoc. Compliance audits are a nightmare.",
    solution: "Governance Framework",
    solutionDesc: "Defined ownership, access policies, a business glossary, and documented data lineage.",
    vignette: "\"We couldn't answer the auditor's questions because we didn't know where our data came from.\"",
  },
  {
    num: "04",
    problem: "Skill Gaps",
    problemDesc: "Analysts spend 80% of their time cleaning data. Business teams can't self-serve. Decisions wait on IT.",
    solution: "Data Literacy Program",
    solutionDesc: "Train business users to self-serve. Embed data champions in each team. Invest in analyst tooling.",
    vignette: "\"Every report request goes through the same 2-person data team. There's always a 2-week backlog.\"",
  },
  {
    num: "05",
    problem: "Technology Sprawl",
    problemDesc: "Too many disconnected tools. Nobody knows which system is authoritative. Integration is a full-time job.",
    solution: "Rationalized Tech Stack",
    solutionDesc: "Audit & consolidate tools. Define the authoritative system per domain. Standardize integration patterns.",
    vignette: "\"We pay for 6 tools that all do the same thing — and none of them talk to each other.\"",
  },
  {
    num: "06",
    problem: "No Executive Buy-in",
    problemDesc: "Data initiatives die in mid-level committees. No budget, no mandate, no accountability at the top.",
    solution: "Executive Sponsorship",
    solutionDesc: "Appoint a Chief Data Officer or equivalent. Tie data KPIs to company OKRs. Make data a board-level topic.",
    vignette: "\"The data team built a great platform. Leadership never used it and budget was cut in Q2.\"",
  },
];

// ─── Challenge Scene: problem left, solution right ───────────────────────────
function ChallengeScene({ frame, fps, challenge }) {
  // Problem card
  const problemSp = spring({ frame: frame - 8, fps, config: { damping: 18, stiffness: 130 } });
  const problemOp = fi(frame, 8, 28, 0, 1);

  // Vignette (quote)
  const vigOp = fi(frame, 42, 60, 0, 1);
  const vigY  = fi(frame, 42, 60, 10, 0);

  // Arrow
  const arrowOp = fi(frame, 62, 78, 0, 1);

  // Solution card
  const solutionSp = spring({ frame: frame - 78, fps, config: { damping: 18, stiffness: 130 } });
  const solutionOp = fi(frame, 78, 98, 0, 1);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>

      {/* Challenge number label */}
      <div style={{ opacity: fi(frame, 0, 16, 0, 1), fontSize: 12, fontWeight: 700, color: "rgba(30,45,90,0.38)", fontFamily: FONT, letterSpacing: "2.5px" }}>
        CHALLENGE {challenge.num}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        {/* Problem card */}
        <div style={{ opacity: problemOp, transform: `scale(${problemSp})` }}>
          <div style={{ width: 400, borderRadius: 22, overflow: "hidden", boxShadow: "0 12px 44px rgba(232,24,46,0.25)" }}>
            <div style={{ background: `linear-gradient(135deg, ${RED}, ${PINK})`, padding: "22px 28px 18px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)", fontFamily: FONT, letterSpacing: "2px", marginBottom: 8 }}>THE PROBLEM</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "white", fontFamily: FONT }}>{challenge.problem}</div>
            </div>
            <div style={{ background: "#fff", padding: "18px 28px" }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: "rgba(30,45,90,0.65)", fontFamily: FONT, lineHeight: 1.5 }}>{challenge.problemDesc}</div>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div style={{ opacity: arrowOp, fontSize: 36, color: NAVY }}>→</div>

        {/* Solution card */}
        <div style={{ opacity: solutionOp, transform: `scale(${solutionSp})` }}>
          <div style={{ width: 400, borderRadius: 22, overflow: "hidden", boxShadow: "0 12px 44px rgba(30,45,90,0.28)" }}>
            <div style={{ background: `linear-gradient(135deg, ${NAVY}, #2d4a8a)`, padding: "22px 28px 18px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.5)", fontFamily: FONT, letterSpacing: "2px", marginBottom: 8 }}>THE SOLUTION</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "white", fontFamily: FONT }}>{challenge.solution}</div>
            </div>
            <div style={{ background: "#fff", padding: "18px 28px" }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: "rgba(30,45,90,0.65)", fontFamily: FONT, lineHeight: 1.5 }}>{challenge.solutionDesc}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Vignette quote */}
      <div style={{ opacity: vigOp, transform: `translateY(${vigY}px)`, maxWidth: 860, textAlign: "center" }}>
        <div style={{
          background: "#fff", borderRadius: 14, padding: "14px 24px",
          border: "1.5px solid rgba(30,45,90,0.08)", boxShadow: "0 3px 12px rgba(0,0,60,0.07)",
          fontSize: 15, fontWeight: 500, color: "rgba(30,45,90,0.55)", fontFamily: FONT, fontStyle: "italic",
        }}>
          {challenge.vignette}
        </div>
      </div>

    </AbsoluteFill>
  );
}

// ─── Closing Scene ─────────────────────────────────────────────────────────────
function ClosingScene({ frame, fps }) {
  const sp  = spring({ frame: frame - 8, fps, config: { damping: 18, stiffness: 130 } });
  const op  = fi(frame, 8, 28, 0, 1);
  const subOp = fi(frame, 52, 70, 0, 1);
  const subY  = fi(frame, 52, 70, 12, 0);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 }}>
      <div style={{ opacity: op, transform: `scale(${sp})`, textAlign: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(30,45,90,0.38)", fontFamily: FONT, letterSpacing: "2.5px", marginBottom: 14 }}>THE BOTTOM LINE</div>
        <div style={{
          background: `linear-gradient(135deg, ${RED}, ${PINK})`,
          borderRadius: 24, padding: "36px 72px",
          boxShadow: "0 20px 64px rgba(232,24,46,0.3)",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 40, fontWeight: 900, color: "white", fontFamily: FONT, lineHeight: 1.2 }}>
            Every challenge has a solution.
            <br/>
            <span style={{ opacity: 0.8, fontWeight: 700, fontSize: 28 }}>The common thread: strategy, ownership, and commitment.</span>
          </div>
        </div>
      </div>

      <div style={{ opacity: subOp, transform: `translateY(${subY}px)`, textAlign: "center", maxWidth: 860 }}>
        <div style={{ fontSize: 20, fontWeight: 500, color: "rgba(30,45,90,0.55)", fontFamily: FONT }}>
          Companies that solve these challenges don&apos;t just have better data —{" "}
          <strong style={{ color: NAVY }}>they make better decisions, faster.</strong>
        </div>
      </div>
    </AbsoluteFill>
  );
}

const CHALLENGE_DUR = 110;
const CLOSING_DUR = 120;

export const EnterpriseDataChallenges = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      {CHALLENGES.map((c, i) => (
        <Sequence key={i} from={i * CHALLENGE_DUR} durationInFrames={CHALLENGE_DUR}>
          <ChallengeScene frame={frame - i * CHALLENGE_DUR} fps={fps} challenge={c} />
        </Sequence>
      ))}
      <Sequence from={CHALLENGES.length * CHALLENGE_DUR} durationInFrames={CLOSING_DUR}>
        <ClosingScene frame={frame - CHALLENGES.length * CHALLENGE_DUR} fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};
