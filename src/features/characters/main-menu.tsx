import localFont from "next/font/local";
import Link from "next/link";
import { version } from "../../../package.json";
import { LoadCharacterButton } from "./load-character-button";
import styles from "./main-menu.module.css";

const rye = localFont({
  src: "../../../public/assets/fonts/rye-regular.ttf",
  display: "swap",
  weight: "400",
  variable: "--font-western",
});

export function MainMenu() {
  return (
    <main className={`${styles.menu} ${rye.variable}`} id="main-content">
      <video
        aria-hidden="true"
        autoPlay
        className={styles.sceneVideo}
        loop
        muted
        playsInline
      >
        <source
          src="/assets/main-menu/Bartender_polishing_glass_in_saloon_20261015192207.mp4"
          type="video/mp4"
        />
      </video>
      <div className={styles.shade} aria-hidden="true" />

      <div className={styles.content}>
        <h1 className={styles.title}>
          <span>Historical</span>
          <span className={styles.titleBar}>Bar</span>
        </h1>
        <p className={styles.invitation}>
          Las grandes historias empiezan
          <br />
          con una conversación.
        </p>
        <nav className={styles.actions} aria-label="Menú principal">
          <Link className={styles.newCharacter} href="/characters/new">
            <span className={styles.plankLabel}>Nuevo personaje</span>
          </Link>
          <LoadCharacterButton />
        </nav>
      </div>
      <small className={styles.version} aria-label={`Versión ${version}`}>
        v{version}
      </small>
    </main>
  );
}
