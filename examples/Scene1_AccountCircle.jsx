/**
 * Scene 1: Account Circle
 * A center "Account" hub with 5 buyer-type nodes evenly spaced on a ring.
 * Animation: center pops first → camera pulls back → nodes slide out from center with dashed connectors.
 * Duration: ~120 frames @ 30fps
 * Use as reference for: radial hub-and-spoke layouts, camera pull-back openers
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

function Card({ children, style = {}, width = 180, height = 180 }) {
  return (
    <div style={{
      width, height, background: "#ffffff", borderRadius: 18,
      border: "1.5px solid rgba(232,24,46,0.12)",
      boxShadow: "0 4px 20px rgba(0,0,60,0.08), inset 0 0 0 1px rgba(255,255,255,0.8)",
      position: "relative", overflow: "visible", ...style,
    }}>
      <div style={{ position:"absolute", right:-1.5, top:"25%", bottom:-1.5, width:4, borderRadius:"0 0 18px 0", background:`linear-gradient(180deg, transparent, ${RED} 40%, ${PINK})` }}/>
      <div style={{ position:"absolute", bottom:-1.5, left:"25%", right:-1.5, height:4, borderRadius:"0 0 18px 0", background:`linear-gradient(90deg, transparent, ${RED} 40%, ${PINK})` }}/>
      {children}
    </div>
  );
}

function IconCard({ label, Icon, size = 180, scale = 1, opacity = 1 }) {
  return (
    <div style={{ transform:`scale(${scale})`, opacity, transformOrigin:"center center" }}>
      <Card width={size} height={size}>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", gap:10, padding:16 }}>
          <div style={{ fontSize:15, fontWeight:600, color:NAVY, fontFamily:FONT, textAlign:"center", lineHeight:1.3, whiteSpace:"pre-line" }}>{label}</div>
          <Icon size={size * 0.38} />
        </div>
      </Card>
    </div>
  );
}

function DashedLine({ x1, y1, x2, y2, progress = 1 }) {
  const dx = x2 - x1, dy = y2 - y1;
  return (
    <svg style={{ position:"absolute", inset:0, overflow:"visible", pointerEvents:"none" }} viewBox="0 0 1920 1080" width="1920" height="1080">
      <line x1={x1} y1={y1} x2={x1 + dx * progress} y2={y1 + dy * progress}
        stroke="#c8cce0" strokeWidth="2.5" strokeDasharray="8 6" strokeLinecap="round"/>
      {progress >= 0.98 && <circle cx={x2} cy={y2} r="6" fill={RED}/>}
    </svg>
  );
}

const PersonIcon       = ({ size=56, color=NAVY }) => <svg width={size} height={size} viewBox="0 0 48 48"><circle cx="24" cy="16" r="9" fill={color}/><path d="M6 42 C6 30 42 30 42 42" fill={color}/></svg>;
const BuildingIcon     = ({ size=56, color=NAVY }) => <svg width={size} height={size} viewBox="0 0 48 48"><rect x="8" y="14" width="32" height="28" rx="3" fill={color}/><rect x="14" y="20" width="6" height="6" rx="1" fill="white"/><rect x="26" y="20" width="6" height="6" rx="1" fill="white"/><rect x="14" y="30" width="6" height="6" rx="1" fill="white"/><rect x="26" y="30" width="6" height="6" rx="1" fill="white"/><rect x="18" y="36" width="12" height="6" rx="1" fill="white"/><polygon points="4,16 24,4 44,16" fill={color}/></svg>;
const TagIcon          = ({ size=56, color=NAVY }) => <svg width={size} height={size} viewBox="0 0 48 48"><path d="M6 6 L28 6 L44 22 L28 42 L6 22 Z" fill={color}/><circle cx="18" cy="17" r="4" fill="white"/></svg>;
const GearIcon         = ({ size=56, color=NAVY }) => <svg width={size} height={size} viewBox="0 0 48 48"><circle cx="24" cy="24" r="7" fill={color}/>{[0,45,90,135,180,225,270,315].map((deg,i)=>{const r=(deg*Math.PI)/180;return <circle key={i} cx={24+Math.cos(r)*14} cy={24+Math.sin(r)*14} r="4.5" fill={color}/>})}<circle cx="24" cy="24" r="5" fill="white"/></svg>;
const PersonClockIcon  = ({ size=56, color=NAVY }) => <svg width={size} height={size} viewBox="0 0 48 48"><circle cx="18" cy="15" r="8" fill={color}/><path d="M4 38 C4 28 32 28 32 38" fill={color}/><circle cx="36" cy="32" r="10" fill="white" stroke={color} strokeWidth="3"/><line x1="36" y1="26" x2="36" y2="32" stroke={color} strokeWidth="2.5" strokeLinecap="round"/><line x1="36" y1="32" x2="40" y2="34" stroke={color} strokeWidth="2.5" strokeLinecap="round"/></svg>;
const PersonCheckIcon  = ({ size=56, color=NAVY }) => <svg width={size} height={size} viewBox="0 0 48 48"><circle cx="20" cy="15" r="8" fill={color}/><path d="M4 40 C4 28 36 28 36 40" fill={color}/><polyline points="30,28 36,36 44,22" stroke={RED} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>;

export function AccountCircleScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CX = 960, CY = 540, R = 310;

  const centerSpring = spring({ frame, fps, config: { damping: 32, stiffness: 140 } });
  const centerOp = fi(frame, 0, 18, 0, 1);

  const nodes = [
    { label: "Economic\nBuyer",  Icon: TagIcon,         angle: -90          },
    { label: "Influencer",       Icon: PersonIcon,      angle: -90 + 72     },
    { label: "Decision\nMaker",  Icon: PersonClockIcon, angle: -90 + 72 * 2 },
    { label: "Champion",         Icon: PersonCheckIcon, angle: -90 + 72 * 3 },
    { label: "Technical\nBuyer", Icon: GearIcon,        angle: -90 + 72 * 4 },
  ];

  const camSp = spring({ frame: frame - 20, fps, config: { damping: 36, stiffness: 60 } });
  const camScale = 1.3 - camSp * 0.3;
  const circleOp = fi(frame, 25, 40, 0, 1);

  return (
    <AbsoluteFill style={{ display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, transform:`scale(${camScale})`, transformOrigin:"center center" }}>
        <svg style={{ position:"absolute", inset:0 }} viewBox="0 0 1920 1080">
          <circle cx={CX} cy={CY} r={R} fill="none" stroke="#e0e4ef" strokeWidth="2" opacity={circleOp}/>
        </svg>

        {nodes.map((node, i) => {
          const rad = ((node.angle - 90) * Math.PI) / 180;
          const nx = CX + R * Math.cos(rad);
          const ny = CY + R * Math.sin(rad);
          const lineStart = 35 + i * 8;
          const lp = fi(frame, lineStart, lineStart + 18, 0, 1);
          return (
            <DashedLine key={i}
              x1={CX + 85 * Math.cos(rad)} y1={CY + 85 * Math.sin(rad)}
              x2={nx - 90 * Math.cos(rad)} y2={ny - 90 * Math.sin(rad)}
              progress={lp}
            />
          );
        })}

        {nodes.map((node, i) => {
          const rad = ((node.angle - 90) * Math.PI) / 180;
          const nx = CX + R * Math.cos(rad);
          const ny = CY + R * Math.sin(rad);
          const popStart = 42 + i * 8;
          const sp = spring({ frame: frame - popStart, fps, config: { damping: 30, stiffness: 160 } });
          const op = fi(frame, popStart, popStart + 14, 0, 1);
          const tx = CX + (nx - CX) * sp;
          const ty = CY + (ny - CY) * sp;
          return (
            <div key={i} style={{ position:"absolute", left: tx - 90, top: ty - 90, opacity: op }}>
              <IconCard label={node.label} Icon={node.Icon} size={180}/>
            </div>
          );
        })}

        <div style={{
          position:"absolute", left: CX - 90, top: CY - 90,
          width:180, height:180,
          transform:`scale(${centerSpring})`, opacity: centerOp,
          borderRadius:"50%",
          background:`linear-gradient(135deg, ${RED}, ${PINK})`,
          boxShadow:"0 8px 40px rgba(232,24,46,0.35)",
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10,
        }}>
          <BuildingIcon size={70} color="white"/>
          <div style={{ fontSize:18, fontWeight:800, color:"white", fontFamily:FONT }}>Account</div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
