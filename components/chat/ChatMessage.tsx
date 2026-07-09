import type { ChatMessage as ChatMessageType } from "../../features/chat/types";

type Props = {
  message: ChatMessageType;
};

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-3xl px-5 py-4 text-sm leading-7 ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-slate-100 text-slate-800"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
