import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Img,
  staticFile,
  Sequence,
} from "remotion";

// ─── Design tokens ────────────────────────────────────────────────────────────
const NAVY   = "#1e2d5a";
const RED    = "#e8182e";
const PINK   = "#c2185b";
const LIGHT  = "#f8faff";
const GREEN  = "#16a34a";
const FONT   = "'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ─── Shared card ──────────────────────────────────────────────────────────────
function Card({ children, style = {}, width = 180, height = 180 }) {
  return (
    <div style={{
      width, height,
      background: "#ffffff",
      borderRadius: 18,
      border: "1.5px solid rgba(232,24,46,0.12)",
      boxShadow: "0 4px 20px rgba(0,0,60,0.08), inset 0 0 0 1px rgba(255,255,255,0.8)",
      position: "relative",
      overflow: "visible",
      ...style,
    }}>
      <div style={{
        position: "absolute", right: -1.5, top: "25%", bottom: -1.5,
        width: 4, borderRadius: "0 0 18px 0",
        background: `linear-gradient(180deg, transparent, ${RED} 40%, ${PINK})`,
      }}/>
      <div style={{
        position: "absolute", bottom: -1.5, left: "25%", right: -1.5,
        height: 4, borderRadius: "0 0 18px 0",
        background: `linear-gradient(90deg, transparent, ${RED} 40%, ${PINK})`,
      }}/>
      {children}
    </div>
  );
}

// ─── Scene title ──────────────────────────────────────────────────────────────
function SceneTitle({ text, frame, startFrame = 0 }) {
  const op = fi(frame, startFrame, startFrame + 18, 0, 1);
  const y  = fi(frame, startFrame, startFrame + 18, 20, 0);
  return (
    <div style={{
      position: "absolute", top: 52, left: 0, right: 0,
      textAlign: "center", opacity: op,
      transform: `translateY(${y}px)`,
      fontSize: 36, fontWeight: 800, color: NAVY, fontFamily: FONT,
      letterSpacing: "-0.5px",
    }}>
      {text}
    </div>
  );
}

