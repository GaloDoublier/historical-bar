// Optional offline visual QA. Pass a Canvas 2D implementation via CANVAS_PACKAGE.
// No browser, network, image models or application storage are involved.
import fs from "node:fs/promises";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import assert from "node:assert/strict";
const canvas=await import(process.env.CANVAS_PACKAGE || "@napi-rs/canvas");
const {createCanvas,loadImage,Path2D}=canvas.default??canvas;
globalThis.Path2D=Path2D;
globalThis.document={createElement:()=>createCanvas(1,1)};
await fs.mkdir("test-results",{recursive:true});
for(const name of ["rig","expressions","face-renderer","renderer"]) {
  const source=(await fs.readFile(`src/features/puppet/${name}.ts`,"utf8")).replace(/"\.\/(rig|expressions|face-renderer)"/g, '"./$1.mjs"');
  await fs.writeFile(`test-results/${name}.mjs`,ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2020}}).outputText);
}
const {preparePuppet}=await import(pathToFileURL(`${process.cwd()}/test-results/renderer.mjs`));
const cases=[
  {name:"white-beard",file:"docs/references/puppet/REF-U01-retrato-linea-boca.png",points:[[.389,.394],[.465,.412],[.53,.395],[.613,.35],[.66,.53],[.64,.70],[.57,.81],[.48,.84],[.4,.75],[.385,.55]]},
  {name:"short-beard",file:"docs/references/puppet/REF-U03-zona-mandibula-seleccionada.png",points:[[.166,.352],[.25,.358],[.32,.331],[.40,.36],[.54,.365],[.59,.341],[.78,.326],[.81,.63],[.72,.83],[.57,.90],[.35,.86],[.19,.72]]},
  {name:"clean-portrait",file:"docs/references/bar-scene/example-02-rustic-bar/06_listening_front.jpeg",points:[[.665,.389],[.69,.393],[.717,.386],[.731,.416],[.735,.45],[.71,.48],[.675,.487],[.647,.464],[.64,.435],[.651,.408]]}
];
for(const item of cases) {
  const image=await loadImage(item.file);
  const rig={version:1,portrait:{width:image.width,height:image.height},regions:{jaw:item.points.map(([x,y])=>({x,y}))},pivot:{x:.5,y:.5},travel:item.name==="clean-portrait"?.009:.025,rotation:0,lipPoints:item.name==="clean-portrait"?3:4};
  const prepared=preparePuppet(image,rig),frame=createCanvas(prepared.width,prepared.height);
  const sheet=createCanvas(1000,400);const ctx=sheet.getContext("2d");ctx.fillStyle="#211912";ctx.fillRect(0,0,1000,400);
  for(const [index,amount] of [0,.3,.6,1].entries()) {
    prepared.draw(frame,amount);
    if(amount===0) {
      const original=createCanvas(frame.width,frame.height);original.getContext("2d").drawImage(image,0,0,frame.width,frame.height);
      assert.deepEqual(frame.getContext("2d").getImageData(0,0,frame.width,frame.height).data,original.getContext("2d").getImageData(0,0,frame.width,frame.height).data);
    }
    if(item.name==="clean-portrait")ctx.drawImage(frame,700,285,220,200,index*250,30,250,310);
    else ctx.drawImage(frame,0,0,frame.width,frame.height,index*250,30,250,310);
    ctx.fillStyle="#f3e6ce";ctx.font="18px serif";ctx.fillText(`${amount*100}%`,index*250+12,375);
  }
  await fs.writeFile(`test-results/${item.name}.png`,sheet.toBuffer("image/png"));
  console.log(`${item.name}: neutral pixels identical; rendered 0/30/60/100%`);
}


// Facial QA uses explicit manual regions only in this test fixture.
{
 const image=await loadImage("docs/references/bar-scene/example-02-rustic-bar/06_listening_front.jpeg");
 const box=(x,y,w,h)=>[{x,y},{x:x+w,y},{x:x+w,y:y+h},{x,y:y+h}];
 const rig={version:1,portrait:{width:image.width,height:image.height},regions:{jaw:[],leftEye:box(.647,.262,.043,.023),rightEye:box(.716,.259,.044,.025),leftBrow:box(.640,.232,.052,.025),rightBrow:box(.713,.225,.056,.027)},pivot:{x:.5,y:.5},travel:.01,rotation:0,lipPoints:3};
 const render=preparePuppet(image,rig),frame=createCanvas(render.width,render.height),sheet=createCanvas(1000,360),ctx=sheet.getContext("2d");
 const states=[{blink:0,surprise:0,anger:0},{blink:1,surprise:0,anger:0},{blink:0,surprise:1,anger:0},{blink:0,surprise:0,anger:1}];
 const labels=["Neutral","Parpadeo","Sorpresa","Enojo"];
 let neutral;
 for(let i=0;i<states.length;i++){
   render.draw(frame,0,states[i]);const pixels=frame.getContext("2d").getImageData(0,0,frame.width,frame.height).data;
   if(i===0)neutral=pixels;else assert.notDeepEqual(pixels,neutral);
   ctx.drawImage(frame,730,165,220,230,i*250,0,250,310);ctx.fillStyle="#211912";ctx.fillRect(i*250,310,250,50);ctx.fillStyle="#f3e6ce";ctx.font="18px serif";ctx.fillText(labels[i],i*250+12,340);
 }
 render.draw(frame,0);assert.deepEqual(frame.getContext("2d").getImageData(0,0,frame.width,frame.height).data,neutral);
 await fs.writeFile("test-results/expressions.png",sheet.toBuffer("image/png"));
 console.log("Facial masks: blink/surprise/anger differ from rest; neutral restored exactly.");
}
