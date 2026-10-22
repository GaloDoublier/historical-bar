"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PuppetEditor } from "@/features/puppet/editor";
import { Portrait } from "@/features/puppet/portrait";
import { newRig, validRig, type PuppetRigV1 } from "@/features/puppet/rig";
import { getCharacter, saveCharacter, type Character } from "./storage";

export function CharacterForm() {
  const router=useRouter();
  const [name,setName]=useState("");
  const [image,setImage]=useState<Blob|null>(null);
  const [rig,setRig]=useState<PuppetRigV1|null>(null);
  const [editing,setEditing]=useState(false);
  const [sources,setSources]=useState<Character["sources"]>([]);
  const [existing,setExisting]=useState<Character|null>(null);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const [loading,setLoading]=useState(true);
  const uploadVersion=useRef(0);
  useEffect(()=>{
    let active=true;
    const id=new URLSearchParams(window.location.search).get("edit");
    Promise.resolve().then(async()=>{
      if(id) {
        const saved=await getCharacter(id);
        if(!active)return;
        if(!saved)throw new Error("No se encontró el personaje guardado.");
        setExisting(saved);setName(saved.name);setImage(saved.image);setRig(saved.rig);setSources(saved.sources);
      }
    }).catch(e=>{if(active)setError(e.message);}).finally(()=>{if(active)setLoading(false);});
    return ()=>{active=false;uploadVersion.current=-1;};
  },[]);
  async function upload(file?:File) {
    if(!file)return;
    const version=++uploadVersion.current;
    setError("");
    if(!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size>20*1024*1024) {setError("Elegí un JPEG, PNG o WebP de hasta 20 MB.");return;}
    const url=URL.createObjectURL(file);
    try {
      const img=new Image();img.src=url;await img.decode();
      if(img.naturalWidth*img.naturalHeight>32_000_000 || Math.min(img.naturalWidth,img.naturalHeight)<64) throw new Error("Usá una foto de al menos 64 px por lado y hasta 32 megapíxeles.");
      if(version!==uploadVersion.current)return;
      setImage(file);setRig(newRig(img.naturalWidth,img.naturalHeight));setEditing(true);
    }catch(e){if(version===uploadVersion.current)setError(e instanceof Error?e.message:"No se pudo leer la foto.");}
    finally{URL.revokeObjectURL(url);}
  }
  async function save(e:React.FormEvent) {
    e.preventDefault(); if(!image||!rig||!validRig(rig)||!name.trim())return;
    setBusy(true);setError("");
    try {
      const character:Character={id:existing?.id??crypto.randomUUID(),name:name.trim(),image,rig,sources,backgroundId:"rustic-bar",outfitId:"portrait-original",createdAt:existing?.createdAt??new Date().toISOString()};
      await saveCharacter(character);router.push(`/chat/${character.id}`);
    }catch(e){setError(e instanceof Error?e.message:"No se pudo guardar.");setBusy(false);}
  }
  return <div className="workshop-page"><header className="workshop-nav"><Link href="/">Historical Bar</Link><Link className="text-link" href="/">Volver al inicio</Link></header>
    <main><p className="kicker">Una nueva visita · el taller</p><h1>{existing?"Preparar el retrato":"¿Quién se sienta a tu mesa?"}</h1><p className="intro">Un nombre, una fotografía y una voz. Prepará a tu próximo interlocutor, punto por punto.</p>
      {loading?<p role="status">Abriendo el taller…</p>:<form className="creation-grid" onSubmit={save}>
        <section className="paper-panel"><p className="kicker">01 / Identidad</p><label className="field">Nombre del personaje<input required maxLength={80} value={name} onChange={e=>setName(e.target.value)} placeholder="Por ejemplo, José de San Martín"/></label>
          <label className="field">Fotografía del rostro<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>{void upload(e.target.files?.[0]);e.target.value="";}}/></label>
          <p className="help">Frontal, boca cerrada y mentón completo. JPEG, PNG o WebP · hasta 20 MB. La foto permanece en este navegador.</p>
          {image&&rig&&<button type="button" className="quiet-button" onClick={()=>setEditing(true)}>Configurar rostro y mandíbula</button>}
          <div className="sources-section"><p className="kicker">02 / Fuentes opcionales</p><label className="field">Adjuntar bibliografía<input type="file" multiple onChange={e=>{setSources(old=>[...old,...Array.from(e.target.files??[]).map(f=>({name:f.name,size:f.size,type:f.type,status:"not-processed" as const}))]);e.target.value="";}}/></label><p className="help">Sin procesar. Sólo se guardan nombres y tamaños; los archivos no se suben ni se usan para responder.</p>
          <ul className="source-list">{sources.map((source,i)=><li key={i}><span>{source.name} · {Math.ceil(source.size/1024)} KB</span><button type="button" className="text-link" aria-label={`Quitar ${source.name}`} onClick={()=>setSources(sources.filter((_,index)=>index!==i))}>Quitar</button></li>)}</ul></div>
          {error&&<p role="alert" className="error-message">{error}</p>}
          <button className="action-link" disabled={busy||!name.trim()||!rig||!validRig(rig)}>{busy?"Guardando…":"Guardar y abrir conversación →"}</button>
        </section><section className="portrait-card"><p className="kicker">03 / Tu invitado</p>{image&&rig?<Portrait image={image} rig={rig}/>:<div className="empty-portrait"><span aria-hidden="true">✧</span><p>Una silla espera<br/>su próxima historia.</p></div>}<p className="portrait-caption">{name||"Un rostro por descubrir"}</p><p className="help">{rig&&validRig(rig)?"Configuración lista · mandíbula, ojos y cejas guardables.":"Cargá una foto y delimitá las cinco regiones en el editor."}</p></section>
      </form>}
    </main>{editing&&image&&rig&&<PuppetEditor image={image} initial={rig} onCancel={()=>setEditing(false)} onConfirm={next=>{setRig(next);setEditing(false);}}/>}
  </div>;
}
