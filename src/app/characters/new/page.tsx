import type { Metadata } from "next";
import { CharacterForm } from "@/features/characters/character-form";

export const metadata: Metadata = { title: "Nuevo personaje" };

export default function NewCharacterPage() {
  return <CharacterForm />;
}
