import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Sequence,
} from "remotion";

const BRAND_BG = "#0a0f1e";
const BRAND_BLUE = "#3b82f6";
const BRAND_CYAN = "#06b6d4";
const BRAND_WHITE = "#f0f4ff";
const BRAND_GRAY = "#8892a4";

function fadeIn(frame, start, duration = 20) {
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function slideUp(frame, start, duration = 20) {
  return interpolate(frame, [start, start + duration], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ─── Scene 1: Title ──────────────────────────────────────────────────────────
function TitleScene({ relativeFrame }) {
  const f = relativeFrame;
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame: f - 10, fps, config: { damping: 14, stiffness: 120 } });
  const subtitleOpacity = fadeIn(f, 35);
  const subtitleY = slideUp(f, 35);
  const lineWidth = interpolate(f, [50, 80], [0, 340], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: BRAND_BG, justifyContent: "center", alignItems: "center" }}>
      {/* Background grid */}
      <Grid opacity={interpolate(f, [0, 30], [0, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />

      <div style={{ textAlign: "center", position: "relative" }}>
        <div
          style={{
            fontSize: 110,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 800,
            color: BRAND_WHITE,
            letterSpacing: "-3px",
            transform: `scale(${titleScale})`,
            lineHeight: 1,
          }}
        >
          Firmo
          <span style={{ color: BRAND_BLUE }}>graphics</span>
        </div>

        <div
          style={{
            width: lineWidth,
            height: 3,
            background: `linear-gradient(90deg, ${BRAND_BLUE}, ${BRAND_CYAN})`,
            margin: "28px auto",
            borderRadius: 2,
          }}
        />

        <div
          style={{
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
            fontSize: 32,
            color: BRAND_GRAY,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 400,
            letterSpacing: "0.5px",
          }}
        >
          The demographics of businesses
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 2: Definition ─────────────────────────────────────────────────────
function DefinitionScene({ relativeFrame }) {
  const f = relativeFrame;

  const labelOpacity = fadeIn(f, 5);
  const line1Opacity = fadeIn(f, 20);
  const line1Y = slideUp(f, 20, 25);
  const line2Opacity = fadeIn(f, 40);
  const line2Y = slideUp(f, 40, 25);
  const line3Opacity = fadeIn(f, 58);
  const line3Y = slideUp(f, 58, 25);

  return (
    <AbsoluteFill style={{ background: BRAND_BG, justifyContent: "center", alignItems: "center" }}>
      <Grid opacity={0.1} />

      <div style={{ maxWidth: 1100, padding: "0 80px", textAlign: "center" }}>
        <div
          style={{
            opacity: labelOpacity,
            fontSize: 16,
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: BRAND_CYAN,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 600,
            marginBottom: 40,
          }}
        >
          Definition
        </div>

        <div
          style={{
            opacity: line1Opacity,
            transform: `translateY(${line1Y}px)`,
            fontSize: 58,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 700,
            color: BRAND_WHITE,
            lineHeight: 1.2,
            marginBottom: 8,
          }}
        >
          Firmographics are data attributes
        </div>

        <div
          style={{
            opacity: line2Opacity,
            transform: `translateY(${line2Y}px)`,
            fontSize: 58,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 700,
            color: BRAND_WHITE,
            lineHeight: 1.2,
            marginBottom: 8,
          }}
        >
          used to{" "}
          <span style={{ color: BRAND_BLUE }}>categorize</span> and{" "}
          <span style={{ color: BRAND_CYAN }}>segment</span>
        </div>

        <div
          style={{
            opacity: line3Opacity,
            transform: `translateY(${line3Y}px)`,
            fontSize: 58,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 700,
            color: BRAND_WHITE,
            lineHeight: 1.2,
          }}
        >
          organizations — not individuals.
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 3: The 6 Attributes ────────────────────────────────────────────────
const ATTRIBUTES = [
  { icon: "🏭", label: "Industry", example: "SaaS · Finance · Healthcare", color: "#3b82f6" },
  { icon: "👥", label: "Company Size", example: "Employees: 50 · 500 · 5,000+", color: "#8b5cf6" },
  { icon: "📍", label: "Location", example: "Country · Region · City", color: "#06b6d4" },
  { icon: "💰", label: "Revenue", example: "$1M · $10M · $1B ARR", color: "#10b981" },
  { icon: "📈", label: "Growth Stage", example: "Startup · Growth · Enterprise", color: "#f59e0b" },
  { icon: "🏗️", label: "Business Type", example: "B2B · B2C · Public · Private", color: "#ef4444" },
];

function AttributeCard({ icon, label, example, color, opacity, scale, translateY }) {
  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${color}44`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 12,
        padding: "22px 26px",
        display: "flex",
        alignItems: "center",
        gap: 18,
      }}
    >
      <div style={{ fontSize: 36, lineHeight: 1 }}>{icon}</div>
      <div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: BRAND_WHITE,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            marginBottom: 4,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 16,
            color: BRAND_GRAY,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          }}
        >
          {example}
        </div>
      </div>
    </div>
  );
}

function AttributesScene({ relativeFrame }) {
  const f = relativeFrame;
  const { fps } = useVideoConfig();

  const headerOpacity = fadeIn(f, 5);

  return (
    <AbsoluteFill style={{ background: BRAND_BG, justifyContent: "center", alignItems: "center" }}>
      <Grid opacity={0.1} />

      <div style={{ width: 1200, padding: "0 60px" }}>
        <div
          style={{
            opacity: headerOpacity,
            fontSize: 16,
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: BRAND_CYAN,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 600,
            marginBottom: 36,
            textAlign: "center",
          }}
        >
          Key Firmographic Attributes
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 18,
          }}
        >
          {ATTRIBUTES.map((attr, i) => {
            const startFrame = 15 + i * 14;
            const cardSpring = spring({
              frame: f - startFrame,
              fps,
              config: { damping: 16, stiffness: 130 },
            });
            const opacity = interpolate(f, [startFrame, startFrame + 15], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <AttributeCard
                key={attr.label}
                {...attr}
                opacity={opacity}
                scale={cardSpring}
                translateY={interpolate(f, [startFrame, startFrame + 20], [20, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })}
              />
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 4: Use Case ────────────────────────────────────────────────────────
function UseCaseScene({ relativeFrame }) {
  const f = relativeFrame;
  const { fps } = useVideoConfig();

  const headerOpacity = fadeIn(f, 5);
  const headerY = slideUp(f, 5);

  const steps = [
    { label: "Identify", desc: "Find companies that match your ideal customer profile", color: BRAND_BLUE },
    { label: "Segment", desc: "Group prospects by industry, size, or stage", color: "#8b5cf6" },
    { label: "Prioritize", desc: "Focus sales effort on highest-value accounts", color: BRAND_CYAN },
    { label: "Personalize", desc: "Tailor messaging to each segment's specific needs", color: "#10b981" },
  ];

  return (
    <AbsoluteFill style={{ background: BRAND_BG, justifyContent: "center", alignItems: "center" }}>
      <Grid opacity={0.1} />

      <div style={{ width: 1100, padding: "0 60px", textAlign: "center" }}>
        <div
          style={{
            opacity: headerOpacity,
            transform: `translateY(${headerY}px)`,
            fontSize: 16,
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: BRAND_CYAN,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          Why It Matters
        </div>

        <div
          style={{
            opacity: fadeIn(f, 15),
            transform: `translateY(${slideUp(f, 15)})`,
            fontSize: 52,
            fontWeight: 800,
            color: BRAND_WHITE,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            marginBottom: 56,
            lineHeight: 1.15,
          }}
        >
          Firmographics power{" "}
          <span style={{ color: BRAND_BLUE }}>B2B go-to-market</span> strategy
        </div>

        <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
          {steps.map((step, i) => {
            const startFrame = 30 + i * 14;
            const cardOpacity = fadeIn(f, startFrame, 18);
            const cardY = slideUp(f, startFrame, 18);
            const numScale = spring({
              frame: f - startFrame,
              fps,
              config: { damping: 14, stiffness: 140 },
            });

            return (
              <div
                key={step.label}
                style={{
                  opacity: cardOpacity,
                  transform: `translateY(${cardY}px)`,
                  flex: 1,
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${step.color}33`,
                  borderTop: `3px solid ${step.color}`,
                  borderRadius: 12,
                  padding: "28px 20px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    transform: `scale(${numScale})`,
                    fontSize: 40,
                    fontWeight: 800,
                    color: step.color,
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    marginBottom: 12,
                  }}
                >
                  {i + 1}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: BRAND_WHITE,
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    marginBottom: 10,
                  }}
                >
                  {step.label}
                </div>
                <div
                  style={{
                    fontSize: 15,
                    color: BRAND_GRAY,
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    lineHeight: 1.5,
                  }}
                >
                  {step.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 5: Outro ───────────────────────────────────────────────────────────
function OutroScene({ relativeFrame }) {
  const f = relativeFrame;
  const { fps } = useVideoConfig();

  const scale = spring({ frame: f - 10, fps, config: { damping: 14, stiffness: 100 } });
  const tagOpacity = fadeIn(f, 35);

  return (
    <AbsoluteFill style={{ background: BRAND_BG, justifyContent: "center", alignItems: "center" }}>
      <Grid opacity={interpolate(f, [0, 20], [0, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />

      <div style={{ textAlign: "center" }}>
        <div
          style={{
            transform: `scale(${scale})`,
            fontSize: 80,
            fontWeight: 800,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            color: BRAND_WHITE,
            letterSpacing: "-2px",
            lineHeight: 1.1,
          }}
        >
          Know your
          <br />
          <span
            style={{
              background: `linear-gradient(90deg, ${BRAND_BLUE}, ${BRAND_CYAN})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            market.
          </span>
        </div>

        <div
          style={{
            opacity: tagOpacity,
            marginTop: 32,
            fontSize: 24,
            color: BRAND_GRAY,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            letterSpacing: "1px",
          }}
        >
          Firmographics — the foundation of B2B intelligence.
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 6: Fan Chart ───────────────────────────────────────────────────────
// Semicircle fan divided into 4 segments, each animating in one by one.
// Coordinate system: center at (cx, cy), radius from INNER_R to OUTER_R.

function polarToCart(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function arcPath(cx, cy, innerR, outerR, startDeg, endDeg) {
  const [ox1, oy1] = polarToCart(cx, cy, outerR, startDeg);
  const [ox2, oy2] = polarToCart(cx, cy, outerR, endDeg);
  const [ix1, iy1] = polarToCart(cx, cy, innerR, endDeg);
  const [ix2, iy2] = polarToCart(cx, cy, innerR, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${ox1} ${oy1}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${ox2} ${oy2}`,
    `L ${ix1} ${iy1}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${ix2} ${iy2}`,
    "Z",
  ].join(" ");
}

// Segments span 180° (left=180° to right=0°), divided into 4 equal slices of 45°
// Using standard math angles: 180° = left, 0° = right, going counter-clockwise
// We want fan opening upward so base is at bottom: angles from 180 down to 0
const FAN_SEGMENTS = [
  {
    label: "Industry",
    icon: "🏭",
    color: "#3b82f6",
    startDeg: 180,
    endDeg: 135,
    labelAngle: 157.5,
    labelDist: 1.18,
  },
  {
    label: "Location",
    icon: "📍",
    color: "#06b6d4",
    startDeg: 135,
    endDeg: 90,
    labelAngle: 112.5,
    labelDist: 1.18,
  },
  {
    label: "Size",
    icon: "👥",
    color: "#8b5cf6",
    startDeg: 90,
    endDeg: 45,
    labelAngle: 67.5,
    labelDist: 1.18,
  },
  {
    label: "Performance",
    icon: "📈",
    color: "#10b981",
    startDeg: 45,
    endDeg: 0,
    labelAngle: 22.5,
    labelDist: 1.18,
  },
];

function FanChartScene({ relativeFrame }) {
  const f = relativeFrame;
  const { fps } = useVideoConfig();

  const CX = 960;
  const CY = 720; // near bottom center so fan sits centered
  const INNER_R = 160;
  const OUTER_R = 400;

  const titleOpacity = fadeIn(f, 5, 20);
  const titleY = slideUp(f, 5, 20);

  return (
    <AbsoluteFill style={{ background: BRAND_BG, overflow: "hidden" }}>
      <Grid opacity={0.1} />

      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: 16,
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: BRAND_CYAN,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          Firmographic Data
        </div>
        <div
          style={{
            fontSize: 60,
            fontWeight: 800,
            color: BRAND_WHITE,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            letterSpacing: "-2px",
            lineHeight: 1,
          }}
        >
          Four Core Dimensions
        </div>
      </div>

      {/* SVG Fan */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
        viewBox="0 0 1920 1080"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {FAN_SEGMENTS.map((seg, i) => (
            <radialGradient key={i} id={`fanGrad${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={seg.color} stopOpacity="0.9" />
              <stop offset="100%" stopColor={seg.color} stopOpacity="0.5" />
            </radialGradient>
          ))}
        </defs>

        {FAN_SEGMENTS.map((seg, i) => {
          const startFrame = 18 + i * 14;
          const sp = spring({
            frame: f - startFrame,
            fps,
            config: { damping: 16, stiffness: 100 },
          });

          // Animate each segment growing from inner to outer radius
          const animatedOuter = INNER_R + sp * (OUTER_R - INNER_R);
          const segOpacity = interpolate(f, [startFrame, startFrame + 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const path = arcPath(CX, CY, INNER_R, animatedOuter, seg.startDeg, seg.endDeg);

          // Midpoint angle for icon placement
          const midAngle = (seg.startDeg + seg.endDeg) / 2;
          const iconR = INNER_R + (animatedOuter - INNER_R) * 0.5;
          const [iconX, iconY] = polarToCart(CX, CY, iconR, midAngle);

          // Label placement outside the arc (unused here — labels rendered in HTML below)
          // Gap between segments
          const gapDeg = 1.5;

          return (
            <g key={i} opacity={segOpacity}>
              {/* Segment fill */}
              <path
                d={arcPath(CX, CY, INNER_R, animatedOuter, seg.startDeg - gapDeg, seg.endDeg + gapDeg)}
                fill={`url(#fanGrad${i})`}
                stroke={seg.color}
                strokeWidth="1.5"
                strokeOpacity="0.4"
              />
              {/* Icon */}
              <text
                x={iconX}
                y={iconY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="42"
                opacity={sp}
              >
                {seg.icon}
              </text>
            </g>
          );
        })}

        {/* Inner circle cap */}
        <path
          d={`M ${CX - INNER_R} ${CY} A ${INNER_R} ${INNER_R} 0 0 1 ${CX + INNER_R} ${CY} Z`}
          fill={BRAND_BG}
          stroke={`${BRAND_CYAN}44`}
          strokeWidth="1.5"
          opacity={interpolate(f, [16, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      </svg>

      {/* HTML labels (easier to style than SVG text) */}
      {FAN_SEGMENTS.map((seg, i) => {
        const startFrame = 18 + i * 14;
        const sp = spring({ frame: f - startFrame, fps, config: { damping: 16, stiffness: 100 } });
        const labelOpacity = interpolate(f, [startFrame + 8, startFrame + 22], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const midAngle = (seg.startDeg + seg.endDeg) / 2;
        const [lx, ly] = polarToCart(960, 720, OUTER_R + 80, midAngle);

        // Anchor: left side labels align right, right side align left, top center
        const isLeft = midAngle > 90;
        const isTop = midAngle === 90;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: lx,
              top: ly,
              transform: `translate(${isLeft ? "-100%" : isTop ? "-50%" : "0%"}, -50%) scale(${0.8 + sp * 0.2})`,
              opacity: labelOpacity,
              textAlign: isLeft ? "right" : "left",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: seg.color,
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                letterSpacing: "-0.5px",
                textShadow: `0 0 20px ${seg.color}66`,
              }}
            >
              {seg.label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

// ─── Background grid helper ───────────────────────────────────────────────────
function Grid({ opacity }) {
  return (
    <svg
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#ffffff" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

// ─── Transitions ──────────────────────────────────────────────────────────────
function FadeTransition({ children, relativeFrame, totalFrames }) {
  const opacity = interpolate(
    relativeFrame,
    [0, 8, totalFrames - 10, totalFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <div style={{ opacity, position: "absolute", inset: 0 }}>{children}</div>;
}

// ─── Main composition ─────────────────────────────────────────────────────────
const SCENE_DURATIONS = [
  90,   // Title
  90,   // Definition
  120,  // Attributes
  110,  // Use Case
  80,   // Outro
  110,  // Fan Chart
];

const OFFSETS = SCENE_DURATIONS.reduce(
  (acc, _, i) => [...acc, (acc[i] || 0) + (i > 0 ? SCENE_DURATIONS[i - 1] : 0)],
  [0]
);

export const Firmographics = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: BRAND_BG }}>
      <Sequence from={OFFSETS[0]} durationInFrames={SCENE_DURATIONS[0]}>
        <FadeTransition relativeFrame={frame - OFFSETS[0]} totalFrames={SCENE_DURATIONS[0]}>
          <TitleScene relativeFrame={frame - OFFSETS[0]} />
        </FadeTransition>
      </Sequence>

      <Sequence from={OFFSETS[1]} durationInFrames={SCENE_DURATIONS[1]}>
        <FadeTransition relativeFrame={frame - OFFSETS[1]} totalFrames={SCENE_DURATIONS[1]}>
          <DefinitionScene relativeFrame={frame - OFFSETS[1]} />
        </FadeTransition>
      </Sequence>

      <Sequence from={OFFSETS[2]} durationInFrames={SCENE_DURATIONS[2]}>
        <FadeTransition relativeFrame={frame - OFFSETS[2]} totalFrames={SCENE_DURATIONS[2]}>
          <AttributesScene relativeFrame={frame - OFFSETS[2]} />
        </FadeTransition>
      </Sequence>

      <Sequence from={OFFSETS[3]} durationInFrames={SCENE_DURATIONS[3]}>
        <FadeTransition relativeFrame={frame - OFFSETS[3]} totalFrames={SCENE_DURATIONS[3]}>
          <UseCaseScene relativeFrame={frame - OFFSETS[3]} />
        </FadeTransition>
      </Sequence>

      <Sequence from={OFFSETS[4]} durationInFrames={SCENE_DURATIONS[4]}>
        <FadeTransition relativeFrame={frame - OFFSETS[4]} totalFrames={SCENE_DURATIONS[4]}>
          <OutroScene relativeFrame={frame - OFFSETS[4]} />
        </FadeTransition>
      </Sequence>

      <Sequence from={OFFSETS[5]} durationInFrames={SCENE_DURATIONS[5]}>
        <FadeTransition relativeFrame={frame - OFFSETS[5]} totalFrames={SCENE_DURATIONS[5]}>
          <FanChartScene relativeFrame={frame - OFFSETS[5]} />
        </FadeTransition>
      </Sequence>
    </AbsoluteFill>
  );
};
