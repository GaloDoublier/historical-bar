import Link from "next/link";
import { PageShell } from "@/components/ui/page-shell";
import { SavedCharacters } from "@/features/characters/saved-characters";

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
        <SavedCharacters />
        <Link className="text-link" href="/chat/demo">
          Explorar la sala de muestra
        </Link>
      </div>
    </PageShell>
  );
}