// ─── Dashed connector ─────────────────────────────────────────────────────────
function DashedLine({ x1, y1, x2, y2, progress = 1, color = "#cccccc" }) {
  const dx = x2 - x1, dy = y2 - y1;
  return (
    <svg style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
      viewBox="0 0 1920 1080" width="1920" height="1080">
      <line
        x1={x1} y1={y1} x2={x1 + dx * progress} y2={y1 + dy * progress}
        stroke={color} strokeWidth="2.5" strokeDasharray="8 6" strokeLinecap="round"
      />
      {progress >= 0.98 && (
        <circle cx={x2} cy={y2} r="6" fill={RED}/>
      )}
    </svg>
  );
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const PersonIcon = ({ size = 56, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx="24" cy="16" r="9" fill={color}/>
    <path d="M6 42 C6 30 42 30 42 42" fill={color}/>
  </svg>
);

const BuildingIcon = ({ size = 56, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <rect x="8" y="14" width="32" height="28" rx="3" fill={color}/>
    <rect x="14" y="20" width="6" height="6" rx="1" fill="white"/>
    <rect x="26" y="20" width="6" height="6" rx="1" fill="white"/>
    <rect x="14" y="30" width="6" height="6" rx="1" fill="white"/>
    <rect x="26" y="30" width="6" height="6" rx="1" fill="white"/>
    <rect x="18" y="36" width="12" height="6" rx="1" fill="white"/>
    <polygon points="4,16 24,4 44,16" fill={color}/>
  </svg>
);

const GearIcon = ({ size = 56, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="7" fill={color}/>
    {[0,45,90,135,180,225,270,315].map((deg, i) => {
      const r = (deg * Math.PI) / 180;
      const x = 24 + Math.cos(r) * 14;
      const y = 24 + Math.sin(r) * 14;
      return <circle key={i} cx={x} cy={y} r="4.5" fill={color}/>;
    })}
    <circle cx="24" cy="24" r="5" fill="white"/>
  </svg>
);

const PhoneIcon = ({ size = 56, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <path d="M12 6 C12 6 16 6 18 10 L20 16 C21 19 19 21 17 22 C19 26 22 29 26 31 C27 29 29 27 32 28 L38 30 C42 32 42 36 42 36 L40 40 C38 44 34 44 30 42 C20 38 10 28 6 18 C4 14 4 10 8 8 Z" fill={color}/>
  </svg>
);

const EnvelopeIcon = ({ size = 56, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <rect x="4" y="12" width="40" height="28" rx="4" fill={color}/>
    <polyline points="4,12 24,28 44,12" stroke="white" strokeWidth="3" fill="none"/>
  </svg>
);

const LinkedInIcon = ({ size = 56, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <rect x="4" y="4" width="40" height="40" rx="7" fill={color}/>
    <rect x="13" y="20" width="6" height="16" fill="white"/>
    <circle cx="16" cy="15" r="3.5" fill="white"/>
    <path d="M24 20 L24 36" stroke="white" strokeWidth="6" strokeLinecap="round"/>
    <path d="M24 26 C24 20 36 19 36 27 L36 36" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round"/>
  </svg>
);

const XCircleIcon = ({ size = 52, color = RED }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="22" fill={color}/>
    <line x1="15" y1="15" x2="33" y2="33" stroke="white" strokeWidth="4" strokeLinecap="round"/>
    <line x1="33" y1="15" x2="15" y2="33" stroke="white" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

const BounceIcon = ({ size = 52, color = RED }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="22" fill={color}/>
    <rect x="10" y="16" width="28" height="18" rx="3" fill="none" stroke="white" strokeWidth="2.5"/>
    <polyline points="10,16 24,26 38,16" stroke="white" strokeWidth="2.5" fill="none"/>
    <path d="M28 11 L34 11 L34 17" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M28 11 L34 5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const SpinnerIcon = ({ size = 52, frame = 0 }) => {
  const angle = (frame * 9) % 360;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ transform: `rotate(${angle}deg)` }}>
      <circle cx="24" cy="24" r="18" fill="none" stroke="#e0e0e0" strokeWidth="4"/>
      <path d="M24 6 A18 18 0 0 1 42 24" fill="none" stroke={RED} strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );
};

const UsersIcon = ({ size = 56, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx="18" cy="16" r="8" fill={color}/>
    <path d="M2 42 C2 30 34 30 34 42" fill={color}/>
    <circle cx="34" cy="14" r="6" fill={color} opacity="0.7"/>
    <path d="M28 38 C32 32 46 32 46 40" fill={color} opacity="0.7"/>
  </svg>
);

const ZapIcon = ({ size = 56, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <polygon points="28,4 12,28 24,28 20,44 36,20 24,20" fill={color}/>
  </svg>
);

const LightningIcon = ({ size = 56, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <polygon points="30,4 10,26 22,26 18,44 38,22 26,22" fill={color}/>
  </svg>
);

const WarningIcon = ({ size = 36, color = RED }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <polygon points="24,4 44,44 4,44" fill={color}/>
    <line x1="24" y1="18" x2="24" y2="30" stroke="white" strokeWidth="4" strokeLinecap="round"/>
    <circle cx="24" cy="38" r="2.5" fill="white"/>
  </svg>
);

const CheckCircleIcon = ({ size = 36, color = GREEN }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="22" fill={color}/>
    <polyline points="13,24 21,32 35,16" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Scene 1: Bad Data Outreach ───────────────────────────────────────────────
function BadDataScene({ frame, fps }) {
  const rows = [
    {
      Icon: PhoneIcon,
      label: "Disconnected Number",
      sublabel: "Can't reach anyone",
      FailIcon: (f) => <XCircleIcon size={52} color={RED}/>,
      failDelay: 18,
      delay: 0,
    },
    {
      Icon: EnvelopeIcon,
      label: "Email Bounced",
      sublabel: "Never delivered",
      FailIcon: (f) => <BounceIcon size={52} color={RED}/>,
      failDelay: 18,
      delay: 45,
    },
    {
      Icon: LinkedInIcon,
      label: "Manual Profile Research",
      sublabel: "Hours wasted, no conversations",
      FailIcon: (f) => <SpinnerIcon size={52} frame={f}/>,
      failDelay: 18,
      delay: 90,
    },
  ];

  const captionOp = fi(frame, 145, 165, 0, 1);
  const captionY = fi(frame, 145, 165, 16, 0);

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 36, alignItems: "stretch" }}>
        {rows.map((row, i) => {
          const sp = spring({ frame: frame - row.delay, fps, config: { damping: 18, stiffness: 130 } });
          const rowOp = fi(frame, row.delay, row.delay + 20, 0, 1);
          const rowX = fi(frame, row.delay, row.delay + 22, -60, 0);
          const failOp = fi(frame, row.delay + row.failDelay, row.delay + row.failDelay + 14, 0, 1);
          const failSp = spring({ frame: frame - row.delay - row.failDelay, fps, config: { damping: 14, stiffness: 200 } });

          // Shake + tint after fail icon appears
          const failVisibleFrame = row.delay + row.failDelay;
          const shakeCycle = Math.max(0, frame - failVisibleFrame - 4);
          const shakeX = shakeCycle < 18
            ? Math.sin(shakeCycle * 1.8) * fi(shakeCycle, 0, 18, 7, 0)
            : 0;
          const rowTint = fi(frame, failVisibleFrame + 4, failVisibleFrame + 20, 0, 0.06);

          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 32,
              opacity: rowOp,
              transform: `translateX(${rowX + shakeX}px)`,
              width: 860,
              background: `rgba(232,24,46,${rowTint})`,
              borderRadius: 16,
              padding: "6px 10px",
              marginLeft: -10,
            }}>
              {/* Icon tile */}
              <div style={{
                width: 100, height: 100, borderRadius: 20,
                background: "#f4f5f7",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 2px 12px rgba(0,0,60,0.07)",
              }}>
                <row.Icon size={52} color="#2D3A55"/>
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: NAVY, fontFamily: FONT, lineHeight: 1.2 }}>
                  {row.label}
                </div>
                <div style={{ fontSize: 18, fontWeight: 400, color: "#7b89aa", fontFamily: FONT, marginTop: 4 }}>
                  {row.sublabel}
                </div>
              </div>

              {/* Failure indicator */}
              <div style={{
                opacity: failOp,
                transform: `scale(${failSp})`,
                transformOrigin: "center center",
                flexShrink: 0,
              }}>
                {row.FailIcon(frame)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom caption */}
      <div style={{
        position: "absolute", bottom: 100,
        opacity: captionOp, transform: `translateY(${captionY}px)`,
        fontFamily: FONT, fontWeight: 900, fontSize: 38, color: RED,
        letterSpacing: "-0.5px",
      }}>
        Bad Data = Lost Deals
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 2: Two Levels of B2B Data ─────────────────────────────────────────
function TwoLevelsScene({ frame, fps }) {
  const companySpring = spring({ frame: frame - 10, fps, config: { damping: 16, stiffness: 120 } });
  const companyOp = fi(frame, 10, 28, 0, 1);

  const arrowProgress = fi(frame, 52, 78, 0, 1);

  const personSpring = spring({ frame: frame - 75, fps, config: { damping: 16, stiffness: 120 } });
  const personOp = fi(frame, 75, 92, 0, 1);

  const pillsOp = fi(frame, 100, 118, 0, 1);
  const pillsY = fi(frame, 100, 118, 10, 0);

  const captionOp = fi(frame, 135, 153, 0, 1);
  const captionY = fi(frame, 135, 153, 14, 0);

  const CARD_W = 700, CARD_H = 200;
  const CX = 960, TOP_Y = 310, BOT_Y = 590;

  const pills = (items, color) => (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", opacity: pillsOp, transform: `translateY(${pillsY}px)` }}>
      {items.map((item, i) => (
        <div key={i} style={{
          padding: "5px 16px",
          borderRadius: 20,
          background: `${color}14`,
          border: `1.5px solid ${color}30`,
          fontSize: 16, fontWeight: 600,
          color: color === NAVY ? "#3a4d7a" : "#b5001f",
          fontFamily: FONT,
        }}>
          {item}
        </div>
      ))}
    </div>
  );

  return (
    <AbsoluteFill>
      {/* Company Data card */}
      <div style={{
        position: "absolute",
        left: CX - CARD_W / 2,
        top: TOP_Y,
        transform: `scale(${companySpring})`,
        opacity: companyOp,
        transformOrigin: "center center",
      }}>
        <Card width={CARD_W} height={CARD_H}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            height: "100%", gap: 28, padding: "0 40px",
          }}>
            <BuildingIcon size={72} color={NAVY}/>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: RED, fontFamily: FONT, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
                Company Level
              </div>
              <div style={{ fontSize: 30, fontWeight: 900, color: NAVY, fontFamily: FONT, letterSpacing: "-0.5px", marginBottom: 12 }}>
                COMPANY DATA
              </div>
              {pills(["Industry", "Size", "Revenue", "Location"], NAVY)}
            </div>
          </div>
        </Card>
      </div>

      {/* Arrow / connector */}
      <svg style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
        viewBox="0 0 1920 1080" width="1920" height="1080">
        <line
          x1={CX} y1={TOP_Y + CARD_H}
          x2={CX} y2={TOP_Y + CARD_H + (BOT_Y - TOP_Y - CARD_H - 8) * arrowProgress}
          stroke="#c8cce0" strokeWidth="3" strokeDasharray="8 6" strokeLinecap="round"
        />
        {arrowProgress >= 0.98 && (
          <>
            <polygon
              points={`${CX},${BOT_Y - 2} ${CX - 12},${BOT_Y - 22} ${CX + 12},${BOT_Y - 22}`}
              fill={RED}
            />
          </>
        )}
      </svg>

      {/* Person Data card */}
      <div style={{
        position: "absolute",
        left: CX - CARD_W / 2,
        top: BOT_Y,
        transform: `scale(${personSpring})`,
        opacity: personOp,
        transformOrigin: "center center",
      }}>
        <Card width={CARD_W} height={CARD_H}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            height: "100%", gap: 28, padding: "0 40px",
          }}>
            <PersonIcon size={72} color={NAVY}/>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: RED, fontFamily: FONT, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
                Person Level
              </div>
              <div style={{ fontSize: 30, fontWeight: 900, color: NAVY, fontFamily: FONT, letterSpacing: "-0.5px", marginBottom: 12 }}>
                PERSON DATA
              </div>
              {pills(["Name", "Title", "Email", "Phone"], PINK)}
            </div>
          </div>
        </Card>
      </div>

      {/* Caption */}
      <div style={{
        position: "absolute", bottom: 90, left: 0, right: 0,
        textAlign: "center",
        opacity: captionOp, transform: `translateY(${captionY}px)`,
        fontFamily: FONT, fontWeight: 800, fontSize: 32, color: NAVY,
      }}>
        B2B Data ={" "}
        <span style={{ color: NAVY }}>Companies</span>
        {" "}+{" "}
        <span style={{ color: RED }}>People</span>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 3: Five Data Types Hub & Spoke ─────────────────────────────────────
function FiveTypesScene({ frame, fps }) {
  const CX = 960, CY = 510, R = 320;

  const hubSpring = spring({ frame, fps, config: { damping: 16, stiffness: 120 } });
  const hubOp = fi(frame, 0, 18, 0, 1);

  const nodes = [
    { label: "Contact\nData",        Icon: PersonIcon,    angle: -90  , delay: 20  },
    { label: "Firmographic\nData",   Icon: BuildingIcon,  angle: -18  , delay: 50  },
    { label: "Technographic\nData",  Icon: GearIcon,      angle:  54  , delay: 80  },
    { label: "Intent\nData",         Icon: ZapIcon,       angle:  126 , delay: 110 },
    { label: "Trigger\nEvents",      Icon: LightningIcon, angle: -162 , delay: 140 },
  ];

  // Glow pulse after all visible
  const glowCycle = Math.max(0, frame - 165) % 40;
  const spokeGlow = fi(glowCycle, 0, 20, 0.35, 0.9) * fi(glowCycle, 20, 40, 0.9, 0.35);

  const allVisible = frame >= 165;

  // Pulsing radiance rings from hub center
  const ringCycle = Math.max(0, frame - 165) % 55;
  const ringScale = fi(ringCycle, 0, 55, 1.0, 2.6);
  const ringOp = fi(ringCycle, 0, 55, 0.55, 0) * fi(frame, 165, 180, 0, 1);
  const ring2Cycle = Math.max(0, frame - 165 - 18) % 55; // staggered
  const ring2Scale = fi(ring2Cycle, 0, 55, 1.0, 2.6);
  const ring2Op = fi(ring2Cycle, 0, 55, 0.35, 0) * fi(frame, 183, 196, 0, 1);

  const captionOp = fi(frame, 175, 195, 0, 1);
  const captionY = fi(frame, 175, 195, 14, 0);

  const captionWords = ["Right Person", "Right Company", "Right Moment"];

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Orbit ring */}
      <svg style={{ position: "absolute", inset: 0 }} viewBox="0 0 1920 1080">
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="#e0e4ef" strokeWidth="2"
          opacity={fi(frame, 10, 30, 0, 1)}/>
      </svg>

      {/* Connector lines */}
      {nodes.map((node, i) => {
        const rad = ((node.angle - 90) * Math.PI) / 180;
        const nx = CX + R * Math.cos(rad);
        const ny = CY + R * Math.sin(rad);
        const lp = fi(frame, node.delay, node.delay + 20, 0, 1);
        const lineColor = allVisible ? `rgba(30,45,90,${spokeGlow})` : "#c8cce0";
        return (
          <DashedLine key={i}
            x1={CX + 110 * Math.cos(rad)} y1={CY + 110 * Math.sin(rad)}
            x2={nx - 95 * Math.cos(rad)} y2={ny - 95 * Math.sin(rad)}
            progress={lp} color={lineColor}
          />
        );
      })}

      {/* Outer nodes */}
      {nodes.map((node, i) => {
        const rad = ((node.angle - 90) * Math.PI) / 180;
        const nx = CX + R * Math.cos(rad);
        const ny = CY + R * Math.sin(rad);
        const sp = spring({ frame: frame - node.delay, fps, config: { damping: 14, stiffness: 160 } });
        const op = fi(frame, node.delay, node.delay + 16, 0, 1);
        return (
          <div key={i} style={{
            position: "absolute",
            left: nx - 90, top: ny - 90,
            transform: `scale(${sp})`, opacity: op,
          }}>
            <Card width={180} height={180}>
              <div style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                height: "100%", gap: 10, padding: 16,
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: "#f4f5f7",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <node.Icon size={30} color="#2D3A55"/>
                </div>
                <div style={{
                  fontSize: 13, fontWeight: 700, color: NAVY,
                  fontFamily: FONT, textAlign: "center", lineHeight: 1.3,
                  whiteSpace: "pre-line",
                }}>
                  {node.label}
                </div>
              </div>
            </Card>
          </div>
        );
      })}

      {/* Pulsing radiance rings from hub */}
      {allVisible && (
        <>
          <div style={{
            position: "absolute",
            left: CX - 110, top: CY - 110,
            width: 220, height: 220,
            borderRadius: "50%",
            border: `3px solid ${RED}`,
            transform: `scale(${ringScale})`,
            opacity: ringOp,
            pointerEvents: "none",
          }}/>
          <div style={{
            position: "absolute",
            left: CX - 110, top: CY - 110,
            width: 220, height: 220,
            borderRadius: "50%",
            border: `2px solid ${PINK}`,
            transform: `scale(${ring2Scale})`,
            opacity: ring2Op,
            pointerEvents: "none",
          }}/>
        </>
      )}

      {/* Center hub */}
      <div style={{
        position: "absolute",
        left: CX - 110, top: CY - 110,
        transform: `scale(${hubSpring})`, opacity: hubOp,
      }}>
        <Card width={220} height={220} style={{ background: `linear-gradient(135deg, ${RED}, ${PINK})` }}>
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            height: "100%", gap: 12,
          }}>
            <UsersIcon size={72} color="white"/>
            <div style={{ fontSize: 18, fontWeight: 800, color: "white", fontFamily: FONT, textAlign: "center", lineHeight: 1.2 }}>
              REVENUE<br/>TEAM
            </div>
          </div>
        </Card>
      </div>

      {/* Caption — three words staggered */}
      <div style={{
        position: "absolute", bottom: 80, left: 0, right: 0,
        display: "flex", justifyContent: "center", gap: 0,
        opacity: captionOp, transform: `translateY(${captionY}px)`,
      }}>
        {captionWords.map((word, i) => {
          const wOp = fi(frame, 175 + i * 10, 190 + i * 10, 0, 1);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <span style={{
                fontFamily: FONT, fontWeight: 900, fontSize: 30,
                color: i % 2 === 0 ? NAVY : RED,
                opacity: wOp,
                letterSpacing: "-0.3px",
              }}>
                {word}
              </span>
              {i < captionWords.length - 1 && (
                <span style={{ fontFamily: FONT, fontWeight: 300, fontSize: 26, color: "#aaa", margin: "0 16px", opacity: wOp }}>·</span>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 4: Cheap Lists vs Quality Data ────────────────────────────────────
function ComparisonScene({ frame, fps }) {
  const headerOp = fi(frame, 10, 28, 0, 1);
  const headerY = fi(frame, 10, 28, -16, 0);
  const dividerH = fi(frame, 20, 48, 0, 480);

  // Left column stagger: 35, 65, 95, 125 (last fully in ~frame 143)
  // Pause until frame 165, then right column stagger in
  const RIGHT_START = 165;
  const rows = [
    { left: "10,000 Contacts",       right: "Fewer, Verified Records",  leftDelay: 35,  rightDelay: RIGHT_START      },
    { left: "High Bounce Rate",       right: "High Deliverability",       leftDelay: 65,  rightDelay: RIGHT_START + 25 },
    { left: "Disconnected Numbers",   right: "Working Numbers",           leftDelay: 95,  rightDelay: RIGHT_START + 50 },
    { left: "Legal Risk",             right: "GDPR/CCPA Compliant",       leftDelay: 125, rightDelay: RIGHT_START + 75 },
  ];

  const COL_W = 420;
  const ROW_H = 88;

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: COL_W * 2 + 80 }}>

        {/* Headers */}
        <div style={{
          display: "flex", gap: 80, marginBottom: 32,
          opacity: headerOp, transform: `translateY(${headerY}px)`,
        }}>
          <div style={{ width: COL_W, textAlign: "center" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: `${RED}15`, borderRadius: 12,
              padding: "10px 28px",
              border: `1.5px solid ${RED}40`,
            }}>
              <WarningIcon size={22} color={RED}/>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 22, color: RED, letterSpacing: 1 }}>
                CHEAP LIST
              </span>
            </div>
          </div>
          <div style={{ width: COL_W, textAlign: "center" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: `${GREEN}15`, borderRadius: 12,
              padding: "10px 28px",
              border: `1.5px solid ${GREEN}40`,
            }}>
              <CheckCircleIcon size={22} color={GREEN}/>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 22, color: GREEN, letterSpacing: 1 }}>
                VERIFIED DATA
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          position: "absolute",
          left: COL_W + 39, top: 72,
          width: 2, height: dividerH,
          background: `linear-gradient(180deg, ${RED}60, ${PINK}60)`,
          borderRadius: 2,
        }}/>

        {/* Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {rows.map((row, i) => {
            const { leftDelay, rightDelay } = row;

            const rowSp    = spring({ frame: frame - leftDelay,     fps, config: { damping: 16, stiffness: 140 } });
            const rowOp    = fi(frame, leftDelay,     leftDelay + 18, 0, 1);
            const iconSp   = spring({ frame: frame - leftDelay - 8, fps, config: { damping: 14, stiffness: 200 } });
            const iconOp   = fi(frame, leftDelay + 8, leftDelay + 22, 0, 1);

            const rightSp     = spring({ frame: frame - rightDelay,     fps, config: { damping: 16, stiffness: 140 } });
            const rightOp     = fi(frame, rightDelay,     rightDelay + 18, 0, 1);
            const rightIconSp = spring({ frame: frame - rightDelay - 8, fps, config: { damping: 14, stiffness: 200 } });
            const rightIconOp = fi(frame, rightDelay + 8, rightDelay + 22, 0, 1);

            return (
              <div key={i} style={{ display: "flex", gap: 80, alignItems: "stretch" }}>
                {/* Left cell — cheap list, appears first */}
                <div style={{
                  width: COL_W, height: ROW_H,
                  background: "white", borderRadius: 14,
                  border: `1.5px solid ${RED}20`,
                  borderLeft: `4px solid ${RED}`,
                  display: "flex", alignItems: "center",
                  padding: "0 20px", gap: 14,
                  boxShadow: "0 2px 10px rgba(0,0,60,0.05)",
                  transform: `scale(${rowSp})`, opacity: rowOp,
                  transformOrigin: "center center",
                }}>
                  <div style={{ opacity: iconOp, transform: `scale(${iconSp})`, transformOrigin: "center" }}>
                    <WarningIcon size={28} color={RED}/>
                  </div>
                  <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 20, color: "#3a3a4a" }}>
                    {row.left}
                  </span>
                </div>

                {/* Right cell — verified data, appears after */}
                <div style={{
                  width: COL_W, height: ROW_H,
                  background: "white", borderRadius: 14,
                  border: `1.5px solid ${GREEN}20`,
                  borderLeft: `4px solid ${GREEN}`,
                  display: "flex", alignItems: "center",
                  padding: "0 20px", gap: 14,
                  boxShadow: "0 2px 10px rgba(0,0,60,0.05)",
                  transform: `scale(${rightSp})`, opacity: rightOp,
                  transformOrigin: "center center",
                }}>
                  <div style={{ opacity: rightIconOp, transform: `scale(${rightIconSp})`, transformOrigin: "center" }}>
                    <CheckCircleIcon size={28} color={GREEN}/>
                  </div>
                  <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 20, color: "#1a3a1a" }}>
                    {row.right}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 5: First-Party vs Third-Party Data ────────────────────────────────
