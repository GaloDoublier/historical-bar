import type { Metadata } from "next";
import { NewCharacterPlaceholder } from "@/features/characters/new-character-placeholder";

export const metadata: Metadata = { title: "Nuevo personaje" };

export default function NewCharacterPage() {
  return <NewCharacterPlaceholder />;
}
