import { validPolygon, type Point, type PuppetRigV1 } from "./rig";
import { browPose } from "./expressions";
export type FaceFrame = { blink: number; surprise: number; anger: number };
export const neutralFace: FaceFrame = { blink: 0, surprise: 0, anger: 0 };

/** Cropped source pixels plus a deterministic skin patch; no eye scaling or new imagery. */
function feature(source: HTMLCanvasElement, points: Point[], eye=false) {
  if (!validPolygon(points)) return null;
  const w=source.width,h=source.height;
  const x=Math.max(0,Math.floor(Math.min(...points.map(p=>p.x*w))));
  const y=Math.max(0,Math.floor(Math.min(...points.map(p=>p.y*h))));
  const width=Math.min(w-x,Math.ceil(Math.max(...points.map(p=>p.x*w)))-x+1);
  const height=Math.min(h-y,Math.ceil(Math.max(...points.map(p=>p.y*h)))-y+1);
  if(width<2||height<2)return null;
  const create=()=>{const c=document.createElement("canvas");c.width=width;c.height=height;return c;};
  const path=new Path2D();points.forEach((p,i)=>i?path.lineTo(p.x*w-x,p.y*h-y):path.moveTo(p.x*w-x,p.y*h-y));path.closePath();
  const layer=create(),patch=create(),scratch=create();
  const lc=layer.getContext("2d")!;lc.clip(path);lc.drawImage(source,-x,-y);
  const pixels=source.getContext("2d")!.getImageData(0,0,w,h);
  const pc=scratch.getContext("2d")!,replacement=pc.createImageData(width,height);
  const sample=(sx:number,sy:number,c:number)=>{
    let sum=0;
    for(let oy=-2;oy<=2;oy++)for(let ox=-2;ox<=2;ox++){
      const px=Math.max(0,Math.min(w-1,Math.round(sx)+ox)),py=Math.max(0,Math.min(h-1,Math.round(sy)+oy));
      sum+=pixels.data[(py*w+px)*4+c];
    }
    return sum/25;
  };
  // Eyes use skin at their corners, avoiding the dark brow above them.
  // Brows clone a narrow forehead strip above the marked hair, avoiding the eye below.
  for(let row=0;row<height;row++)for(let col=0;col<width;col++)for(let c=0;c<4;c++){
    const t=col/Math.max(1,width-1);
    replacement.data[(row*width+col)*4+c]=eye
      ? sample(x-4,y+row,c)*(1-t)+sample(x+width+4,y+row,c)*t
      : sample(x+col,y-Math.max(4,height*.5)+row*.12,c);
  }  pc.putImageData(replacement,0,0);
  const mask=create(),mc=mask.getContext("2d")!;
  mc.filter=`blur(${Math.min(2,height*.12)}px)`;mc.fill(path);
  const ctx=patch.getContext("2d")!;ctx.drawImage(scratch,0,0);
  ctx.globalCompositeOperation="destination-in";ctx.drawImage(mask,0,0);
  lc.globalCompositeOperation="destination-in";lc.drawImage(mask,0,0);
  const crease=`rgba(${[0,1,2].map(c=>Math.round(sample(x+width/2,y+height/2,c))).join(",")},0.55)`;
  return {x,y,width,height,path,layer,patch,crease};
}
export function prepareFace(source:HTMLCanvasElement,rig:PuppetRigV1) {
  const eyes=[feature(source,rig.regions.leftEye??[],true),feature(source,rig.regions.rightEye??[],true)];
  const brows=[feature(source,rig.regions.leftBrow??[]),feature(source,rig.regions.rightBrow??[])];
  return (ctx:CanvasRenderingContext2D,frame:FaceFrame)=>{
    if(frame.blink>.001)eyes.forEach(eye=>{
      if(!eye)return;
      const closure=Math.min(1,frame.blink);
      ctx.save();ctx.translate(eye.x,eye.y);ctx.clip(eye.path);
      // A curved upper eyelid progressively occludes the unscaled original eye.
      ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(eye.width,0);
      const edge=eye.height*closure*1.15;
      ctx.lineTo(eye.width,edge-eye.height*.12);
      ctx.quadraticCurveTo(eye.width/2,edge+eye.height*.12,0,edge-eye.height*.12);
      ctx.closePath();ctx.clip();ctx.drawImage(eye.patch,0,0);
      if(closure>.75){
        ctx.globalAlpha=(closure-.75)*4;ctx.strokeStyle=eye.crease;ctx.lineWidth=Math.max(.6,eye.height*.045);
        ctx.beginPath();ctx.moveTo(eye.width*.08,eye.height*.62);
        ctx.quadraticCurveTo(eye.width*.5,eye.height*.84,eye.width*.92,eye.height*.62);ctx.stroke();
      }
      ctx.restore();
    });
    if(frame.surprise+frame.anger>.001)brows.forEach((brow,i)=>{
      if(!brow)return;
      const side=i===0?"left":"right",surprise=browPose("surprise",side),anger=browPose("anger",side);
      const lift=(surprise.lift*frame.surprise+anger.lift*frame.anger)*brow.height;
      const angle=surprise.angle*frame.surprise+anger.angle*frame.anger;
      ctx.drawImage(brow.patch,brow.x,brow.y);
      ctx.save();ctx.translate(brow.x+brow.width/2,brow.y+brow.height/2+lift);ctx.rotate(angle);
      ctx.drawImage(brow.layer,-brow.width/2,-brow.height/2);ctx.restore();
    });
  };
}
