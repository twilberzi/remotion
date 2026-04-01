import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

// ─── Design tokens ────────────────────────────────────────────────────────
const NAVY = "#1e2d5a";
const RED  = "#e8182e";
const FONT = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, s, e, f, t) {
  return interpolate(frame, [s, e], [f, t], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

// ─── Animation breakdown (24fps, ~5.3s = 128 frames) ─────────────────────
// 0–28:   large card sweeps in from left (rotated, scaled large)
// 28–52:  card exits right (rotates + translates off screen)
// 52–72:  "Chapter N" pill badge springs in from above
// 65–88:  title fades + slides up
// 88+:    held final state

export const ChapterSlide = ({ chapterNumber = 1, chapterTitle = "Chapter Title" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Sweeping card ─────────────────────────────────────────────────────
  // Starts off left, rotated -18°, then sweeps across and exits right
  const cardEnterSp = spring({ frame: frame - 0,  fps, config: { damping: 28, stiffness: 60 } });
  const cardExitSp  = spring({ frame: frame - 28, fps, config: { damping: 22, stiffness: 80 } });

  // X: enters from -900 → center (0), then exits to +1200
  const cardX = fi(frame, 0, 28, -900, 80) + fi(frame, 28, 52, 0, 1300);
  // Rotation: starts at -18°, straightens to 0° on entry, then tips to +8° on exit
  const cardRot = fi(frame, 0, 28, -18, -4) + fi(frame, 28, 52, 0, 10);
  // Scale: large on entry (1.3), normalizes to 1.0, shrinks slightly on exit
  const cardScale = fi(frame, 0, 22, 1.35, 1.0) + fi(frame, 28, 52, 0, -0.15);
  const cardOp = fi(frame, 42, 56, 1, 0);

  // ── Badge pill ────────────────────────────────────────────────────────
  const badgeSp  = spring({ frame: frame - 52, fps, config: { damping: 18, stiffness: 180 } });
  const badgeOp  = fi(frame, 52, 65, 0, 1);
  const badgeY   = fi(frame, 52, 68, -18, 0);

  // ── Title ─────────────────────────────────────────────────────────────
  const titleOp  = fi(frame, 65, 82, 0, 1);
  const titleY   = fi(frame, 65, 82, 16, 0);

  return (
    <AbsoluteFill style={{
      // Light blue → white gradient background matching the sample
      background: "linear-gradient(135deg, #d6eef5 0%, #e8f4f9 30%, #f0f8fb 60%, #f8fbff 100%)",
      fontFamily: FONT,
      overflow: "hidden",
    }}>

      {/* ── Sweeping card — uses Icon-box-BLANK asset ──────────────────── */}
      <div style={{
        position: "absolute",
        // Large card, centered vertically, swept horizontally
        left: "50%", top: "50%",
        width: 820, height: 820,
        marginLeft: -410, marginTop: -410,
        transform: `translateX(${cardX}px) rotate(${cardRot}deg) scale(${cardScale})`,
        opacity: cardOp,
        willChange: "transform",
      }}>
        <Img
          src={staticFile("icon-box-blank.png")}
          style={{ width: "100%", height: "100%", objectFit: "fill" }}
        />
      </div>

      {/* ── Final state — badge + title ────────────────────────────────── */}

      {/* Chapter pill badge */}
      <div style={{
        position: "absolute",
        top: "38%", left: 0, right: 0,
        display: "flex", justifyContent: "center",
        opacity: badgeOp,
        transform: `translateY(${badgeY}px) scale(${badgeSp})`,
        transformOrigin: "center center",
      }}>
        <div style={{
          background: RED,
          borderRadius: 99,
          padding: "9px 22px",
          fontSize: 18,
          fontWeight: 700,
          color: "white",
          letterSpacing: "0.2px",
          boxShadow: "0 4px 18px rgba(232,24,46,0.35)",
        }}>
          Chapter {chapterNumber}
        </div>
      </div>

      {/* Chapter title */}
      <div style={{
        position: "absolute",
        top: "48%", left: 0, right: 0,
        textAlign: "center",
        opacity: titleOp,
        transform: `translateY(${titleY}px)`,
        padding: "0 120px",
      }}>
        <div style={{
          fontSize: 58,
          fontWeight: 800,
          color: NAVY,
          lineHeight: 1.15,
          letterSpacing: "-0.5px",
        }}>
          {chapterTitle}
        </div>
      </div>

    </AbsoluteFill>
  );
};
