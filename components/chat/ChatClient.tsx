"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ChatInput from "./ChatInput";
import ChatMessageList from "./ChatMessageList";
import ChatSuggestions from "./ChatSuggestions";
import ChatContextPanel from "./ChatContextPanel";
import { INITIAL_CHAT_MESSAGES } from "../../features/chat/constants";
import { loadPortfolioAssets } from "../../lib/portfolio/storage";
import type {
  ChatApiResponse,
  ChatMessage,
  ChatUserContext,
  PortfolioContextAsset,
} from "../../features/chat/types";

const MAX_CHAT_MESSAGE_LENGTH = 1000;

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

  try {
    const assets = loadPortfolioAssets()
      .filter(Boolean)
      .map((asset) => normalizeAsset(asset as unknown as Record<string, unknown>));

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
  const [isFallbackAnswer, setIsFallbackAnswer] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [isContextReady, setIsContextReady] = useState(false);
  const [context, setContext] = useState<ChatUserContext>({
    totalAssets: 0,
    monthlyContribution: 0,
    assetCount: 0,
    assets: [],
  });
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const isSendingRef = useRef(false);

  useEffect(() => {
    setContext(readPortfolioContext());
    setIsContextReady(true);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const inputLength = input.trim().length;
  const inputError =
    inputLength > MAX_CHAT_MESSAGE_LENGTH
      ? "相談内容は1,000文字以内で入力してください。"
      : "";
  const canSend = useMemo(
    () => inputLength > 0 && !inputError && !isSending && isContextReady,
    [inputError, inputLength, isContextReady, isSending],
  );

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (
      !trimmed ||
      trimmed.length > MAX_CHAT_MESSAGE_LENGTH ||
      isSendingRef.current ||
      !isContextReady
    ) {
      if (trimmed.length > MAX_CHAT_MESSAGE_LENGTH) {
        setNoticeMessage("相談内容は1,000文字以内で入力してください。");
      }
      return;
    }

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMessage];
    const latestContext = readPortfolioContext();
    isSendingRef.current = true;
    setContext(latestContext);
    setMessages(nextMessages);
    setInput("");
    setIsSending(true);
    setNoticeMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          history: nextMessages,
          context: latestContext,
        }),
      });

      const data = (await response.json()) as ChatApiResponse;
      setIsFallbackAnswer(data.source === "fallback" && data.status !== "rate_limited");
      setNoticeMessage(data.status === "rate_limited" ? data.answer : "");

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
      setIsFallbackAnswer(true);
      setNoticeMessage("");
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
      isSendingRef.current = false;
      setIsSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 md:py-8">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_320px]">
        <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 md:p-6">
            <p className="text-sm font-semibold text-blue-600">AI相談</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              資産形成で迷ったことをAIに聞く
            </h1>
            <p className="mt-3 leading-7 text-slate-600">
              登録した資産状況を踏まえて、次に確認することを短く整理します。
            </p>
            <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-500">
              AIの回答は参考情報です。投資助言や利益保証ではありません。パスワード、秘密鍵、カード番号などは入力しないでください。
            </p>
          </div>

          <div className="flex h-[68vh] min-h-[560px] flex-col lg:h-[620px]">
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
              {inputError ? (
                <p className="mt-3 text-xs font-medium text-red-600">{inputError}</p>
              ) : null}
              {noticeMessage ? (
                <p className="mt-3 text-xs font-medium text-slate-600">{noticeMessage}</p>
              ) : null}
              {isFallbackAnswer ? (
                <p className="mt-3 text-xs font-medium text-slate-500">
                  現在は簡易回答です。
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <ChatContextPanel
            context={context}
            onRefresh={() => {
              setContext(readPortfolioContext());
              setIsContextReady(true);
            }}
          />

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">次に進む場所</h2>
            <div className="mt-4 space-y-3">
              <Link
                href="/portfolio"
                className="block rounded-2xl border border-slate-200 p-4 font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
              >
                資産を見る →
              </Link>
              <Link
                href="/simulator"
                className="block rounded-2xl border border-slate-200 p-4 font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
              >
                将来のお金を計算する →
              </Link>
              <Link
                href="/dashboard"
                className="block rounded-2xl border border-slate-200 p-4 font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
              >
                Dashboardを見る →
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