// Two source streams converging on a central "Your Pipeline" hub
const FunnelIcon = ({ size = 56, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <polygon points="4,8 44,8 30,26 30,42 18,36 18,26" fill={color}/>
  </svg>
);
const GlobeIcon = ({ size = 56, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="20" fill="none" stroke={color} strokeWidth="3.5"/>
    <ellipse cx="24" cy="24" rx="9" ry="20" fill="none" stroke={color} strokeWidth="3"/>
    <line x1="4" y1="24" x2="44" y2="24" stroke={color} strokeWidth="3"/>
    <line x1="7" y1="14" x2="41" y2="14" stroke={color} strokeWidth="2.5"/>
    <line x1="7" y1="34" x2="41" y2="34" stroke={color} strokeWidth="2.5"/>
  </svg>
);
const CRMIcon = ({ size = 56, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <rect x="6" y="8" width="36" height="32" rx="4" fill={color}/>
    <rect x="10" y="14" width="12" height="10" rx="2" fill="white" opacity="0.85"/>
    <rect x="26" y="14" width="12" height="10" rx="2" fill="white" opacity="0.85"/>
    <rect x="10" y="28" width="28" height="4" rx="2" fill="white" opacity="0.6"/>
  </svg>
);
const TargetIcon = ({ size = 56, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="20" fill="none" stroke={color} strokeWidth="3.5"/>
    <circle cx="24" cy="24" r="13" fill="none" stroke={color} strokeWidth="3"/>
    <circle cx="24" cy="24" r="6" fill={color}/>
  </svg>
);

function DataSourcesScene({ frame, fps }) {
  const CX = 960, CY = 540;

  // Left side: First-party (slides in from left)
  const leftX = fi(frame, 0, 28, -200, 0);
  const leftOp = fi(frame, 0, 24, 0, 1);

  // Right side: Third-party (slides in from right)
  const rightX = fi(frame, 15, 43, 200, 0);
  const rightOp = fi(frame, 15, 40, 0, 1);

  // Center hub
  const hubSp = spring({ frame: frame - 55, fps, config: { damping: 14, stiffness: 140 } });
  const hubOp = fi(frame, 55, 72, 0, 1);

  // Flow arrows
  const leftFlow = fi(frame, 65, 88, 0, 1);
  const rightFlow = fi(frame, 72, 95, 0, 1);

  // Sub-items stagger
  const leftItems = ["Your CRM", "Website Visits", "Sales Calls", "Email Responses"];
  const rightItems = ["Public Records", "Business Registries", "Company Sites", "Pro Networks"];

  const ITEM_DELAY = 12;

  const arrowPath = (x1, y1, x2, y2, progress) => {
    const mx = x1 + (x2 - x1) * progress;
    return `M${x1},${y1} L${mx},${y2}`;
  };

  return (
    <AbsoluteFill>
      {/* Flow lines from sources to hub */}
      <svg style={{ position: "absolute", inset: 0 }} viewBox="0 0 1920 1080">
        {/* Left arrow */}
        <line
          x1={CX - 310} y1={CY}
          x2={CX - 310 + 200 * leftFlow} y2={CY}
          stroke={`rgba(30,45,90,0.5)`} strokeWidth="3"
          strokeDasharray="10 6" strokeLinecap="round"
        />
        {leftFlow >= 0.98 && <polygon points={`${CX-110},${CY} ${CX-130},${CY-10} ${CX-130},${CY+10}`} fill={NAVY} opacity="0.6"/>}
        {/* Right arrow */}
        <line
          x1={CX + 310} y1={CY}
          x2={CX + 310 - 200 * rightFlow} y2={CY}
          stroke={`rgba(232,24,46,0.5)`} strokeWidth="3"
          strokeDasharray="10 6" strokeLinecap="round"
        />
        {rightFlow >= 0.98 && <polygon points={`${CX+110},${CY} ${CX+130},${CY-10} ${CX+130},${CY+10}`} fill={RED} opacity="0.6"/>}
      </svg>

      {/* Left column: First-party */}
      <div style={{
        position: "absolute",
        left: 80,
        top: "50%",
        transform: `translateY(-50%) translateX(${leftX}px)`,
        opacity: leftOp,
        width: 360,
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${NAVY}, #2d4a8a)`,
          borderRadius: 16, padding: "20px 28px", marginBottom: 20,
          display: "flex", alignItems: "center", gap: 16,
          boxShadow: "0 8px 30px rgba(30,45,90,0.25)",
        }}>
          <CRMIcon size={44} color="white"/>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", fontFamily: FONT, letterSpacing: 2, textTransform: "uppercase" }}>
              You Collect It
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "white", fontFamily: FONT }}>
              First-Party
            </div>
          </div>
        </div>
        {/* Items */}
        {leftItems.map((item, i) => {
          const iOp = fi(frame, 20 + i * ITEM_DELAY, 36 + i * ITEM_DELAY, 0, 1);
          const iX = fi(frame, 20 + i * ITEM_DELAY, 36 + i * ITEM_DELAY, -20, 0);
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 16px", marginBottom: 8,
              background: "white", borderRadius: 10,
              border: `1.5px solid rgba(30,45,90,0.1)`,
              borderLeft: `3px solid ${NAVY}`,
              boxShadow: "0 2px 8px rgba(0,0,60,0.05)",
              opacity: iOp, transform: `translateX(${iX}px)`,
              fontFamily: FONT, fontSize: 17, fontWeight: 600, color: NAVY,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: NAVY, flexShrink: 0 }}/>
              {item}
            </div>
          );
        })}
        <div style={{
          marginTop: 12, fontSize: 13, fontWeight: 500, color: "#7b89aa", fontFamily: FONT,
          opacity: fi(frame, 70, 86, 0, 1),
        }}>
          Accurate — but limited to people<br/>who already know you.
        </div>
      </div>

      {/* Right column: Third-party */}
      <div style={{
        position: "absolute",
        right: 80,
        top: "50%",
        transform: `translateY(-50%) translateX(${rightX}px)`,
        opacity: rightOp,
        width: 360,
      }}>
        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${RED}, ${PINK})`,
          borderRadius: 16, padding: "20px 28px", marginBottom: 20,
          display: "flex", alignItems: "center", gap: 16,
          boxShadow: "0 8px 30px rgba(232,24,46,0.25)",
        }}>
          <GlobeIcon size={44} color="white"/>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)", fontFamily: FONT, letterSpacing: 2, textTransform: "uppercase" }}>
              Market-Mapped
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "white", fontFamily: FONT }}>
              Third-Party
            </div>
          </div>
        </div>
        {/* Items */}
        {rightItems.map((item, i) => {
          const iOp = fi(frame, 30 + i * ITEM_DELAY, 46 + i * ITEM_DELAY, 0, 1);
          const iX = fi(frame, 30 + i * ITEM_DELAY, 46 + i * ITEM_DELAY, 20, 0);
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 16px", marginBottom: 8,
              background: "white", borderRadius: 10,
              border: `1.5px solid rgba(232,24,46,0.1)`,
              borderLeft: `3px solid ${RED}`,
              boxShadow: "0 2px 8px rgba(0,0,60,0.05)",
              opacity: iOp, transform: `translateX(${iX}px)`,
              fontFamily: FONT, fontSize: 17, fontWeight: 600, color: "#3a2020",
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: RED, flexShrink: 0 }}/>
              {item}
            </div>
          );
        })}
        <div style={{
          marginTop: 12, fontSize: 13, fontWeight: 500, color: "#7b89aa", fontFamily: FONT,
          opacity: fi(frame, 75, 91, 0, 1),
          textAlign: "right",
        }}>
          Coverage you could never<br/>build manually.
        </div>
      </div>

      {/* Center hub */}
      <div style={{
        position: "absolute",
        left: CX - 90, top: CY - 90,
        transform: `scale(${hubSp})`, opacity: hubOp,
      }}>
        <Card width={180} height={180} style={{ background: `linear-gradient(135deg, ${NAVY}, #2d4a8a)` }}>
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            height: "100%", gap: 10,
          }}>
            <TargetIcon size={56} color="white"/>
            <div style={{ fontSize: 14, fontWeight: 800, color: "white", fontFamily: FONT, textAlign: "center", lineHeight: 1.3 }}>
              YOUR<br/>PIPELINE
            </div>
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 6: Data Decay ──────────────────────────────────────────────────────
// CRM rows visually rotting year by year
const CalendarIcon = ({ size = 40, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <rect x="4" y="10" width="40" height="34" rx="4" fill={color}/>
    <rect x="4" y="10" width="40" height="14" rx="4" fill={color}/>
    <rect x="12" y="4" width="4" height="12" rx="2" fill={color}/>
    <rect x="32" y="4" width="4" height="12" rx="2" fill={color}/>
    <rect x="10" y="30" width="8" height="7" rx="2" fill="white" opacity="0.8"/>
    <rect x="22" y="30" width="8" height="7" rx="2" fill="white" opacity="0.5"/>
    <rect x="34" y="30" width="8" height="7" rx="2" fill="white" opacity="0.3"/>
  </svg>
);

function DataDecayScene({ frame, fps }) {
  // 3 "year" snapshots, each revealing at intervals
  const years = [
    { label: "Year 1", total: 10, valid: 10, delay: 0 },
    { label: "Year 2", total: 10, valid: 8,  delay: 55 },
    { label: "Year 3", total: 10, valid: 6,  delay: 110 },
  ];

  const statOp = fi(frame, 155, 172, 0, 1);
  const statY = fi(frame, 155, 172, 16, 0);

  // Contacts as small rows: green = valid, red+faded = stale
  function ContactRows({ total, valid, stale, colDelay, yearFrame }) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 14 }}>
        {Array.from({ length: total }).map((_, i) => {
          const isStale = i >= valid;
          const rowDelay = colDelay + i * 6;
          const rowOp = fi(yearFrame, rowDelay, rowDelay + 12, 0, 1);
          const rowX = fi(yearFrame, rowDelay, rowDelay + 14, -16, 0);
          const staleReveal = fi(yearFrame, colDelay + 30 + i * 4, colDelay + 45 + i * 4, 0, 1);

          return (
            <div key={i} style={{
              opacity: rowOp,
              transform: `translateX(${rowX}px)`,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <div style={{
                width: 220, height: 32,
                borderRadius: 7,
                background: isStale ? `rgba(232,24,46,${0.12 + staleReveal * 0.1})` : "white",
                border: `1.5px solid ${isStale ? `rgba(232,24,46,${0.3 + staleReveal * 0.3})` : "rgba(22,163,74,0.2)"}`,
                display: "flex", alignItems: "center", paddingLeft: 10, gap: 8,
                boxShadow: isStale ? "none" : "0 1px 5px rgba(0,0,60,0.05)",
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: isStale ? `rgba(232,24,46,${0.6 + staleReveal * 0.4})` : GREEN,
                  flexShrink: 0,
                }}/>
                <div style={{
                  width: isStale ? 80 : 140,
                  height: 6, borderRadius: 3,
                  background: isStale ? `rgba(232,24,46,${0.3 + staleReveal * 0.2})` : "rgba(22,163,74,0.3)",
                }}/>
                {!isStale && (
                  <div style={{ width: 40, height: 6, borderRadius: 3, background: "rgba(22,163,74,0.2)", marginLeft: "auto", marginRight: 10 }}/>
                )}
                {isStale && (
                  <div style={{
                    marginLeft: "auto", marginRight: 8,
                    fontSize: 10, fontWeight: 700,
                    color: `rgba(232,24,46,${0.7 + staleReveal * 0.3})`,
                    fontFamily: FONT, letterSpacing: 0.5,
                    opacity: staleReveal,
                  }}>
                    STALE
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>
        {years.map((yr, yi) => {
          const colOp = fi(frame, yr.delay, yr.delay + 20, 0, 1);
          const colY = fi(frame, yr.delay, yr.delay + 20, 24, 0);
          const staleCount = yr.total - yr.valid;
          const pct = Math.round((yr.valid / yr.total) * 100);

          return (
            <div key={yi} style={{
              opacity: colOp,
              transform: `translateY(${colY}px)`,
              width: 260,
            }}>
              {/* Year header */}
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                marginBottom: 8,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: yi === 0 ? GREEN : yi === 1 ? "#d97706" : RED,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 4px 16px ${yi === 0 ? "rgba(22,163,74,0.3)" : yi === 1 ? "rgba(217,119,6,0.3)" : "rgba(232,24,46,0.3)"}`,
                }}>
                  <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 13, color: "white" }}>{yr.label.split(" ")[1]}</span>
                </div>
                <div>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 18, color: NAVY }}>{yr.label}</div>
                  <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 13,
                    color: yi === 0 ? GREEN : yi === 1 ? "#d97706" : RED }}>
                    {pct}% valid
                  </div>
                </div>
              </div>

              {/* Contact rows */}
              <ContactRows
                total={yr.total}
                valid={yr.valid}
                stale={staleCount}
                colDelay={yr.delay}
                yearFrame={frame}
              />
            </div>
          );
        })}
      </div>

      {/* Stat callout */}
      <div style={{
        position: "absolute", bottom: 88,
        opacity: statOp, transform: `translateY(${statY}px)`,
        display: "flex", alignItems: "center", gap: 16,
        background: `${RED}12`, border: `1.5px solid ${RED}30`,
        borderRadius: 14, padding: "14px 32px",
      }}>
        <WarningIcon size={28} color={RED}/>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: NAVY }}>
          20–30% of B2B data goes stale{" "}
          <span style={{ color: RED }}>every year</span>
        </span>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 7: Three Consequences of Bad Data ─────────────────────────────────
// Deliverability → Legal Risk → Morale — domino-style reveal with visual indicators
const EmailDeliverIcon = ({ size = 52, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <rect x="4" y="10" width="40" height="30" rx="4" fill={color}/>
    <polyline points="4,10 24,26 44,10" stroke="white" strokeWidth="3" fill="none"/>
    <line x1="28" y1="32" x2="42" y2="32" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
    <line x1="28" y1="38" x2="36" y2="38" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
  </svg>
);
const ScaleIcon = ({ size = 52, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <line x1="24" y1="6" x2="24" y2="42" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
    <line x1="12" y1="10" x2="36" y2="10" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
    <ellipse cx="10" cy="28" rx="8" ry="6" fill={color}/>
    <ellipse cx="38" cy="28" rx="8" ry="6" fill={color}/>
    <path d="M2 22 L10 10 L18 22" fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M30 22 L38 10 L46 22" fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round"/>
    <line x1="24" y1="42" x2="16" y2="42" stroke={color} strokeWidth="3" strokeLinecap="round"/>
    <line x1="24" y1="42" x2="32" y2="42" stroke={color} strokeWidth="3" strokeLinecap="round"/>
  </svg>
);
const MoodDownIcon = ({ size = 52, color = NAVY }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="20" fill="none" stroke={color} strokeWidth="3.5"/>
    <circle cx="16" cy="19" r="3" fill={color}/>
    <circle cx="32" cy="19" r="3" fill={color}/>
    <path d="M14 34 Q24 26 34 34" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round"/>
  </svg>
);

function ConsequencesScene({ frame, fps }) {
  const panels = [
    {
      Icon: EmailDeliverIcon,
      title: "Deliverability",
      headline: "Reputation damage",
      detail: "High bounce rates and spam traps hurt your sending score. Real prospects stop seeing your emails.",
      color: RED,
      delay: 0,
      meter: 0.22, // "bad" fill
    },
    {
      Icon: ScaleIcon,
      title: "Legal Risk",
      headline: "GDPR & CCPA exposure",
      detail: "Non-compliant data can cost more than a year of good data. One bad list, real exposure.",
      color: "#d97706",
      delay: 50,
      meter: 0.55,
    },
    {
      Icon: MoodDownIcon,
      title: "Team Morale",
      headline: "Burnout & lost productivity",
      detail: "When reps spend half their day fixing bad records, they burn out fast. Productivity drops.",
      color: PINK,
      delay: 100,
      meter: 0.3,
    },
  ];

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", gap: 48, alignItems: "stretch" }}>
        {panels.map((p, i) => {
          const sp = spring({ frame: frame - p.delay, fps, config: { damping: 20, stiffness: 110 } });
          const op = fi(frame, p.delay, p.delay + 22, 0, 1);
          const textOp = fi(frame, p.delay + 12, p.delay + 32, 0, 1);
          const textY = fi(frame, p.delay + 12, p.delay + 32, 14, 0);
          const meterW = fi(frame, p.delay + 20, p.delay + 55, 0, p.meter);

          return (
            <div key={i} style={{
              width: 340,
              transform: `scale(${sp}) translateY(${fi(frame - p.delay, 0, 22, 30, 0)}px)`,
              opacity: op,
              transformOrigin: "center bottom",
            }}>
              {/* Card */}
              <div style={{
                background: "white",
                borderRadius: 20,
                border: `1.5px solid rgba(30,45,90,0.08)`,
                borderTop: `4px solid ${p.color}`,
                boxShadow: `0 8px 32px rgba(0,0,60,0.08), 0 0 0 1px rgba(255,255,255,0.8)`,
                padding: "32px 28px",
                height: "100%",
              }}>
                {/* Icon */}
                <div style={{
                  width: 72, height: 72, borderRadius: 18,
                  background: `${p.color}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 20,
                }}>
                  <p.Icon size={40} color={p.color}/>
                </div>

                {/* Number */}
                <div style={{
                  fontSize: 11, fontWeight: 700, color: p.color,
                  fontFamily: FONT, letterSpacing: 2, textTransform: "uppercase",
                  marginBottom: 6,
                }}>
                  0{i + 1}
                </div>

                {/* Title */}
                <div style={{
                  fontSize: 26, fontWeight: 900, color: NAVY,
                  fontFamily: FONT, lineHeight: 1.2, marginBottom: 8,
                  opacity: textOp, transform: `translateY(${textY}px)`,
                }}>
                  {p.title}
                </div>

                {/* Headline */}
                <div style={{
                  fontSize: 16, fontWeight: 700, color: p.color,
                  fontFamily: FONT, marginBottom: 12,
                  opacity: textOp, transform: `translateY(${textY}px)`,
                }}>
                  {p.headline}
                </div>

                {/* Detail */}
                <div style={{
                  fontSize: 15, fontWeight: 400, color: "#4a5580",
                  fontFamily: FONT, lineHeight: 1.55,
                  opacity: fi(frame, p.delay + 22, p.delay + 42, 0, 1),
                }}>
                  {p.detail}
                </div>

                {/* Impact meter */}
                <div style={{ marginTop: 24 }}>
                  <div style={{
                    fontSize: 11, fontWeight: 700, color: "#9aa0b8",
                    fontFamily: FONT, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6,
                  }}>
                    Impact Level
                  </div>
                  <div style={{
                    height: 6, borderRadius: 3,
                    background: "rgba(30,45,90,0.08)", overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%",
                      width: `${meterW * 100}%`,
                      background: `linear-gradient(90deg, ${p.color}80, ${p.color})`,
                      borderRadius: 3,
                      transition: "width 0.3s",
                    }}/>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 8: Do You Need B2B Data? ──────────────────────────────────────────
// Decision sorter: scenarios fly in and sort into YES / NO columns
function NeedDataScene({ frame, fps }) {
  const noScenarios = [
    { text: "Inbound-only,\nconsistent demand" },
    { text: "Tiny target list" },
    { text: "Early discovery\nphase" },
    { text: "Simple, fast-moving\ndeals" },
  ];

  const yesScenarios = [
    { text: "You run outbound" },
    { text: "Large TAM" },
    { text: "Multiple sellers" },
    { text: "Low connect rates" },
    { text: "Reps spend hours\nresearching" },
  ];

  // Headers
  const headerOp = fi(frame, 8, 26, 0, 1);
  const dividerH = fi(frame, 18, 46, 0, 520);

  // NO column: slides in from left
  // YES column: slides in from right
  const COL_W = 380;
  const START_NO = 30;
  const START_YES = 30;

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: COL_W * 2 + 80 }}>

        {/* Column headers */}
        <div style={{
          display: "flex", gap: 80, marginBottom: 28,
          opacity: headerOp,
        }}>
          <div style={{ width: COL_W, textAlign: "center" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "rgba(30,45,90,0.06)", borderRadius: 12,
              padding: "10px 28px", border: `1.5px solid rgba(30,45,90,0.15)`,
            }}>
              <span style={{ fontSize: 20, fontFamily: FONT }}>🚫</span>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 20, color: "#4a5580", letterSpacing: 0.5 }}>
                PROBABLY NOT
              </span>
            </div>
          </div>
          <div style={{ width: COL_W, textAlign: "center" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: `${RED}12`, borderRadius: 12,
              padding: "10px 28px", border: `1.5px solid ${RED}35`,
            }}>
              <span style={{ fontSize: 20, fontFamily: FONT }}>✅</span>
              <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 20, color: RED, letterSpacing: 0.5 }}>
                YOU NEED IT
              </span>
            </div>
          </div>
        </div>

        {/* Vertical divider */}
        <div style={{
          position: "absolute",
          left: COL_W + 39, top: 62,
          width: 2, height: dividerH,
          background: `linear-gradient(180deg, ${RED}50, ${PINK}30)`,
          borderRadius: 2,
        }}/>

        {/* Two columns */}
        <div style={{ display: "flex", gap: 80 }}>
          {/* NO column */}
          <div style={{ width: COL_W, display: "flex", flexDirection: "column", gap: 12 }}>
            {noScenarios.map((s, i) => {
              const d = START_NO + i * 18;
              const op = fi(frame, d, d + 18, 0, 1);
              const x = fi(frame, d, d + 20, -40, 0);
              return (
                <div key={i} style={{
                  opacity: op, transform: `translateX(${x}px)`,
                  background: "white", borderRadius: 12,
                  border: `1.5px solid rgba(30,45,90,0.1)`,
                  borderLeft: `3px solid rgba(30,45,90,0.3)`,
                  padding: "14px 18px",
                  fontFamily: FONT, fontSize: 16, fontWeight: 600,
                  color: "#4a5580", lineHeight: 1.4, whiteSpace: "pre-line",
                  boxShadow: "0 2px 8px rgba(0,0,60,0.04)",
                }}>
                  {s.text}
                </div>
              );
            })}
          </div>

          {/* YES column */}
          <div style={{ width: COL_W, display: "flex", flexDirection: "column", gap: 12 }}>
            {yesScenarios.map((s, i) => {
              const d = START_YES + i * 16;
              const op = fi(frame, d, d + 18, 0, 1);
              const x = fi(frame, d, d + 20, 40, 0);
              return (
                <div key={i} style={{
                  opacity: op, transform: `translateX(${x}px)`,
                  background: "white", borderRadius: 12,
                  border: `1.5px solid ${RED}20`,
                  borderLeft: `3px solid ${RED}`,
                  padding: "14px 18px",
                  fontFamily: FONT, fontSize: 16, fontWeight: 700,
                  color: NAVY, lineHeight: 1.4, whiteSpace: "pre-line",
                  boxShadow: "0 2px 10px rgba(232,24,46,0.07)",
                }}>
                  {s.text}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 9: Volume Illusion — 10,000 contacts explode, then collapse ────────
// Particles rain down, then only a small verified cluster remains
function seededRand(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return (h >>> 0) / 4294967295;
}

function VolumeIllusionScene({ frame, fps }) {
  // Phase 1 (0–50): "10,000" slams in huge
  // Phase 2 (50–110): particles burst outward from center
  // Phase 3 (110–165): particles fade/fall away
  // Phase 4 (165–210): only 312 "verified" remains, glowing green
  // Caption (180+)

  const bigNumSp = spring({ frame, fps, config: { damping: 8, stiffness: 280 } });
  const bigNumOp = fi(frame, 0, 10, 0, 1);
  const bigNumScale = fi(frame, 60, 100, 1, 0.45);
  const bigNumFade = fi(frame, 60, 100, 1, 0);

  const subTextOp = fi(frame, 18, 36, 0, 1);
  const subTextY = fi(frame, 18, 36, 12, 0);

  // Particle dots — 60 of them scattered
  const PARTICLE_COUNT = 60;
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const r = seededRand(`p${i}`);
    const r2 = seededRand(`p${i}x`);
    const angle = r * Math.PI * 2;
    const speed = 120 + r2 * 280;
    const px = Math.cos(angle) * speed;
    const py = Math.sin(angle) * speed - 60;
    const startFrame = 50 + Math.floor(r * 20);
    const isKeeper = i < 8; // only 8 survive
    return { px, py, startFrame, isKeeper, r };
  });

  // Verified number
  const verifiedSp = spring({ frame: frame - 168, fps, config: { damping: 14, stiffness: 160 } });
  const verifiedOp = fi(frame, 168, 185, 0, 1);

  const captionOp = fi(frame, 185, 200, 0, 1);
  const captionY = fi(frame, 185, 200, 14, 0);

  return (
    <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Particle layer */}
      <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} viewBox="0 0 1920 1080">
        {particles.map((p, i) => {
          const t = Math.max(0, frame - p.startFrame);
          const travelProgress = fi(t, 0, 40, 0, 1);
          const fadeOut = p.isKeeper
            ? fi(frame, 155, 175, 1, 0) // keepers fade out too, replaced by verified card
            : fi(frame, 100, 140, 1, 0);
          const cx = 960 + p.px * travelProgress;
          const cy = 540 + p.py * travelProgress;
          const size = p.isKeeper ? 10 : 5 + p.r * 5;
          const color = p.isKeeper ? GREEN : RED;
          const opacity = travelProgress > 0 ? fadeOut : 0;
          return (
            <circle key={i} cx={cx} cy={cy} r={size}
              fill={color} opacity={opacity * (p.isKeeper ? 0.8 : 0.4)}
            />
          );
        })}
      </svg>

      {/* Big 10,000 label */}
      <div style={{
        position: "absolute",
        textAlign: "center",
        opacity: bigNumFade * (bigNumOp),
        transform: `scale(${0.5 + bigNumSp * 0.5}) scale(${bigNumScale})`,
        transformOrigin: "center center",
      }}>
        <div style={{
          fontFamily: FONT, fontWeight: 900,
          fontSize: 220, color: NAVY,
          lineHeight: 0.9, letterSpacing: "-8px",
        }}>
          10,000
        </div>
        <div style={{
          fontFamily: FONT, fontWeight: 700, fontSize: 28,
          color: "#7b89aa", letterSpacing: 4, textTransform: "uppercase",
          opacity: subTextOp, transform: `translateY(${subTextY}px)`,
        }}>
          contacts on a cheap list
        </div>
      </div>

      {/* Verified number rises from center */}
      <div style={{
        position: "absolute",
        textAlign: "center",
        transform: `scale(${verifiedSp})`,
        opacity: verifiedOp,
      }}>
        <div style={{
          fontFamily: FONT, fontWeight: 900, fontSize: 130,
          color: GREEN, letterSpacing: "-4px", lineHeight: 0.9,
        }}>
          312
        </div>
        <div style={{
          fontFamily: FONT, fontWeight: 700, fontSize: 22,
          color: GREEN, letterSpacing: 3, textTransform: "uppercase", marginTop: 12,
          opacity: fi(frame, 178, 192, 0, 1),
        }}>
          actually deliverable
        </div>
      </div>

      {/* Bottom caption */}
      <div style={{
        position: "absolute", bottom: 90, left: 0, right: 0,
        textAlign: "center",
        opacity: captionOp, transform: `translateY(${captionY}px)`,
        fontFamily: FONT, fontWeight: 900, fontSize: 28, color: RED,
      }}>
        Volume is not value.
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 10: The Broken Chain ───────────────────────────────────────────────
// 5 data types shown as chain links. One breaks, then they all go dark.
function BrokenChainScene({ frame, fps }) {
  const types = [
    { label: "Contact",       color: NAVY,     Icon: PersonIcon    },
    { label: "Firmographic",  color: "#2563eb", Icon: BuildingIcon  },
    { label: "Technographic", color: "#7c3aed", Icon: GearIcon      },
    { label: "Intent",        color: "#d97706", Icon: ZapIcon       },
    { label: "Trigger Events",color: RED,       Icon: LightningIcon },
  ];

  // All appear (0-80), then Intent (index 3) "breaks" at frame 100
  // After break, chain dims. Warning flashes.
  const breakFrame = 100;
  const isBroken = frame >= breakFrame;
  const breakProgress = fi(frame, breakFrame, breakFrame + 20, 0, 1);

  // Chain link SVG paths between nodes
  const NODE_W = 230, NODE_H = 110, GAP = 18;
  const totalW = types.length * NODE_W + (types.length - 1) * GAP;
  const startX = (1920 - totalW) / 2;
  const Y = 490;

  const flashOp = isBroken
    ? Math.abs(Math.sin((frame - breakFrame) * 0.25)) * fi(frame, breakFrame, breakFrame + 8, 0, 1)
    : 0;

  const captionOp = fi(frame, 148, 166, 0, 1);
  const captionY = fi(frame, 148, 166, 14, 0);

  return (
    <AbsoluteFill>
      {/* Chain connector lines */}
      <svg style={{ position: "absolute", inset: 0 }} viewBox="0 0 1920 1080">
        {types.map((t, i) => {
          if (i === types.length - 1) return null;
          const x1 = startX + i * (NODE_W + GAP) + NODE_W;
          const x2 = startX + (i + 1) * (NODE_W + GAP);
          const isBrokenLink = isBroken && (i === 2 || i === 3); // break between intent and trigger
          const linkOp = isBrokenLink
            ? fi(frame, breakFrame, breakFrame + 16, 1, 0.1)
            : fi(frame, 10 + i * 8, 26 + i * 8, 0, 1);
          const linkColor = isBrokenLink ? RED : "#c8cce0";
          return (
            <g key={i}>
              <line x1={x1} y1={Y + NODE_H / 2} x2={x2} y2={Y + NODE_H / 2}
                stroke={linkColor} strokeWidth={isBrokenLink ? "3" : "2.5"}
                strokeDasharray={isBrokenLink ? "6 4" : "none"}
                opacity={linkOp}
              />
              {/* Break X marker */}
              {isBrokenLink && breakProgress > 0.3 && (
                <g opacity={breakProgress}>
                  <line x1={(x1 + x2) / 2 - 10} y1={Y + NODE_H / 2 - 10}
                    x2={(x1 + x2) / 2 + 10} y2={Y + NODE_H / 2 + 10}
                    stroke={RED} strokeWidth="3.5" strokeLinecap="round"/>
                  <line x1={(x1 + x2) / 2 + 10} y1={Y + NODE_H / 2 - 10}
                    x2={(x1 + x2) / 2 - 10} y2={Y + NODE_H / 2 + 10}
                    stroke={RED} strokeWidth="3.5" strokeLinecap="round"/>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Nodes */}
      {types.map((t, i) => {
        const sp = spring({ frame: frame - i * 12, fps, config: { damping: 14, stiffness: 150 } });
        const op = fi(frame, i * 12, i * 12 + 18, 0, 1);
        const x = startX + i * (NODE_W + GAP);
        // After break, nodes 3+ dim in cascade order; nodes 0,1,2 dim sequentially outward from break
        const cascadeDimDelay = isBroken
          ? i >= 3
            ? (i - 3) * 12  // right side dims first, then cascades outward
            : (2 - i) * 14  // left side dims in reverse (2, 1, 0)
          : 9999;
        const dimStart = breakFrame + 10 + cascadeDimDelay;
        const dimOp = isBroken && i < 3
          ? fi(frame, dimStart, dimStart + 20, 1, 0.25)
          : 1;
        const affectedOp = isBroken && i >= 3
          ? fi(frame, breakFrame + (i - 3) * 12, breakFrame + 20 + (i - 3) * 12, 1, 0.25)
          : 1;
        const isAffected = isBroken && i >= 3;
        const nodeOp = op * dimOp * affectedOp;
        const borderColor = isAffected ? RED : t.color;

        return (
          <div key={i} style={{
            position: "absolute",
            left: x, top: Y,
            width: NODE_W, height: NODE_H,
            transform: `scale(${sp}) translateY(${fi(frame - i * 12, 0, 18, 24, 0)}px)`,
            opacity: nodeOp,
            transformOrigin: "center center",
          }}>
            <div style={{
              width: "100%", height: "100%",
              background: "white",
              borderRadius: 16,
              border: `2px solid ${borderColor}30`,
              borderTop: `3px solid ${borderColor}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 14, paddingLeft: 20,
              boxShadow: `0 4px 20px rgba(0,0,60,0.07)`,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${t.color}18`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <t.Icon size={26} color={t.color}/>
              </div>
              <span style={{
                fontFamily: FONT, fontWeight: 800, fontSize: 15,
                color: NAVY, lineHeight: 1.3,
              }}>
                {t.label}
              </span>
            </div>
          </div>
        );
      })}

      {/* Flash overlay on break */}
      <div style={{
        position: "absolute", inset: 0,
        background: RED,
        opacity: flashOp * 0.08,
        pointerEvents: "none",
      }}/>

      {/* Warning message */}
      {isBroken && (
        <div style={{
          position: "absolute",
          top: Y + NODE_H + 48,
          left: 0, right: 0,
          textAlign: "center",
          opacity: fi(frame, breakFrame + 14, breakFrame + 32, 0, 1),
          transform: `translateY(${fi(frame, breakFrame + 14, breakFrame + 32, 16, 0)}px)`,
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 14,
            background: `${RED}12`, border: `1.5px solid ${RED}40`,
            borderRadius: 14, padding: "16px 36px",
          }}>
            <WarningIcon size={28} color={RED}/>
            <span style={{
              fontFamily: FONT, fontWeight: 800, fontSize: 22, color: NAVY,
            }}>
              Remove one type — the whole system breaks.
            </span>
          </div>
        </div>
      )}

      {/* Bottom caption */}
      <div style={{
        position: "absolute", bottom: 88, left: 0, right: 0,
        textAlign: "center",
        opacity: captionOp, transform: `translateY(${captionY}px)`,
        fontFamily: FONT, fontWeight: 800, fontSize: 26, color: NAVY,
      }}>
        All five types work together —{" "}
        <span style={{ color: RED }}>or not at all.</span>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 11: Speed on Bad Data = Faster Failure ────────────────────────────
// SVG speedometer climbs into the red, needle slams over, then "FAILURE" crashes in
function SpeedometerScene({ frame, fps }) {
  // Needle sweeps from ~-120deg (slow) to +60deg (redline) over frames 20–100
  // Then screen flash + FAILURE text crashes down at frame 110
  const CX = 960, CY = 580, R = 300;

  const needleAngle = fi(frame, 20, 95, -120, 68); // degrees from 9-o-clock baseline
  const needleRad = (needleAngle * Math.PI) / 180;
  const nx = CX + Math.cos(needleRad) * (R - 40);
  const ny = CY + Math.sin(needleRad) * (R - 40);

  // Speed label counter
  const speedVal = Math.round(fi(frame, 20, 95, 0, 100));

  // Dial arcs
  const arcOp = fi(frame, 0, 20, 0, 1);

  const crashFrame = 100;
  const isCrashed = frame >= crashFrame;
  const crashSp = spring({ frame: frame - crashFrame, fps, config: { damping: 10, stiffness: 300 } });
  const crashOp = fi(frame, crashFrame, crashFrame + 8, 0, 1);
  const flashOp = fi(frame, crashFrame, crashFrame + 6, 0.25, 0) * fi(frame, crashFrame, crashFrame + 2, 0, 1);

  // Tick labels
  const ticks = [
    { angle: -120, label: "0" },
    { angle: -84,  label: "20" },
    { angle: -48,  label: "40" },
    { angle: -12,  label: "60" },
    { angle: 24,   label: "80" },
    { angle: 60,   label: "100" },
  ];

  // Speed readout color: navy (0-40%) → orange (40-70%) → red (70%+)
  const speedColor = speedVal < 40
    ? NAVY
    : speedVal < 70
      ? `rgb(${Math.round(30 + (speedVal - 40) / 30 * (217 - 30))}, ${Math.round(45 + (speedVal - 40) / 30 * (119 - 45))}, ${Math.round(90 + (speedVal - 40) / 30 * (6 - 90))})`
      : RED;

  return (
    <AbsoluteFill>
      {/* Flash on crash */}
      <div style={{
        position: "absolute", inset: 0, background: RED,
        opacity: flashOp, pointerEvents: "none",
      }}/>

      {/* Dial SVG */}
      <svg style={{ position: "absolute", inset: 0 }} viewBox="0 0 1920 1080" opacity={arcOp}>
        {/* Background arc — full sweep */}
        <path
          d={`M ${CX + Math.cos((-120) * Math.PI / 180) * R} ${CY + Math.sin((-120) * Math.PI / 180) * R}
              A ${R} ${R} 0 1 1 ${CX + Math.cos((68) * Math.PI / 180) * R} ${CY + Math.sin((68) * Math.PI / 180) * R}`}
          fill="none" stroke="rgba(30,45,90,0.08)" strokeWidth="48" strokeLinecap="round"
        />
        {/* Green zone */}
        <path
          d={`M ${CX + Math.cos((-120) * Math.PI / 180) * R} ${CY + Math.sin((-120) * Math.PI / 180) * R}
              A ${R} ${R} 0 0 1 ${CX + Math.cos((-30) * Math.PI / 180) * R} ${CY + Math.sin((-30) * Math.PI / 180) * R}`}
          fill="none" stroke={`${GREEN}50`} strokeWidth="48" strokeLinecap="round"
        />
        {/* Yellow zone */}
        <path
          d={`M ${CX + Math.cos((-30) * Math.PI / 180) * R} ${CY + Math.sin((-30) * Math.PI / 180) * R}
              A ${R} ${R} 0 0 1 ${CX + Math.cos((20) * Math.PI / 180) * R} ${CY + Math.sin((20) * Math.PI / 180) * R}`}
          fill="none" stroke={`#d97706`} strokeWidth="48" opacity="0.4" strokeLinecap="round"
        />
        {/* Red zone */}
        <path
          d={`M ${CX + Math.cos((20) * Math.PI / 180) * R} ${CY + Math.sin((20) * Math.PI / 180) * R}
              A ${R} ${R} 0 0 1 ${CX + Math.cos((68) * Math.PI / 180) * R} ${CY + Math.sin((68) * Math.PI / 180) * R}`}
          fill="none" stroke={`${RED}60`} strokeWidth="48" strokeLinecap="round"
        />

        {/* Tick marks + labels */}
        {ticks.map((tick, i) => {
          const tr = (tick.angle * Math.PI) / 180;
          const tx = CX + Math.cos(tr) * (R + 30);
          const ty = CY + Math.sin(tr) * (R + 30);
          const ti1x = CX + Math.cos(tr) * (R - 24);
          const ti1y = CY + Math.sin(tr) * (R - 24);
          const ti2x = CX + Math.cos(tr) * (R + 4);
          const ti2y = CY + Math.sin(tr) * (R + 4);
          return (
            <g key={i}>
              <line x1={ti1x} y1={ti1y} x2={ti2x} y2={ti2y}
                stroke="rgba(30,45,90,0.3)" strokeWidth="2.5" strokeLinecap="round"/>
              <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
                fontSize="22" fontFamily="Helvetica Neue, Arial" fontWeight="700"
                fill="rgba(30,45,90,0.5)">
                {tick.label}
              </text>
            </g>
          );
        })}

        {/* Needle */}
        <line x1={CX} y1={CY} x2={nx} y2={ny}
          stroke={speedColor}
          strokeWidth="6" strokeLinecap="round"
          opacity={arcOp}
        />
        {/* Needle hub */}
        <circle cx={CX} cy={CY} r="22" fill={NAVY}/>
        <circle cx={CX} cy={CY} r="10" fill="white"/>
      </svg>

      {/* Center speed readout */}
      <div style={{
        position: "absolute",
        left: "50%", top: CY + 60,
        transform: "translateX(-50%)",
        textAlign: "center",
        opacity: arcOp,
      }}>
        <div style={{
          fontFamily: FONT, fontWeight: 900, fontSize: 72,
          color: speedColor,
          lineHeight: 1,
        }}>
          {speedVal}%
        </div>
        <div style={{
          fontFamily: FONT, fontWeight: 600, fontSize: 18,
          color: "#7b89aa", letterSpacing: 2, textTransform: "uppercase",
          opacity: labelOp,
        }}>
          activity on bad data
        </div>
      </div>

      {/* Zone labels */}
      <div style={{
        position: "absolute", left: 260, top: CY - 40,
        fontFamily: FONT, fontWeight: 800, fontSize: 20, color: GREEN,
        opacity: labelOp,
      }}>
        SLOW
      </div>
      <div style={{
        position: "absolute", right: 220, top: CY - 160,
        fontFamily: FONT, fontWeight: 800, fontSize: 20, color: RED,
        opacity: labelOp,
      }}>
        REDLINE
      </div>

      {/* CRASH overlay */}
      {isCrashed && (
        <div style={{
          position: "absolute",
          left: "50%", top: "50%",
          transform: `translate(-50%, -50%) scale(${crashSp})`,
          opacity: crashOp,
          textAlign: "center",
        }}>
          <div style={{
            fontFamily: FONT, fontWeight: 900, fontSize: 148,
            color: RED, letterSpacing: "-4px",
            textShadow: "0 4px 40px rgba(232,24,46,0.4)",
          }}>
            FAILURE
          </div>
        </div>
      )}

      {/* Caption */}
      <div style={{
        position: "absolute", bottom: 72, left: 0, right: 0,
        textAlign: "center",
        opacity: captionOp,
        fontFamily: FONT, fontWeight: 800, fontSize: 26, color: NAVY,
      }}>
        Speed on top of bad data doesn't create growth.{" "}
        <span style={{ color: RED }}>It creates faster failure.</span>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene 12: Audit Now — bold word-slam action sequence ────────────────────
// Dark background. Three actions slam in one by one, massive typography.
function AuditNowScene({ frame, fps }) {
  // Dark theme for contrast
  const steps = [
    {
      number: "01",
      action: "PULL 50",
      detail: "contacts from your CRM",
      delay: 0,
    },
    {
      number: "02",
      action: "TEST IT",
      detail: "deliverability + connect rates",
      delay: 55,
    },
    {
      number: "03",
      action: "FIX THE",
      detail: "foundation before you scale",
      detail2: "FOUNDATION",
      delay: 110,
    },
  ];

  const bgOp = fi(frame, 0, 12, 0, 1);

  // Horizontal rule sweeps
  const rule1 = fi(frame, 40, 65, 0, 1);
  const rule2 = fi(frame, 95, 120, 0, 1);

  const closingOp = fi(frame, 162, 182, 0, 1);
  const closingY = fi(frame, 162, 182, 18, 0);

  return (
    <AbsoluteFill>
      {/* Dark overlay — this scene goes dark for impact */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(160deg, #0d1224 0%, #1a1f38 100%)`,
        opacity: bgOp,
      }}/>

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 0, padding: "0 160px",
      }}>
        {steps.map((step, i) => {
          // Escalating spring: each step hits harder
          const springConfigs = [
            { damping: 14, stiffness: 200 },
            { damping: 11, stiffness: 280 },
            { damping: 8,  stiffness: 380 },
          ];
          const wordSp = spring({ frame: frame - step.delay, fps, config: springConfigs[i] });
          const wordOp = fi(frame, step.delay, step.delay + 10, 0, 1);
          const detailOp = fi(frame, step.delay + 10, step.delay + 26, 0, 1);
          const detailX = fi(frame, step.delay + 10, step.delay + 26, 20, 0);

          return (
            <div key={i} style={{ width: "100%", paddingBottom: i < 2 ? 40 : 0 }}>
              {/* Step row */}
              <div style={{
                display: "flex", alignItems: "baseline", gap: 32,
                transform: `scale(${0.7 + wordSp * 0.3})`,
                opacity: wordOp,
                transformOrigin: "left center",
              }}>
                <span style={{
                  fontFamily: FONT, fontWeight: 900, fontSize: 22,
                  color: RED, letterSpacing: 2, flexShrink: 0, marginTop: 8,
                }}>
                  {step.number}
                </span>
                <span style={{
                  fontFamily: FONT, fontWeight: 900,
                  fontSize: 96, color: "white",
                  lineHeight: 0.95, letterSpacing: "-3px",
                }}>
                  {step.action}
                </span>
              </div>
              {/* Detail */}
              <div style={{
                paddingLeft: 54,
                opacity: detailOp,
                transform: `translateX(${detailX}px)`,
                marginTop: 8,
              }}>
                <span style={{
                  fontFamily: FONT, fontWeight: 500, fontSize: 26,
                  color: "rgba(255,255,255,0.55)", letterSpacing: 0.5,
                }}>
                  {step.detail}
                </span>
              </div>
              {/* Divider rule */}
              {i < 2 && (
                <div style={{
                  marginTop: 28,
                  height: 1.5,
                  borderRadius: 1,
                  width: `${(i === 0 ? rule1 : rule2) * 100}%`,
                  background: "rgba(255,255,255,0.1)",
                }}/>
              )}
            </div>
          );
        })}
      </div>

      {/* Closing line */}
      <div style={{
        position: "absolute", bottom: 80, left: 0, right: 0,
        textAlign: "center",
        opacity: closingOp,
        transform: `translateY(${closingY}px)`,
      }}>
        <span style={{
          fontFamily: FONT, fontWeight: 800, fontSize: 24,
          color: "rgba(255,255,255,0.5)",
          letterSpacing: 1,
        }}>
          B2B data isn't lists.{" "}
        </span>
        <span style={{
          fontFamily: FONT, fontWeight: 900, fontSize: 24,
          color: "white",
          position: "relative",
          display: "inline-block",
        }}>
          It's the system that lets you sell.
          {/* Underline sweep */}
          <span style={{
            position: "absolute",
            bottom: -4, left: 0,
            height: 3, borderRadius: 2,
            width: `${fi(frame, 168, 200, 0, 100)}%`,
            background: `linear-gradient(90deg, ${RED}, ${PINK})`,
          }}/>
        </span>
      </div>
    </AbsoluteFill>
  );
}

// ─── Scene durations ──────────────────────────────────────────────────────────
const SCENE1 = 200;
const SCENE2 = 180;
const SCENE3 = 220;
const SCENE4 = 280;
const SCENE5 = 200;
const SCENE6 = 210;
const SCENE7 = 210;
const SCENE8 = 190;
const SCENE9  = 210;
const SCENE10 = 210;
const SCENE11 = 210;
const SCENE12 = 210;

// ─── Root composition ─────────────────────────────────────────────────────────
export const B2BDataExplained = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: LIGHT, fontFamily: FONT }}>
      <Img
        src={staticFile("explained/Background.png")}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }}
      />

      {/* Scene 1: Bad Data Is Breaking Outreach */}
      <Sequence from={0} durationInFrames={SCENE1}>
        <AbsoluteFill>
          <SceneTitle text="Bad Data Is Breaking Your Outreach" frame={frame}/>
          <BadDataScene frame={frame} fps={fps}/>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 2: Two Levels of B2B Data */}
      <Sequence from={SCENE1} durationInFrames={SCENE2}>
        <AbsoluteFill>
          <SceneTitle text="Two Levels of B2B Data" frame={frame - SCENE1}/>
          <TwoLevelsScene frame={frame - SCENE1} fps={fps}/>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 3: Five Data Types */}
      <Sequence from={SCENE1 + SCENE2} durationInFrames={SCENE3}>
        <AbsoluteFill>
          <SceneTitle text="The Five Data Types" frame={frame - SCENE1 - SCENE2}/>
          <FiveTypesScene frame={frame - SCENE1 - SCENE2} fps={fps}/>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 4: Cheap vs Verified */}
      <Sequence from={SCENE1 + SCENE2 + SCENE3} durationInFrames={SCENE4}>
        <AbsoluteFill>
          <SceneTitle text="Cheap Lists vs. Quality Data" frame={frame - SCENE1 - SCENE2 - SCENE3}/>
          <ComparisonScene frame={frame - SCENE1 - SCENE2 - SCENE3} fps={fps}/>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 5: First-Party vs Third-Party */}
      <Sequence from={SCENE1 + SCENE2 + SCENE3 + SCENE4} durationInFrames={SCENE5}>
        <AbsoluteFill>
          <SceneTitle text="Where Does B2B Data Come From?" frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4}/>
          <DataSourcesScene frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4} fps={fps}/>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 6: Data Decay */}
      <Sequence from={SCENE1 + SCENE2 + SCENE3 + SCENE4 + SCENE5} durationInFrames={SCENE6}>
        <AbsoluteFill>
          <SceneTitle text="Your CRM Is Already Decaying" frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5}/>
          <DataDecayScene frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5} fps={fps}/>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 7: Three Consequences */}
      <Sequence from={SCENE1 + SCENE2 + SCENE3 + SCENE4 + SCENE5 + SCENE6} durationInFrames={SCENE7}>
        <AbsoluteFill>
          <SceneTitle text="How Bad Data Hurts You" frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5 - SCENE6}/>
          <ConsequencesScene frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5 - SCENE6} fps={fps}/>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 8: Do You Need B2B Data? */}
      <Sequence from={SCENE1 + SCENE2 + SCENE3 + SCENE4 + SCENE5 + SCENE6 + SCENE7} durationInFrames={SCENE8}>
        <AbsoluteFill>
          <SceneTitle text="Do You Actually Need B2B Data?" frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5 - SCENE6 - SCENE7}/>
          <NeedDataScene frame={frame - SCENE1 - SCENE2 - SCENE3 - SCENE4 - SCENE5 - SCENE6 - SCENE7} fps={fps}/>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 9: Volume Illusion */}
      <Sequence from={SCENE1+SCENE2+SCENE3+SCENE4+SCENE5+SCENE6+SCENE7+SCENE8} durationInFrames={SCENE9}>
        <AbsoluteFill>
          <SceneTitle text="The Volume Illusion" frame={frame-SCENE1-SCENE2-SCENE3-SCENE4-SCENE5-SCENE6-SCENE7-SCENE8}/>
          <VolumeIllusionScene frame={frame-SCENE1-SCENE2-SCENE3-SCENE4-SCENE5-SCENE6-SCENE7-SCENE8} fps={fps}/>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 10: Broken Chain */}
      <Sequence from={SCENE1+SCENE2+SCENE3+SCENE4+SCENE5+SCENE6+SCENE7+SCENE8+SCENE9} durationInFrames={SCENE10}>
        <AbsoluteFill>
          <SceneTitle text="The Five Types — Or Nothing" frame={frame-SCENE1-SCENE2-SCENE3-SCENE4-SCENE5-SCENE6-SCENE7-SCENE8-SCENE9}/>
          <BrokenChainScene frame={frame-SCENE1-SCENE2-SCENE3-SCENE4-SCENE5-SCENE6-SCENE7-SCENE8-SCENE9} fps={fps}/>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 11: Speedometer */}
      <Sequence from={SCENE1+SCENE2+SCENE3+SCENE4+SCENE5+SCENE6+SCENE7+SCENE8+SCENE9+SCENE10} durationInFrames={SCENE11}>
        <AbsoluteFill>
          <SpeedometerScene frame={frame-SCENE1-SCENE2-SCENE3-SCENE4-SCENE5-SCENE6-SCENE7-SCENE8-SCENE9-SCENE10} fps={fps}/>
        </AbsoluteFill>
      </Sequence>

      {/* Scene 12: Audit Now */}
      <Sequence from={SCENE1+SCENE2+SCENE3+SCENE4+SCENE5+SCENE6+SCENE7+SCENE8+SCENE9+SCENE10+SCENE11} durationInFrames={SCENE12}>
        <AbsoluteFill>
          <AuditNowScene frame={frame-SCENE1-SCENE2-SCENE3-SCENE4-SCENE5-SCENE6-SCENE7-SCENE8-SCENE9-SCENE10-SCENE11} fps={fps}/>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
