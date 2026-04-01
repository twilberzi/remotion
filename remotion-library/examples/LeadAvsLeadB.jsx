/**
 * Lead A vs Lead B Scene (from GTM Explained series)
 * Two lead cards side by side. Without lead scoring they look identical (same company profile).
 * With lead scoring: Lead A (87pts, hot) gets called, Lead B (3pts) goes to nurture.
 * Full 5-act story: arrival → activity reveal → score hide → score reveal → outcomes.
 * Duration: ~600 frames @ 30fps (20s)
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

export function LeadAvsLeadB() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const companyRowsA = [
    { label: "Company",   val: "Vertex Systems"  },
    { label: "Industry",  val: "SaaS / Tech"     },
    { label: "Employees", val: "800–2,000"        },
    { label: "Revenue",   val: "$80M–$150M"       },
    { label: "Title",     val: "VP of Marketing"  },
  ];
  const companyRowsB = [
    { label: "Company",   val: "Aligned Networks" },
    { label: "Industry",  val: "SaaS / Tech"      },
    { label: "Employees", val: "1,500–2,500"       },
    { label: "Revenue",   val: "$100M–$150M"       },
    { label: "Title",     val: "VP of Marketing"   },
  ];

  const aItems = [
    { text: "Visited pricing page ×3",    delay: 38  },
    { text: "Attended product webinar",   delay: 62  },
    { text: "Downloaded ROI calculator",  delay: 86  },
    { text: "Perfect-fit company profile",delay: 110 },
  ];
  const bItems = [
    { text: "Subscribed to blog",          delay: 188 },
    { text: "Last activity: 6 months ago", delay: 212 },
    { text: "No engagement since",         delay: 236 },
  ];

  const cardASp = spring({ frame: frame - 0,   fps, config: { damping: 30, stiffness: 130 } });
  const cardAOp = fi(frame, 0, 22, 0, 1);
  const cardBSp = spring({ frame: frame - 150, fps, config: { damping: 30, stiffness: 130 } });
  const cardBOp = fi(frame, 150, 172, 0, 1);

  const activityFadeOut = fi(frame, 300, 326, 1, 0);
  const activityFadeIn  = fi(frame, 420, 452, 0, 1);
  const activityOp      = frame < 300 ? 1 : frame < 420 ? activityFadeOut : activityFadeIn;

  const withoutOp      = fi(frame, 342, 362, 0, 1);
  const withoutY       = fi(frame, 342, 362, 14, 0);
  const withScoringOp  = fi(frame, 392, 412, 0, 1);
  const withScoringY   = fi(frame, 392, 412, 14, 0);

  const aHighlight  = fi(frame, 452, 480, 0, 1);
  const aGlowPulse  = frame > 452 ? 0.5 + 0.5 * Math.sin(((frame - 452) / 18) * Math.PI * 2) : 0;
  const scoreASp    = spring({ frame: frame - 452, fps, config: { damping: 32, stiffness: 180 } });
  const scoreAVal   = Math.round(87 * Math.min(scoreASp, 1));
  const barAW       = fi(frame, 455, 495, 0, 87);
  const bDim        = fi(frame, 470, 500, 1, 0.35);
  const scoreBSp    = spring({ frame: frame - 465, fps, config: { damping: 30, stiffness: 170 } });
  const scoreBVal   = Math.round(3 * Math.min(scoreBSp, 1));
  const barBW       = fi(frame, 468, 500, 0, 3);

  const outAOp = fi(frame, 512, 530, 0, 1);
  const outAY  = fi(frame, 512, 530, 14, 0);
  const outBOp = fi(frame, 542, 560, 0, 1);
  const outBY  = fi(frame, 542, 560, 14, 0);

  const renderActivityItem = (item, isA) => {
    const iOp = fi(frame, item.delay, item.delay + 18, 0, 1);
    const iX  = fi(frame, item.delay, item.delay + 18, isA ? -20 : 20, 0);
    return (
      <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 10, opacity: iOp * activityOp, transform: `translateX(${iX}px)` }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, background: isA ? `linear-gradient(135deg, ${RED}, ${PINK})` : "rgba(30,45,90,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {isA
            ? <svg width="12" height="12" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
            : <svg width="12" height="12" viewBox="0 0 10 10"><line x1="2.5" y1="2.5" x2="7.5" y2="7.5" stroke="rgba(30,45,90,0.55)" strokeWidth="1.8" strokeLinecap="round"/><line x1="7.5" y1="2.5" x2="2.5" y2="7.5" stroke="rgba(30,45,90,0.55)" strokeWidth="1.8" strokeLinecap="round"/></svg>
          }
        </div>
        <div style={{ fontSize: 18, fontWeight: 500, color: isA ? NAVY : "rgba(30,45,90,0.65)", fontFamily: FONT }}>{item.text}</div>
      </div>
    );
  };

  const renderCard = (isA) => {
    const cardSp  = isA ? cardASp  : cardBSp;
    const cardOp  = isA ? cardAOp  : cardBOp;
    const items   = isA ? aItems   : bItems;
    const scoreVal= isA ? scoreAVal: scoreBVal;
    const scoreSp = isA ? scoreASp : scoreBSp;
    const barW    = isA ? barAW    : barBW;
    const dimOp   = isA ? 1        : bDim;
    const highlightBorder = isA ? aHighlight : 0;
    const outOp   = isA ? outAOp   : outBOp;
    const outY    = isA ? outAY    : outBY;
    const scoreRevealOp = isA ? fi(frame, 452, 468, 0, 1) : fi(frame, 465, 480, 0, 1);

    return (
      <div style={{
        width: 440, display: "flex", flexDirection: "column", gap: 12,
        transform: `translateX(${fi(frame, isA ? 0 : 150, isA ? 22 : 172, isA ? -40 : 40, 0)}px) scale(${0.94 + 0.06 * cardSp})`,
        opacity: cardOp * dimOp,
      }}>
        <div style={{ background: "#ffffff", borderRadius: 18, border: `1.5px solid ${highlightBorder > 0 ? `rgba(232,24,46,${0.4 * highlightBorder})` : "rgba(30,45,90,0.09)"}`, boxShadow: highlightBorder > 0 ? `0 0 0 ${4 * highlightBorder}px rgba(232,24,46,${0.15 * highlightBorder}), 0 8px 36px rgba(232,24,46,${0.18 * highlightBorder})` : "0 4px 20px rgba(0,0,60,0.07)", overflow: "hidden" }}>
          <div style={{ background: highlightBorder > 0 ? `linear-gradient(135deg, rgba(232,24,46,${highlightBorder}), rgba(194,24,91,${highlightBorder})), ${NAVY}` : NAVY, padding: "16px 22px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: "white", fontFamily: FONT }}>{isA ? "A" : "B"}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "white", fontFamily: FONT }}>Lead {isA ? "A" : "B"}</div>
              <div style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", fontFamily: FONT }}>{isA ? "sarah@vertexsystems.com" : "darnell@alignednetworks.com"}</div>
            </div>
          </div>
          <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(30,45,90,0.75)", fontFamily: FONT, letterSpacing: "1px", marginBottom: 6 }}>COMPANY</div>
            {(isA ? companyRowsA : companyRowsB).map((r, i) => {
              const rows = isA ? companyRowsA : companyRowsB;
              return (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < rows.length - 1 ? "1px solid rgba(30,45,90,0.05)" : "none", opacity: fi(frame, 8 + i * 10, 22 + i * 10, 0, 1) }}>
                  <span style={{ fontSize: 16, color: "rgba(30,45,90,0.6)", fontWeight: 500, fontFamily: FONT }}>{r.label}</span>
                  <span style={{ fontSize: 16, color: NAVY, fontWeight: 700, fontFamily: FONT }}>{r.val}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background: "#ffffff", borderRadius: 18, border: `1.5px solid ${isA && highlightBorder > 0 ? `rgba(232,24,46,${0.3 * highlightBorder})` : "rgba(30,45,90,0.09)"}`, boxShadow: "0 4px 20px rgba(0,0,60,0.07)", overflow: "hidden", opacity: activityOp }}>
          <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(30,45,90,0.75)", fontFamily: FONT, letterSpacing: "1px" }}>ACTIVITY & SIGNALS</div>
            {items.map(item => renderActivityItem(item, isA))}
            <div style={{ marginTop: 4, opacity: scoreRevealOp }}>
              <div style={{ height: "1px", background: "rgba(30,45,90,0.08)", marginBottom: 12 }}/>
              <div style={{ fontSize: 16, fontWeight: 700, color: "rgba(30,45,90,0.75)", fontFamily: FONT, letterSpacing: "1px", marginBottom: 8 }}>LEAD SCORE</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 68, height: 68, borderRadius: "50%", flexShrink: 0, background: isA ? `linear-gradient(135deg, ${RED}, ${PINK})` : "rgba(30,45,90,0.1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${Math.min(scoreSp, 1)})`, boxShadow: isA ? `0 0 0 ${6 * aGlowPulse}px rgba(232,24,46,0.25), 0 4px 16px rgba(232,24,46,0.4)` : "none" }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: isA ? "white" : "rgba(30,45,90,0.55)", fontFamily: FONT, lineHeight: 1 }}>{scoreVal}</div>
                  <div style={{ fontSize: 13, color: isA ? "rgba(255,255,255,0.65)" : "rgba(30,45,90,0.5)", fontFamily: FONT }}>/100</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 8, borderRadius: 99, background: "rgba(30,45,90,0.07)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${barW}%`, borderRadius: 99, background: isA ? `linear-gradient(90deg, ${RED}, ${PINK})` : "rgba(30,45,90,0.18)" }}/>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 16, fontWeight: 700, color: isA ? RED : "rgba(30,45,90,0.5)", fontFamily: FONT }}>
                    {isA ? <span>🔥 Hot Lead</span> : <span>Cold — No urgency</span>}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ opacity: outOp, transform: `translateY(${outY}px)`, marginTop: 4 }}>
              <div style={{ padding: "10px 16px", borderRadius: 6, textAlign: "center", background: isA ? RED : "rgba(30,45,90,0.07)", fontSize: 18, fontWeight: 600, color: isA ? "white" : NAVY, fontFamily: FONT, boxShadow: isA ? "0 4px 16px rgba(232,24,46,0.35)" : "none" }}>{isA ? "→ Call today" : "→ Add to nurture"}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>
      <div style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>
        {renderCard(true)}
        {renderCard(false)}
      </div>
      <div style={{ opacity: withoutOp, transform: `translateY(${withoutY}px)`, textAlign: "center" }}>
        <span style={{ fontSize: 30, fontWeight: 600, color: "rgba(30,45,90,0.55)", fontFamily: FONT }}>
          Without lead scoring —&nbsp;<strong style={{ color: NAVY }}>they look identical.</strong>
        </span>
      </div>
      <div style={{ opacity: withScoringOp, transform: `translateY(${withScoringY}px)`, textAlign: "center" }}>
        <span style={{ fontSize: 30, fontWeight: 700, color: NAVY, fontFamily: FONT }}>
          With lead scoring? <span style={{ color: RED }}>Lead A gets called today.</span> Lead B goes into nurture.
        </span>
      </div>
    </AbsoluteFill>
  );
}
