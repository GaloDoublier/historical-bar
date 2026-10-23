"use client";
import { useEffect, useRef, useState } from "react";
import { energyTarget, rms, smoothMouth } from "./audio-math";

export type AudioFrame = { rms: number; opening: number; playing: boolean };
const silent:AudioFrame={rms:0,opening:0,playing:false};
const demo="/assets/audio/audio-prueba-es-la.wav";

export function AudioPlayer({onFrame}:{onFrame:(frame:AudioFrame)=>void}) {
  const audio=useRef<HTMLAudioElement>(null);
  const graph=useRef<{context:AudioContext;source:MediaElementAudioSourceNode;analyser:AnalyserNode}|null>(null);
  const callback=useRef(onFrame);
  const [file,setFile]=useState({url:demo,name:"Voz de muestra · español"});
  const [error,setError]=useState("");
  const [frame,setFrame]=useState(silent);
  const [gate,setGate]=useState(.012), [reference,setReference]=useState(.18);
  const settings=useRef({gate,reference});
  useEffect(()=>{callback.current=onFrame;},[onFrame]);
  useEffect(()=>{settings.current={gate,reference};},[gate,reference]);
  useEffect(()=>()=>{if(file.url.startsWith("blob:"))URL.revokeObjectURL(file.url);},[file.url]);
  useEffect(()=> {
    const el=audio.current!;
    let raf=0,active=true,last=0,opening=0;
    function emit(value:AudioFrame) {if(active){setFrame(value);callback.current(value);}}
    function closeMouth() {cancelAnimationFrame(raf);opening=0;emit(silent);}
    function tick(time:number) {
      if(!active||el.paused||el.ended||el.seeking||el.readyState<3){closeMouth();return;}
      const g=graph.current;if(!g)return;
      const samples=new Float32Array(g.analyser.fftSize);g.analyser.getFloatTimeDomainData(samples);
      const level=el.muted||el.volume===0?0:rms(samples);
      opening=smoothMouth(opening,energyTarget(level,settings.current.gate,settings.current.reference),(time-last)/1000);last=time;
      emit({rms:level,opening,playing:true});raf=requestAnimationFrame(tick);
    }
    async function start() {
      try {
        if(!graph.current) {
          const context=new AudioContext();
          const source=context.createMediaElementSource(el),analyser=context.createAnalyser();analyser.fftSize=1024;
          source.connect(analyser);analyser.connect(context.destination);graph.current={context,source,analyser};
        }
        await graph.current.context.resume();
        if(!active||el.paused||el.ended)return;
        setError("");cancelAnimationFrame(raf);last=performance.now();raf=requestAnimationFrame(tick);
      }catch {el.pause();closeMouth();if(active)setError("El navegador no pudo iniciar Web Audio. Volvé a pulsar reproducir.");}
    }
    const fail=()=>{closeMouth();setError("No se pudo reproducir este audio. Elegí otro WAV, MP3 u otro formato compatible.");};
    const volume=()=>{if(el.muted||el.volume===0)closeMouth();else if(!el.paused)void start();};
    el.addEventListener("play",start);el.addEventListener("playing",start);el.addEventListener("seeked",start);
    const stops=["pause","ended","seeking","waiting","emptied"];
    stops.forEach(event=>el.addEventListener(event,closeMouth));el.addEventListener("error",fail);el.addEventListener("volumechange",volume);
    return ()=>{
      active=false;cancelAnimationFrame(raf);el.pause();
      el.removeEventListener("play",start);el.removeEventListener("playing",start);el.removeEventListener("seeked",start);
      stops.forEach(event=>el.removeEventListener(event,closeMouth));el.removeEventListener("error",fail);el.removeEventListener("volumechange",volume);
      const g=graph.current;if(g){g.source.disconnect();g.analyser.disconnect();void g.context.close();graph.current=null;}
    };
  },[]);
  function replace(url:string,name:string) {audio.current?.pause();setError("");setFrame(silent);onFrame(silent);setFile({url,name});}
  return <section className="audio-panel" aria-label="Reproductor de voz"><div className="audio-heading"><p className="kicker">Voz real · audio-rms</p><span className="audio-reading" data-testid="audio-reading" data-opening={frame.opening.toFixed(4)} data-rms={frame.rms.toFixed(4)}>{Math.round(frame.opening*100)} % apertura</span></div>
    <p className="help">{file.name}</p><audio ref={audio} src={file.url} controls preload="metadata" aria-label="Audio del personaje"/>
    <div className="button-row"><button className="quiet-button" onClick={()=>replace(demo,"Voz de muestra · español")}>Audio de prueba</button><button className="quiet-button" onClick={()=>{const el=audio.current;if(el){el.pause();el.currentTime=0;}}}>Detener</button><label className="quiet-button audio-upload">Cargar otro audio<input aria-label="Cargar otro audio" type="file" accept="audio/*,.wav,.mp3,.ogg,.m4a,.flac" onChange={e=>{const f=e.target.files?.[0];if(f){if(f.size>100*1024*1024)setError("Elegí un audio de hasta 100 MB.");else replace(URL.createObjectURL(f),f.name);}e.target.value="";}}/></label></div>
    <details><summary>Ajustar sensibilidad</summary><label className="field">Umbral de silencio · {gate.toFixed(3)}<input type="range" min=".001" max=".08" step=".001" value={gate} onChange={e=>setGate(+e.target.value)}/></label><label className="field">Nivel para máxima apertura · {reference.toFixed(2)}<input type="range" min=".09" max=".6" step=".01" value={reference} onChange={e=>setReference(+e.target.value)}/></label><p className="help">RMS {frame.rms.toFixed(4)} · análisis del mismo audio que escuchás. La amplitud aproxima el habla; no distingue fonemas.</p></details>
    {error&&<p role="alert" className="error-message">{error}</p>}
  </section>;
}
