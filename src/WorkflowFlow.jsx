import { useCurrentFrame, useVideoConfig, interpolate, staticFile, Img } from "remotion";

const NAVY = "#1e2d5a";
const NAVY_RGB = [30, 45, 90];
const BORDER_IDLE_RGB = [0xb0, 0xbc, 0xd4];
const FONT = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";

// ZI brand red gradient stops
const RED_A = [232, 24, 46];
const RED_B = [194, 24, 91];

const STEPS = [
  { label: "AUDIENCE",  sub: "Filter your targets" },
  { label: "ENRICH",    sub: "Add account context" },
  { label: "SCORE",     sub: "Prioritize with AI" },
  { label: "CONTACTS",  sub: "Find the right people" },
  { label: "VERIFY",    sub: "Confirm email validity" },
  { label: "MESSAGING", sub: "Generate personalized outreach" },
  { label: "ACTIVATE",  sub: "Export to Outreach" },
];

const HOLD = 150;
const XFADE = 18;
const STEP_DUR = HOLD + XFADE;

const CARD_W = 295;
const CARD_H = 94;
const ARROW_H = 36;
const GAP = 2;
const V_PAD = 40;

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function smoothstep(x) {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
}

// 0→1 highlight weight for the active card — always continuous
function getHighlight(frame, i) {
  const fadeIn  = smoothstep(fi(frame, i * STEP_DUR, i * STEP_DUR + XFADE, 0, 1));
  const fadeOut = smoothstep(fi(frame, i * STEP_DUR + HOLD, i * STEP_DUR + HOLD + XFADE, 0, 1));
  return Math.max(0, Math.min(1, fadeIn)) * Math.max(0, Math.min(1, 1 - fadeOut));
}

function lerpRgb(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function rgb(c) { return `rgb(${c[0]},${c[1]},${c[2]})`; }

export function WorkflowFlow() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const W = width / 2;
  const H = height / 2;
  const totalFlowH = STEPS.length * CARD_H + (STEPS.length - 1) * (ARROW_H + GAP * 2);
  const startY = Math.max(V_PAD, (H - totalFlowH) / 2);
  const cx = W / 2;

  // Which step index has fully passed (hw settled to 0 after being active)
  // A card is "past" once the next card has started its fade-in
  const activeStep = Math.min(Math.floor(frame / STEP_DUR), STEPS.length - 1);

  return (
    <div style={{
      width,
      height,
      background: "transparent",
      position: "relative",
      overflow: "hidden",
      fontFamily: FONT,
    }}>
      {/* Scale 2× from top-left to fill 4K canvas */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: width / 2,
        height: height / 2,
        transformOrigin: "top left",
        transform: "scale(2)",
      }}>
      {STEPS.map((step, i) => {
        const cardY = startY + i * (CARD_H + ARROW_H + GAP * 2);
        const hw = getHighlight(frame, i); // [0,1], always continuous

        // A card is "past" once it has been active and the next card has taken over
        // Use a threshold so the transition is complete before we flip
        const isPast = i < activeStep || (i === activeStep - 1 && hw < 0.01);

        // --- Background ---
        // Future/past: white. Active: red gradient (interpolated via hw)
        // Past: stays white — no background change needed
        const bgA = lerpRgb([255, 255, 255], RED_A, hw);
        const bgB = lerpRgb([255, 255, 255], RED_B, hw);
        const background = `linear-gradient(135deg, ${rgb(bgA)} 0%, ${rgb(bgB)} 100%)`;

        // --- Border ---
        // Future: muted gray. Past: solid navy. Active: fades out (gradient hides it)
        let borderColor;
        if (isPast) {
          borderColor = NAVY;
        } else {
          // Lerp from idle gray toward transparent as card activates
          const bAlpha = (1 - hw).toFixed(3);
          borderColor = `rgba(${BORDER_IDLE_RGB[0]},${BORDER_IDLE_RGB[1]},${BORDER_IDLE_RGB[2]},${bAlpha})`;
        }
        const borderWidth = isPast ? 2 : 2;

        // --- Shadow ---
        const shadowAlpha = (hw * 0.14).toFixed(3);
        const boxShadow = hw > 0.01
          ? `0 4px ${Math.round(4 + hw * 18)}px rgba(232,24,46,${shadowAlpha})`
          : "none";

        // --- Label color ---
        // Future: muted gray. Past: navy. Active: white (via hw)
        const LABEL_IDLE = [0x94, 0xa3, 0xb8];
        let labelColor;
        if (isPast) {
          labelColor = NAVY;
        } else {
          labelColor = rgb(lerpRgb(LABEL_IDLE, [255, 255, 255], hw));
        }

        // --- Subtext color ---
        // Future: light gray. Past: navy (slightly lighter). Active: white
        let subColor;
        if (isPast) {
          subColor = `rgba(30,45,90,0.65)`;
        } else {
          subColor = rgb(lerpRgb([0xc8, 0xd0, 0xdc], [255, 255, 255], hw));
        }

        // Subtle upward drift on subtext while active
        const subDrift = isPast ? 0 : fi(hw, 0, 1, 4, 0);

        // --- Arrow ---
        const hasArrow = i < STEPS.length - 1;
        // Past arrows: full navy opacity. Active: bright. Future: dim
        const arrowOpacity = isPast ? 0.7 : 0.28 + hw * 0.55;

        return (
          <div key={i}>
            <div style={{
              position: "absolute",
              left: cx - CARD_W / 2,
              top: cardY,
              width: CARD_W,
              height: CARD_H,
              background,
              borderRadius: 24,
              border: `${borderWidth}px solid ${borderColor}`,
              boxShadow,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              boxSizing: "border-box",
              padding: "0 24px",
            }}>
              <div style={{
                fontFamily: FONT,
                fontSize: 24,
                fontWeight: 800,
                color: labelColor,
                letterSpacing: 1.8,
                lineHeight: 1,
              }}>
                {step.label}
              </div>
              <div style={{
                fontFamily: FONT,
                fontSize: 18,
                fontWeight: 500,
                color: subColor,
                letterSpacing: 0.1,
                lineHeight: 1,
                textAlign: "center",
                transform: `translateY(${subDrift}px)`,
              }}>
                {step.sub}
              </div>
            </div>

            {hasArrow && (
              <div style={{
                position: "absolute",
                left: cx - 14,
                top: cardY + CARD_H + GAP,
                width: 28,
                height: ARROW_H,
                opacity: arrowOpacity,
              }}>
                <Img
                  src={staticFile("workflow-arrow.png")}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
}
