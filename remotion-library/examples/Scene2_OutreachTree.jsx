/**
 * Scene 2: Outreach Tree
 * A root "Outreach" card branches to 3 persona cards (CFO, Technical Buyer, End-User),
 * each with 2 outcome tags fanning out to the right.
 * Animation: root pops → trunk line draws → personas slide in → tags pop in.
 * Duration: ~120 frames @ 30fps
 * Use as reference for: tree/hierarchy layouts, branching animations
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

function IconBoxCard({ label, Icon, width = 190, height = 190, scale = 1, opacity = 1 }) {
  const hasLabel = label && label.length > 0;
  return (
    <div style={{ width, height, position:"relative", transform:`scale(${scale})`, opacity, transformOrigin:"center center" }}>
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

const PersonIcon      = ({ size=56, color=NAVY }) => <svg width={size} height={size} viewBox="0 0 48 48"><circle cx="24" cy="16" r="9" fill={color}/><path d="M6 42 C6 30 42 30 42 42" fill={color}/></svg>;
const GearIcon        = ({ size=56, color=NAVY }) => <svg width={size} height={size} viewBox="0 0 48 48"><circle cx="24" cy="24" r="7" fill={color}/>{[0,45,90,135,180,225,270,315].map((deg,i)=>{const r=(deg*Math.PI)/180;return <circle key={i} cx={24+Math.cos(r)*14} cy={24+Math.sin(r)*14} r="4.5" fill={color}/>})}<circle cx="24" cy="24" r="5" fill="white"/></svg>;
const PersonCheckIcon = ({ size=56, color=NAVY }) => <svg width={size} height={size} viewBox="0 0 48 48"><circle cx="20" cy="15" r="8" fill={color}/><path d="M4 40 C4 28 36 28 36 40" fill={color}/><polyline points="30,28 36,36 44,22" stroke={RED} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const MegaphoneIcon   = ({ size=56, color=NAVY }) => <svg width={size} height={size} viewBox="0 0 48 48"><path d="M6 18 L6 30 L14 30 L14 18 Z" fill={color}/><path d="M14 18 L38 8 L38 40 L14 30 Z" fill={color}/><rect x="6" y="30" width="8" height="10" rx="2" fill={color}/><line x1="40" y1="16" x2="46" y2="14" stroke={color} strokeWidth="3" strokeLinecap="round"/><line x1="40" y1="24" x2="46" y2="24" stroke={color} strokeWidth="3" strokeLinecap="round"/><line x1="40" y1="32" x2="46" y2="30" stroke={color} strokeWidth="3" strokeLinecap="round"/></svg>;

export function OutreachTreeScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const LEFT_X = 240, CX = 780;
  const rows = [
    { label: "CFO",              Icon: PersonIcon,      y: 280, items: ["ROI", "Financial Benefits"] },
    { label: "Technical\nBuyer", Icon: GearIcon,        y: 540, items: ["Demo", "Product Features"] },
    { label: "End-User",         Icon: PersonCheckIcon, y: 800, items: ["Use Cases", "User Experience"] },
  ];

  const rootSpring = spring({ frame, fps, config: { damping: 30, stiffness: 120 } });
  const rootOp = fi(frame, 0, 16, 0, 1);

  return (
    <AbsoluteFill>
      {/* Vertical trunk */}
      <svg style={{ position:"absolute", inset:0 }} viewBox="0 0 1920 1080">
        <line x1={CX} y1={280} x2={CX} y2={800} stroke="#c8cce0" strokeWidth="2.5" strokeDasharray="8 6" opacity={fi(frame, 20, 40, 0, 1)}/>
      </svg>

      {/* Root */}
      <div style={{ position:"absolute", left: LEFT_X - 95, top: 445 }}>
        <IconBoxCard label="Outreach" Icon={MegaphoneIcon} width={190} height={190} scale={rootSpring} opacity={rootOp}/>
      </div>

      {/* Horizontal branch root → trunk */}
      <svg style={{ position:"absolute", inset:0 }} viewBox="0 0 1920 1080">
        <line x1={LEFT_X + 95} y1={540} x2={CX} y2={540} stroke="#c8cce0" strokeWidth="2.5" strokeDasharray="8 6" opacity={fi(frame, 25, 42, 0, 1)}/>
      </svg>

      {rows.map((row, i) => {
        const sp1 = spring({ frame: frame - (20 + i * 15), fps, config: { damping: 30, stiffness: 150 } });
        const op1 = fi(frame, 20 + i * 15, 36 + i * 15, 0, 1);

        return (
          <div key={i}>
            <svg style={{ position:"absolute", inset:0 }} viewBox="0 0 1920 1080">
              <line x1={CX} y1={row.y} x2={CX + 120} y2={row.y} stroke="#c8cce0" strokeWidth="2.5" strokeDasharray="8 6" opacity={op1 * 0.8}/>
            </svg>

            <div style={{ position:"absolute", left: CX + 120, top: row.y - 95 }}>
              <IconBoxCard label={row.label} Icon={row.Icon} width={190} height={190} scale={sp1} opacity={op1}/>
            </div>

            {row.items.map((item, j) => {
              const tagSp = spring({ frame: frame - (36 + i * 15 + j * 10), fps, config: { damping: 28, stiffness: 160 } });
              const tagOp = fi(frame, 36 + i * 15 + j * 10, 50 + i * 15 + j * 10, 0, 1);
              const ITEM_X = CX + 370;
              const ITEM_Y = row.y - 60 + j * 90;
              return (
                <div key={j}>
                  <svg style={{ position:"absolute", inset:0 }} viewBox="0 0 1920 1080">
                    <line x1={CX + 310} y1={row.y} x2={ITEM_X} y2={ITEM_Y + 35} stroke="#c8cce0" strokeWidth="2" strokeDasharray="6 5" opacity={tagOp * 0.7}/>
                  </svg>
                  <div style={{ position:"absolute", left: ITEM_X, top: ITEM_Y, transform:`scale(${tagSp})`, opacity: tagOp }}>
                    <div style={{
                      background:"white", border:`1.5px solid rgba(232,24,46,0.15)`, borderRadius:12,
                      padding:"12px 28px", fontSize:18, fontWeight:700, color:NAVY, fontFamily:FONT,
                      boxShadow:"0 4px 16px rgba(0,0,60,0.08)", whiteSpace:"nowrap",
                      borderRight:`4px solid ${RED}`, borderBottom:`4px solid ${PINK}`,
                    }}>{item}</div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
}
