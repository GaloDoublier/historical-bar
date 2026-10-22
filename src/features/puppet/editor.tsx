"use client";
import { useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import { ToolIcon } from "./tool-icon";
import { Portrait } from "./portrait";
import { historyReducer } from "./editor-history";
import { emotionLabels, type Emotion } from "./expressions";
import { clamp, newRig, normalizeRig, regionLabels, rigErrors, type Point, type PuppetRigV1, type RegionName } from "./rig";

type Props = { image: Blob; initial: PuppetRigV1; onConfirm: (rig:PuppetRigV1)=>void; onCancel:()=>void };
type Tool = "insert" | "hand" | "select";
export function PuppetEditor({image,initial,onConfirm,onCancel}:Props) {
  const dialog=useRef<HTMLDialogElement>(null), viewport=useRef<HTMLDivElement>(null);
  const [history,dispatch]=useReducer(historyReducer,{past:[],present:structuredClone(initial),future:[]});
  const rig=history.present;
  const [region,setRegion]=useState<RegionName>("jaw");
  const [tool,setTool]=useState<Tool>("insert");
  const [pivotMode,setPivotMode]=useState(false);
  const [selected,setSelected]=useState<number|null>(null);
  const [zoom,setZoom]=useState(1),[opening,setOpening]=useState(0);
  const [emotion,setEmotion]=useState<Emotion>("neutral");
  const [blink,setBlink]=useState(false);
  const [attempted,setAttempted]=useState(false),[panning,setPanning]=useState(false);
  const errorBox=useRef<HTMLDivElement>(null);
  const errors=rigErrors(rig);
  function confirm() { setAttempted(true); if(errors.length) requestAnimationFrame(()=>{errorBox.current?.focus();errorBox.current?.scrollIntoView({block:"nearest"});}); else onConfirm(normalizeRig(rig)); }
  function endGesture() { drag.current=null;pan.current=null;setPanning(false); }
  const drag=useRef<{index:number;record:boolean}|null>(null);
  const pan=useRef<{x:number;y:number;left:number;top:number}|null>(null);
  const zoomRef=useRef(1);
  const anchor=useRef<{x:number;y:number;left:number;top:number;ratio:number}|null>(null);
  const points=rig.regions[region];
  function edit(value:PuppetRigV1,record=true) { dispatch({type:"edit",value,record}); }
  function undo() { dispatch({type:"undo"});setSelected(null); }
  function redo() { dispatch({type:"redo"});setSelected(null); }
  function changeZoom(next:number,x?:number,y?:number) {
    const v=viewport.current;if(!v)return;
    const value=clamp(next,1,6),r=v.getBoundingClientRect();
    anchor.current={x:x??r.width/2,y:y??r.height/2,left:v.scrollLeft,top:v.scrollTop,ratio:value/zoomRef.current};
    zoomRef.current=value;setZoom(value);
  }
  useLayoutEffect(()=>{
    const a=anchor.current,v=viewport.current;
    if(a&&v){v.scrollLeft=(a.left+a.x)*a.ratio-a.x;v.scrollTop=(a.top+a.y)*a.ratio-a.y;anchor.current=null;}
  },[zoom]);
  useEffect(()=> {
    const d=dialog.current!,previous=document.activeElement as HTMLElement;d.showModal();
    const v=viewport.current!;
    const wheel=(e:WheelEvent)=>{
      if(!e.ctrlKey)return;e.preventDefault();
      const rect=v.getBoundingClientRect(),value=clamp(zoomRef.current*Math.exp(-e.deltaY*.002),1,6);
      anchor.current={x:e.clientX-rect.left,y:e.clientY-rect.top,left:v.scrollLeft,top:v.scrollTop,ratio:value/zoomRef.current};
      zoomRef.current=value;setZoom(value);
    };
    v.addEventListener("wheel",wheel,{passive:false});
    return ()=>{v.removeEventListener("wheel",wheel);d.close();previous?.focus();};
  },[]);
  function updatePoint(index:number,p:Point,record=true) {
    edit({...rig,regions:{...rig.regions,[region]:points.map((point,i)=>i===index?p:point)}},record);
  }
  function remove() {
    if(selected===null||!points[selected])return;
    edit({...rig,regions:{...rig.regions,[region]:points.filter((_,i)=>i!==selected)}});setSelected(null);
  }
  function position(event:React.PointerEvent<SVGSVGElement>):Point {
    const rect=event.currentTarget.getBoundingClientRect();
    return {x:clamp((event.clientX-rect.left)/rect.width),y:clamp((event.clientY-rect.top)/rect.height)};
  }
  function keyDown(e:React.KeyboardEvent) {
    const target=e.target as HTMLElement;
    if(target.matches("input,textarea,select,[contenteditable=true]"))return;
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){e.preventDefault();if(e.shiftKey)redo();else undo();}
    else if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="y"){e.preventDefault();redo();}
    else if(e.key==="Delete"||e.key==="Backspace"){e.preventDefault();remove();}
  }
  return <dialog className="puppet-dialog" ref={dialog} onKeyDown={keyDown} onCancel={e=>{e.preventDefault();onCancel();}} aria-labelledby="editor-title">
    <header className="editor-heading"><div><p className="kicker">Taller de retratos · edición manual</p><h2 id="editor-title">Dar voz a una fotografía</h2></div><button className="quiet-button" onClick={onCancel} aria-label="Cerrar editor">Cerrar ×</button></header>
    <p className="help">Mandíbula: empezá por comisura izquierda, centro y comisura derecha, y seguí alrededor del mentón. Delimitá ojos y cejas con contornos ajustados para animarlos.</p>
    <div className="editor-grid"><section>
      <div className="button-row editor-tools" role="toolbar" aria-label="Herramientas de guías">
        {([['insert','Insertar puntos'],['hand','Mano'],['select','Seleccionar puntos']] as const).map(([value,label])=><button key={value} className="quiet-button icon-button" aria-label={label} title={label} aria-pressed={tool===value} onClick={()=>{setTool(value);setPivotMode(false);}}><ToolIcon name={value}/></button>)}
        <button className="quiet-button icon-button" disabled={!history.past.length} onClick={undo} aria-label="Deshacer" title="Deshacer · Ctrl+Z"><ToolIcon name="undo"/></button><button className="quiet-button icon-button" disabled={!history.future.length} onClick={redo} aria-label="Rehacer" title="Rehacer · Ctrl+Y"><ToolIcon name="redo"/></button>
      </div>
      <div className={`editor-viewport tool-${tool}${panning?" is-panning":""}`} ref={viewport}>
        <div className="editor-photo" style={{width:`${zoom*100}%`,aspectRatio:`${rig.portrait.width}/${rig.portrait.height}`}}>
          <Portrait image={image} rig={rig}/>
          <svg tabIndex={0} viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-label="Área de edición de guías" onPointerDown={e=>{
            if(e.button!==0&&e.button!==1)return;
            e.preventDefault();e.currentTarget.focus();e.currentTarget.setPointerCapture(e.pointerId);
            if(e.button===1||tool==="hand") {setPanning(true);const v=viewport.current!;pan.current={x:e.clientX,y:e.clientY,left:v.scrollLeft,top:v.scrollTop};return;}
            const p=position(e);
            if(pivotMode){edit({...rig,pivot:p});drag.current={index:-1,record:false};return;}
            const rect=e.currentTarget.getBoundingClientRect();
            const near=points.findIndex(q=>Math.hypot((p.x-q.x)*rect.width,(p.y-q.y)*rect.height)<14);
            if(tool==="select") {setSelected(near>=0?near:null);if(near>=0)drag.current={index:near,record:true};return;}
            if(near>=0) {setSelected(near);return;}
            // Insert near an existing edge in its order; otherwise append to the outline.
            let index=points.length,best=12;
            if(points.length>=3)points.forEach((a,i)=>{const b=points[(i+1)%points.length];const dx=(b.x-a.x)*rect.width,dy=(b.y-a.y)*rect.height;const t=clamp(((p.x-a.x)*rect.width*dx+(p.y-a.y)*rect.height*dy)/(dx*dx+dy*dy||1));const distance=Math.hypot((p.x-a.x)*rect.width-t*dx,(p.y-a.y)*rect.height-t*dy);if(distance<best){best=distance;index=i+1;}});
            const next=[...points];next.splice(index,0,p);edit({...rig,regions:{...rig.regions,[region]:next}});setSelected(index);drag.current={index,record:false};
          }} onPointerMove={e=>{
            if(pan.current){const v=viewport.current!;v.scrollLeft=pan.current.left-(e.clientX-pan.current.x);v.scrollTop=pan.current.top-(e.clientY-pan.current.y);return;}
            if(!drag.current)return;const p=position(e),{index,record}=drag.current;
            if(index===-1)edit({...rig,pivot:p},record);else updatePoint(index,p,record);drag.current.record=false;
          }} onPointerUp={endGesture} onPointerCancel={endGesture} onLostPointerCapture={endGesture} onAuxClick={e=>{if(e.button===1)e.preventDefault();}}>
            {(Object.keys(regionLabels) as RegionName[]).map(key=><polygon key={key} points={rig.regions[key].map(p=>`${p.x*1000},${p.y*1000}`).join(" ")} fill={key===region?"#e3b46c22":"transparent"} stroke={key===region?"#ffd58b":"#9cb9b0"} strokeWidth="2" vectorEffect="non-scaling-stroke"/>)}
            {points.map((p,i)=><circle key={i} cx={p.x*1000} cy={p.y*1000} r={(i===selected?8:5)/zoom} fill={i===selected?"#fff":"#e3b46c"}/>)}
            <path d={`M ${rig.pivot.x*1000-12} ${rig.pivot.y*1000} h 24 M ${rig.pivot.x*1000} ${rig.pivot.y*1000-12} v 24`} stroke="#ff8d73" strokeWidth="3"/>
          </svg>
        </div>
      </div>
      <label className="field">Zoom · {zoom.toFixed(1)}× · Ctrl + rueda<input aria-label="Zoom" type="range" min="1" max="6" step=".1" value={zoom} onChange={e=>changeZoom(+e.target.value)}/></label>
      <div className="button-row"><button className="quiet-button" onClick={()=>changeZoom(1)}>Ajustar a la vista</button><button className="quiet-button" aria-pressed={pivotMode} onClick={()=>{setPivotMode(!pivotMode);setTool("select");setSelected(null);}}>Ubicar articulación</button></div>
      <label className="field">Región<select value={region} onChange={e=>{setRegion(e.target.value as RegionName);setSelected(null);setPivotMode(false);}}>{Object.entries(regionLabels).map(([key,label])=><option key={key} value={key}>{label} · {rig.regions[key as RegionName].length} puntos</option>)}</select></label>
      <div className="point-controls"><label className="field">Punto seleccionado<select value={selected??""} onChange={e=>{setSelected(e.target.value===""?null:+e.target.value);setTool("select");setPivotMode(false);}}><option value="">Ninguno</option>{points.map((_,i)=><option key={i} value={i}>{i+1}</option>)}</select></label>
        {(["x","y"] as const).map(axis=><label key={axis} className="field">{axis.toUpperCase()} %<input type="number" min="0" max="100" step=".1" disabled={selected===null&&!pivotMode} value={Math.round((pivotMode?rig.pivot[axis]:points[selected??-1]?.[axis]??0)*1000)/10} onChange={e=>{const p=pivotMode?rig.pivot:points[selected!];const next={...p,[axis]:clamp(+e.target.value/100)};if(pivotMode)edit({...rig,pivot:next});else updatePoint(selected!,next);}}/></label>)}
      </div>
      <div className="button-row"><button className="quiet-button" disabled={selected===null} onClick={remove}>Eliminar seleccionado · Supr</button><button className="quiet-button" onClick={()=>{edit({...rig,regions:{...rig.regions,[region]:[]}});setSelected(null);}}>Restaurar esta guía</button><button className="quiet-button" onClick={()=>{edit(newRig(initial.portrait.width,initial.portrait.height));setSelected(null);}}>Restaurar todas las guías</button></div>
      <p className="help">Mantené presionada la rueda para arrastrar desde cualquier herramienta. Seleccioná un punto antes de borrarlo. Ctrl+Z deshace; Ctrl+Y rehace. Restaurar vacía los contornos y también se puede deshacer.</p>
    </section><section className="preview-panel"><p className="kicker">Vista previa sin guías</p><Portrait image={image} rig={rig} opening={opening} emotion={emotion} autoBlink={blink}/>
      <div className="preview-sliders">
      <label className="field">Apertura manual · {Math.round(opening*100)} %<input aria-label="Apertura manual" type="range" min="0" max="1" step=".01" value={opening} onChange={e=>setOpening(+e.target.value)}/></label>
      <label className="field">Recorrido · {(rig.travel*100).toFixed(1)} % de la foto<input aria-label="Recorrido" type="range" min=".002" max=".08" step=".001" value={rig.travel} onChange={e=>edit({...rig,travel:+e.target.value})}/></label>
      </div>
      <div className="button-row">{Object.entries(emotionLabels).map(([key,label])=><button key={key} className="quiet-button" aria-pressed={emotion===key} onClick={()=>setEmotion(key as Emotion)}>{label}</button>)}</div>
      <label className="blink-toggle"><input type="checkbox" checked={blink} onChange={e=>setBlink(e.target.checked)}/> Parpadeo automático</label>
      <label className="field">Puntos iniciales que forman el borde del labio<input type="number" min="2" max={Math.max(3,rig.regions.jaw.length-1)} value={rig.lipPoints} onChange={e=>edit({...rig,lipPoints:Math.round(clamp(+e.target.value,2,Math.max(3,rig.regions.jaw.length-1)))})}/></label>
      <label className="field">Rotación en articulación · {rig.rotation}°<input type="range" min="-8" max="8" step=".5" value={rig.rotation} onChange={e=>edit({...rig,rotation:+e.target.value})}/></label>
      <p className="help">Usá contornos ajustados. La piel revelada y los párpados se reconstruyen con píxeles de la misma foto. En barbas, perfiles o regiones amplias pueden verse costuras.</p>
    </section></div>
    <div ref={errorBox} tabIndex={-1} className={attempted&&errors.length?"error-message editor-errors":""} role={attempted&&errors.length?"alert":undefined}>{attempted&&errors.length>0&&<><p>No se pudo confirmar. Revisá lo siguiente:</p><ul>{errors.map(error=><li key={error}>{error}</li>)}</ul></>}</div>
    <footer className="editor-footer"><p className="help">{errors.length?"Al confirmar te indicaremos qué falta completar.":"Las cinco regiones están listas para guardar."}</p><div className="button-row"><button className="quiet-button" onClick={onCancel}>Cancelar</button><button className="action-link" onClick={confirm}>Confirmar configuración</button></div></footer>
  </dialog>;
}
