import type { ChatMessage } from "./types";

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "initial-assistant-message",
    role: "assistant",
    body:
      "こんにちは。AI Asset Labです。資産形成で迷っていることを、できるだけシンプルに整理します。まずは下のおすすめ質問から選んでください。",
  },
];

export const CHAT_SUGGESTIONS = [
  "何から資産形成を始めればいい？",
  "毎月3万円ならどう運用する？",
  "副業収入を資産形成に回したい",
  "リスクを抑えて増やしたい",
];
