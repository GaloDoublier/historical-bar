import Link from "next/link";
import { PageShell } from "@/components/ui/page-shell";

export function NewCharacterPlaceholder() {
  return (
    <PageShell
      eyebrow="Una nueva visita"
      title="Nuevo personaje"
      description="Aquí prepararás el nombre y el retrato de tu próximo interlocutor."
    >
      <section
        aria-labelledby="character-placeholder-title"
        className="mb-8 space-y-4 rounded-sm border border-rule bg-wood p-6"
      >
        <h2 className="text-xl" id="character-placeholder-title">
          El creador está en preparación
        </h2>
        <p className="leading-relaxed text-muted">
          El formulario permitirá elegir un retrato y ajustar el rostro en un
          editor que se abrirá aquí mismo, dentro de una ventana modal.
        </p>
        <p className="leading-relaxed text-muted">
          También podrás adjuntar fuentes opcionales. Por ahora no se guardan
          personajes ni se procesan archivos.
        </p>
      </section>
      <Link className="action-link" href="/chat/demo">
        Visitar la sala de muestra
      </Link>
    </PageShell>
  );
}
