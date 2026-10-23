"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { getCharacter, type Character } from "@/features/characters/storage";
import { Portrait } from "@/features/puppet/portrait";
import { AudioPlayer, type AudioFrame } from "@/features/puppet/audio-player";

import { emotionLabels, type Emotion } from "@/features/puppet/expressions";
type Message={role:"visitor"|"character";text:string};
export function ConversationRoom({characterId}:{characterId:string}) {
  const [character,setCharacter]=useState<Character|null>(null),[loading,setLoading]=useState(true),[error,setError]=useState("");
  const [messages,setMessages]=useState<Message[]>([]),[input,setInput]=useState("");
  const [thinking,setThinking]=useState(false),[frame,setFrame]=useState<AudioFrame>({rms:0,opening:0,playing:false});
  const [emotion,setEmotion]=useState<Emotion>("neutral"),[autoBlink,setAutoBlink]=useState(true);
  const timeout=useRef<ReturnType<typeof setTimeout>|null>(null),log=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    let active=true;
    getCharacter(characterId).then(saved=>{if(active){setCharacter(saved??null);if(saved)setMessages([{role:"character",text:`Soy ${saved.name}. Tomá asiento. ¿Sobre qué te gustaría conversar?`}]);}}).catch(e=>{if(active)setError(e.message);}).finally(()=>{if(active)setLoading(false);});
    return()=>{active=false;if(timeout.current)clearTimeout(timeout.current);};
  },[characterId]);
  useEffect(()=>{log.current?.scrollTo({top:log.current.scrollHeight,behavior:"smooth"});},[messages,thinking]);
  const onFrame=useCallback((next:AudioFrame)=>setFrame(next),[]);
  const state=frame.playing?"speaking":thinking?"thinking":"idle";
  function send(e:React.FormEvent) {
    e.preventDefault();if(!input.trim()||thinking)return;
    const question=input.trim();setInput("");setMessages(old=>[...old,{role:"visitor",text:question}]);setThinking(true);
    timeout.current=setTimeout(()=>{setMessages(old=>[...old,{role:"character",text:`${question.endsWith("?")?"Una buena pregunta para esta mesa.":"Te escucho."} Imaginemos juntos esa época. Esta es una respuesta de muestra: todavía no consulto fuentes ni un modelo de lenguaje.`}]);setThinking(false);},850);
  }
  return <div className="workshop-page chat-page"><header className="workshop-nav"><Link href="/">Historical Bar</Link><div className="button-row"><Link className="text-link" href="/">Inicio</Link>{character&&<Link className="text-link" href={`/characters/new?edit=${character.id}`}>Editar personaje</Link>}</div></header>
    {loading?<main><p role="status">Preparando tu mesa…</p></main>:!character?<main><p className="kicker">Una mesa reservada</p><h1>{characterId==="demo"?"El bar te espera":"No encontramos ese personaje"}</h1><p className="intro">{error||"Creá y guardá un personaje en este navegador para verlo en la sala."}</p><Link className="action-link" href="/characters/new">Crear personaje</Link></main>:<main>
      <div className="room-title"><div><p className="kicker">Al otro lado de la mesa</p><h1>{character.name}</h1></div><span className={`state-badge ${state}`} role="status" data-testid="character-state">{state==="speaking"?"Hablando":state==="thinking"?"Pensando…":"Escuchando"}</span></div>
      <div className="room-grid"><section className={`bar-scene ${state}`} aria-label="Retrato frente a la mesa de un bar rústico"><div className="bar-shelves" aria-hidden="true"/><div className="bar-lamp" aria-hidden="true"/><div className="scene-portrait"><Portrait image={character.image} rig={character.rig} opening={frame.opening} emotion={emotion} autoBlink={autoBlink}/></div><aside className="room-tools" aria-label="Pruebas del personaje"><p className="kicker">Pruebas · provisional</p><p className="help">Expresión de cejas</p><div className="button-row">{Object.entries(emotionLabels).map(([key,label])=><button key={key} className="quiet-button" aria-pressed={emotion===key} onClick={()=>setEmotion(key as Emotion)}>{label}</button>)}</div><label className="blink-toggle"><input type="checkbox" checked={autoBlink} onChange={e=>setAutoBlink(e.target.checked)}/> Parpadeo automático</label><details className="voice-tests"><summary>Pruebas de voz</summary><AudioPlayer onFrame={onFrame}/></details></aside><div className="bar-table" aria-hidden="true"><div className="bar-glass"/></div><span className="scene-caption">Una mesa, una historia.</span></section>
        <section className="conversation-panel"><div className="conversation-heading"><h2>La conversación</h2><span>MOCK · LOCAL</span></div><div ref={log} className="message-log" role="log" aria-label="Mensajes de conversación" aria-live="polite">{messages.map((message,i)=><article key={i} className={`message ${message.role}`}><p className="kicker">{message.role==="visitor"?"Vos":character.name}</p><p>{message.text}</p></article>)}{thinking&&<p className="help">Está preparando una respuesta…</p>}</div><form onSubmit={send} className="message-form"><label htmlFor="message-input" className="sr-only">Tu mensaje</label><input id="message-input" value={input} maxLength={1000} onChange={e=>setInput(e.target.value)} placeholder="Abrí la conversación…"/><button className="action-link" disabled={thinking||!input.trim()}>Enviar</button></form><p className="help">Respuestas simuladas. El audio de prueba es independiente del texto.</p></section>
      </div><p className="help room-note">Retrato y configuración guardados sólo en este navegador. Parpadeo geométrico y cejas fotográficas; expresiones provisionales.</p>
    </main>}
  </div>;
}
