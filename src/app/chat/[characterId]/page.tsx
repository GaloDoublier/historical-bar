import type { Metadata } from "next";
import { ConversationRoom } from "@/features/chat/conversation-room";

export const metadata: Metadata = { title: "Sala de conversación" };

type ConversationPageProps = {
  params: Promise<{ characterId: string }>;
};

export default async function ConversationPage({
  params,
}: ConversationPageProps) {
  const { characterId } = await params;

  return <ConversationRoom characterId={characterId} />;
}
