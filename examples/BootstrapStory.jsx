import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Figtree";
loadFont();

const NAVY  = "#1e2d5a";
const RED   = "#e8182e";
const PINK  = "#c2185b";
const WHITE = "#ffffff";
const FONT  = "'Figtree', 'Helvetica Neue', Helvetica, Arial, sans-serif";

function fi(frame, start, end, from, to) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
}

function formatDollars(n) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

// ─── Credit Card Component ────────────────────────────────────────────────────
function CreditCard({ label, sublabel, amount, maxAmount, glowActive, photo, style }) {
  const W = 340, H = 210, R = 18;
  const amountPct = maxAmount > 0 ? Math.min(amount / maxAmount, 1) : 0;

  return (
    <div style={{
      width: W, height: H,
      borderRadius: R,
      background: `linear-gradient(135deg, #1a2548 0%, #0d1629 100%)`,
      boxShadow: glowActive
        ? `0 0 40px rgba(232,24,46,0.7), 0 8px 32px rgba(0,0,0,0.6)`
        : `0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)`,
      position: "relative",
      overflow: "hidden",
      fontFamily: FONT,
      transition: "box-shadow 0.1s",
      ...style,
    }}>
      {/* Red accent stripe at top */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 6,
        background: `linear-gradient(90deg, ${RED}, ${PINK})`,
        borderRadius: `${R}px ${R}px 0 0`,
      }} />

      {/* Chip or photo */}
      {photo ? (
        <div style={{
          position: "absolute", top: 22, left: 20,
          width: 44, height: 44, borderRadius: "50%",
          overflow: "hidden",
          border: "2px solid rgba(255,255,255,0.25)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
        }}>
          <Img
            src={staticFile(photo)}
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
          />
        </div>
      ) : (
        <div style={{
          position: "absolute", top: 28, left: 24,
          width: 38, height: 28, borderRadius: 5,
          background: "linear-gradient(135deg, #d4a84b, #f0c96a)",
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)",
        }} />
      )}

      {/* Label */}
      <div style={{
        position: "absolute", top: 26, right: 20,
        fontSize: 11, fontWeight: 700, letterSpacing: "2px",
        color: "rgba(255,255,255,0.5)", textTransform: "uppercase",
      }}>
        {label}
      </div>

      {/* Amount counter */}
      <div style={{
        position: "absolute", bottom: 52, left: 24,
        fontSize: 34, fontWeight: 900, color: WHITE,
        textShadow: glowActive ? `0 0 20px rgba(232,24,46,0.8)` : "none",
        letterSpacing: "-1px",
        fontVariantNumeric: "tabular-nums",
      }}>
        {formatDollars(amount)}
      </div>

      {/* Credit limit bar */}
      <div style={{
        position: "absolute", bottom: 22, left: 24, right: 24,
      }}>
        <div style={{
          fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)",
          textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 5,
          display: "flex", justifyContent: "space-between",
        }}>
          <span>CREDIT LIMIT</span>
          <span style={{ color: glowActive ? RED : "rgba(255,255,255,0.4)" }}>
            {glowActive ? "MAXED OUT" : `$25,000`}
          </span>
        </div>
        <div style={{
          height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: `${amountPct * 100}%`,
            background: glowActive
              ? `linear-gradient(90deg, ${RED}, ${PINK})`
              : `linear-gradient(90deg, #4a9eff, #7bc3ff)`,
            borderRadius: 2,
            boxShadow: glowActive ? `0 0 8px ${RED}` : "none",
          }} />
        </div>
      </div>

      {/* Sublabel */}
      <div style={{
        position: "absolute", top: 68, left: 24,
        fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.45)",
        fontStyle: "italic",
      }}>
        {sublabel}
      </div>
    </div>
  );
}

