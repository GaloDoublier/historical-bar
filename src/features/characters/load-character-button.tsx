"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listCharacters, type Character } from "./storage";
import styles from "./main-menu.module.css";

export function LoadCharacterButton() {
  const [showExplanation, setShowExplanation] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCharacters, setShowCharacters] = useState(false);

  useEffect(() => {
    let active = true;
    listCharacters()
      .then((rows) => { if (active) setCharacters(rows); })
      .catch(() => { if (active) setError("No se pudieron leer los personajes guardados."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const available = characters.length > 0;

  return (
    <div
      className={styles.loadControl}
      onPointerEnter={() => setShowExplanation(true)}
      onPointerLeave={(event) => {
        if (!event.currentTarget.contains(document.activeElement)) {
          setShowExplanation(false);
        }
      }}
      onFocus={() => setShowExplanation(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setShowExplanation(false);
        }
      }}
    >
      <button
        className={styles.loadCharacter}
        type="button"
        aria-disabled={!available}
        aria-describedby={available ? undefined : "saved-characters-status"}
        aria-expanded={available ? showCharacters : undefined}
        aria-controls={available ? "saved-characters-list" : undefined}
        onClick={() => available ? setShowCharacters(!showCharacters) : setShowExplanation(true)}
        onKeyDown={(event) => {
          if (event.key === "Escape") { setShowExplanation(false); setShowCharacters(false); }
        }}
      >
        <span className={styles.plankLabel}>Cargar conversación</span>
      </button>
      <p
        className={styles.savedStatus}
        id="saved-characters-status"
        role="tooltip"
        hidden={available || !showExplanation}
      >
        {error || (loading ? "Buscando personajes guardados…" : "Todavía no hay personajes guardados.")}
      </p>
      {available && showCharacters && (
        <ul className={styles.savedCharacters} id="saved-characters-list" aria-label="Personajes guardados">
          {characters.map((character) => (
            <li key={character.id}>
              <Link className="text-link" href={`/chat/${character.id}`}>{character.name} →</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
