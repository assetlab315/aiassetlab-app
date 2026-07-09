"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ChatInput from "./ChatInput";
import ChatMessageList from "./ChatMessageList";
import ChatSuggestions from "./ChatSuggestions";
import ChatContextPanel from "./ChatContextPanel";
import { INITIAL_CHAT_MESSAGES } from "../../features/chat/constants";
import type {
  ChatApiResponse,
  ChatMessage,
  ChatUserContext,
  PortfolioContextAsset,
} from "../../features/chat/types";

const STORAGE_KEYS = [
  "aiassetlab_portfolio_assets",
  "aiAssetLabPortfolioAssets",
  "portfolioAssets",
];

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function toNumber(value: unknown) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function normalizeAsset(asset: Record<string, unknown>): PortfolioContextAsset {
  return {
    name: String(asset.name || asset.title || "資産"),
    category: String(asset.category || asset.type || "未分類"),
    amount: toNumber(asset.amount ?? asset.value ?? asset.currentValue),
    monthlyContribution: toNumber(
      asset.monthlyContribution ?? asset.monthlyAmount ?? asset.monthly,
    ),
  };
}

function readPortfolioContext(): ChatUserContext {
  if (typeof window === "undefined") {
    return {
      totalAssets: 0,
      monthlyContribution: 0,
      assetCount: 0,
      assets: [],
    };
  }

  const raw = STORAGE_KEYS.map((key) => window.localStorage.getItem(key)).find(Boolean);

  if (!raw) {
    return {
      totalAssets: 0,
      monthlyContribution: 0,
      assetCount: 0,
      assets: [],
    };
  }

  try {
    const parsed = JSON.parse(raw);
    const sourceAssets = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed.assets)
        ? parsed.assets
        : [];

    const assets = sourceAssets
      .filter((asset): asset is Record<string, unknown> => Boolean(asset))
      .map(normalizeAsset);

    return {
      totalAssets: assets.reduce((sum, asset) => sum + (asset.amount || 0), 0),
      monthlyContribution: assets.reduce(
        (sum, asset) => sum + (asset.monthlyContribution || 0),
        0,
      ),
      assetCount: assets.length,
      assets,
    };
  } catch {
    return {
      totalAssets: 0,
      monthlyContribution: 0,
      assetCount: 0,
      assets: [],
    };
  }
}

export default function ChatClient() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [context, setContext] = useState<ChatUserContext>({
    totalAssets: 0,
    monthlyContribution: 0,
    assetCount: 0,
    assets: [],
  });
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setContext(readPortfolioContext());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const canSend = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          history: nextMessages,
          context,
        }),
      });

      const data = (await response.json()) as ChatApiResponse;

      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          content: data.answer,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "assistant",
          content:
            "一時的に回答できませんでした。少し時間をおいて、もう一度試してください。",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_320px]">
        <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <p className="text-sm font-semibold text-blue-600">AIに相談</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              資産形成の悩みをAIに相談する
            </h1>
            <p className="mt-3 leading-7 text-slate-600">
              登録した資産状況を踏まえて、次にやることを分かりやすく整理します。
            </p>
          </div>

          <div className="flex h-[620px] flex-col">
            <ChatMessageList messages={messages} isSending={isSending} />
            <div ref={bottomRef} />

            <div className="border-t border-slate-100 p-4">
              <ChatSuggestions onSelect={(suggestion) => setInput(suggestion)} />
              <ChatInput
                value={input}
                canSend={canSend}
                onChange={setInput}
                onSend={() => sendMessage(input)}
              />
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <ChatContextPanel context={context} onRefresh={() => setContext(readPortfolioContext())} />

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">次におすすめ</h2>
            <div className="mt-4 space-y-3">
              <Link
                href="/portfolio"
                className="block rounded-2xl border border-slate-200 p-4 font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50"
              >
                資産を見る →
              </Link>
              <Link
                href="/simulator"
                className="block rounded-2xl border border-slate-200 p-4 font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50"
              >
                将来のお金を計算する →
              </Link>
              <Link
                href="/dashboard"
                className="block rounded-2xl border border-slate-200 p-4 font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50"
              >
                Dashboardへ戻る →
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
