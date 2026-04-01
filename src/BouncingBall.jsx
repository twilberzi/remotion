import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const BouncingBall = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ball bounces every 30 frames (1 second), 5 bounces total
  const BOUNCE_PERIOD = 30;
  const localFrame = frame % BOUNCE_PERIOD;

  const bounceY = spring({
    frame: localFrame,
    fps,
    config: { damping: 8, stiffness: 200, mass: 0.6 },
    from: 0,
    to: 1,
  });

  // Ball goes down then snaps back up — invert so 0=top, 1=floor
  const FLOOR_Y = 820;
  const START_Y = 200;
  const ballY = interpolate(bounceY, [0, 1], [START_Y, FLOOR_Y], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Squash/stretch: wider + shorter at floor, tall + narrow at top
  const distFromFloor = (FLOOR_Y - ballY) / (FLOOR_Y - START_Y); // 1 at top, 0 at floor
  const scaleX = interpolate(distFromFloor, [0, 0.15, 1], [1.5, 1.1, 1]);
  const scaleY = interpolate(distFromFloor, [0, 0.15, 1], [0.6, 0.9, 1]);

  // Shadow shrinks as ball rises
  const shadowScale = interpolate(distFromFloor, [0, 1], [1, 0.3]);
  const shadowOpacity = interpolate(distFromFloor, [0, 1], [0.35, 0.08]);

  const BALL_R = 60;
  const CX = 960;

  return (
    <AbsoluteFill style={{ background: "#f8faff" }}>
      {/* Shadow */}
      <div style={{
        position: "absolute",
        left: CX - 60,
        top: FLOOR_Y + BALL_R * scaleY - 10,
        width: 120,
        height: 20,
        borderRadius: "50%",
        background: "#1e2d5a",
        opacity: shadowOpacity,
        transform: `scaleX(${shadowScale * scaleX})`,
        transformOrigin: "center center",
        filter: "blur(6px)",
      }}/>

      {/* Ball */}
      <div style={{
        position: "absolute",
        left: CX - BALL_R,
        top: ballY - BALL_R,
        width: BALL_R * 2,
        height: BALL_R * 2,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #e8182e, #c2185b)",
        boxShadow: "0 8px 32px rgba(232,24,46,0.4)",
        transform: `scaleX(${scaleX}) scaleY(${scaleY})`,
        transformOrigin: "center bottom",
      }}/>
    </AbsoluteFill>
  );
};
