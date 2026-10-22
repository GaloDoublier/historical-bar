export type Emotion = "neutral" | "surprise" | "anger";
export const emotionLabels: Record<Emotion,string> = { neutral: "Neutro", surprise: "Sorpresa", anger: "Enojo" };
/** Fixed cadence; quick close, short hold, slower opening. No random timers. */
export function blinkAt(seconds: number) {
  const phase = seconds % 4.6;
  if (phase < 4.22) return 0;
  if (phase < 4.32) return (phase-4.22)/.1;
  if (phase < 4.38) return 1;
  return Math.max(0, 1-(phase-4.38)/.22);
}
export function browPose(emotion: Emotion, side: "left" | "right") {
  const direction = side === "left" ? 1 : -1;
  if (emotion === "surprise") return { lift: -0.8, angle: -direction * .10 };
  if (emotion === "anger") return { lift: .25, angle: direction * .23 };
  return { lift: 0, angle: 0 };
}
