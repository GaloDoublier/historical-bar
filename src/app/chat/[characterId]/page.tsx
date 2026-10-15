import type { Metadata } from "next";
import { ConversationPlaceholder } from "@/features/chat/conversation-placeholder";

export const metadata: Metadata = { title: "Sala de conversación" };

type ConversationPageProps = {
  params: Promise<{ characterId: string }>;
};

export default async function ConversationPage({
  params,
}: ConversationPageProps) {
  const { characterId } = await params;

  return <ConversationPlaceholder characterId={characterId} />;
}
