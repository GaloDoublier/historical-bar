import Link from "next/link";
import { PageShell } from "@/components/ui/page-shell";

export function ConversationPlaceholder({
  characterId,
}: {
  characterId: string;
}) {
  return (
    <PageShell
      eyebrow="Al otro lado de la mesa"
      title="Sala de conversación"
      description="El bar pronto abrirá sus puertas. Esta es una primera parada para recorrer la aplicación."
    >
      <section
        aria-labelledby="conversation-placeholder-title"
        className="mb-8 space-y-4 rounded-sm border border-rule bg-wood p-6"
      >
        <h2 className="text-xl" id="conversation-placeholder-title">
          Una mesa reservada
        </h2>
        <p className="break-words text-muted">
          Identificador de muestra: <span className="text-paper">{characterId}</span>
        </p>
        <p className="leading-relaxed text-muted">
          La escena del bar, el personaje y los mensajes llegarán en las próximas
          etapas. Esta sala todavía no carga personajes ni genera respuestas.
        </p>
      </section>
      <Link className="action-link" href="/characters/new">
        Volver al creador
      </Link>
    </PageShell>
  );
}
