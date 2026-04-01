import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Video, staticFile } from "remotion";

const NAVY = "#1e2d5a";
const RED  = "#e8182e";
const FONT = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, s, e, f, t) {
  return interpolate(frame, [s, e], [f, t], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

const FONT_SIZE = 68;
const LINE_H = FONT_SIZE * 1.3; // clip box height — generous so ascenders aren't cut

function QuoteBlock({ lines, startFrame, frame, fps }) {
  const INTERVAL = 6;
  let idx = 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
      {lines.map((line, li) => (
        <div key={li} style={{ display: "flex", flexDirection: "row", alignItems: "flex-end" }}>
          {line.map((word, wi) => {
            const isRed = word.startsWith("*");
            const text  = isRed ? word.slice(1) : word;
            const delay = startFrame + idx++ * INTERVAL;
            const sp    = spring({ frame: frame - delay, fps, config: { damping: 26, stiffness: 220 } });
            const yOffset = (1 - sp) * LINE_H;

            return (
              <div key={wi} style={{
                overflow: "hidden",
                height: LINE_H,
                marginRight: wi < line.length - 1 ? "0.22em" : 0,
                display: "flex",
                alignItems: "flex-end",
              }}>
                <span style={{
                  display: "inline-block",
                  transform: `translateY(${yOffset}px)`,
                  fontSize: FONT_SIZE,
                  fontWeight: 800,
                  fontFamily: FONT,
                  color: isRed ? RED : NAVY,
                  letterSpacing: "-0.5px",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  paddingBottom: 4,
                }}>
                  {text}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

const Q1_LINES = [
  ["Sales", "intelligence"],
  ["finds", "*prospects."],
];

const Q2_LINES = [
  ["Revenue", "intelligence"],
  ["wins", "deals", "and"],
  ["*forecasts", "*outcomes."],
];

const Q1_START = 12;
const Q2_START = 140;

export const FullScreenQuote = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const q1op     = fi(frame, 108, 122, 1, 0);
  const q2op     = fi(frame, Q2_START - 4, Q2_START + 8, 0, 1);
  const borderOp = fi(frame, 0, 18, 0, 1);

  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>

      <Video
        src={staticFile("bg-fullscreen.mp4")}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        startFrom={0}
        muted
      />

      <div style={{
        position: "absolute", inset: 28,
        borderRadius: 28,
        border: "1.5px solid rgba(255,255,255,0.55)",
        opacity: borderOp,
        pointerEvents: "none",
      }}/>

      {/* Quote 1 */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center",
        paddingLeft: "18%",
        opacity: q1op,
      }}>
        <QuoteBlock lines={Q1_LINES} startFrame={Q1_START} frame={frame} fps={fps} />
      </div>

      {/* Quote 2 */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center",
        paddingLeft: "18%",
        opacity: q2op,
      }}>
        <QuoteBlock lines={Q2_LINES} startFrame={Q2_START} frame={frame} fps={fps} />
      </div>

    </AbsoluteFill>
  );
};
