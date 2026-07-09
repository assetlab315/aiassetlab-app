import type { ChatMessage } from "./types";

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "initial-ai-message",
    role: "assistant",
    content:
      "こんにちは。まずは下の候補を選ぶか、今の不安を1つ送ってください。資産登録がある場合は、その内容も踏まえて一緒に考えます。",
    createdAt: new Date().toISOString(),
  },
];

export const CHAT_SUGGESTIONS = [
  "今の資産配分をどう見直せばいい？",
  "毎月いくら積み立てるべき？",
  "新NISAでは何から始めればいい？",
  "20年後に向けて何をすればいい？",
];
