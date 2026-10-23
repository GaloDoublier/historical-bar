import test from "node:test";
import assert from "node:assert/strict";
import { rms, energyTarget, smoothMouth } from "../src/features/puppet/audio-math.ts";
import { validPolygon, newRig, validRig } from "../src/features/puppet/rig.ts";

test("RMS: silence, empty buffer, sine and doubled gain",()=>{
  assert.equal(rms(new Float32Array(2048)),0);assert.equal(rms(new Float32Array()),0);
  const sine=Float32Array.from({length:2048},(_,i)=>Math.sin(i*2*Math.PI/64)*.2);
  assert.ok(Math.abs(rms(sine)-.2/Math.sqrt(2))<1e-6);
  assert.ok(Math.abs(rms(sine.map(v=>v*2))-rms(sine)*2)<1e-6);
});
test("gate, gain mapping and clipping are independent of audio file",()=>{
  assert.equal(energyTarget(.005),0);assert.equal(energyTarget(.012),0);
  assert.equal(energyTarget(1),1);assert.ok(energyTarget(.1)>energyTarget(.03));
  assert.ok(Number.isFinite(energyTarget(.1,.2,.1)));
});
test("attack/release are stable and silence converges to closed",()=>{
  const attack=smoothMouth(0,1,.016),release=1-smoothMouth(1,0,.016);
  assert.ok(attack>release);assert.equal(smoothMouth(.5,1,0),.5);
  let value=0;for(let i=0;i<60;i++)value=smoothMouth(value,1,1/60);
  assert.ok(value>.99);for(let i=0;i<120;i++)value=smoothMouth(value,0,1/60);
  assert.equal(value,0);assert.ok(smoothMouth(0,1,100)<=1);
});
test("polygon rejects degeneracy, self intersection and invalid coordinates",()=>{
  const triangle=[{x:.2,y:.2},{x:.7,y:.2},{x:.5,y:.8}];
  assert.equal(validPolygon(triangle),true);
  assert.equal(validPolygon([{x:.2,y:.2},{x:.3,y:.3},{x:.4,y:.4}]),false);
  assert.equal(validPolygon([{x:0,y:0},{x:1,y:1},{x:0,y:1},{x:1,y:0}]),false);
  assert.equal(validPolygon([...triangle,{x:NaN,y:0}]),false);
  assert.equal(validPolygon([...triangle,{x:2,y:0}]),false);
  const rig=newRig(1200,800);assert.equal(validRig(rig),false);
  for(const key of Object.keys(rig.regions))rig.regions[key]=triangle;
  rig.regions.jaw=[{x:.2,y:.2},{x:.5,y:.25},{x:.7,y:.2},{x:.7,y:.7},{x:.2,y:.7}];
  assert.equal(validRig(rig),true);assert.deepEqual(JSON.parse(JSON.stringify(rig)),rig);
});

// Report actionable failures instead of silently disabling confirmation.
import { rigErrors } from "../src/features/puppet/rig.ts";
test("rig validation explains each missing region and invalid outline",()=>{
 const rig=newRig(800,600);
 const missing=rigErrors(rig);
 assert.ok(missing.some(e=>e.includes("Ojo izquierdo")&&e.includes("faltan 3")));
 assert.ok(missing.some(e=>e.includes("Mandíbula")&&e.includes("5 puntos")));
 rig.regions.leftEye=[{x:.1,y:.1},{x:.4,y:.4},{x:.1,y:.4},{x:.4,y:.1}];
 assert.ok(rigErrors(rig).some(e=>e.includes("Ojo izquierdo")&&e.includes("cruces")));
 rig.travel=NaN;assert.ok(rigErrors(rig).some(e=>e.startsWith("Recorrido")));
});

test("repeated consecutive clicks do not block a valid rig",()=>{
 const r=newRig(800,600),triangle=[{x:.2,y:.2},{x:.6,y:.2},{x:.4,y:.7}];
 for(const k of Object.keys(r.regions))r.regions[k]=[...triangle,triangle[0]];
 r.regions.jaw=[{x:.2,y:.2},{x:.2,y:.2},{x:.4,y:.25},{x:.6,y:.2},{x:.6,y:.7},{x:.2,y:.7}];
 assert.deepEqual(rigErrors(r),[]);
});
