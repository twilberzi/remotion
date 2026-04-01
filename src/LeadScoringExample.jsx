/**
 * Lead Scoring Example Scene (from GTM Explained series)
 * Sarah, VP of Marketing, 500-person company. 3 behavioral signals score in live.
 * Attended webinar (+15), Downloaded ROI calculator (+20), Visited pricing ×2 (+15) = 50 pts.
 * Score ring fills on the right, "route to sales" CTA appears.
 * Duration: ~390 frames @ 30fps
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

const NAVY = "#1e2d5a";
const RED  = "#e8182e";
const PINK = "#c2185b";
const FONT = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
}

export function LeadScoringExample() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const behavRows = [
    { label: "Attended webinar last week",          pts: 15, delay: 45  },
    { label: "Downloaded ROI calculator yesterday", pts: 20, delay: 82  },
    { label: "Visited pricing page (×2 today)",     pts: 15, delay: 119 },
  ];

  const fullTotal = 50;
  const scoreFill = fi(frame, 200, 270, 0, fullTotal);
  const ringOp    = fi(frame, 198, 215, 0, 1);
  const ringSp    = spring({ frame: frame - 198, fps, config: { damping: 30, stiffness: 140 } });
  const ctaOp     = fi(frame, 285, 305, 0, 1);
  const ctaY      = fi(frame, 285, 305, 14, 0);
  const cardSp    = spring({ frame: frame - 0, fps, config: { damping: 30, stiffness: 130 } });
  const cardOp    = fi(frame, 0, 20, 0, 1);

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 80 }}>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 650, transform: `scale(${cardSp})`, opacity: cardOp }}>
        <div style={{ background: "#fff", borderRadius: 18, padding: "24px 32px", border: "2px solid rgba(232,24,46,0.15)", boxShadow: "0 6px 28px rgba(30,45,90,0.1)", marginBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(30,45,90,0.55)", fontFamily: FONT, letterSpacing: "1.2px", marginBottom: 10 }}>INBOUND LEAD · SCORING NOW</div>
          <div style={{ fontSize: 36, fontWeight: 800, color: NAVY, fontFamily: FONT }}>Sarah</div>
          <div style={{ fontSize: 19, color: "rgba(30,45,90,0.7)", fontFamily: FONT, marginTop: 6 }}>VP of Marketing · 500-person company · Target industry</div>
        </div>

        <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(30,45,90,0.55)", fontFamily: FONT, letterSpacing: "1.2px", marginBottom: 2, paddingLeft: 4, opacity: fi(frame, 38, 52, 0, 1) }}>BEHAVIORAL SIGNALS</div>

        {behavRows.map((row, i) => {
          const rowOp = fi(frame, row.delay, row.delay + 16, 0, 1);
          const rowX  = fi(frame, row.delay, row.delay + 16, -20, 0);
          const ptsSp = spring({ frame: frame - row.delay - 8, fps, config: { damping: 30, stiffness: 200 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: "1.5px solid rgba(232,24,46,0.1)", borderRadius: 14, padding: "18px 24px", boxShadow: "0 2px 10px rgba(232,24,46,0.07)", opacity: rowOp, transform: `translateX(${rowX}px)` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: `linear-gradient(135deg, ${RED}, ${PINK})`, flexShrink: 0 }}/>
                <div style={{ fontSize: 20, fontWeight: 600, color: NAVY, fontFamily: FONT }}>{row.label}</div>
              </div>
              <div style={{ padding: "7px 16px", borderRadius: 6, background: RED, fontSize: 16, fontWeight: 600, color: "white", fontFamily: FONT, transform: `scale(${ptsSp})`, whiteSpace: "nowrap" }}>+{row.pts} pts</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <div style={{ opacity: ringOp, transform: `scale(${ringSp})`, position: "relative", width: 280, height: 280 }}>
          <svg width={280} height={280} style={{ position: "absolute", top: 0, left: 0 }}>
            <circle cx={140} cy={140} r={112} fill="none" stroke="rgba(30,45,90,0.08)" strokeWidth={16}/>
            <circle cx={140} cy={140} r={112} fill="none" stroke="url(#scoreGrad)" strokeWidth={16} strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 112}`}
              strokeDashoffset={`${2 * Math.PI * 112 * (1 - scoreFill / 100)}`}
              transform="rotate(-90 140 140)"
            />
            <defs>
              <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={RED}/>
                <stop offset="100%" stopColor={PINK}/>
              </linearGradient>
            </defs>
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(30,45,90,0.6)", fontFamily: FONT, letterSpacing: "1px" }}>LEAD SCORE</div>
            <div style={{ fontSize: 76, fontWeight: 900, color: NAVY, fontFamily: FONT, lineHeight: 1 }}>{Math.round(scoreFill)}</div>
            <div style={{ fontSize: 19, fontWeight: 600, color: "rgba(30,45,90,0.6)", fontFamily: FONT }}>/ 100</div>
          </div>
        </div>

        <div style={{ opacity: ringOp, transform: `scale(${ringSp})`, background: "#fff", borderRadius: 14, padding: "18px 28px", border: "1.5px solid rgba(30,45,90,0.08)", boxShadow: "0 4px 16px rgba(0,0,60,0.08)", textAlign: "center", width: 280 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "rgba(30,45,90,0.6)", fontFamily: FONT, marginBottom: 6 }}>15 + 20 + 15</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: NAVY, fontFamily: FONT }}>= 50 points total</div>
        </div>

        <div style={{ opacity: ctaOp, transform: `translateY(${ctaY}px)`, fontSize: 19, fontWeight: 600, color: "rgba(30,45,90,0.65)", fontFamily: FONT, textAlign: "center", maxWidth: 280 }}>
          Hits your threshold —{" "}
          <strong style={{ color: RED }}>route to sales immediately.</strong>
        </div>
      </div>

    </AbsoluteFill>
  );
}
