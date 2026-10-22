import { clamp, validPolygon, type PuppetRigV1 } from "./rig";
import { prepareFace, neutralFace, type FaceFrame } from "./face-renderer";

function surface(width: number, height: number) {
  const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
  return canvas;
}

/** Prepared once per image/rig. All reconstruction samples the original photograph. */
export function preparePuppet(image: HTMLImageElement, rig: PuppetRigV1) {
  const scale = Math.min(1, 1400 / Math.max(image.naturalWidth, image.naturalHeight));
  const w = Math.round(image.naturalWidth * scale), h = Math.round(image.naturalHeight * scale);
  const original = surface(w,h), base = surface(w,h), jaw = surface(w,h);
  const originalCtx = original.getContext("2d")!;
  originalCtx.drawImage(image,0,0,w,h);
  const drawFace=prepareFace(original,rig);
  const ctx = base.getContext("2d")!, jctx = jaw.getContext("2d")!;
  ctx.drawImage(original,0,0);
  const polygon = rig.regions.jaw;
  const path = new Path2D();
  polygon.forEach((p,i) => i ? path.lineTo(p.x*w,p.y*h) : path.moveTo(p.x*w,p.y*h)); path.closePath();
  if (validPolygon(polygon)) {
    jctx.save(); jctx.clip(path); jctx.drawImage(original,0,0); jctx.restore();
    const pixels = originalCtx.getImageData(0,0,w,h), repaired = ctx.getImageData(0,0,w,h);
    // Scanline interpolation from skin/background immediately OUTSIDE the cutout.
    // The original chin is completely removed from the stationary base.
    for (let y=0;y<h;y++) {
      const intersections: number[] = [];
      polygon.forEach((a,i) => {
        const b=polygon[(i+1)%polygon.length], row=(y+.5)/h;
        if ((a.y<=row && b.y>row)||(b.y<=row && a.y>row)) intersections.push((a.x+(row-a.y)*(b.x-a.x)/(b.y-a.y))*w);
      });
      intersections.sort((a,b)=>a-b);
      for (let k=0;k+1<intersections.length;k+=2) {
        const left=Math.max(0,Math.floor(intersections[k])), right=Math.min(w-1,Math.ceil(intersections[k+1]));
        const l=Math.max(0,left-3), r=Math.min(w-1,right+3);
        for(let x=left;x<=right;x++) for(let c=0;c<3;c++) {
          const t=(x-left)/Math.max(1,right-left);
          repaired.data[(y*w+x)*4+c]=pixels.data[(y*w+l)*4+c]*(1-t)+pixels.data[(y*w+r)*4+c]*t;
        }
      }
    }
    // Clip the repair so antialiased boundary pixels remain consistent.
    const repair=surface(w,h); repair.getContext("2d")!.putImageData(repaired,0,0);
    ctx.save(); ctx.clip(path); ctx.drawImage(repair,0,0); ctx.restore();
  }
  const mouth=polygon.slice(0,Math.min(rig.lipPoints??3,polygon.length));
  const xs=mouth.map(p=>p.x*w), ys=mouth.map(p=>p.y*h);
  const left=Math.min(...xs), right=Math.max(...xs), top=Math.min(...ys);
  // Upper contour follows the manually drawn lip, even when its center is lower
  // than its corners. An ellipse alone can expose a pale seam on curved mouths.
  const lip: {x:number;y:number}[]=[];
  for(let x=left+.5;x<right;x+=1) {
    const hits:number[]=[];
    mouth.slice(0,-1).forEach((a,i)=>{
      const b=mouth[i+1];
      if((a.x*w<=x && b.x*w>x)||(b.x*w<=x && a.x*w>x)) hits.push((a.y+(x/w-a.x)*(b.y-a.y)/(b.x-a.x))*h);
    });
    if(hits.length)lip.push({x,y:Math.min(...hits)});
  }
  return { width:w, height:h, draw(target: HTMLCanvasElement, amount:number, face:FaceFrame=neutralFace) {
    if(target.width!==w || target.height!==h) { target.width=w; target.height=h; }
    const out=target.getContext("2d")!;
    out.clearRect(0,0,w,h);
    const open=clamp(amount);
    if(open<=.001 || !validPolygon(polygon)) { out.drawImage(original,0,0); drawFace(out,face); return; }
    out.drawImage(base,0,0);
    const dy=open*rig.travel*h;
    // An organic, tapered oral shadow restricted to the top of the jaw mask.
    out.save(); out.clip(path);
    const cavity=out.createRadialGradient((left+right)/2,top+dy*.35,0,(left+right)/2,top+dy*.35,(right-left)/2);
    cavity.addColorStop(0,"#160d0b"); cavity.addColorStop(1,"#38221c");
    out.fillStyle=cavity; out.beginPath();
    lip.forEach((p,i)=>i?out.lineTo(p.x,p.y):out.moveTo(p.x,p.y));
    for(let i=lip.length-1;i>=0;i--) {
      const p=lip[i], taper=Math.pow(Math.max(0,Math.sin(Math.PI*(p.x-left)/(right-left))),.35);
      out.lineTo(p.x,p.y+dy*1.35*taper);
    }
    out.closePath();out.fill();out.restore();
    out.save(); out.translate(rig.pivot.x*w,rig.pivot.y*h+dy);
    out.rotate(open*rig.rotation*Math.PI/180); out.translate(-rig.pivot.x*w,-rig.pivot.y*h);
    out.drawImage(jaw,0,0); out.restore();
    drawFace(out,face);
  }};
}
