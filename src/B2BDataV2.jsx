import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ─── Icons (stroke, single color) ────────────────────────────────────────────

const BuildingIcon = ({ size = 40, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="10" y="16" width="28" height="26" rx="2" stroke={color} strokeWidth="2.6" strokeLinejoin="round"/>
    <path d="M17 42 L17 32 L24 32 L24 42" stroke={color} strokeWidth="2.6" strokeLinejoin="round"/>
    <rect x="16" y="21" width="5" height="5" rx="1" stroke={color} strokeWidth="2"/>
    <rect x="27" y="21" width="5" height="5" rx="1" stroke={color} strokeWidth="2"/>
    <path d="M10 16 L24 7 L38 16" stroke={color} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round"/>
  </svg>
);

const TagIcon = ({ size = 40, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M6 6 L26 6 L42 22 L26 42 L6 26 Z" stroke={color} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round"/>
    <circle cx="16" cy="16" r="3.5" fill={color}/>
  </svg>
);

const ContactIcon = ({ size = 40, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="6" y="10" width="36" height="28" rx="3" stroke={color} strokeWidth="2.6" strokeLinejoin="round"/>
    <circle cx="19" cy="22" r="5" stroke={color} strokeWidth="2.4"/>
    <path d="M10 38 C10 32 28 32 28 38" stroke={color} strokeWidth="2.4" strokeLinecap="round"/>
    <line x1="32" y1="20" x2="40" y2="20" stroke={color} strokeWidth="2.4" strokeLinecap="round"/>
    <line x1="32" y1="26" x2="38" y2="26" stroke={color} strokeWidth="2.4" strokeLinecap="round"/>
  </svg>
);

const StackIcon = ({ size = 40, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <path d="M6 16 L24 8 L42 16 L24 24 Z" stroke={color} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round"/>
    <path d="M6 24 L24 32 L42 24" stroke={color} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round"/>
    <path d="M6 32 L24 40 L42 32" stroke={color} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round"/>
  </svg>
);

const TargetIcon = ({ size = 40, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="2.6"/>
    <circle cx="24" cy="24" r="10" stroke={color} strokeWidth="2.6"/>
    <circle cx="24" cy="24" r="3.5" fill={color}/>
    <line x1="24" y1="4"  x2="24" y2="10" stroke={color} strokeWidth="2.4" strokeLinecap="round"/>
    <line x1="24" y1="38" x2="24" y2="44" stroke={color} strokeWidth="2.4" strokeLinecap="round"/>
    <line x1="4"  y1="24" x2="10" y2="24" stroke={color} strokeWidth="2.4" strokeLinecap="round"/>
    <line x1="38" y1="24" x2="44" y2="24" stroke={color} strokeWidth="2.4" strokeLinecap="round"/>
  </svg>
);

const UsersIcon = ({ size = 40, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="18" cy="17" r="7" stroke={color} strokeWidth="2.6"/>
    <path d="M4 40 C4 30 32 30 32 40" stroke={color} strokeWidth="2.6" strokeLinecap="round"/>
    <circle cx="34" cy="19" r="5.5" stroke={color} strokeWidth="2.4"/>
    <path d="M26 40 C27 35 44 35 44 40" stroke={color} strokeWidth="2.4" strokeLinecap="round"/>
  </svg>
);

const ClockIcon = ({ size = 40, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="2.6"/>
    <line x1="24" y1="11" x2="24" y2="24" stroke={color} strokeWidth="2.6" strokeLinecap="round"/>
    <line x1="24" y1="24" x2="33" y2="30" stroke={color} strokeWidth="2.6" strokeLinecap="round"/>
    <circle cx="24" cy="24" r="2.5" fill={color}/>
  </svg>
);

// ─── Scene structure ──────────────────────────────────────────────────────────
// Phase 1  (0–55):   "B2B DATA" label slams in, then 4 data chips reveal left→right
// Phase 2  (60–120): "Revenue teams use this to…" slides in, 3 use-case rows punch in
// Hold through 200

const ACCENT = "#e8182e"; // red
const DIM    = "rgba(255,255,255,0.38)";

const DATA_ITEMS = [
  { label: "Company Size",    Icon: BuildingIcon },
  { label: "Industry",        Icon: TagIcon      },
  { label: "Contact Details", Icon: ContactIcon  },
  { label: "Tech Stack",      Icon: StackIcon    },
];

const USE_ITEMS = [
  { label: "Who to go after",      Icon: TargetIcon },
  { label: "Who to talk to",       Icon: UsersIcon  },
  { label: "When to reach out",    Icon: ClockIcon  },
];

// ─── Word slam: single word scales + fades in fast ───────────────────────────
function WordSlam({ text, frame, delay, size = 96, color = "white", accent = false }) {
  const sp = spring({ frame: frame - delay, fps: 30, config: { damping: 10, stiffness: 260 } });
  const op = fi(frame, delay, delay + 8, 0, 1);
  return (
    <span style={{
      display: "inline-block",
      transform: `scale(${0.7 + sp * 0.3})`,
      opacity: op,
      color: accent ? ACCENT : color,
      fontWeight: 900,
      fontSize: size,
      letterSpacing: "-2px",
      lineHeight: 1,
      fontFamily: FONT,
      transformOrigin: "center bottom",
    }}>{text}</span>
  );
}

// ─── Horizontal rule that sweeps in ──────────────────────────────────────────
function SweepLine({ frame, delay, color = ACCENT }) {
  const w = fi(frame, delay, delay + 22, 0, 100);
  return (
    <div style={{
      height: 3, borderRadius: 2,
      width: `${w}%`,
      background: color,
      marginTop: 2,
    }}/>
  );
}

// ─── Data chip ───────────────────────────────────────────────────────────────
function DataChip({ item, frame, delay }) {
  const sp = spring({ frame: frame - delay, fps: 30, config: { damping: 13, stiffness: 200 } });
  const op = fi(frame, delay, delay + 12, 0, 1);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      transform: `translateX(${(1 - sp) * -30}px)`,
      opacity: op,
    }}>
      <div style={{
        width: 48, height: 48,
        borderRadius: 10,
        border: "1.5px solid rgba(255,255,255,0.15)",
        background: "rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <item.Icon size={26} color="white" />
      </div>
      <span style={{
        fontSize: 22, fontWeight: 600, color: "rgba(255,255,255,0.88)",
        fontFamily: FONT, whiteSpace: "nowrap",
      }}>{item.label}</span>
    </div>
  );
}

// ─── Use-case row ─────────────────────────────────────────────────────────────
function UseRow({ item, frame, delay, index }) {
  const sp = spring({ frame: frame - delay, fps: 30, config: { damping: 14, stiffness: 180 } });
  const op = fi(frame, delay, delay + 14, 0, 1);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 20,
      transform: `translateX(${(1 - sp) * 40}px)`,
      opacity: op,
    }}>
      {/* Number */}
      <div style={{
        fontSize: 13, fontWeight: 800, color: ACCENT,
        fontFamily: FONT, width: 22, textAlign: "right", flexShrink: 0,
        letterSpacing: "0px",
      }}>0{index + 1}</div>
      {/* Icon */}
      <div style={{
        width: 44, height: 44,
        borderRadius: 10,
        background: `${ACCENT}22`,
        border: `1.5px solid ${ACCENT}55`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        <item.Icon size={24} color={ACCENT} />
      </div>
      {/* Label */}
      <span style={{
        fontSize: 26, fontWeight: 700, color: "white",
        fontFamily: FONT, letterSpacing: "-0.3px",
      }}>{item.label}</span>
    </div>
  );
}

export const B2BDataV2 = () => {
  const frame = useCurrentFrame();

  // Phase divider line between left and right panels — draws at frame 8
  const divOp  = fi(frame, 8, 22, 0, 1);
  const divH   = fi(frame, 8, 30, 0, 100);

  // "includes" label
  const inclOp = fi(frame, 18, 30, 0, 1);

  // Right panel "Revenue teams…" header
  const rhOp = fi(frame, 58, 72, 0, 1);
  const rhY  = fi(frame, 58, 72, 16, 0);

  return (
    <AbsoluteFill style={{
      background: "#12151c",
      fontFamily: FONT,
      overflow: "hidden",
    }}>

      {/* ── Subtle grid overlay ── */}
      <svg style={{ position: "absolute", inset: 0, opacity: 0.04 }} width="1920" height="1080">
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 100} y1={0} x2={i * 100} y2={1080} stroke="white" strokeWidth="1"/>
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 100} x2={1920} y2={i * 100} stroke="white" strokeWidth="1"/>
        ))}
      </svg>

      {/* ── Red accent bar — top edge ── */}
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: fi(frame, 0, 18, 0, 1920),
        height: 4,
        background: `linear-gradient(90deg, ${ACCENT}, #ff4d6d)`,
      }}/>

      {/* ══ LEFT PANEL ══ */}
      <div style={{
        position: "absolute",
        left: 100, top: 0, bottom: 0,
        width: 820,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 0,
      }}>

        {/* "B2B" */}
        <div style={{ lineHeight: 0.95 }}>
          <WordSlam text="B2B" frame={frame} delay={4} size={130} />
        </div>

        {/* "DATA" in red */}
        <div style={{ lineHeight: 0.95, marginTop: 4 }}>
          <WordSlam text="DATA" frame={frame} delay={10} size={130} accent />
        </div>

        {/* Sweep line */}
        <SweepLine frame={frame} delay={16} />

        {/* Descriptor */}
        <div style={{
          marginTop: 22,
          fontSize: 20, fontWeight: 400,
          color: "rgba(255,255,255,0.50)",
          lineHeight: 1.6, maxWidth: 600,
          opacity: fi(frame, 20, 36, 0, 1),
          transform: `translateY(${fi(frame, 20, 36, 10, 0)}px)`,
        }}>
          Verified information about companies<br/>and the people who work there.
        </div>

        {/* "Includes" label */}
        <div style={{
          marginTop: 44,
          fontSize: 12, fontWeight: 700,
          color: ACCENT,
          letterSpacing: "3px",
          textTransform: "uppercase",
          opacity: inclOp,
        }}>Includes</div>

        {/* 4 data chips */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 16 }}>
          {DATA_ITEMS.map((item, i) => (
            <DataChip key={i} item={item} frame={frame} delay={24 + i * 10} />
          ))}
        </div>
      </div>

      {/* ── Vertical divider ── */}
      <div style={{
        position: "absolute",
        left: 960,
        top: `${(100 - divH) / 2}%`,
        width: 1,
        height: `${divH}%`,
        background: "rgba(255,255,255,0.10)",
        opacity: divOp,
      }}/>

      {/* ══ RIGHT PANEL ══ */}
      <div style={{
        position: "absolute",
        left: 1010, right: 80,
        top: 0, bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 0,
      }}>

        {/* "Revenue teams use this to…" */}
        <div style={{
          opacity: rhOp,
          transform: `translateY(${rhY}px)`,
        }}>
          <div style={{
            fontSize: 14, fontWeight: 700, color: ACCENT,
            letterSpacing: "3px", textTransform: "uppercase",
            marginBottom: 10,
          }}>Revenue teams use this to</div>
          <div style={{
            fontSize: 52, fontWeight: 900, color: "white",
            lineHeight: 1.05, letterSpacing: "-1.5px",
          }}>Decide<br/>who,<br/>and when.</div>
          <SweepLine frame={frame} delay={68} />
        </div>

        {/* 3 use-case rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 44 }}>
          {USE_ITEMS.map((item, i) => (
            <UseRow key={i} item={item} frame={frame} delay={76 + i * 14} index={i} />
          ))}
        </div>
      </div>

    </AbsoluteFill>
  );
};
