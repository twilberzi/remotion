import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  useVideoConfig,
  spring,
} from "remotion";

const FONT_SERIF = "Georgia, 'Times New Roman', serif";
const FONT_SANS  = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ─── Full daily data (Jan 2 – Mar 6, 2026) ───────────────────────────────────
const RAW = [
  // [label, CRM, HUBS, GTM]
  ["Jan 2",  253.62, 382.23, 9.61],
  ["Jan 6",  262.90, 396.00, 10.49],
  ["Jan 7",  266.12, 398.22, 10.48],
  ["Jan 8",  260.53, 369.90, 10.58],
  ["Jan 9",  259.94, 371.56, 10.40],
  ["Jan 12", 259.40, 375.96, 10.47],
  ["Jan 13", 241.06, 358.89, 10.06],
  ["Jan 14", 239.57, 345.30, 10.08],
  ["Jan 15", 233.53, 329.24, 10.00],
  ["Jan 16", 227.11, 311.88,  9.04],
  ["Jan 20", 220.07, 304.79,  8.79],
  ["Jan 21", 221.58, 302.32,  8.76],
  ["Jan 22", 228.09, 319.50,  9.12],
  ["Jan 23", 228.05, 322.78,  8.82],
  ["Jan 26", 229.40, 328.99,  8.91],
  ["Jan 27", 228.53, 319.66,  8.72],
  ["Jan 28", 227.96, 317.11,  8.72],
  ["Jan 29", 214.08, 281.53,  8.19],
  ["Jan 30", 212.29, 280.00,  8.05],
  ["Feb 2",  210.81, 274.06,  7.81],
  ["Feb 3",  196.38, 245.16,  6.92],
  ["Feb 4",  199.44, 243.93,  6.87],
  ["Feb 5",  189.97, 223.49,  6.78],
  ["Feb 6",  191.35, 232.58,  7.31],
  ["Feb 9",  194.03, 231.08,  7.32],
  ["Feb 10", 193.45, 231.95,  6.63],
  ["Feb 11", 185.00, 209.33,  6.56],
  ["Feb 12", 185.43, 228.95,  6.30],
  ["Feb 13", 189.72, 243.85,  6.36],
  ["Feb 17", 184.29, 247.31,  6.49],
  ["Feb 18", 187.79, 250.14,  6.60],
  ["Feb 19", 185.29, 239.37,  6.43],
  ["Feb 20", 185.16, 233.50,  6.45],
  ["Feb 23", 178.16, 217.36,  6.03],
  ["Feb 24", 185.42, 232.60,  5.99],
  ["Feb 25", 191.75, 245.70,  6.13],
  ["Feb 26", 199.47, 268.52,  6.40],
  ["Feb 27", 194.79, 264.51,  6.21],
  ["Mar 2",  192.95, 263.60,  6.18],
  ["Mar 3",  196.05, 275.37,  6.23],
  ["Mar 4",  193.08, 278.59,  6.24],
  ["Mar 5",  201.39, 291.47,  6.59],
  ["Mar 6",  202.11, 296.56,  6.56],
];

const N      = RAW.length;
const LABELS = RAW.map(r => r[0]);
const CRM    = RAW.map(r => r[1]);
const HUBS   = RAW.map(r => r[2]);
const GTM    = RAW.map(r => r[3]);

// ─── Chart geometry ───────────────────────────────────────────────────────────
const L = 200;   // left axis
const R = 1720;  // right edge
const T = 200;   // top of plot
const B = 880;   // bottom of plot
const W = R - L;
const H = B - T;

// Left axis: CRM + HUBS share scale
const Y_MIN = 150, Y_MAX = 430;
// Right axis: GTM
const G_MIN = 4.5, G_MAX = 12;

function xAt(i) { return L + (i / (N - 1)) * W; }
function yL(v)  { return B - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * H; }
function yR(v)  { return B - ((v - G_MIN) / (G_MAX - G_MIN)) * H; }

// ─── Grid ─────────────────────────────────────────────────────────────────────
const LEFT_TICKS  = [160, 200, 240, 280, 320, 360, 400];
// x-grid at month boundaries + every other label
const X_LABELS    = ["Jan 2","Jan 9","Jan 16","Jan 23","Jan 30","Feb 6","Feb 13","Feb 20","Feb 27","Mar 6"];
const RIGHT_TICKS = [5, 6, 7, 8, 9, 10, 11];