// ─── Main Composition ─────────────────────────────────────────────────────────
export function BootstrapStory() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Beat timing (all local frames) ──
  // Beat 1: "BOOTSTRAPPED" slams in at frame 20
  // Beat 2: Cards slide in at frame 100
  // Beat 3: MAXED OUT at frame 340
  // Beat 4: Result card at frame 450

  // ── Beat 1: BOOTSTRAPPED word ──────────────────────────────────────────────
  const b1Sp = spring({ frame: frame - 20, fps, config: { damping: 30, stiffness: 200 } });
  const b1Scale = fi(b1Sp, 0, 1, 0, 1);
  // After beat 2 starts, shrink up and fade
  const b1ShrinkT = fi(frame, 90, 115, 0, 1);
  const b1FinalScale = b1Scale * (1 - b1ShrinkT * 0.35);
  const b1Y = fi(frame, 90, 115, 0, -120);
  const b1FontSize = 120 - b1ShrinkT * 52; // 120 → 68
  const b1Opacity = frame < 440 ? 1 : fi(frame, 440, 460, 1, 0);

  // ── Beat 2: Credit cards ──────────────────────────────────────────────────
  const cardLeftSp  = spring({ frame: frame - 100, fps, config: { damping: 30, stiffness: 140 } });
  const cardRightSp = spring({ frame: frame - 115, fps, config: { damping: 30, stiffness: 140 } });
  const cardLeftX  = fi(cardLeftSp,  0, 1, -420, 0);
  const cardRightX = fi(cardRightSp, 0, 1,  420, 0);
  const cardsOpacity = frame < 440 ? fi(frame, 100, 130, 0, 1) : fi(frame, 440, 465, 1, 0);

  // Counter: left card (co-founder) counts up $0 → $25,000 from frame 120
  const leftCountSp  = spring({ frame: frame - 120, fps, config: { damping: 32, stiffness: 120 } });
  const leftAmount   = 25000 * Math.min(leftCountSp, 1);

  // Counter: right card (Henry) counts up from frame 135
  const rightCountSp = spring({ frame: frame - 135, fps, config: { damping: 32, stiffness: 120 } });
  const rightAmount  = 25000 * Math.min(rightCountSp, 1);

  // Glow when maxed
  const glowActive = frame >= 340;

  // ── Beat 3: MAXED OUT text ────────────────────────────────────────────────
  const b3Sp = spring({ frame: frame - 340, fps, config: { damping: 28, stiffness: 220 } });
  const b3Scale = fi(b3Sp, 0, 1, 0, 1);
  const b3Opacity = frame >= 340 ? (frame < 440 ? 1 : fi(frame, 440, 465, 1, 0)) : 0;

  // ── Beat 4: Result stat card ──────────────────────────────────────────────
  const b4Sp = spring({ frame: frame - 450, fps, config: { damping: 30, stiffness: 140 } });
  const b4Scale = fi(b4Sp, 0, 1, 0.7, 1);
  const b4Opacity = fi(frame, 450, 480, 0, 1);

  // $50k counter in beat 4
  const totalCountSp = spring({ frame: frame - 455, fps, config: { damping: 32, stiffness: 130 } });
  const totalAmount  = 50000 * Math.min(totalCountSp, 1);

  // Valuation text appears a bit later
  const valuationOpacity = fi(frame, 510, 545, 0, 1);
  const valuationY       = fi(frame, 510, 545, 18, 0);

  // "7 years" line
  const yearsOpacity = fi(frame, 570, 600, 0, 1);
  const yearsY       = fi(frame, 570, 600, 14, 0);

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent", pointerEvents: "none", fontFamily: FONT }}>

      {/* ── Beat 1 + faded label: BOOTSTRAPPED ─────────────────────────────── */}
      {frame >= 20 && (
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: `translate(-50%, calc(-50% + ${b1Y}px)) scale(${b1FinalScale})`,
          opacity: b1Opacity,
          textAlign: "center",
          pointerEvents: "none",
        }}>
          <div style={{
            fontSize: b1FontSize,
            fontWeight: 900,
            color: WHITE,
            letterSpacing: "-2px",
            textTransform: "uppercase",
            textShadow: "0 4px 30px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.9)",
            lineHeight: 1,
          }}>
            BOOTSTRAPPED
          </div>
        </div>
      )}

      {/* ── Beat 2: Two credit cards ────────────────────────────────────────── */}
      {frame >= 100 && (
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          gap: 40,
          opacity: cardsOpacity,
          marginTop: 30,
        }}>
          <div style={{ transform: `translateX(${cardLeftX}px)` }}>
            <CreditCard
              label="CO-FOUNDER"
              sublabel="From his grandpa"
              amount={leftAmount}
              maxAmount={25000}
              glowActive={glowActive}
              photo="grandpa.jpg"
            />
          </div>
          <div style={{ transform: `translateX(${cardRightX}px)` }}>
            <CreditCard
              label="HENRY"
              sublabel="JPMorgan Chase card"
              amount={rightAmount}
              maxAmount={25000}
              glowActive={glowActive}
            />
          </div>
        </div>
      )}

      {/* ── Beat 3: MAXED OUT ───────────────────────────────────────────────── */}
      {frame >= 340 && (
        <div style={{
          position: "absolute",
          bottom: 80, left: "50%",
          transform: `translateX(-50%) scale(${b3Scale})`,
          opacity: b3Opacity,
          textAlign: "center",
        }}>
          <div style={{
            fontSize: 88,
            fontWeight: 900,
            color: RED,
            letterSpacing: "4px",
            textTransform: "uppercase",
            textShadow: `0 0 40px rgba(232,24,46,0.6), 0 4px 20px rgba(0,0,0,0.8)`,
            lineHeight: 1,
          }}>
            MAXED OUT
          </div>
        </div>
      )}

      {/* ── Beat 4: Result stat card ────────────────────────────────────────── */}
      {frame >= 450 && (
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: `translate(-50%, -50%) scale(${b4Scale})`,
          opacity: b4Opacity,
          textAlign: "center",
          minWidth: 560,
        }}>
          {/* Card bg */}
          <div style={{
            background: "rgba(10, 14, 35, 0.88)",
            border: `1.5px solid rgba(232,24,46,0.35)`,
            borderRadius: 24,
            padding: "36px 52px 32px",
            backdropFilter: "blur(8px)",
            boxShadow: "0 12px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
          }}>
            {/* Total invested */}
            <div style={{
              fontSize: 13, fontWeight: 700, letterSpacing: "3px",
              color: "rgba(255,255,255,0.45)", textTransform: "uppercase",
              marginBottom: 12,
            }}>
              TOTAL INVESTED
            </div>
            <div style={{
              fontSize: 72, fontWeight: 900, color: WHITE,
              letterSpacing: "-2px", lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}>
              {formatDollars(totalAmount)}
            </div>

            {/* Arrow + valuation */}
            <div style={{
              opacity: valuationOpacity,
              transform: `translateY(${valuationY}px)`,
              marginTop: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            }}>
              <div style={{
                fontSize: 32, color: RED, fontWeight: 900, lineHeight: 1,
              }}>↗</div>
              <div style={{
                fontSize: 48, fontWeight: 900,
                background: `linear-gradient(90deg, ${RED}, ${PINK})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-1px",
              }}>
                $11.4B
              </div>
            </div>

            {/* 7 years line */}
            <div style={{
              opacity: yearsOpacity,
              transform: `translateY(${yearsY}px)`,
              marginTop: 16,
              fontSize: 16, fontWeight: 600,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.5px",
            }}>
              7 years · No outside capital
            </div>
          </div>
        </div>
      )}

    </AbsoluteFill>
  );
}
