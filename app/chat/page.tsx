import ChatClient from "../../components/chat/ChatClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "資産形成をAIに相談",
  description: "登録した資産状況を踏まえて、積立や資産配分など資産形成の次の一歩をAIに相談できます。",
  alternates: {
    canonical: "/chat",
  },
};

export default function ChatPage() {
  return <ChatClient />;
}