// ─── SVG path builder (draws left-to-right with progress 0→1) ─────────────────
// Uses SVG stroke-dasharray trick for smooth line reveal
// Returns total path length estimate and the d string

function buildLinePath(prices, yFn) {
  let d = "";
  for (let i = 0; i < N; i++) {
    const x = xAt(i);
    const y = yFn(prices[i]);
    if (i === 0) d += `M ${x} ${y}`;
    else {
      // smooth cardinal spline via cubic bezier
      const px = xAt(i - 1), py = yFn(prices[i - 1]);
      const cpx = (px + x) / 2;
      d += ` C ${cpx} ${py} ${cpx} ${y} ${x} ${y}`;
    }
  }
  return d;
}

function buildAreaPath(prices, yFn) {
  const line = buildLinePath(prices, yFn);
  return `${line} L ${xAt(N-1)} ${B} L ${xAt(0)} ${B} Z`;
}

// ─── Leading dot position at progress p ───────────────────────────────────────
function dotAt(prices, yFn, progress) {
  const fi2 = (v, min, max, a, b) =>
    a + ((v - min) / (max - min)) * (b - a);
  const pos = progress * (N - 1);
  const i0  = Math.floor(pos);
  const i1  = Math.min(N - 1, i0 + 1);
  const t   = pos - i0;
  const x   = xAt(i0) + (xAt(i1) - xAt(i0)) * t;
  const y   = yFn(prices[i0]) + (yFn(prices[i1]) - yFn(prices[i0])) * t;
  return { x, y };
}

// ─── Clip rect for draw-in reveal ─────────────────────────────────────────────
// A clipPath that reveals from left to right
function ClipRect({ id, progress }) {
  const clipW = L + (progress * W) + 20; // slight overshoot
  return (
    <defs>
      <clipPath id={id}>
        <rect x={L} y={0} width={Math.max(0, clipW - L)} height={1080}/>
      </clipPath>
    </defs>
  );
}

// ─── Inline series label ──────────────────────────────────────────────────────
function SeriesLabel({ text, x, y, bg, frame, delay }) {
  const sp = spring({ frame: frame - delay, fps: 30, config: { damping: 14, stiffness: 160 } });
  const op = fi(frame, delay, delay + 10, 0, 1);
  const W2 = text.length * 8.5 + 20;
  return (
    <g opacity={op} transform={`scale(${0.7 + sp * 0.3}) translate(${x * (1 - (0.7 + sp * 0.3))}, ${y * (1 - (0.7 + sp * 0.3))})`}
      style={{ transformOrigin: `${x}px ${y}px` }}>
      <rect x={x - W2/2} y={y - 13} width={W2} height={26} rx={3} fill={bg}/>
      <text x={x} y={y + 5} fontSize={15} fontWeight={700}
        fontFamily={FONT_SANS} fill="white" textAnchor="middle"
        letterSpacing="0.3">{text}</text>
    </g>
  );
}

// ─── Timing ───────────────────────────────────────────────────────────────────
// 0–16:    frame, axes, grid fade in
// 16–110:  CRM draws left→right
// 90–180:  HUBS draws left→right
// 155–220: GTM draws left→right
// 210+:    all labels pop in

