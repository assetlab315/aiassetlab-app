import type { ChatMessage } from "../../features/chat/types";

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[92%] whitespace-pre-line rounded-3xl px-5 py-4 leading-7 sm:max-w-[82%] ${
          isUser
            ? "bg-blue-600 text-white"
            : "border border-slate-100 bg-slate-50 text-slate-700"
        }`}
      >
        <p className="text-sm font-semibold opacity-80">
          {isUser ? "あなた" : "AI Asset Lab"}
        </p>
        <p className="mt-1">{message.content}</p>
      </div>
    </div>
  );
}

export default function ChatMessageList({
  messages,
  isSending,
}: {
  messages: ChatMessage[];
  isSending: boolean;
}) {
  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-6">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isSending ? (
        <div className="flex justify-start">
          <div className="rounded-3xl border border-slate-100 bg-slate-50 px-5 py-4 text-slate-500">
            AIが考えています...
          </div>
        </div>
      ) : null}
    </div>
  );
}
