import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

// ─── Style inspired by Calm Stomp Intro ───────────────────────────────────────
// Deep navy bg, center-screen kinetic text
// Purple accent (#6c63ff) for key words, white for the rest
// Words stomp in one at a time, building sentences

const BG      = "#0d0f1a";
const PURPLE  = "#6c63ff";
const WHITE   = "#ffffff";
const DIM     = "rgba(255,255,255,0.45)";
const FONT    = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ─── Single word that stomps in ───────────────────────────────────────────────
// Motion: scales from 1.3→1.0 + fades in very fast (4 frames)
function Stomp({ word, frame, delay, color = WHITE, size = 110, italic = false }) {
  const sp  = spring({ frame: frame - delay, fps: 30, config: { damping: 9, stiffness: 300 } });
  const op  = fi(frame, delay, delay + 5, 0, 1);
  const sc  = 1.3 - sp * 0.3; // 1.3 → 1.0

  return (
    <span style={{
      display: "inline-block",
      color,
      fontSize: size,
      fontWeight: 800,
      fontStyle: italic ? "italic" : "normal",
      fontFamily: FONT,
      letterSpacing: "-2px",
      lineHeight: 1,
      opacity: op,
      transform: `scale(${sc})`,
      transformOrigin: "center bottom",
      marginRight: size * 0.18,
    }}>
      {word}
    </span>
  );
}

// ─── A line of stomped words ──────────────────────────────────────────────────
function StompLine({ words, frame, baseDelay, size = 110, gap = 0 }) {
  // words: [{ text, color?, italic? }]
  return (
    <div style={{
      display: "flex",
      alignItems: "baseline",
      justifyContent: "center",
      flexWrap: "wrap",
      gap,
    }}>
      {words.map((w, i) => (
        <Stomp
          key={i}
          word={w.text}
          frame={frame}
          delay={baseDelay + i * 7}
          color={w.color || WHITE}
          size={size}
          italic={w.italic}
        />
      ))}
    </div>
  );
}

// ─── Full-screen text take ────────────────────────────────────────────────────
// Fades entire take out at exitFrame
function Take({ children, frame, enterFrame = 0, exitFrame = 9999 }) {
  const inOp  = fi(frame, enterFrame, enterFrame + 3, 0, 1);
  const outOp = fi(frame, exitFrame, exitFrame + 6, 1, 0);
  const op    = Math.min(inOp, outOp);
  if (frame < enterFrame || frame > exitFrame + 6) return null;
  return (
    <AbsoluteFill style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      opacity: op,
    }}>
      {children}
    </AbsoluteFill>
  );
}

// ─── Scene timing ─────────────────────────────────────────────────────────────
// Take 1 (0–44):    "B2B" → "DATA" → dim subtext
// Take 2 (48–95):   "verified" → "information" — full sentence builds
// Take 3 (98–148):  company size / industry / contact details / tech stack
// Take 4 (152–200): "Revenue teams" → "decide" → who/when chips

export const B2BDataStomp = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: FONT, overflow: "hidden" }}>

      {/* ── Take 1: "B2B DATA" ── */}
      <Take frame={frame} enterFrame={0} exitFrame={42}>
        <div style={{ textAlign: "center", lineHeight: 0.9 }}>
          <StompLine
            words={[{ text: "B2B", color: PURPLE }]}
            frame={frame} baseDelay={2} size={160}
          />
          <StompLine
            words={[{ text: "DATA", color: WHITE }]}
            frame={frame} baseDelay={10} size={160}
          />
          <div style={{
            marginTop: 28,
            fontSize: 22, fontWeight: 400,
            color: DIM,
            opacity: fi(frame, 18, 30, 0, 1),
            letterSpacing: "0.5px",
          }}>
            verified · companies · people
          </div>
        </div>
      </Take>

      {/* ── Take 2: "verified information about companies and the people who work there" ── */}
      <Take frame={frame} enterFrame={48} exitFrame={93}>
        <div style={{ textAlign: "center", maxWidth: 1300 }}>
          <StompLine
            words={[
              { text: "Verified", color: PURPLE },
              { text: "information" },
            ]}
            frame={frame} baseDelay={50} size={88}
          />
          <StompLine
            words={[
              { text: "about" },
              { text: "companies", color: PURPLE },
            ]}
            frame={frame} baseDelay={64} size={88}
          />
          <StompLine
            words={[
              { text: "and" },
              { text: "the" },
              { text: "people", color: PURPLE },
              { text: "who" },
              { text: "work" },
              { text: "there." },
            ]}
            frame={frame} baseDelay={76} size={64}
          />
        </div>
      </Take>

      {/* ── Take 3: What it includes — words stomp in one-by-one ── */}
      <Take frame={frame} enterFrame={98} exitFrame={145}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 16, fontWeight: 700, letterSpacing: "4px",
            color: PURPLE, textTransform: "uppercase",
            marginBottom: 32,
            opacity: fi(frame, 98, 108, 0, 1),
          }}>It includes</div>

          {[
            { text: "Company size",    delay: 106, color: WHITE  },
            { text: "Industry",        delay: 116, color: PURPLE },
            { text: "Contact details", delay: 126, color: WHITE  },
            { text: "Tech stack",      delay: 134, color: PURPLE },
          ].map((item, i) => {
            const sp = spring({ frame: frame - item.delay, fps: 30, config: { damping: 9, stiffness: 300 } });
            const op = fi(frame, item.delay, item.delay + 5, 0, 1);
            return (
              <div key={i} style={{
                fontSize: 76, fontWeight: 800,
                color: item.color,
                letterSpacing: "-1.5px",
                lineHeight: 1.1,
                opacity: op,
                transform: `scale(${1.25 - sp * 0.25})`,
                transformOrigin: "center center",
                display: "block",
              }}>
                {item.text}
              </div>
            );
          })}
        </div>
      </Take>

      {/* ── Take 4: Revenue teams decide who, and when ── */}
      <Take frame={frame} enterFrame={152} exitFrame={200}>
        <div style={{ textAlign: "center" }}>
          <StompLine
            words={[
              { text: "Revenue", color: DIM },
              { text: "teams", color: DIM },
              { text: "use" },
              { text: "this" },
              { text: "to" },
            ]}
            frame={frame} baseDelay={154} size={60}
          />
          <div style={{ marginTop: 12 }}>
            <StompLine
              words={[
                { text: "decide", color: PURPLE },
              ]}
              frame={frame} baseDelay={176} size={150}
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <StompLine
              words={[
                { text: "who,", color: WHITE },
                { text: "and", color: DIM },
                { text: "when.", color: WHITE },
              ]}
              frame={frame} baseDelay={184} size={72}
            />
          </div>
        </div>
      </Take>

    </AbsoluteFill>
  );
};
