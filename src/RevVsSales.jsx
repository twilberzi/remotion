import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const NAVY = "#1e2d5a";
const RED  = "#e8182e";
const FONT = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, s, e, f, t) {
  return interpolate(frame, [s, e], [f, t], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

const W = 1920, H = 1080;
const CY = H / 2 + 40;

// ─── Phase 1: Sales Intelligence (0–120) ───────────────────────────────────
const CIRCLES = [
  { x: 560  },
  { x: 720  },
  { x: 880  },
  { x: 1040 }, // target
  { x: 1200 },
  { x: 1360 },
];
const TARGET = 3;
const CR = 46;

// ─── Phase 2: Revenue Intelligence (140–280) ───────────────────────────────
const DEALS = [
  { label: "Acme Corp",   hot: true  },
  { label: "Globex",      hot: false },
  { label: "Initech",     hot: true  },
  { label: "Dunder Mfg",  hot: false },
  { label: "Vance Ltd",   hot: true  },
];
const DW = 200, DH = 60, DGAP = 20;
const DEALS_W = DEALS.length * DW + (DEALS.length - 1) * DGAP;
const DEALS_X0 = W / 2 - DEALS_W / 2;

const BARS = [0.42, 0.58, 0.74, 0.91];
const BW = 70, BSPACING = 110, BMAX = 200;
const BX0 = W / 2 - (BARS.length * BSPACING) / 2 + 20;
const BY0 = H / 2 + 80;

export const RevVsSales = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Phase timing ──────────────────────────────────────────────────────────
  const P1 = 0;    // Sales Intel
  const P2 = 130;  // Rev Intel

  // Cross-fade between phases
  const p1op = fi(frame, 108, 128, 1, 0);
  const p2op = fi(frame, P2, P2 + 18, 0, 1);

  // ── Phase 1 — Sales Intel ─────────────────────────────────────────────────
  // Mag glass: fast right → sweep back left → settle on target (middle)
  // Uses cubic bezier-style keyframe interpolation with easing

  // Segment 1: fast sweep right (frame 18→45)
  const seg1 = fi(frame, 18, 45, CIRCLES[0].x - 20, CIRCLES[5].x + 30);
  // Segment 2: glide back left (frame 45→75)
  const seg2 = fi(frame, 45, 75, CIRCLES[5].x + 30, CIRCLES[1].x);
  // Segment 3: smooth settle on target (frame 75→105) — spring for glidy finish
  const settleSp = spring({ frame: frame - 75, fps, config: { damping: 32, stiffness: 55 } });
  const seg3 = CIRCLES[1].x + (CIRCLES[TARGET].x - CIRCLES[1].x) * settleSp;

  const magXFinal = frame < 45 ? seg1 : frame < 75 ? seg2 : seg3;

  const targetLit = fi(frame, 106, 122, 0, 1);
  const pulseR    = fi(frame, 106, 140, CR, CR + 28);
  const pulseOp   = fi(frame, 106, 140, 0.7, 0);

  const siLabelOp = fi(frame, 0, 16, 0, 1);
  const siLabelY  = fi(frame, 0, 16, 10, 0);

  // ── Phase 2 — Rev Intel (slower, longer) ──────────────────────────────────
  // Deal cards appear slowly staggered
  // Hot ones glow red with long ease
  // Cards slide up gently, bars rise with long spring

  const dealSlide = spring({ frame: frame - (P2 + 110), fps, config: { damping: 28, stiffness: 42 } });
  const dealY     = -dealSlide * 110;
  const dealAlpha = 1 - dealSlide * 0.65;

  const riLabelOp = fi(frame, P2, P2 + 22, 0, 1);
  const riLabelY  = fi(frame, P2, P2 + 22, 10, 0);
  const payoffOp  = fi(frame, P2 + 210, P2 + 230, 0, 1);
  const payoffY   = fi(frame, P2 + 210, P2 + 230, 12, 0);

  return (
    <AbsoluteFill style={{ background: "#f8faff", fontFamily: FONT, overflow: "hidden" }}>

      {/* ══ PHASE 1: SALES INTEL ══════════════════════════════════════════════ */}
      <div style={{ position: "absolute", inset: 0, opacity: p1op }}>

        {/* Label */}
        <div style={{
          position: "absolute", top: 60, left: 0, right: 0, textAlign: "center",
          opacity: siLabelOp, transform: `translateY(${siLabelY}px)`,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, letterSpacing: "2.5px", textTransform: "uppercase", opacity: 0.38 }}>Sales Intelligence</div>
          <div style={{ fontSize: 42, fontWeight: 800, color: NAVY, marginTop: 8 }}>
            Find the right <span style={{ color: RED }}>prospect</span>
          </div>
        </div>

        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          {/* Prospect circles */}
          {CIRCLES.map((c, i) => {
            const delay = 14 + i * 9;
            const sp = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 150 } });
            const isTarget = i === TARGET;
            const filled = isTarget ? targetLit : 0;
            return (
              <g key={i} opacity={Math.min(sp, 1)}>
                {isTarget && (
                  <circle cx={c.x} cy={CY} r={pulseR}
                    fill="none" stroke={RED} strokeWidth={2.5} opacity={pulseOp}/>
                )}
                <circle cx={c.x} cy={CY} r={CR * sp}
                  fill={`rgba(232,24,46,${filled * 0.9})`}
                  stroke={isTarget ? `rgba(232,24,46,${0.2 + filled * 0.8})` : "rgba(30,45,90,0.12)"}
                  strokeWidth={2}/>
                <text x={c.x} y={CY + 6}
                  textAnchor="middle"
                  fill={isTarget && targetLit > 0.4 ? "white" : `rgba(30,45,90,0.45)`}
                  fontSize={13} fontWeight="700" fontFamily={FONT}>
                  {String.fromCharCode(65 + i)}
                </text>
              </g>
            );
          })}

          {/* Magnifying glass */}
          {frame >= 14 && frame < 128 && (
            <g transform={`translate(${magXFinal}, ${CY})`} opacity={fi(frame, 14, 28, 0, 1)}>
              <circle cx={0} cy={0} r={CR + 16}
                fill="none" stroke={NAVY} strokeWidth={3} opacity={0.2}/>
              <circle cx={0} cy={0} r={CR + 16}
                fill="none" stroke={NAVY} strokeWidth={2}
                strokeDasharray="5 7" opacity={0.55}/>
              <line x1={CR + 12} y1={CR + 12} x2={CR + 28} y2={CR + 28}
                stroke={NAVY} strokeWidth={5} strokeLinecap="round" opacity={0.35}/>
            </g>
          )}
        </svg>
      </div>

      {/* ══ PHASE 2: REV INTEL ════════════════════════════════════════════════ */}
      <div style={{ position: "absolute", inset: 0, opacity: p2op }}>

        {/* Label */}
        <div style={{
          position: "absolute", top: 60, left: 0, right: 0, textAlign: "center",
          opacity: riLabelOp, transform: `translateY(${riLabelY}px)`,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, letterSpacing: "2.5px", textTransform: "uppercase", opacity: 0.38 }}>Revenue Intelligence</div>
          <div style={{ fontSize: 42, fontWeight: 800, color: NAVY, marginTop: 8 }}>
            Win deals + <span style={{ color: RED }}>forecast outcomes</span>
          </div>
        </div>

        {/* Deal cards */}
        {DEALS.map((deal, i) => {
          const lf = frame - P2;
          const delay = 22 + i * 18;
          const sp = spring({ frame: lf - delay, fps, config: { damping: 22, stiffness: 100 } });
          const hotDelay = 110 + i * 14;
          const hotOp = deal.hot ? fi(lf, hotDelay, hotDelay + 28, 0, 1) : 0;
          const x = DEALS_X0 + i * (DW + DGAP);
          const y = H / 2 - DH / 2 + dealY;

          return (
            <div key={i} style={{
              position: "absolute",
              left: x, top: y,
              width: DW, height: DH,
              opacity: Math.min(sp, 1) * dealAlpha,
              transform: `scale(${sp})`,
              transformOrigin: "center center",
              background: deal.hot ? `rgba(232,24,46,${hotOp * 0.08})` : "white",
              borderRadius: 14,
              border: deal.hot
                ? `1.5px solid rgba(232,24,46,${0.12 + hotOp * 0.55})`
                : "1.5px solid rgba(30,45,90,0.09)",
              boxShadow: deal.hot
                ? `0 4px 22px rgba(232,24,46,${hotOp * 0.18})`
                : "0 3px 12px rgba(30,45,90,0.07)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                fontSize: 15, fontWeight: 700,
                color: deal.hot && hotOp > 0.5 ? RED : NAVY,
                fontFamily: FONT,
              }}>{deal.label}</div>
            </div>
          );
        })}

        {/* Forecast bars */}
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <g opacity={fi(frame - P2, 100, 118, 0, 1)}>
            {BARS.map((pct, i) => {
              const lf = frame - P2;
              const delay = 130 + i * 22;
              const barH = BMAX * pct * fi(lf, delay, delay + 55, 0, 1);
              const bx = BX0 + i * BSPACING;
              const by = BY0 - barH;
              const isLast = i === BARS.length - 1;
              return (
                <g key={i}>
                  <rect x={bx} y={by} width={BW} height={barH} rx={8}
                    fill={isLast ? RED : `rgba(30,45,90,${0.2 + i * 0.12})`}/>
                  {isLast && barH > 20 && (
                    <text x={bx + BW / 2} y={by - 10}
                      textAnchor="middle" fill={RED}
                      fontSize={14} fontWeight="800" fontFamily={FONT}>
                      91%
                    </text>
                  )}
                  <text x={bx + BW / 2} y={BY0 + 22}
                    textAnchor="middle" fill={NAVY}
                    fontSize={12} fontWeight="600" fontFamily={FONT} opacity={0.4}>
                    Q{i + 1}
                  </text>
                </g>
              );
            })}
            <line x1={BX0 - 16} y1={BY0} x2={BX0 + BARS.length * BSPACING} y2={BY0}
              stroke={NAVY} strokeWidth={1.5} opacity={0.12}/>
          </g>
        </svg>

        {/* Payoff */}
        <div style={{
          position: "absolute", bottom: 54, left: 0, right: 0, textAlign: "center",
          opacity: payoffOp, transform: `translateY(${payoffY}px)`,
        }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: NAVY, opacity: 0.72 }}>
            Sales intelligence starts conversations.{" "}
            <span style={{ color: RED }}>Revenue intelligence closes them.</span>
          </div>
        </div>

      </div>

    </AbsoluteFill>
  );
};
