import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { rms, energyTarget, smoothMouth } from "../src/features/puppet/audio-math.ts";

// WAV decoding here is test-only. The app delegates every format to HTMLMediaElement.
function readWav(path) {
  const data=fs.readFileSync(path);assert.equal(data.toString("ascii",0,4),"RIFF");
  let format,channels,rate,bits,pcm;
  for(let offset=12;offset+8<=data.length;) {
    const name=data.toString("ascii",offset,offset+4),size=data.readUInt32LE(offset+4),start=offset+8;
    if(name==="fmt "){format=data.readUInt16LE(start);channels=data.readUInt16LE(start+2);rate=data.readUInt32LE(start+4);bits=data.readUInt16LE(start+14);}
    if(name==="data")pcm=data.subarray(start,start+size);
    offset=start+size+(size%2);
  }
  assert.equal(format,1);assert.ok([16,24,32].includes(bits));assert.ok(pcm);
  const stride=bits/8*channels, samples=new Float32Array(pcm.length/stride);
  for(let i=0;i<samples.length;i++)for(let c=0;c<channels;c++)samples[i]+=pcm.readIntLE(i*stride+c*bits/8,bits/8)/(2**(bits-1)*channels);
  return {samples,rate};
}
test("two independent voice WAVs produce different, bounded jaw envelopes",()=>{
  const traces=[];
  for(const file of ["public/assets/audio/audio-prueba-es-la.wav","tests/fixtures/second-voice.wav"]) {
    const {samples,rate}=readWav(file),trace=[];let opening=0;
    const size=Math.round(rate/60);
    for(let i=0;i<samples.length;i+=size){opening=smoothMouth(opening,energyTarget(rms(samples.subarray(i,i+size))),1/60);trace.push(opening);}
    assert.ok(Math.max(...trace)>.1);assert.ok(trace.every(v=>v>=0&&v<=1));
    for(let i=0;i<120;i++)opening=smoothMouth(opening,energyTarget(rms(new Float32Array(size))),1/60);
    assert.equal(opening,0,"two seconds of silence close the jaw");
    traces.push(trace);
    console.log(`${file}: ${(samples.length/rate).toFixed(2)}s, peak opening ${Math.max(...trace).toFixed(3)}, silence closes to 0`);
  }
  assert.notDeepEqual(traces[0].slice(0,120),traces[1].slice(0,120));
});
