"use client";
import { useEffect, useRef, useState } from "react";
import { preparePuppet } from "./renderer";
import { blinkAt, type Emotion } from "./expressions";
import type { PuppetRigV1 } from "./rig";

export function Portrait({ image, rig, opening=0, emotion="neutral", autoBlink=false }: { image: Blob; rig: PuppetRigV1; opening?: number; emotion?: Emotion; autoBlink?: boolean }) {
  const canvas=useRef<HTMLCanvasElement>(null);
  const prepared=useRef<ReturnType<typeof preparePuppet> | null>(null);
  const controls=useRef({opening,emotion,autoBlink});
  const [error,setError]=useState("");
  useEffect(()=>{controls.current={opening,emotion,autoBlink};},[opening,emotion,autoBlink]);
  useEffect(() => {
    let active=true,raf=0,last=0,elapsed=0,surprise=0,anger=0;
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)");
    const url=URL.createObjectURL(image),img=new Image();
    function tick(now:number) {
      if(!active)return;
      const dt=last?Math.min(.05,(now-last)/1000):0;last=now;
      if(!document.hidden)elapsed+=dt;
      const c=controls.current,alpha=1-Math.exp(-dt/.13);
      surprise+=(Number(c.emotion==="surprise")-surprise)*alpha;
      anger+=(Number(c.emotion==="anger")-anger)*alpha;
      if(surprise<.001)surprise=0;if(anger<.001)anger=0;
      const blink=c.autoBlink&&!reduced.matches?blinkAt(elapsed):0;
      if(canvas.current)prepared.current?.draw(canvas.current,c.opening,{blink,surprise,anger});
      raf=requestAnimationFrame(tick);
    }
    img.onload=()=>{if(!active)return;prepared.current=preparePuppet(img,rig);raf=requestAnimationFrame(tick);};
    img.onerror=()=>{if(active)setError("No se pudo mostrar el retrato.");};img.src=url;
    return ()=>{active=false;cancelAnimationFrame(raf);URL.revokeObjectURL(url);prepared.current=null;};
  },[image,rig]);
  return <>{error&&<p role="alert">{error}</p>}<canvas ref={canvas} className="puppet-portrait" aria-label="Retrato fotográfico con mandíbula, párpados y cejas animados" /></>;
}
