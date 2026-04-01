import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Img,
  staticFile,
} from "remotion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faBuilding,
  faUsers,
  faMoneyBillWave,
  faChartBar,
  faVideo,
  faEnvelope,
  faEnvelopeOpen,
} from "@fortawesome/free-solid-svg-icons";

const NAVY  = "#1e2a5a";
const RED   = "#e8182e";
const PINK  = "#c2185b";
const LIGHT = "#f8faff";
const FONT  = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ─── Explained-style card ─────────────────────────────────────────────────────
function ExplainedCard({ label, faIcon, points, frame, delay }) {
  const sp    = spring({ frame: frame - delay, fps: 30, config: { damping: 14, stiffness: 180 } });
  const op    = fi(frame, delay, delay + 10, 0, 1);
  const ptsSp = spring({ frame: frame - delay - 12, fps: 30, config: { damping: 10, stiffness: 260 } });
  const ptsOp = fi(frame, delay + 12, delay + 22, 0, 1);

  const isNeg    = points < 0;
  const ptsLabel = isNeg ? `${points}` : `+${points}`;

  return (
    <div style={{
      transform: `scale(${sp})`,
      opacity: op,
      transformOrigin: "center bottom",
      position: "relative",
    }}>
      {/* Card */}
      <div style={{
        width: 200, height: 220,
        background: "white",
        borderRadius: 20,
        boxShadow: "0 6px 28px rgba(0,0,60,0.10)",
        position: "relative",
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        alignItems: "center",
        padding: "22px 16px 18px",
        gap: 18,
      }}>
        {/* Red-pink gradient right + bottom edge accents */}
        <div style={{
          position: "absolute",
          right: 0, top: "30%", bottom: 0, width: 4,
          background: `linear-gradient(180deg, transparent, ${RED} 40%, ${PINK})`,
          borderRadius: "0 0 20px 0",
        }}/>
        <div style={{
          position: "absolute",
          bottom: 0, left: "30%", right: 0, height: 4,
          background: `linear-gradient(90deg, transparent, ${RED} 40%, ${PINK})`,
          borderRadius: "0 0 20px 0",
        }}/>

        {/* Label */}
        <div style={{
          fontSize: 15, fontWeight: 700, color: NAVY,
          fontFamily: FONT, textAlign: "center",
          lineHeight: 1.3, whiteSpace: "pre-line",
          zIndex: 1,
        }}>{label}</div>

        {/* Font Awesome icon */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          flex: 1, zIndex: 1,
        }}>
          <FontAwesomeIcon icon={faIcon} style={{ width: 72, height: 72, color: NAVY }}/>
        </div>
      </div>

      {/* Points badge */}
      <div style={{
        position: "absolute",
        right: -22, bottom: -22,
        width: 72, height: 72, borderRadius: "50%",
        background: isNeg
          ? `linear-gradient(135deg, ${NAVY}, #3a4880)`
          : `linear-gradient(135deg, ${RED}, ${PINK})`,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        boxShadow: isNeg
          ? "0 4px 16px rgba(30,42,90,0.4)"
          : "0 4px 16px rgba(200,0,80,0.4)",
        transform: `scale(${ptsSp})`,
        opacity: ptsOp,
        zIndex: 3,
      }}>
        <div style={{
          fontSize: 17, fontWeight: 900, color: "white",
          fontFamily: FONT, lineHeight: 1,
        }}>{ptsLabel}</div>
        <div style={{
          fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.85)",
          fontFamily: FONT, letterSpacing: "0.3px",
        }}>points</div>
      </div>
    </div>
  );
}

// ─── Row label (vertical) ─────────────────────────────────────────────────────
function RowLabel({ text, color, frame, delay }) {
  const op = fi(frame, delay, delay + 20, 0, 1);
  const x  = fi(frame, delay, delay + 20, 12, 0);
  return (
    <div style={{
      writingMode: "vertical-rl",
      textOrientation: "mixed",
      transform: `rotate(180deg) translateX(${x}px)`,
      opacity: op,
      fontSize: 18, fontWeight: 900, color,
      fontFamily: FONT, letterSpacing: "4px",
      textTransform: "uppercase",
      marginRight: 36,
      alignSelf: "center",
    }}>{text}</div>
  );
}

// ─── Data rows ────────────────────────────────────────────────────────────────
const DEMO_ROW = [
  { label: "Job Title =\nVP or Higher",      faIcon: faBriefcase,      points:  20 },
  { label: "Company Industry =\nTechnology", faIcon: faBuilding,       points:  10 },
  { label: "Company Size >\n100 Employees",  faIcon: faUsers,          points:   5 },
  { label: "Company Revenue\n< $1 Million",  faIcon: faMoneyBillWave,  points: -10 },
];

const BEHAV_ROW = [
  { label: "Visited\nPricing Page",          faIcon: faChartBar,       points:  25 },
  { label: "Watched\nProduct Video",         faIcon: faVideo,          points:  20 },
  { label: "Opened\nMarketing Email",        faIcon: faEnvelopeOpen,   points:   5 },
  { label: "Unsubscribed\nFrom Emails",      faIcon: faEnvelope,       points: -15 },
];

// ─── Scene ────────────────────────────────────────────────────────────────────
function LeadScoringScene({ frame }) {
  return (
    <AbsoluteFill style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 80, paddingTop: 30,
    }}>
      {/* Demographics row */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <RowLabel text="Demographics" color={RED} frame={frame} delay={0}/>
        <div style={{ display: "flex", gap: 48 }}>
          {DEMO_ROW.map((item, i) => (
            <ExplainedCard key={i} {...item} frame={frame} delay={10 + i * 14}/>
          ))}
        </div>
      </div>

      {/* Behaviors row */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <RowLabel text="Behaviors" color={NAVY} frame={frame} delay={62}/>
        <div style={{ display: "flex", gap: 48 }}>
          {BEHAV_ROW.map((item, i) => (
            <ExplainedCard key={i} {...item} frame={frame} delay={72 + i * 14}/>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
}

function SceneTitle({ frame }) {
  const op = fi(frame, 0, 18, 0, 1);
  const y  = fi(frame, 0, 18, 18, 0);
  return (
    <div style={{
      position: "absolute", top: 48, left: 0, right: 0,
      textAlign: "center", opacity: op,
      transform: `translateY(${y}px)`,
      fontSize: 40, fontWeight: 900, color: NAVY, fontFamily: FONT,
      letterSpacing: "-0.5px",
    }}>
      Sample Lead Scoring Model
    </div>
  );
}

export const BuyerIntentScore = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: LIGHT, fontFamily: FONT }}>
      <Img
        src={staticFile("explained/Background.png")}
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover", opacity: 0.6,
        }}
      />
      <SceneTitle frame={frame}/>
      <LeadScoringScene frame={frame}/>
    </AbsoluteFill>
  );
};
