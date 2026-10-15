import Link from "next/link";
import type { ReactNode } from "react";

type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function PageShell({
  eyebrow,
  title,
  description,
  children,
}: PageShellProps) {
  return (
    <div className="mx-auto flex min-h-svh max-w-5xl flex-col px-6 sm:px-12">
      <a
        className="sr-only focus:not-sr-only focus:mt-4 focus:text-brass"
        href="#main-content"
      >
        Ir al contenido
      </a>
      <header className="flex flex-wrap items-center justify-between gap-5 border-b border-rule py-7">
        <Link className="text-lg font-bold tracking-wide" href="/">
          Historical Bar
        </Link>
        <nav aria-label="Navegación principal" className="flex gap-6 text-sm">
          <Link className="text-link" href="/">
            Inicio
          </Link>
          <Link className="text-link" href="/characters/new">
            Nuevo personaje
          </Link>
        </nav>
      </header>
      <main className="flex-1 py-16 sm:py-24" id="main-content" tabIndex={-1}>
        <p className="mb-5 text-xs tracking-[0.2em] text-brass uppercase">
          {eyebrow}
        </p>
        <h1 className="max-w-3xl text-4xl leading-tight sm:text-6xl">{title}</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          {description}
        </p>
        <div className="mt-10 max-w-2xl">{children}</div>
      </main>
      <footer className="border-t border-rule py-6 text-sm text-muted">
        Prototipo inicial · Pantallas en preparación
      </footer>
    </div>
  );
}
