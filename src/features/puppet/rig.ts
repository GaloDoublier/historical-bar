export type Point = { x: number; y: number };
export type RegionName = "jaw" | "leftEye" | "rightEye" | "leftBrow" | "rightBrow";
export type PuppetRigV1 = {
  version: 1;
  portrait: { width: number; height: number };
  regions: Record<RegionName, Point[]>;
  pivot: Point;
  travel: number;
  rotation: number;
  lipPoints: number;
};

export const regionLabels: Record<RegionName, string> = {
  jaw: "Mandíbula", leftEye: "Ojo izquierdo (en imagen)", rightEye: "Ojo derecho (en imagen)",
  leftBrow: "Ceja izquierda (en imagen)", rightBrow: "Ceja derecha (en imagen)",
};

export function newRig(width: number, height: number): PuppetRigV1 {
  return { version: 1, portrait: { width, height },
    regions: { jaw: [], leftEye: [], rightEye: [], leftBrow: [], rightBrow: [] },
    pivot: { x: .5, y: .65 }, travel: .012, rotation: 0, lipPoints: 3 };
}

export const clamp = (v: number, low = 0, high = 1) => Math.min(high, Math.max(low, v));
export function polygonArea(points: Point[]) {
  return Math.abs(points.reduce((sum, p, i) => {
    const q = points[(i + 1) % points.length];
    return sum + p.x * q.y - q.x * p.y;
  }, 0)) / 2;
}
export function validPolygon(points: Point[]) {
  if (points.length < 3 || points.some(p => !Number.isFinite(p.x) || !Number.isFinite(p.y) || p.x < 0 || p.x > 1 || p.y < 0 || p.y > 1) || polygonArea(points) < .00001) return false;
  const cross = (a: Point, b: Point, c: Point) => (b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
  for (let i=0; i<points.length; i++) for (let j=i+2; j<points.length; j++) {
    if (i===0 && j===points.length-1) continue;
    const a=points[i], b=points[(i+1)%points.length], c=points[j], d=points[(j+1)%points.length];
    if (cross(a,b,c)*cross(a,b,d)<=0 && cross(c,d,a)*cross(c,d,b)<=0) return false;
  }
  return true;
}
export function validRig(rig: PuppetRigV1) {
  return rigErrors(rig).length === 0;
}

/** Repeated clicks must not invalidate an otherwise unchanged outline. */
export function normalizeRig(rig: PuppetRigV1): PuppetRigV1 {
  const regions = { ...rig.regions };
  for (const key of Object.keys(regions) as RegionName[]) {
    const points = regions[key].filter((p,i,list)=>!i || p.x!==list[i-1].x || p.y!==list[i-1].y);
    if(points.length>1 && points[0].x===points[points.length-1].x && points[0].y===points[points.length-1].y) points.pop();
    regions[key]=points;
  }
  return {...rig,regions};
}

export function rigErrors(rig: PuppetRigV1): string[] {
  rig=normalizeRig(rig);
  const errors: string[] = [];
  for (const key of Object.keys(regionLabels) as RegionName[]) {
    const points = rig.regions[key];
    if (points.length < 3) errors.push(`${regionLabels[key]}: faltan ${3-points.length} puntos para cerrar la región (mínimo 3).`);
    else if (!validPolygon(points)) errors.push(`${regionLabels[key]}: revisá el contorno; tiene cruces, puntos superpuestos, está fuera de la foto o no encierra un área suficiente.`);
  }
  if (!Number.isInteger(rig.lipPoints) || rig.lipPoints < 2) errors.push("Borde del labio: indicá al menos 2 puntos iniciales, con un número entero.");
  else if (rig.regions.jaw.length < rig.lipPoints+2) errors.push(`Mandíbula: con ${rig.lipPoints} puntos de labio necesitás al menos ${rig.lipPoints+2} puntos en total, incluyendo 2 alrededor del mentón. Tenés ${rig.regions.jaw.length}.`);
  if (!Number.isFinite(rig.travel) || rig.travel < .002 || rig.travel > .08) errors.push("Recorrido: elegí un valor entre 0,2 % y 8 % de la foto.");
  return errors;
}
