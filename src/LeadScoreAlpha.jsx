import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { LeadScoreScene } from "./ExplainedComposition.jsx";

// Transparent wrapper — no background, alpha channel safe
// Render with: npx remotion render LeadScoreAlpha --codec=prores --prores-profile=4444 --output=out/LeadScore.mov
export const LeadScoreAlpha = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      <LeadScoreScene frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};
