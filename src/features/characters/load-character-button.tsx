"use client";

import { useState } from "react";
import styles from "./main-menu.module.css";

export function LoadCharacterButton() {
  const [showExplanation, setShowExplanation] = useState(false);

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
        aria-disabled="true"
        aria-describedby="saved-characters-status"
        onClick={() => setShowExplanation(true)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setShowExplanation(false);
        }}
      >
        <span className={styles.plankLabel}>Cargar conversación</span>
      </button>
      <p
        className={styles.savedStatus}
        id="saved-characters-status"
        role="tooltip"
        hidden={!showExplanation}
      >
        Todavía no hay personajes guardados.
      </p>
    </div>
  );
}
