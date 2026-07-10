import { NextResponse } from "next/server";
import type { ChatApiRequest, ChatApiResponse } from "../../../features/chat/types";
import { createChatPrompt } from "../../../lib/chat/createChatPrompt";
import { createFallbackAnswer } from "../../../lib/chat/createFallbackAnswer";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatApiRequest;
    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json<ChatApiResponse>({
        answer: "相談内容を入力してください。",
        source: "fallback",
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json<ChatApiResponse>({
        answer: createFallbackAnswer(message, body.context),
        source: "fallback",
      });
    }

    const prompt = createChatPrompt(message, body.history || [], body.context);

    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "あなたは初心者向けの資産形成サービス AI Asset Lab のAIアドバイザーです。分かりやすく、短く、行動につながる回答をしてください。",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.4,
      }),
    });

    if (!openAiResponse.ok) {
      return NextResponse.json<ChatApiResponse>({
        answer: createFallbackAnswer(message, body.context),
        source: "fallback",
      });
    }

    const data = await openAiResponse.json();
    const answer =
      data?.choices?.[0]?.message?.content ||
      createFallbackAnswer(message, body.context);

    return NextResponse.json<ChatApiResponse>({
      answer,
      source: "openai",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[api/chat] error:", message);

    return NextResponse.json<ChatApiResponse>({
      answer:
        "一時的に回答できませんでした。資産を見る、将来のお金を計算する、AIに相談するの順で、今日できることを1つ選びましょう。",
      source: "fallback",
    });
  }
}
