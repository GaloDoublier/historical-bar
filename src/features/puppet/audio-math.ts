export function rms(samples: Float32Array): number {
  if (!samples.length) return 0;
  return Math.sqrt(samples.reduce((sum, value) => sum + value * value, 0) / samples.length);
}
export function energyTarget(level: number, gate = .012, reference = .18) {
  return Math.pow(Math.min(1, Math.max(0, (level - gate) / Math.max(.001, reference - gate))), .7);
}
export function smoothMouth(current: number, target: number, dt: number) {
  const tau = target > current ? .045 : .12;
  const next = current + (target-current) * (1-Math.exp(-Math.min(.1, Math.max(0, dt))/tau));
  return next < .001 ? 0 : next;
}
