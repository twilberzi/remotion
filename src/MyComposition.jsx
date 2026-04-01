import { AbsoluteFill } from "remotion";

export const MyComposition = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0f0f0f",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 style={{ color: "white", fontFamily: "sans-serif", fontSize: 64 }}>
        Hello, Remotion!
      </h1>
    </AbsoluteFill>
  );
};
