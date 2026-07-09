import type { ChatMessage } from "./types";

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "initial-ai-message",
    role: "assistant",
    content:
      "こんにちは。資産形成で迷っていることを、何でも聞いてください。資産登録がある場合は、その内容も踏まえて一緒に考えます。",
    createdAt: new Date().toISOString(),
  },
];

export const CHAT_SUGGESTIONS = [
  "今の資産配分をどう見直せばいい？",
  "毎月いくら積み立てるべき？",
  "新NISAでは何から始めればいい？",
  "20年後に向けて何をすればいい？",
];
