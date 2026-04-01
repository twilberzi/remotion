import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Sequence,
} from "remotion";

const BG = "#0a0f1e";
const WHITE = "#f0f4ff";
const GRAY = "#8892a4";
const BLUE = "#3b82f6";
const CYAN = "#06b6d4";
const GREEN = "#10b981";
const PURPLE = "#8b5cf6";

function clamp(val, min = 0, max = 1) {
  return Math.min(max, Math.max(min, val));
}

function fadeIn(frame, start, duration = 20) {
  return clamp(interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  }));
}

// ─── Scene 1: The Contrast Setup (~70 frames) ────────────────────────────────
function ContrastSetupScene({ f }) {
  const { fps } = useVideoConfig();

  // "Here's the simplest contrast."
  const introOpacity = fadeIn(f, 5, 18);
  const introY = interpolate(f, [5, 23], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Dividing line grows from center
  const lineHeight = interpolate(f, [28, 52], [0, 700], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineOpacity = fadeIn(f, 28, 8);

  // Labels fade in after line
  const leftLabelOpacity = fadeIn(f, 50, 15);
  const rightLabelOpacity = fadeIn(f, 58, 15);
  const leftLabelX = interpolate(f, [50, 65], [-30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rightLabelX = interpolate(f, [58, 73], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {/* Intro text */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: introOpacity,
          transform: `translateY(${introY}px)`,
        }}
      >
        <div style={{
          fontSize: 28,
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: GRAY,
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontWeight: 500,
        }}>
          Here's the simplest contrast
        </div>
      </div>

      {/* Vertical dividing line */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 2,
          height: lineHeight,
          opacity: lineOpacity,
          background: `linear-gradient(180deg, transparent, ${CYAN}88, ${CYAN}, ${CYAN}88, transparent)`,
          borderRadius: 2,
        }}
      />

      {/* Left label: Demand Gen */}
      <div
        style={{
          position: "absolute",
          left: "25%",
          top: "50%",
          transform: `translate(-50%, -50%) translateX(${leftLabelX}px)`,
          opacity: leftLabelOpacity,
          textAlign: "center",
        }}
      >
        <div style={{
          fontSize: 52,
          fontWeight: 800,
          color: BLUE,
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          letterSpacing: "-1px",
        }}>
          Demand Gen
        </div>
      </div>

      {/* Right label: ABM */}
      <div
        style={{
          position: "absolute",
          right: "25%",
          top: "50%",
          transform: `translate(50%, -50%) translateX(${rightLabelX}px)`,
          opacity: rightLabelOpacity,
          textAlign: "center",
        }}
      >
        <div style={{
          fontSize: 52,
          fontWeight: 800,
          color: GREEN,
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          letterSpacing: "-1px",
        }}>
          ABM
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 2: The Visual Contrast (~110 frames) ───────────────────────────────
// Left: rising bar chart with "lead volume" ticking up
// Right: account nodes moving along a pipeline toward closed revenue

const BAR_DATA = [
  { color: `${BLUE}cc`, delay: 0 },
  { color: `${BLUE}bb`, delay: 6 },
  { color: `${BLUE}aa`, delay: 12 },
  { color: `${BLUE}99`, delay: 18 },
  { color: `${BLUE}cc`, delay: 8 },
  { color: `${BLUE}aa`, delay: 14 },
  { color: `${BLUE}bb`, delay: 22 },
  { color: `${BLUE}cc`, delay: 4 },
];

function BarChart({ f, fps }) {
  const maxHeights = [120, 180, 90, 210, 150, 240, 130, 200];

  return (
    <div style={{
      display: "flex",
      alignItems: "flex-end",
      gap: 12,
      height: 260,
      padding: "0 8px",
    }}>
      {BAR_DATA.map((bar, i) => {
        const sp = spring({
          frame: f - bar.delay,
          fps,
          config: { damping: 18, stiffness: 100 },
        });
        const h = sp * maxHeights[i];
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 44,
                height: h,
                background: `linear-gradient(180deg, ${BLUE}, ${BLUE}66)`,
                borderRadius: "6px 6px 0 0",
                transition: "height 0.1s",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

// Pipeline node component
function PipelineNode({ label, x, y, color, opacity, scale }) {
  return (
    <div style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-50%, -50%) scale(${scale})`,
      opacity,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
    }}>
      <div style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
        boxShadow: `0 0 20px ${color}66`,
      }}>
        🏢
      </div>
      <div style={{
        fontSize: 13,
        color: WHITE,
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontWeight: 600,
        whiteSpace: "nowrap",
        background: "rgba(0,0,0,0.5)",
        padding: "2px 8px",
        borderRadius: 4,
      }}>
        {label}
      </div>
    </div>
  );
}

// Pipeline stage marker
function PipelineStage({ label, x, y, color, opacity }) {
  return (
    <div style={{
      position: "absolute",
      left: x,
      top: y,
      transform: "translateX(-50%)",
      opacity,
      textAlign: "center",
    }}>
      <div style={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        background: color,
        margin: "0 auto 6px",
        boxShadow: `0 0 12px ${color}`,
      }} />
      <div style={{
        fontSize: 14,
        color: GRAY,
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "1px",
      }}>
        {label}
      </div>
    </div>
  );
}

function ContrastVisualScene({ f }) {
  const { fps } = useVideoConfig();

  const panelOpacity = fadeIn(f, 0, 15);

  // Ticking lead count number
  const leadCount = Math.floor(
    interpolate(f, [10, 80], [0, 1847], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );

  // Pipeline line draw progress
  const pipelineProgress = interpolate(f, [15, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pipelineWidth = pipelineProgress * 520;

  // Pipeline stages
  const stageOpacity1 = fadeIn(f, 20, 12);
  const stageOpacity2 = fadeIn(f, 32, 12);
  const stageOpacity3 = fadeIn(f, 44, 12);
  const stageOpacity4 = fadeIn(f, 56, 12);

  // Account nodes moving along the pipeline
  // finalX: fraction of pipeline length (0=start, 1=end)
  // yOffset: px above(-) or below(+) the pipeline track
  const accountPositions = [
    { label: "Acme Corp",   delay: 25, finalX: 0.72, yOffset: -110 },
    { label: "TechCo",      delay: 35, finalX: 0.45, yOffset:   90 },
    { label: "StartupXYZ",  delay: 45, finalX: 0.20, yOffset: -110 },
  ];

  const PIPELINE_Y = 380;

  // Left panel metric text
  const metricOpacity = fadeIn(f, 70, 18);
  const metricY = interpolate(f, [70, 88], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BG }}>
      {/* Dividing line */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: 0,
        bottom: 0,
        width: 2,
        background: `linear-gradient(180deg, transparent, ${CYAN}44, ${CYAN}44, transparent)`,
      }} />

      {/* ── LEFT PANEL: Demand Gen ── */}
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "50%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: panelOpacity,
        padding: "0 60px",
      }}>
        {/* Panel header */}
        <div style={{
          fontSize: 22,
          fontWeight: 700,
          color: BLUE,
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          textTransform: "uppercase",
          letterSpacing: "3px",
          marginBottom: 40,
        }}>
          Demand Gen
        </div>

        {/* Bar chart */}
        <BarChart f={f} fps={fps} />

        {/* Lead count */}
        <div style={{
          marginTop: 28,
          display: "flex",
          alignItems: "baseline",
          gap: 8,
        }}>
          <div style={{
            fontSize: 72,
            fontWeight: 800,
            color: WHITE,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
            letterSpacing: "-3px",
            lineHeight: 1,
          }}>
            {leadCount.toLocaleString()}
          </div>
          <div style={{
            fontSize: 20,
            color: GRAY,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          }}>
            leads
          </div>
        </div>

        {/* Metric label */}
        <div style={{
          opacity: metricOpacity,
          transform: `translateY(${metricY}px)`,
          marginTop: 28,
          fontSize: 26,
          fontWeight: 700,
          color: `${BLUE}`,
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          textAlign: "center",
          borderTop: `2px solid ${BLUE}44`,
          paddingTop: 20,
          width: "100%",
        }}>
          Measures{" "}
          <span style={{ color: WHITE }}>Lead Volume</span>
        </div>
      </div>

      {/* ── RIGHT PANEL: ABM ── */}
      <div style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: "50%",
        opacity: panelOpacity,
      }}>
        {/* Panel header */}
        <div style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 22,
          fontWeight: 700,
          color: GREEN,
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          textTransform: "uppercase",
          letterSpacing: "3px",
        }}>
          ABM
        </div>

        {/* Pipeline track */}
        <div style={{
          position: "absolute",
          left: 100,
          top: PIPELINE_Y + 6,
          width: pipelineWidth,
          height: 3,
          background: `linear-gradient(90deg, ${GREEN}88, ${GREEN})`,
          borderRadius: 2,
        }} />

        {/* Pipeline stages */}
        <PipelineStage label="Target" x={140} y={PIPELINE_Y - 20} color={GREEN} opacity={stageOpacity1} />
        <PipelineStage label="Engage" x={270} y={PIPELINE_Y - 20} color={CYAN} opacity={stageOpacity2} />
        <PipelineStage label="Pipeline" x={400} y={PIPELINE_Y - 20} color={PURPLE} opacity={stageOpacity3} />
        <PipelineStage label="Closed" x={530} y={PIPELINE_Y - 20} color="#f59e0b" opacity={stageOpacity4} />

        {/* Closed won icon */}
        <div style={{
          position: "absolute",
          left: 530,
          top: PIPELINE_Y + 6,
          transform: "translate(-50%, -50%)",
          fontSize: 28,
          opacity: stageOpacity4,
          filter: "drop-shadow(0 0 12px #f59e0b)",
        }}>
          💰
        </div>

        {/* Account nodes moving along pipeline */}
        {accountPositions.map((acct, i) => {
          const nodeProgress = spring({
            frame: f - acct.delay,
            fps,
            config: { damping: 20, stiffness: 70 },
          });
          const nodeOpacity = fadeIn(f, acct.delay, 10);
          const nodeX = 100 + nodeProgress * acct.finalX * 520;
          // Spread nodes above/below the pipeline track
          const nodeY = PIPELINE_Y + 6 + acct.yOffset;
          const isAbove = acct.yOffset < 0;
          const connectorTop = isAbove ? nodeY + 56 : PIPELINE_Y + 6;
          const connectorHeight = Math.abs(PIPELINE_Y + 6 - nodeY - 56);

          return (
            <div key={i}>
              {/* Connector line to pipeline */}
              <div style={{
                position: "absolute",
                left: nodeX,
                top: connectorTop,
                width: 1,
                height: connectorHeight,
                background: `${GREEN}44`,
                transform: "translateX(-50%)",
                opacity: nodeOpacity,
              }} />
              <PipelineNode
                label={acct.label}
                x={nodeX}
                y={nodeY}
                color={[GREEN, CYAN, PURPLE][i]}
                opacity={nodeOpacity}
                scale={0.85 + nodeProgress * 0.15}
              />
            </div>
          );
        })}

        {/* Metric label */}
        <div style={{
          position: "absolute",
          bottom: 130,
          left: 60,
          right: 40,
          opacity: metricOpacity,
          transform: `translateY(${metricY}px)`,
          fontSize: 22,
          fontWeight: 700,
          color: GREEN,
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          textAlign: "center",
          borderTop: `2px solid ${GREEN}44`,
          paddingTop: 20,
          lineHeight: 1.5,
        }}>
          Measures{" "}
          <span style={{ color: WHITE }}>Account Movement</span>
          <br />
          <span style={{ color: GRAY, fontWeight: 400, fontSize: 18 }}>
            toward Pipeline → Closed Revenue
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 3: The Punchline (~60 frames) ──────────────────────────────────────
function PunchlineScene({ f }) {
  const { fps } = useVideoConfig();

  const line1Scale = spring({ frame: f - 5, fps, config: { damping: 14, stiffness: 130 } });
  const line2Opacity = fadeIn(f, 25, 18);
  const line2Y = interpolate(f, [25, 43], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line3Opacity = fadeIn(f, 40, 18);
  const line3Y = interpolate(f, [40, 58], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 1100, padding: "0 80px" }}>
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 60,
          marginBottom: 56,
          transform: `scale(${line1Scale})`,
        }}>
          {/* Demand Gen pill */}
          <div style={{
            background: `${BLUE}22`,
            border: `2px solid ${BLUE}`,
            borderRadius: 50,
            padding: "16px 36px",
            fontSize: 28,
            fontWeight: 700,
            color: BLUE,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          }}>
            Demand Gen
          </div>

          <div style={{
            fontSize: 36,
            color: GRAY,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          }}>
            vs
          </div>

          {/* ABM pill */}
          <div style={{
            background: `${GREEN}22`,
            border: `2px solid ${GREEN}`,
            borderRadius: 50,
            padding: "16px 36px",
            fontSize: 28,
            fontWeight: 700,
            color: GREEN,
            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          }}>
            ABM
          </div>
        </div>

        <div style={{
          opacity: line2Opacity,
          transform: `translateY(${line2Y}px)`,
          fontSize: 52,
          fontWeight: 700,
          color: WHITE,
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          lineHeight: 1.25,
          marginBottom: 16,
        }}>
          <span style={{ color: BLUE }}>Lead volume</span>
          {" "}vs{" "}
          <span style={{ color: GREEN }}>account movement</span>
        </div>

        <div style={{
          opacity: line3Opacity,
          transform: `translateY(${line3Y}px)`,
          fontSize: 30,
          fontWeight: 400,
          color: GRAY,
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          lineHeight: 1.5,
        }}>
          toward real pipeline and{" "}
          <span style={{
            color: "#f59e0b",
            fontWeight: 700,
          }}>
            closed revenue
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── Fade transition wrapper ───────────────────────────────────────────────────
function FadeTransition({ children, f, total }) {
  const opacity = interpolate(f, [0, 8, total - 10, total], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <div style={{ opacity, position: "absolute", inset: 0 }}>{children}</div>;
}

// ─── Main Composition ─────────────────────────────────────────────────────────
const DURATIONS = [70, 110, 65];
const OFFSETS = DURATIONS.reduce((acc, d, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + DURATIONS[i - 1]);
  return acc;
}, []);

export const DemandVsABM = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: BG }}>
      <Sequence from={OFFSETS[0]} durationInFrames={DURATIONS[0]}>
        <FadeTransition f={frame - OFFSETS[0]} total={DURATIONS[0]}>
          <ContrastSetupScene f={frame - OFFSETS[0]} />
        </FadeTransition>
      </Sequence>

      <Sequence from={OFFSETS[1]} durationInFrames={DURATIONS[1]}>
        <FadeTransition f={frame - OFFSETS[1]} total={DURATIONS[1]}>
          <ContrastVisualScene f={frame - OFFSETS[1]} />
        </FadeTransition>
      </Sequence>

      <Sequence from={OFFSETS[2]} durationInFrames={DURATIONS[2]}>
        <FadeTransition f={frame - OFFSETS[2]} total={DURATIONS[2]}>
          <PunchlineScene f={frame - OFFSETS[2]} />
        </FadeTransition>
      </Sequence>
    </AbsoluteFill>
  );
};
