import Link from "next/link";
import { PageShell } from "@/components/ui/page-shell";

export default function MainMenuPage() {
  return (
    <PageShell
      eyebrow="Un encuentro con la historia"
      title="Historical Bar"
      description="Una mesa, una historia y alguien con quien conversar."
    >
      <div className="flex flex-col items-start gap-5">
        <Link className="action-link" href="/characters/new">
          Nuevo personaje
        </Link>
        <div className="space-y-2">
          <button
            aria-describedby="saved-characters-status"
            className="min-h-12 cursor-not-allowed rounded-sm border border-rule px-6 py-3 text-muted"
            disabled
            type="button"
          >
            Continuar conversación
          </button>
          <p className="text-sm text-muted" id="saved-characters-status">
            Todavía no hay personajes guardados. El guardado local llegará más
            adelante.
          </p>
        </div>
        <Link className="text-link" href="/chat/demo">
          Explorar la sala de muestra
        </Link>
      </div>
    </PageShell>
  );
}
