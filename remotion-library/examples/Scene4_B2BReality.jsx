/**
 * Scene 4: B2B Reality Check
 * 3 panels revealing sequentially: longer cycles, subscription models, buyer expectations.
 * Each panel: icon card + headline + subtext + animated accent line.
 * Animation: panels stagger in at frames 0, 60, 120 with scale spring + text slide.
 * Duration: ~200 frames @ 30fps
 * Use as reference for: 3-panel reveal layouts, staggered panel sequences
 */

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";

const NAVY = "#1e2d5a";
const RED  = "#e8182e";
const PINK = "#c2185b";
const FONT = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
}

function IconBoxCard({ label, Icon, width = 220, height = 240 }) {
  const hasLabel = label && label.length > 0;
  return (
    <div style={{ width, height, position:"relative" }}>
      <Img src={staticFile("icon-box-blank.png")} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"fill" }}/>
      <div style={{ position:"absolute", top:0, left:0, right:0, bottom: hasLabel ? 80 : 0, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Icon size={hasLabel ? 88 : Math.round(height * 0.55)} />
      </div>
      {hasLabel && (
        <div style={{ position:"absolute", bottom:38, left:0, right:0, textAlign:"center", fontSize:23, fontWeight:700, color:NAVY, fontFamily:FONT, letterSpacing:0, lineHeight:1.3, whiteSpace:"pre-line" }}>
          {label}
        </div>
      )}
    </div>
  );
}

const ClockLongIcon = ({ size=80, color=NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="22" fill={color}/>
    <line x1="24" y1="8" x2="24" y2="24" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
    <line x1="24" y1="24" x2="35" y2="31" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="24" cy="24" r="3" fill="white"/>
  </svg>
);

const RecurringIcon = ({ size=80, color=NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="22" fill={color}/>
    <path d="M14 18 A12 12 0 0 1 34 18" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
    <polygon points="34,12 38,20 30,20" fill="white"/>
    <path d="M34 30 A12 12 0 0 1 14 30" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
    <polygon points="14,36 10,28 18,28" fill="white"/>
  </svg>
);

const RocketUpIcon = ({ size=80, color=NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <rect x="2" y="2" width="44" height="44" rx="8" fill={color}/>
    <rect x="7"  y="34" width="7" height="8"  rx="2" fill="white" opacity="0.35"/>
    <rect x="17" y="26" width="7" height="16" rx="2" fill="white" opacity="0.6"/>
    <rect x="27" y="17" width="7" height="25" rx="2" fill="white" opacity="0.85"/>
    <rect x="37" y="8"  width="7" height="34" rx="2" fill="white"/>
  </svg>
);

export function B2BRealityScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panels = [
    {
      icon: ClockLongIcon,
      headline: "B2B sales cycles\nare longer.",
      sub: "More stakeholders. More scrutiny.\nMore time to win—or lose.",
      accentColor: NAVY,
      delay: 0,
    },
    {
      icon: RecurringIcon,
      headline: "Subscription models\nare the norm.",
      sub: "Revenue is earned every month,\nnot just at the close.",
      accentColor: RED,
      delay: 60,
    },
    {
      icon: RocketUpIcon,
      headline: "Buyer expectations\nare through the roof.",
      sub: "Personalization, speed, and trust\naren't optional anymore.",
      accentColor: PINK,
      delay: 120,
    },
  ];

  return (
    <AbsoluteFill style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ display:"flex", gap:56, alignItems:"stretch" }}>
        {panels.map((panel, i) => {
          const sp    = spring({ frame: frame - panel.delay, fps, config: { damping: 30, stiffness: 120 } });
          const op    = fi(frame, panel.delay, panel.delay + 22, 0, 1);
          const txtY  = fi(frame, panel.delay + 8, panel.delay + 28, 18, 0);
          const txtOp = fi(frame, panel.delay + 8, panel.delay + 28, 0, 1);

          return (
            <div key={i} style={{
              transform:`scale(${sp})`, opacity:op, transformOrigin:"center bottom",
              display:"flex", flexDirection:"column", alignItems:"center", width:460,
            }}>
              <div style={{ marginBottom:36 }}>
                <IconBoxCard label="" Icon={panel.icon}/>
              </div>

              <div style={{
                fontSize:32, fontWeight:800, color:NAVY, fontFamily:FONT,
                textAlign:"center", lineHeight:1.25, whiteSpace:"pre-line", marginBottom:18,
                opacity:txtOp, transform:`translateY(${txtY}px)`,
              }}>
                {panel.headline}
              </div>

              <div style={{
                fontSize:19, fontWeight:400, color:"#4a5580", fontFamily:FONT,
                textAlign:"center", lineHeight:1.5, whiteSpace:"pre-line",
                opacity: fi(frame, panel.delay + 18, panel.delay + 36, 0, 1),
              }}>
                {panel.sub}
              </div>

              <div style={{
                marginTop:28, height:4, borderRadius:2,
                width: fi(frame, panel.delay + 20, panel.delay + 50, 0, 180),
                background:`linear-gradient(90deg, ${panel.accentColor}, ${PINK})`,
                opacity: fi(frame, panel.delay + 20, panel.delay + 38, 0, 1),
              }}/>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
