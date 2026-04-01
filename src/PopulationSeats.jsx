import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const NAVY  = "#1e2d5a";
const PURPLE = "#6b5fc7";
const BG    = "#f0ede6"; // parchment/stone background matching screenshot
const FONT  = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, s, e, f, t) {
  return interpolate(frame, [s, e], [f, t], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

// Chart layout
const CHART_L = 148;  // left edge (y-axis)
const CHART_R = 1760; // right edge
const CHART_T = 110;  // top edge
const CHART_B = 900;  // bottom edge (x-axis)
const CW = CHART_R - CHART_L;
const CH = CHART_B - CHART_T;

// Axis ranges
const MAX_X = 320e6;   // 320M population
const MAX_Y = 720;     // 720 representatives

function toChartX(pop) {
  return CHART_L + (pop / MAX_X) * CW;
}
function toChartY(seats) {
  return CHART_B - (seats / MAX_Y) * CH;
}

// All 31 country data points (approximate from chart)
const COUNTRIES = [
  // labeled dark dots
  { label: "United Kingdom", pop: 67e6,  seats: 650, dark: true,  lx:  10, ly: -22 },
  { label: "Turkey",         pop: 84e6,  seats: 550, dark: true,  lx:  10, ly: -22 },
  { label: "Mexico",         pop: 130e6, seats: 500, dark: true,  lx:  10, ly: -22 },
  { label: "Japan",          pop: 126e6, seats: 465, dark: true,  lx:  10, ly:  18 },
  { label: "Poland",         pop: 38e6,  seats: 460, dark: true,  lx: -60, ly: -22 },
  { label: "Canada",         pop: 38e6,  seats: 338, dark: true,  lx: -62, ly:  16 },
  { label: "Colombia",       pop: 50e6,  seats: 166, dark: true,  lx:  10, ly:  18 },
  // unlabeled gray dots
  { label: null, pop:  4e6,  seats:  56 },
  { label: null, pop:  5e6,  seats:  60 },
  { label: null, pop:  5.5e6,seats: 105 },
  { label: null, pop:  8e6,  seats: 183 },
  { label: null, pop:  9e6,  seats: 200 },
  { label: null, pop: 10e6,  seats: 150 },
  { label: null, pop: 11e6,  seats: 150 },
  { label: null, pop: 12e6,  seats: 200 },
  { label: null, pop: 14e6,  seats: 120 },
  { label: null, pop: 17e6,  seats: 165 },
  { label: null, pop: 18e6,  seats: 200 },
  { label: null, pop: 19e6,  seats: 180 },
  { label: null, pop: 20e6,  seats: 295 },
  { label: null, pop: 21e6,  seats: 298 },
  { label: null, pop: 22e6,  seats: 200 },
  { label: null, pop: 25e6,  seats: 575 },
  { label: null, pop: 30e6,  seats: 620 },
  { label: null, pop: 33e6,  seats: 350 },
  { label: null, pop: 45e6,  seats: 350 },
  { label: null, pop: 47e6,  seats: 350 },
  { label: null, pop: 52e6,  seats: 625 },
  { label: null, pop: 54e6,  seats: 575 },
  { label: null, pop: 60e6,  seats: 630 },
  { label: null, pop: 83e6,  seats: 736 },
];

// X-axis tick marks
const X_TICKS = [0, 50e6, 100e6, 150e6, 200e6, 250e6, 300e6];
// Y-axis tick marks
const Y_TICKS = [0, 100, 200, 300, 400, 500, 600, 700];

function formatM(n) {
  if (n === 0) return "0";
  return (n / 1e6) + "M";
}

// Cube-root line points — y = 2.5 * cbrt(pop) scaled to chart coordinates
// Formula from cube root law: seats ≈ 2 * population^(1/3)
// Fitted to match the line in the chart
const CURVE_POINTS = (() => {
  const pts = [];
  for (let i = 0; i <= 100; i++) {
    const pop = (i / 100) * MAX_X;
    const seats = 2.45 * Math.cbrt(pop);
    if (seats <= MAX_Y) {
      pts.push({ x: toChartX(pop), y: toChartY(seats) });
    }
  }
  return pts;
})();

// Build SVG polyline path string
function curvePath(progress) {
  const count = Math.max(2, Math.round(progress * CURVE_POINTS.length));
  const pts = CURVE_POINTS.slice(0, count);
  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}

// Animation timing
// 0–40:   axes draw in
// 40–100: dots pop in (staggered)
// 110–180: dashed curve draws across
// 185–220: "Cube Root" label fades in
const AXIS_END    = 40;
const DOTS_START  = 45;
const DOTS_STAGGER = 5;
const CURVE_START = 110;
const CURVE_END   = 185;
const LABEL_START = 185;

export const PopulationSeats = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Axes
  const axisProgress = fi(frame, 0, AXIS_END, 0, 1);
  const xAxisW = axisProgress * CW;
  const yAxisH = axisProgress * CH;

  // Title fade in
  const titleOp = fi(frame, 0, 20, 0, 1);
  const titleY  = fi(frame, 0, 20, 8, 0);

  // Curve
  const curveProgress = fi(frame, CURVE_START, CURVE_END, 0, 1);
  const curveLabelOp  = fi(frame, LABEL_START, LABEL_START + 20, 0, 1);

  // Grid lines opacity
  const gridOp = fi(frame, 20, AXIS_END, 0, 0.18);

  return (
    <AbsoluteFill style={{ background: BG, fontFamily: FONT, overflow: "hidden" }}>

      {/* Title block */}
      <div style={{
        position: "absolute", top: 32, left: CHART_L - 10,
        opacity: titleOp, transform: `translateY(${titleY}px)`,
      }}>
        <div style={{ fontSize: 36, fontWeight: 800, color: NAVY, lineHeight: 1.1 }}>
          Population and seats in 31 countries
        </div>
        <div style={{ fontSize: 19, fontWeight: 600, color: NAVY, opacity: 0.5, marginTop: 4, fontStyle: "italic" }}>
          OECD
        </div>
      </div>

      {/* Y-axis label */}
      <div style={{
        position: "absolute",
        left: 20,
        top: CHART_T + CH / 2,
        transform: "translateY(-50%) rotate(-90deg)",
        transformOrigin: "center center",
        fontSize: 18, fontWeight: 600, color: NAVY, opacity: axisProgress * 0.75,
        whiteSpace: "nowrap",
      }}>
        Representatives
      </div>

      {/* X-axis label */}
      <div style={{
        position: "absolute",
        left: CHART_L + CW / 2,
        bottom: 24,
        transform: "translateX(-50%)",
        fontSize: 18, fontWeight: 600, color: NAVY, opacity: axisProgress * 0.75,
        whiteSpace: "nowrap",
      }}>
        Total population
      </div>

      {/* SVG — axes, grid, dots, curve */}
      <svg
        width={1920} height={1080}
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        {/* Grid lines — horizontal */}
        {Y_TICKS.filter(v => v > 0).map(v => {
          const y = toChartY(v);
          return (
            <line key={v}
              x1={CHART_L} y1={y} x2={CHART_R} y2={y}
              stroke={NAVY} strokeWidth={1} opacity={gridOp}
            />
          );
        })}

        {/* Grid lines — vertical */}
        {X_TICKS.filter(v => v > 0).map(v => {
          const x = toChartX(v);
          return (
            <line key={v}
              x1={x} y1={CHART_T} x2={x} y2={CHART_B}
              stroke={NAVY} strokeWidth={1} opacity={gridOp}
            />
          );
        })}

        {/* Y axis */}
        <line
          x1={CHART_L} y1={CHART_B}
          x2={CHART_L} y2={CHART_B - yAxisH}
          stroke={NAVY} strokeWidth={2.5}
          strokeLinecap="round"
        />

        {/* X axis */}
        <line
          x1={CHART_L} y1={CHART_B}
          x2={CHART_L + xAxisW} y2={CHART_B}
          stroke={NAVY} strokeWidth={2.5}
          strokeLinecap="round"
        />

        {/* Y axis tick labels */}
        {Y_TICKS.map(v => {
          const y = toChartY(v);
          return (
            <text key={v}
              x={CHART_L - 14} y={y + 6}
              textAnchor="end"
              fontSize={18} fontWeight={600}
              fill={NAVY} opacity={axisProgress * 0.7}
              fontFamily={FONT}
            >{v}</text>
          );
        })}

        {/* X axis tick labels */}
        {X_TICKS.map(v => {
          const x = toChartX(v);
          return (
            <text key={v}
              x={x} y={CHART_B + 36}
              textAnchor="middle"
              fontSize={18} fontWeight={600}
              fill={NAVY} opacity={axisProgress * 0.7}
              fontFamily={FONT}
            >{formatM(v)}</text>
          );
        })}

        {/* Data dots */}
        {COUNTRIES.map((c, i) => {
          const delay = DOTS_START + i * DOTS_STAGGER;
          const sp = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 200 } });
          const op = fi(frame, delay, delay + 10, 0, 1);
          const cx = toChartX(c.pop);
          const cy = toChartY(c.seats);
          const r  = c.dark ? 14 : 12;
          const fill = c.dark ? "#3a3a4a" : "rgba(100,100,120,0.45)";
          return (
            <g key={i} transform={`translate(${cx},${cy})`} opacity={op}>
              <circle
                cx={0} cy={0} r={r * sp}
                fill={fill}
              />
              {c.label && (
                <text
                  x={(c.lx ?? 16)} y={(c.ly ?? -14) + 5}
                  fontSize={16} fontWeight={700}
                  fill={NAVY}
                  fontFamily={FONT}
                  opacity={sp}
                >{c.label}</text>
              )}
            </g>
          );
        })}

        {/* Dashed cube-root curve */}
        {curveProgress > 0.01 && (
          <path
            d={curvePath(curveProgress)}
            fill="none"
            stroke={PURPLE}
            strokeWidth={3.5}
            strokeDasharray="12 8"
            strokeLinecap="round"
            opacity={0.85}
          />
        )}

        {/* "Cube Root" italic label on the curve */}
        {curveLabelOp > 0 && (() => {
          const labelPop = 240e6;
          const labelSeats = 2.45 * Math.cbrt(labelPop);
          const lx = toChartX(labelPop);
          const ly = toChartY(labelSeats);
          return (
            <text
              x={lx} y={ly - 18}
              fontSize={22} fontWeight={700} fontStyle="italic"
              fill={PURPLE} opacity={curveLabelOp}
              fontFamily={FONT}
              transform={`rotate(-14, ${lx}, ${ly - 18})`}
            >Cube Root</text>
          );
        })()}

      </svg>

    </AbsoluteFill>
  );
};
