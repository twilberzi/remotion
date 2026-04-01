import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  useVideoConfig,
  spring,
} from "remotion";

const FONT_CRAYON = "'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', cursive";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ─── Same daily data ──────────────────────────────────────────────────────────
const RAW = [
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

const N    = RAW.length;
const CRM  = RAW.map(r => r[1]);
const HUBS = RAW.map(r => r[2]);
const GTM  = RAW.map(r => r[3]);

// ─── Chart geometry ───────────────────────────────────────────────────────────
const L = 220, R = 1700, T = 220, B = 870;
const W = R - L, H = B - T;
const Y_MIN = 150, Y_MAX = 430;
const G_MIN = 4.5, G_MAX = 12;

function xAt(i) { return L + (i / (N - 1)) * W; }
function yL(v)  { return B - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * H; }
function yR(v)  { return B - ((v - G_MIN) / (G_MAX - G_MIN)) * H; }

// ─── Wobbly line path — add slight random perpendicular jitter per point ──────
// Uses a seeded wobble so it's stable across frames
function wobble(x, y, seed, amp = 3) {
  // simple deterministic noise from seed
  const s = Math.sin(seed * 127.1) * 43758.5453;
  const dx = (s - Math.floor(s) - 0.5) * amp * 2;
  const s2 = Math.sin(seed * 269.5 + 1.3) * 43758.5453;
  const dy = (s2 - Math.floor(s2) - 0.5) * amp * 2;
  return { x: x + dx, y: y + dy };
}

function buildWobblyPath(prices, yFn, progress, amp = 4) {
  const count = Math.max(2, Math.round(progress * (N - 1)) + 1);
  const pts = [];
  for (let i = 0; i < Math.min(count, N); i++) {
    let price = prices[i];
    if (i === count - 1 && count < N) {
      const frac = progress * (N - 1) - (count - 2);
      price = prices[i - 1] + (prices[i] - prices[i - 1]) * Math.max(0, Math.min(1, frac));
    }
    const base = { x: xAt(i), y: yFn(price) };
    const w = wobble(base.x, base.y, i * 3.7 + prices[0] * 0.01, amp);
    pts.push(w);
  }
  if (pts.length < 2) return { line: "", area: "" };

  // Build a rough jagged polyline — kid-style
  let line = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    // slight mid-point sag for hand-drawn feel
    const mx = (pts[i - 1].x + pts[i].x) / 2 + (Math.sin(i * 2.3) * 3);
    const my = (pts[i - 1].y + pts[i].y) / 2 + (Math.cos(i * 1.7) * 4);
    line += ` Q ${mx.toFixed(1)} ${my.toFixed(1)} ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
  }

  const lastPt = pts[pts.length - 1];
  // area path — close down to baseline with wobbly bottom
  const area = `${line} L ${lastPt.x.toFixed(1)} ${B + 6} L ${pts[0].x.toFixed(1)} ${B + 4} Z`;
  return { line, area };
}

// ─── Wobbly axis line ─────────────────────────────────────────────────────────
function WobblyLine({ x1, y1, x2, y2, color, strokeWidth = 4, progress = 1 }) {
  const dx = x2 - x1, dy = y2 - y1;
  const ex = x1 + dx * progress, ey = y1 + dy * progress;
  // add a couple of wobble segments
  const mx = (x1 + ex) / 2 + (Math.sin(x1 * 0.03) * 5);
  const my = (y1 + ey) / 2 + (Math.cos(y1 * 0.02) * 4);
  return (
    <path
      d={`M ${x1} ${y1} Q ${mx} ${my} ${ex} ${ey}`}
      stroke={color} strokeWidth={strokeWidth}
      fill="none" strokeLinecap="round"
    />
  );
}

// ─── Crayon fill (multiple overlapping semi-transparent strokes) ───────────────
// Simulates crayon coloring by drawing horizontal stripes at random offsets
function CrayonFill({ area, color, frame, delay, clipId }) {
  const op = fi(frame, delay, delay + 30, 0, 0.55);
  return (
    <g opacity={op} clipPath={`url(#${clipId})`}>
      {/* Layer 1 — base fill */}
      <path d={area} fill={color} opacity={0.45}/>
      {/* Layer 2 — slightly offset for texture */}
      <path d={area} fill={color} opacity={0.20}
        transform="translate(2, 3)"/>
      {/* Layer 3 — another offset */}
      <path d={area} fill={color} opacity={0.15}
        transform="translate(-3, 2)"/>
    </g>
  );
}

// ─── Clip rect for left-to-right reveal ──────────────────────────────────────
function ClipDef({ id, progress }) {
  const clipW = Math.max(0, (progress * W) + 30);
  return (
    <clipPath id={id}>
      <rect x={L} y={0} width={clipW} height={1080}/>
    </clipPath>
  );
}

// ─── Crayon scribble label ────────────────────────────────────────────────────
function ScribbleLabel({ text, x, y, color, frame, delay, rotate = -2 }) {
  const sp = spring({ frame: frame - delay, fps: 30, config: { damping: 8, stiffness: 180 } });
  const op = fi(frame, delay, delay + 10, 0, 1);
  const W2 = text.length * 11 + 24;
  return (
    <g opacity={op}
      transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${0.5 + sp * 0.5})`}
      style={{ transformOrigin: `${x}px ${y}px` }}>
      {/* Paper scrap background */}
      <rect x={-W2/2 - 2} y={-20} width={W2 + 4} height={38} rx={3}
        fill="white" opacity={0.9}
        transform={`rotate(${rotate * 0.5})`}/>
      {/* Crayon outline */}
      <rect x={-W2/2} y={-18} width={W2} height={34} rx={3}
        fill="none" stroke={color} strokeWidth={3}
        transform={`rotate(${-rotate * 0.3})`}/>
      <text x={0} y={8} fontSize={18} fontWeight={700}
        fontFamily={FONT_CRAYON} fill={color} textAnchor="middle">{text}</text>
    </g>
  );
}

// ─── Timing ───────────────────────────────────────────────────────────────────
// 0–20:   bg + axes draw in
// 20–110: CRM draws + colors
// 90–180: HUBS draws + colors
// 155–225: GTM draws
// 220+:   labels pop in, hold

export const StockChartKid = () => {
  const frame = useCurrentFrame();

  const axisOp = fi(frame, 0, 22, 0, 1);
  const crmP   = fi(frame, 20, 110, 0, 1);
  const hubsP  = fi(frame, 90, 180, 0, 1);
  const gtmP   = fi(frame, 155, 225, 0, 1);

  const { line: crmLine,  area: crmArea  } = buildWobblyPath(CRM,  yL, crmP,  5);
  const { line: hubsLine, area: hubsArea } = buildWobblyPath(HUBS, yL, hubsP, 4);
  const { line: gtmLine                  } = buildWobblyPath(GTM,  yR, gtmP,  3);

  // x-axis label positions
  const xLabels = [
    { lbl: "Jan", i: 0 },
    { lbl: "Feb", i: 19 },
    { lbl: "Mar", i: 39 },
  ];

  const badgeDelay = 228;

  // wobble the title letters slightly
  const titleWobble = fi(frame, 0, 1, 0, 0); // just a hook

  return (
    <AbsoluteFill style={{
      background: "#fdf8f0",
      fontFamily: FONT_CRAYON,
      overflow: "hidden",
    }}>

      {/* ── Lined paper background ── */}
      <svg style={{ position: "absolute", inset: 0, opacity: 1 }} width="1920" height="1080">
        {/* Horizontal rules */}
        {Array.from({ length: 28 }).map((_, i) => (
          <line key={i} x1={0} y1={30 + i * 38} x2={1920} y2={30 + i * 38}
            stroke="#c8d8f0" strokeWidth={1}/>
        ))}
        {/* Red margin line */}
        <line x1={100} y1={0} x2={100} y2={1080} stroke="#f0b0b0" strokeWidth={2}/>
        {/* Spiral holes */}
        {Array.from({ length: 12 }).map((_, i) => (
          <circle key={i} cx={52} cy={56 + i * 88} r={14}
            fill="none" stroke="#d0d0d0" strokeWidth={2}/>
        ))}
      </svg>

      {/* ── Title — crayon handwriting ── */}
      <div style={{
        position: "absolute", top: 38, left: 160,
        opacity: fi(frame, 2, 18, 0, 1),
        transform: `rotate(-1.2deg)`,
      }}>
        <div style={{
          fontSize: 52, fontWeight: 700, color: "#2244cc",
          fontFamily: FONT_CRAYON, letterSpacing: "1px",
          textShadow: "3px 3px 0 rgba(0,0,200,0.12)",
        }}>
          Stocks Going Down 📉
        </div>
        <div style={{
          fontSize: 20, color: "#888", fontFamily: FONT_CRAYON,
          marginTop: 2, transform: "rotate(0.5deg)",
        }}>
          by me (Jan – Mar 2026) 🖍️
        </div>
      </div>

      {/* ── Chart SVG ── */}
      <svg style={{ position: "absolute", inset: 0 }}
        viewBox="0 0 1920 1080" width="1920" height="1080">

        {/* Defs */}
        <defs>
          <filter id="crayon">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3"
              stitchTiles="stitch" result="noise"/>
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise"/>
            <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" result="blend"/>
            <feComposite in="blend" in2="SourceGraphic" operator="in"/>
          </filter>
          <ClipDef id="crmClip"  progress={crmP}  />
          <ClipDef id="hubsClip" progress={hubsP} />
          <ClipDef id="gtmClip"  progress={gtmP}  />
        </defs>

        {/* ── Grid lines — wobbly, light blue ── */}
        {[160, 200, 240, 280, 320, 360, 400].map((t, i) => {
          const y = yL(t) + Math.sin(i * 2.1) * 2;
          return (
            <g key={i} opacity={axisOp}>
              <path d={`M ${L - 5} ${y} Q ${(L+R)/2} ${y + Math.sin(i*1.3)*3} ${R+5} ${y + Math.cos(i*0.9)*2}`}
                stroke="#c8d8f0" strokeWidth={1.5} fill="none"/>
              <text x={L - 16} y={y + 6} fontSize={16}
                fill="#aaa" textAnchor="end"
                fontFamily={FONT_CRAYON}>${t}</text>
            </g>
          );
        })}

        {/* X-axis date labels */}
        {xLabels.map((xl, i) => (
          <text key={i} x={xAt(xl.i)} y={B + 44}
            fontSize={22} fill="#888" textAnchor="middle"
            fontFamily={FONT_CRAYON}
            transform={`rotate(${(i-1)*1.5}, ${xAt(xl.i)}, ${B+44})`}
            opacity={axisOp}>
            {xl.lbl}
          </text>
        ))}

        {/* ── Axes — thick wobbly crayon strokes ── */}
        <g opacity={axisOp}>
          {/* Y axis */}
          <WobblyLine x1={L} y1={T-10} x2={L} y2={B+10}
            color="#333" strokeWidth={5}/>
          {/* X axis */}
          <WobblyLine x1={L-10} y1={B} x2={R+10} y2={B}
            color="#333" strokeWidth={5}/>
          {/* Arrow heads — hand-drawn */}
          <path d={`M ${L-8} ${T-8} L ${L} ${T-22} L ${L+8} ${T-8}`}
            stroke="#333" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <path d={`M ${R+8} ${B-8} L ${R+22} ${B} L ${R+8} ${B+8}`}
            stroke="#333" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </g>

        {/* ── CRM — blue crayon fill + wobbly line ── */}
        <g clipPath="url(#crmClip)">
          <CrayonFill area={crmArea} color="#4488ee" frame={frame} delay={20} clipId="crmClip"/>
          <path d={crmLine} fill="none" stroke="#2255bb" strokeWidth={5}
            strokeLinecap="round" strokeLinejoin="round"
            filter="url(#crayon)"/>
        </g>

        {/* ── HUBS — orange/red crayon fill + wobbly dashed line ── */}
        <g clipPath="url(#hubsClip)">
          <CrayonFill area={hubsArea} color="#ff8844" frame={frame} delay={90} clipId="hubsClip"/>
          <path d={hubsLine} fill="none" stroke="#dd4411" strokeWidth={5}
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="18 8"
            filter="url(#crayon)"/>
        </g>

        {/* ── GTM — yellow-green crayon line ── */}
        <g clipPath="url(#gtmClip)">
          <path d={gtmLine} fill="none" stroke="#88aa00" strokeWidth={5}
            strokeLinecap="round" strokeLinejoin="round"
            filter="url(#crayon)"/>
        </g>

        {/* ── Scribble labels ── */}
        <ScribbleLabel text="Salesforce 💧" x={xAt(8)}  y={yL(CRM[8])  - 44}
          color="#2255bb" frame={frame} delay={badgeDelay} rotate={-3}/>
        <ScribbleLabel text="HubSpot 🧡"   x={xAt(12)} y={yL(HUBS[12]) + 50}
          color="#dd4411" frame={frame} delay={badgeDelay + 14} rotate={2}/>
        <ScribbleLabel text="ZoomInfo 💛"  x={xAt(5)}  y={yR(GTM[5])   - 44}
          color="#667700" frame={frame} delay={badgeDelay + 28} rotate={-1}/>

        {/* ── % change — written like a kid noted it ── */}
        {fi(frame, badgeDelay + 40, badgeDelay + 55, 0, 1) > 0.05 && (
          <>
            <text x={R + 32} y={yL(CRM[N-1]) + 6}
              fontSize={20} fill="#2255bb" fontFamily={FONT_CRAYON} fontWeight={700}
              opacity={fi(frame, badgeDelay + 40, badgeDelay + 54, 0, 1)}
              transform="rotate(-2)">-20% 😬</text>
            <text x={R + 32} y={yL(HUBS[N-1]) + 6}
              fontSize={20} fill="#dd4411" fontFamily={FONT_CRAYON} fontWeight={700}
              opacity={fi(frame, badgeDelay + 52, badgeDelay + 66, 0, 1)}
              transform="rotate(1.5)">-22% 😱</text>
            <text x={R + 32} y={yR(GTM[N-1]) + 6}
              fontSize={20} fill="#667700" fontFamily={FONT_CRAYON} fontWeight={700}
              opacity={fi(frame, badgeDelay + 64, badgeDelay + 78, 0, 1)}
              transform="rotate(-1)">-32% 💀</text>
          </>
        )}

        {/* ── Sticker star ── */}
        {fi(frame, badgeDelay + 80, badgeDelay + 90, 0, 1) > 0.05 && (
          <g opacity={fi(frame, badgeDelay + 80, badgeDelay + 92, 0, 1)}
            transform={`translate(${R - 60}, ${T + 30})`}>
            <text fontSize={64} textAnchor="middle" dominantBaseline="middle">⭐</text>
          </g>
        )}
      </svg>

      {/* ── Hand-written legend ── */}
      <div style={{
        position: "absolute",
        top: 148, right: 240,
        display: "flex", flexDirection: "column", gap: 10,
        opacity: fi(frame, 18, 32, 0, 1),
        transform: "rotate(1deg)",
      }}>
        {[
          { color: "#2255bb", dash: false, label: "Salesforce (CRM)" },
          { color: "#dd4411", dash: true,  label: "HubSpot (HUBS)"   },
          { color: "#667700", dash: false, label: "ZoomInfo (GTM)"   },
        ].map((s, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            transform: `rotate(${(i-1)*1.2}deg)`,
          }}>
            <svg width={34} height={12}>
              <line x1={2} y1={6} x2={32} y2={6}
                stroke={s.color} strokeWidth={4} strokeLinecap="round"
                strokeDasharray={s.dash ? "9 5" : "none"}/>
            </svg>
            <span style={{
              fontSize: 18, color: s.color, fontFamily: FONT_CRAYON, fontWeight: 700,
            }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Bottom note ── */}
      <div style={{
        position: "absolute", bottom: 22, left: 160,
        fontSize: 16, color: "#bbb", fontFamily: FONT_CRAYON,
        transform: "rotate(-0.5deg)",
        opacity: fi(frame, 22, 36, 0, 1),
      }}>
        data from the internet probably (Jan–Mar 2026)
      </div>

    </AbsoluteFill>
  );
};
