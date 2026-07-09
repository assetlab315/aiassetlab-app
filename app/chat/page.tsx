import ChatClient from "../../components/chat/ChatClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIに相談する",
  description: "登録した資産状況を踏まえて、資産形成の次の一歩をAIに相談できます。",
  alternates: {
    canonical: "/chat",
  },
};

export default function ChatPage() {
  return <ChatClient />;
}
