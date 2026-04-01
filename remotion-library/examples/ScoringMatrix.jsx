/**
 * Scoring Matrix Scene (from GTM Explained series)
 * 4×4 matrix: Demographic score (rows) vs Behavior score (cols).
 * Cells classify leads: Send to sales / Sales-oriented nurturing / General nurturing / Possibly purge.
 * Hot cells glow and pulse after grid is revealed.
 * Duration: ~210 frames @ 30fps
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

export function ScoringMatrix() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const colHeaders = ["50+", "25–50", "2–24", "<2"];
  const rowHeaders = ["50+", "25–50", "2–24", "<2"];

  const cells = [
    [{ text: "Send to\nsales", h: "hot" },  { text: "Send to\nsales", h: "hot" },  { text: "Sales-oriented\nnurturing", h: "warm" }, { text: "General\nnurturing", h: "none" }],
    [{ text: "Send to\nsales", h: "hot" },  { text: "Sales-oriented\nnurturing", h: "warm" }, { text: "Sales-oriented\nnurturing", h: "warm" }, { text: "General\nnurturing", h: "none" }],
    [{ text: "Sales-oriented\nnurturing", h: "warm" }, { text: "Sales-oriented\nnurturing", h: "warm" }, { text: "Sales-oriented\nnurturing", h: "warm" }, { text: "General\nnurturing", h: "none" }],
    [{ text: "General\nnurturing", h: "none" }, { text: "General\nnurturing", h: "none" }, { text: "General\nnurturing", h: "none" }, { text: "Possibly purge /\ncheck for spam", h: "purge" }],
  ];

  const cellBg   = { hot: `linear-gradient(135deg, ${RED}, ${PINK})`, warm: "#dbeafe", none: "#f0f4ff", purge: "#fce7f3" };
  const cellText = { hot: "white", warm: NAVY, none: NAVY, purge: NAVY };

  const CELL_W = 190, CELL_H = 100, HEADER_W = 110, HEADER_H = 48, GAP = 6;
  const gridDelay = 20;
  const highlightPhase = frame > 110;
  const pulse = highlightPhase ? 0.85 + 0.15 * Math.sin(((frame - 110) / 20) * Math.PI * 2) : 1;

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative" }}>

        <div style={{
          position: "absolute", left: -28, top: "50%",
          transform: "translateX(-100%) translateY(-50%) rotate(-90deg)", transformOrigin: "right center",
          fontSize: 16, fontWeight: 700, color: NAVY, fontFamily: FONT, letterSpacing: "1px",
          opacity: fi(frame, 0, 20, 0, 1), whiteSpace: "nowrap",
        }}>DEMOGRAPHICS SCORE</div>
        <div style={{
          position: "absolute", top: -38, left: HEADER_W + 20, right: 0,
          textAlign: "center", fontSize: 16, fontWeight: 700, color: NAVY,
          fontFamily: FONT, letterSpacing: "1px", opacity: fi(frame, 0, 20, 0, 1),
        }}>BEHAVIOR SCORE</div>

        <div style={{ display: "flex", marginLeft: HEADER_W + GAP, gap: GAP, marginBottom: GAP }}>
          {colHeaders.map((h, ci) => (
            <div key={ci} style={{
              width: CELL_W, height: HEADER_H, opacity: fi(frame, ci * 8, ci * 8 + 18, 0, 1),
              display: "flex", alignItems: "center", justifyContent: "center",
              background: NAVY, borderRadius: 10,
              fontSize: 17, fontWeight: 800, color: "white", fontFamily: FONT,
            }}>{h}</div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>
          {cells.map((row, ri) => (
            <div key={ri} style={{ display: "flex", gap: GAP, opacity: fi(frame, gridDelay + ri * 16, gridDelay + ri * 16 + 20, 0, 1) }}>
              <div style={{
                width: HEADER_W, height: CELL_H,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: NAVY, borderRadius: 10,
                fontSize: 17, fontWeight: 800, color: "white", fontFamily: FONT,
              }}>{rowHeaders[ri]}</div>
              {row.map((cell, ci) => {
                const isHot = cell.h === "hot";
                const cellSp = spring({ frame: frame - gridDelay - ri * 16 - ci * 6, fps, config: { damping: 28, stiffness: 170 } });
                return (
                  <div key={ci} style={{
                    width: CELL_W, height: CELL_H,
                    background: cellBg[cell.h], borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transform: `scale(${cellSp}) ${isHot && highlightPhase ? `scale(${pulse})` : ""}`,
                    boxShadow: isHot && highlightPhase ? `0 0 ${20 * pulse}px rgba(232,24,46,0.5)` : "0 2px 8px rgba(0,0,60,0.07)",
                    border: isHot ? "none" : "1px solid rgba(30,45,90,0.08)",
                  }}>
                    <div style={{ fontSize: 14, fontWeight: isHot ? 700 : 600, color: cellText[cell.h], fontFamily: FONT, textAlign: "center", lineHeight: 1.4, whiteSpace: "pre-line" }}>{cell.text}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
}
