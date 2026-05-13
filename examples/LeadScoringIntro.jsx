import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Sequence,
} from "remotion";

const NAVY  = "#1e2d5a";
const RED   = "#e8182e";
const PINK  = "#c2185b";
const FONT  = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function LeadScoringIntroScene({ frame, fps }) {

  const cards = [
    {
      tag:   "READY NOW",
      name:  "Hot Lead",
      icon:  "🔥",
      grad:  `linear-gradient(135deg, ${RED}, ${PINK})`,
      delay: 20,
      score: 87,
      scoreColor: RED,
      scoreGrad: `linear-gradient(135deg, ${RED}, ${PINK})`,
      signals: [
        { label: "Visited pricing page ×3",   pts: "+25" },
        { label: "Attended product webinar",   pts: "+15" },
        { label: "VP of Marketing, 500-person co.", pts: "+20" },
      ],
      action: "Route to sales →",
      actionBg: `linear-gradient(135deg, ${RED}, ${PINK})`,
    },
    {
      tag:   "NEEDS NURTURING",
      name:  "Warm Lead",
      icon:  "⏳",
      grad:  "linear-gradient(135deg, #2563eb, #7c3aed)",
      delay: 44,
      score: 42,
      scoreColor: "#2563eb",
      scoreGrad: "linear-gradient(135deg, #2563eb, #7c3aed)",
      signals: [
        { label: "Downloaded ebook",           pts: "+10" },
        { label: "Opened 3 emails",            pts: "+3"  },
        { label: "Director-level, mid-market", pts: "+15" },
      ],
      action: "Add to nurture →",
      actionBg: "linear-gradient(135deg, #2563eb, #7c3aed)",
    },
    {
      tag:   "WON'T CONVERT",
      name:  "Cold Lead",
      icon:  "❄️",
      grad:  `linear-gradient(135deg, rgba(30,45,90,0.55), rgba(30,45,90,0.38))`,
      delay: 68,
      score: 8,
      scoreColor: "rgba(30,45,90,0.4)",
      scoreGrad: "linear-gradient(135deg, rgba(30,45,90,0.35), rgba(30,45,90,0.25))",
      signals: [
        { label: "Blog subscriber, 6 mo. ago", pts: "+2"  },
        { label: "Opened 1 email",             pts: "+1"  },
        { label: "Outside target market",      pts: "+0"  },
      ],
      action: "Deprioritize",
      actionBg: "rgba(30,45,90,0.12)",
      actionTextColor: "rgba(30,45,90,0.4)",
    },
  ];

  // Timing
  const CARDS_DONE   = 100;  // cards fully settled
  const PAUSE        = 60;   // 2-second hold at 30fps
  const REVEAL_START = CARDS_DONE + PAUSE; // frame 160 — slide up + reveal

  // All three cards + panels move together at REVEAL_START
  const revealSp = spring({ frame: frame - REVEAL_START, fps, config: { damping: 22, stiffness: 90 } });
  const GAP     = 16;
  const CARD_H  = 100;
  const PANEL_H = 220;

  // Canvas: 1920×1080. Columns: 3×296px + 2×32px gap = 952px wide, left edge at 484px
  const COLS    = 3;
  const COL_W   = 360;
  const COL_GAP = 40;
  const LEFT    = (1920 - (COLS * COL_W + (COLS - 1) * COL_GAP)) / 2; // 484

  // Before reveal: cards vertically centered = top 490 (540 - CARD_H/2)
  // After reveal:  full stack centered = top 372 (540 - (CARD_H+GAP+PANEL_H)/2)
  const CARD_TOP_BEFORE = 490;
  const CARD_TOP_AFTER  = 372;
  const cardTop  = CARD_TOP_BEFORE + revealSp * (CARD_TOP_AFTER - CARD_TOP_BEFORE);
  const panelTop = CARD_TOP_AFTER + CARD_H + GAP; // 488

  // Payoff line
  const payoffOp = fi(frame, REVEAL_START + 80, REVEAL_START + 105, 0, 1);
  const payoffY  = fi(frame, REVEAL_START + 80, REVEAL_START + 105, 20, 0);

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>

      {cards.map((card, i) => {
        const cardSp = spring({ frame: frame - card.delay, fps, config: { damping: 18, stiffness: 140 } });
        const cardOp = fi(frame, card.delay, card.delay + 20, 0, 1);
        const cardY  = fi(frame, card.delay, card.delay + 24, 36, 0);
        const colLeft = LEFT + i * (COL_W + COL_GAP);

        return (
          <div key={i}>

            {/* Score panel — fixed position, fades in on reveal */}
            <div style={{
              position: "absolute",
              left: colLeft, top: panelTop, width: COL_W,
              opacity: fi(frame, REVEAL_START, REVEAL_START + 8, 0, 1),
            }}>
              <div style={{
                background: "#fff", borderRadius: 18,
                border: "1.5px solid rgba(30,45,90,0.08)",
                boxShadow: "0 4px 20px rgba(0,0,60,0.08)", overflow: "hidden",
              }}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "14px 20px", borderBottom: "1px solid rgba(30,45,90,0.07)",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(30,45,90,0.4)", fontFamily: FONT, letterSpacing: "1.5px" }}>LEAD SCORE</div>
                  <div style={{
                    width: 52, height: 52, borderRadius: "50%", background: card.scoreGrad,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, fontWeight: 900, color: "white", fontFamily: FONT,
                    boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                  }}>{card.score}</div>
                </div>
                <div style={{ padding: "14px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {card.signals.map((sig, si) => {
                    const sigDelay = REVEAL_START + 10 + si * 14;
                    return (
                      <div key={si} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        opacity: fi(frame, sigDelay, sigDelay + 14, 0, 1),
                        transform: `translateX(${fi(frame, sigDelay, sigDelay + 14, -10, 0)}px)`,
                      }}>
                        <div style={{ fontSize: 16, fontWeight: 500, color: "rgba(30,45,90,0.6)", fontFamily: FONT, flex: 1, paddingRight: 8 }}>{sig.label}</div>
                        <div style={{
                          fontSize: 16, fontWeight: 800, color: "white", fontFamily: FONT,
                          background: card.scoreGrad, padding: "3px 12px", borderRadius: 999,
                          flexShrink: 0, opacity: sig.pts === "+0" ? 0.35 : 1,
                        }}>{sig.pts}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{
                  margin: "4px 14px 14px", padding: "12px 16px", borderRadius: 12,
                  background: card.actionBg, textAlign: "center",
                  fontSize: 17, fontWeight: 800,
                  color: card.actionTextColor || "white", fontFamily: FONT,
                  opacity: fi(frame, REVEAL_START + 40, REVEAL_START + 55, 0, 1),
                }}>{card.action}</div>
              </div>
            </div>

            {/* Lead card — starts centered, slides up to stack position */}
            <div style={{
              position: "absolute",
              left: colLeft, top: cardTop, width: COL_W,
              opacity: cardOp,
              transform: `translateY(${cardY}px) scale(${cardSp})`,
              transformOrigin: "bottom center",
              zIndex: 2,
            }}>
              <div style={{
                background: "#fff", borderRadius: 20, overflow: "hidden",
                boxShadow: "0 8px 36px rgba(0,0,60,0.12)",
                border: "1.5px solid rgba(30,45,90,0.07)",
              }}>
                <div style={{
                  background: card.grad, padding: "24px 26px 20px",
                  display: "flex", flexDirection: "column", gap: 8,
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.75)", fontFamily: FONT, letterSpacing: "2px" }}>{card.tag}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 38, lineHeight: 1 }}>{card.icon}</span>
                    <div style={{ fontSize: 34, fontWeight: 900, color: "white", fontFamily: FONT }}>{card.name}</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        );
      })}

      {/* ── Payoff line ── */}
      <div style={{
        position: "absolute",
        bottom: 58, left: 0, right: 0,
        textAlign: "center",
        opacity: payoffOp,
        transform: `translateY(${payoffY}px)`,
        zIndex: 10,
      }}>
        <div style={{ fontSize: 36, fontWeight: 900, color: NAVY, fontFamily: FONT, lineHeight: 1.2 }}>
          <span style={{ color: RED }}>Lead scoring</span> is how you tell the difference.
        </div>
      </div>

    </AbsoluteFill>
  );
}

export const LeadScoringIntro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Sequence from={0} durationInFrames={360}>
        <LeadScoringIntroScene frame={frame} fps={fps}/>
      </Sequence>
    </AbsoluteFill>
  );
};
