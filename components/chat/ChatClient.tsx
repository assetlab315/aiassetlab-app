"use client";

import { useMemo, useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessageList from "./ChatMessageList";
import ChatSuggestions from "./ChatSuggestions";
import { INITIAL_CHAT_MESSAGES } from "../../features/chat/constants";
import type { ChatMessage } from "../../features/chat/types";
import { createMockReply } from "../../lib/chat/createMockReply";

export default function ChatClient() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);

  const latestUserMessage = useMemo(
    () => [...messages].reverse().find((message) => message.role === "user"),
    [messages],
  );

  const sendMessage = (body: string) => {
    const trimmedBody = body.trim();

    if (!trimmedBody) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      body: trimmedBody,
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setIsTyping(true);

    window.setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        body: createMockReply(trimmedBody),
      };

      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <section className="rounded-3xl bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <p className="text-sm font-semibold text-slate-900">
          相談テーマ
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {latestUserMessage?.body ?? "まずは気になる質問を選んでください。"}
        </p>
      </div>

      <div className="p-5">
        <ChatSuggestions onSelect={sendMessage} />
        <ChatMessageList messages={messages} isTyping={isTyping} />
        <ChatInput onSubmit={sendMessage} disabled={isTyping} />
      </div>
    </section>
  );
}