export const StockChart = () => {
  const frame = useCurrentFrame();

  const bgOp   = fi(frame, 0, 16, 0, 1);
  const crmP   = fi(frame, 16, 110, 0, 1);
  const hubsP  = fi(frame, 90, 180, 0, 1);
  const gtmP   = fi(frame, 155, 220, 0, 1);

  const crmDot  = dotAt(CRM,  yL, crmP);
  const hubsDot = dotAt(HUBS, yL, hubsP);
  const gtmDot  = dotAt(GTM,  yR, gtmP);

  const crmArea  = buildAreaPath(CRM,  yL);
  const crmLine  = buildLinePath(CRM,  yL);
  const hubsArea = buildAreaPath(HUBS, yL);
  const hubsLine = buildLinePath(HUBS, yL);
  const gtmLine  = buildLinePath(GTM,  yR);

  // % change badges — appear after GTM finishes
  const badgeDelay = 220;

  return (
    <AbsoluteFill style={{ background: "#e9e8e3", fontFamily: FONT_SANS, overflow: "hidden" }}>

      {/* ── Subtle paper texture overlay ── */}
      <svg style={{ position: "absolute", inset: 0, opacity: 0.03 }} width="1920" height="1080">
        {Array.from({ length: 55 }).map((_, i) => (
          <line key={i} x1={0} y1={i * 20} x2={1920} y2={i * 20}
            stroke="#000" strokeWidth={1}/>
        ))}
      </svg>

      {/* ── Title block ── */}
      <div style={{
        position: "absolute", top: 56, left: L,
        opacity: fi(frame, 2, 18, 0, 1),
      }}>
        <div style={{
          fontSize: 40, fontWeight: 700, color: "#111",
          fontFamily: FONT_SERIF, letterSpacing: "-0.3px", lineHeight: 1.1,
        }}>
          GTM Platform Stock Performance
        </div>
        <div style={{
          width: 480, height: 1.5, background: "#999", marginTop: 8, marginBottom: 6,
        }}/>
        <div style={{
          fontSize: 16, color: "#666", fontFamily: FONT_SANS, fontWeight: 400,
        }}>
          Source: stockanalysis.com, Jan 2 – Mar 6, 2026
        </div>
      </div>

      {/* ── Main SVG chart ── */}
      <svg style={{ position: "absolute", inset: 0 }}
        viewBox="0 0 1920 1080" width="1920" height="1080"
        opacity={bgOp}
      >
        {/* Grid — vertical lines */}
        {X_LABELS.map((lbl, i) => {
          const xi = RAW.findIndex(r => r[0] === lbl);
          if (xi < 0) return null;
          const x = xAt(xi);
          return (
            <g key={i}>
              <line x1={x} y1={T} x2={x} y2={B}
                stroke="#c4c3be" strokeWidth={1}/>
              <text x={x} y={B + 30} fontSize={14} fill="#888"
                textAnchor="middle" fontFamily={FONT_SANS}>{lbl}</text>
            </g>
          );
        })}

        {/* Grid — horizontal lines + left tick labels */}
        {LEFT_TICKS.map((t, i) => {
          const y = yL(t);
          return (
            <g key={i}>
              <line x1={L} y1={y} x2={R} y2={y}
                stroke="#c4c3be" strokeWidth={1}/>
              <text x={L - 12} y={y + 5} fontSize={14} fill="#888"
                textAnchor="end" fontFamily={FONT_SANS}>${t}</text>
            </g>
          );
        })}

        {/* Right axis tick labels (GTM) */}
        {RIGHT_TICKS.map((t, i) => (
          <text key={i} x={R + 12} y={yR(t) + 5} fontSize={14} fill="#b8a830"
            textAnchor="start" fontFamily={FONT_SANS}>${t}</text>
        ))}

        {/* Axes */}
        <line x1={L} y1={T} x2={L} y2={B} stroke="#333" strokeWidth={2}/>
        <line x1={L} y1={B} x2={R} y2={B} stroke="#333" strokeWidth={2}/>
        <line x1={R} y1={T} x2={R} y2={B} stroke="#b8a830" strokeWidth={1.5} opacity={0.5}/>

        {/* Left axis label */}
        <text x={L - 100} y={(T + B) / 2} fontSize={14} fill="#666"
          textAnchor="middle" fontFamily={FONT_SANS}
          transform={`rotate(-90, ${L - 100}, ${(T + B) / 2})`}>
          CRM &amp; HUBS — USD
        </text>

        {/* Right axis label */}
        <text x={R + 100} y={(T + B) / 2} fontSize={14} fill="#b8a830"
          textAnchor="middle" fontFamily={FONT_SANS}
          transform={`rotate(90, ${R + 100}, ${(T + B) / 2})`}>
          GTM — USD
        </text>

        {/* ── CRM area + line ── */}
        <ClipRect id="crmClip" progress={crmP} />
        <g clipPath="url(#crmClip)">
          <path d={crmArea} fill="#5ab4d6" opacity={0.35}/>
          <path d={crmLine} fill="none" stroke="#1a82b5" strokeWidth={2.5}/>
        </g>
        {/* CRM leading dot */}
        {crmP > 0.01 && crmP < 0.999 && (
          <circle cx={crmDot.x} cy={crmDot.y} r={6}
            fill="#1a82b5" stroke="white" strokeWidth={2}/>
        )}

        {/* ── HUBS area + line ── */}
        <ClipRect id="hubsClip" progress={hubsP} />
        <g clipPath="url(#hubsClip)">
          <path d={hubsArea} fill="#d48060" opacity={0.22}/>
          <path d={hubsLine} fill="none" stroke="#cc5533"
            strokeWidth={2.5} strokeDasharray="10 4"/>
        </g>
        {/* HUBS leading dot */}
        {hubsP > 0.01 && hubsP < 0.999 && (
          <circle cx={hubsDot.x} cy={hubsDot.y} r={6}
            fill="#cc5533" stroke="white" strokeWidth={2}/>
        )}

        {/* ── GTM line only ── */}
        <ClipRect id="gtmClip" progress={gtmP} />
        <g clipPath="url(#gtmClip)">
          <path d={gtmLine} fill="none" stroke="#c6b800" strokeWidth={2.5}/>
        </g>
        {/* GTM leading dot */}
        {gtmP > 0.01 && gtmP < 0.999 && (
          <circle cx={gtmDot.x} cy={gtmDot.y} r={6}
            fill="#c6b800" stroke="white" strokeWidth={2}/>
        )}

        {/* ── Series inline labels ── */}
        <SeriesLabel text="Salesforce (CRM)"
          x={xAt(10)} y={yL(CRM[10]) - 32}
          bg="#1a82b5" frame={frame} delay={badgeDelay}/>
        <SeriesLabel text="HubSpot (HUBS)"
          x={xAt(14)} y={yL(HUBS[14]) + 36}
          bg="#cc5533" frame={frame} delay={badgeDelay + 12}/>
        <SeriesLabel text="ZoomInfo (GTM)"
          x={xAt(6)} y={yR(GTM[6]) - 32}
          bg="#a09800" frame={frame} delay={badgeDelay + 24}/>

        {/* ── % change callouts at right edge ── */}
        {fi(frame, badgeDelay, badgeDelay + 12, 0, 1) > 0.05 && (
          <>
            {/* CRM end callout */}
            <g opacity={fi(frame, badgeDelay, badgeDelay + 14, 0, 1)}>
              <line x1={R + 2} y1={yL(CRM[N-1])} x2={R + 40} y2={yL(CRM[N-1])}
                stroke="#1a82b5" strokeWidth={1.5} strokeDasharray="4 3"/>
              <text x={R + 44} y={yL(CRM[N-1]) + 5} fontSize={15} fill="#1a82b5"
                fontFamily={FONT_SANS} fontWeight={700}>-20%</text>
            </g>
            {/* HUBS end callout */}
            <g opacity={fi(frame, badgeDelay + 12, badgeDelay + 26, 0, 1)}>
              <line x1={R + 2} y1={yL(HUBS[N-1])} x2={R + 40} y2={yL(HUBS[N-1])}
                stroke="#cc5533" strokeWidth={1.5} strokeDasharray="4 3"/>
              <text x={R + 44} y={yL(HUBS[N-1]) + 5} fontSize={15} fill="#cc5533"
                fontFamily={FONT_SANS} fontWeight={700}>-22%</text>
            </g>
            {/* GTM end callout */}
            <g opacity={fi(frame, badgeDelay + 24, badgeDelay + 38, 0, 1)}>
              <line x1={R + 2} y1={yR(GTM[N-1])} x2={R + 40} y2={yR(GTM[N-1])}
                stroke="#a09800" strokeWidth={1.5} strokeDasharray="4 3"/>
              <text x={R + 44} y={yR(GTM[N-1]) + 5} fontSize={15} fill="#a09800"
                fontFamily={FONT_SANS} fontWeight={700}>-32%</text>
            </g>
          </>
        )}
      </svg>

      {/* ── Legend ── */}
      <div style={{
        position: "absolute", top: 152, right: 220,
        display: "flex", gap: 28, alignItems: "center",
        opacity: fi(frame, 14, 28, 0, 1),
      }}>
        {[
          { color: "#1a82b5", dash: false, label: "Salesforce (CRM)"  },
          { color: "#cc5533", dash: true,  label: "HubSpot (HUBS)"    },
          { color: "#c6b800", dash: false, label: "ZoomInfo (GTM) →"  },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <svg width={28} height={10}>
              <line x1={0} y1={5} x2={28} y2={5}
                stroke={s.color} strokeWidth={3}
                strokeDasharray={s.dash ? "7 4" : "none"}/>
            </svg>
            <span style={{ fontSize: 15, color: "#444", fontFamily: FONT_SANS }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Source ── */}
      <div style={{
        position: "absolute", bottom: 24, left: L,
        fontSize: 13, color: "#999", fontFamily: FONT_SANS,
        opacity: fi(frame, 18, 30, 0, 1),
      }}>
        Data: stockanalysis.com · All prices in USD · Past performance is not indicative of future results
      </div>

    </AbsoluteFill>
  );
};
