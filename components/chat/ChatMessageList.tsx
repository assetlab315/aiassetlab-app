import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import type { ChatMessage as ChatMessageType } from "../../features/chat/types";

type Props = {
  messages: ChatMessageType[];
  isTyping: boolean;
};

export default function ChatMessageList({ messages, isTyping }: Props) {
  return (
    <div className="mt-5 h-[460px] space-y-4 overflow-y-auto rounded-3xl border border-slate-100 bg-slate-50 p-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {isTyping ? <TypingIndicator /> : null}
    </div>
  );
}
