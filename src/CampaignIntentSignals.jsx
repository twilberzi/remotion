import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export const CampaignIntentSignals = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Timing ───────────────────────────────────────────────────────────────
  // 0–40:   center card fades + scales in from center
  // 30–65:  top badge fades + scales in from center
  // 50–85:  bottom badge fades + scales in from center
  // 85–240: hold with gentle float

  // Smooth spring config — higher damping = slower, silkier
  const cardSpring  = spring({ frame,        fps, config: { damping: 22, stiffness: 80 } });
  const topSpring   = spring({ frame: frame - 30, fps, config: { damping: 20, stiffness: 85 } });
  const botSpring   = spring({ frame: frame - 50, fps, config: { damping: 20, stiffness: 85 } });

  const cardOpacity = fi(frame, 0,  22, 0, 1);
  const topOpacity  = fi(frame, 30, 50, 0, 1);
  const botOpacity  = fi(frame, 50, 70, 0, 1);

  // Gentle idle float (starts blending in after intro)
  const floatIntro = fi(frame, 40, 90, 0, 1); // fade float in after card settles
  const floatCard = Math.sin((frame / 30) * 0.85)        * 3 * floatIntro;
  const floatTop  = Math.sin((frame / 30) * 0.92 + 1.1)  * 4 * floatIntro;
  const floatBot  = Math.sin((frame / 30) * 0.80 + 2.3)  * 4 * floatIntro;

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(145deg, #eef2ff 0%, #f0f4ff 50%, #e8eeff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Subtle background glow */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }}/>

      {/* ── Center card ── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          transform: `translateY(${floatCard}px) scale(${0.88 + cardSpring * 0.12})`,
          opacity: cardOpacity,
          filter: "drop-shadow(0 24px 48px rgba(0,0,60,0.14))",
        }}
      >
        <Img
          src={staticFile("campaign/Campaign.png")}
          style={{ width: 520, borderRadius: 20 }}
        />

        {/* ── Top badge (Intent to buy) — top-right, scales in from its own center ── */}
        <div
          style={{
            position: "absolute",
            top: -44,
            right: -210,
            zIndex: 10,
            transform: `translateY(${floatTop}px) scale(${topSpring})`,
            opacity: topOpacity,
            transformOrigin: "center center",
            filter: "drop-shadow(0 8px 20px rgba(0,0,60,0.13))",
          }}
        >
          <Img
            src={staticFile("campaign/Group 1088597.png")}
            style={{ width: 370 }}
          />
        </div>

        {/* ── Bottom badge (Recent Funding) — bottom-left, scales in from its own center ── */}
        <div
          style={{
            position: "absolute",
            bottom: -44,
            left: -210,
            zIndex: 10,
            transform: `translateY(${floatBot}px) scale(${botSpring})`,
            opacity: botOpacity,
            transformOrigin: "center center",
            filter: "drop-shadow(0 8px 20px rgba(0,0,60,0.13))",
          }}
        >
          <Img
            src={staticFile("campaign/Group 1088595.png")}
            style={{ width: 370 }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
