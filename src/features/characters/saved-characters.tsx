"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { listCharacters, type Character } from "./storage";

export function SavedCharacters() {
  const [characters,setCharacters]=useState<Character[]>([]);
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(true);
  useEffect(()=> {let active=true;listCharacters().then(rows=>{if(active)setCharacters(rows);}).catch(e=>{if(active)setError(e.message);}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[]);
  if(!characters.length)return <div className="space-y-2"><button aria-describedby="saved-characters-status" className="min-h-12 cursor-not-allowed rounded-sm border border-rule px-6 py-3 text-muted" disabled>Continuar conversación</button><p className="text-sm text-muted" id="saved-characters-status">{error|| (loading?"Buscando personajes guardados…":"Todavía no hay personajes guardados en este navegador.")}</p></div>;
  return <div className="space-y-3"><p className="text-sm text-muted">Continuar conversación</p><ul className="space-y-3">{characters.map(character=><li key={character.id}><Link className="text-link" href={`/chat/${character.id}`}>{character.name} →</Link></li>)}</ul></div>;
}
