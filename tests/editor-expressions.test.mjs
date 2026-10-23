import test from "node:test";
import assert from "node:assert/strict";
import { historyReducer } from "../src/features/puppet/editor-history.ts";
import { newRig } from "../src/features/puppet/rig.ts";
import { blinkAt, browPose } from "../src/features/puppet/expressions.ts";

test("point history groups drag, restores resets and invalidates redo on new edit",()=>{
 const original=newRig(100,100);
 let state={past:[],present:original,future:[]};
 const first={...original,pivot:{x:.3,y:.4}};
 state=historyReducer(state,{type:"edit",value:first});
 const dragged={...first,pivot:{x:.6,y:.7}};
 state=historyReducer(state,{type:"edit",value:dragged,record:false});
 state=historyReducer(state,{type:"undo"});assert.deepEqual(state.present,original);
 state=historyReducer(state,{type:"redo"});assert.deepEqual(state.present,dragged);
 state=historyReducer(state,{type:"edit",value:newRig(100,100)});
 state=historyReducer(state,{type:"undo"});assert.deepEqual(state.present,dragged);
 state=historyReducer(state,{type:"edit",value:first});assert.equal(state.future.length,0);
});
test("blink is periodic, closes fully, and spends most time open",()=>{
 assert.equal(blinkAt(0),0);assert.equal(blinkAt(4.35),1);assert.equal(blinkAt(4.6),0);
 for(let t=0;t<10;t+=.01){assert.ok(blinkAt(t)>=0&&blinkAt(t)<=1);assert.ok(Math.abs(blinkAt(t)-blinkAt(t+4.6))<1e-10);}
 assert.ok(blinkAt(4.27)>.4&&blinkAt(4.27)<.6);
});
test("eyebrows return neutral and mirror anger/surprise rotations",()=>{
 assert.deepEqual(browPose("neutral","left"),{lift:0,angle:0});
 assert.ok(browPose("surprise","left").lift<0);
 assert.equal(browPose("anger","left").angle,-browPose("anger","right").angle);
 assert.ok(browPose("anger","left").angle>0);
});
