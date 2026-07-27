import { NextResponse } from "next/server";
import type { ChatApiRequest, ChatApiResponse } from "../../../features/chat/types";
import { createChatPrompt } from "../../../lib/chat/createChatPrompt";
import { createFallbackAnswer } from "../../../lib/chat/createFallbackAnswer";

const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_ITEMS = 6;
const MAX_HISTORY_CONTENT_LENGTH = 1000;
const MAX_PORTFOLIO_ASSETS = 8;
const MAX_ASSET_TEXT_LENGTH = 80;
const MAX_MONEY_VALUE = 1_000_000_000_000;
const MAX_REQUEST_CONTENT_LENGTH = 30_000;
const OPENAI_TIMEOUT_MS = 15_000;
const OPENAI_MAX_TOKENS = 500;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const RATE_LIMIT_MAX_KEYS = 1000;
const SYSTEM_PROMPT = `あなたはAI Asset Labの資産形成AIアドバイザーです。日本の資産形成初心者へ、分かりやすい日本語で直接答えてください。

回答原則:
- 結論を先に伝え、一般論だけで終わらせない
- 原則300〜600日本語文字で、必要な場合のみ2〜4個の箇条書きを使う
- 低コスト、分散、長期、継続、生活防衛資金を重視する
- 投資助言、利益保証、個別銘柄の断定的な売買指示はしない
- 制度、税制、商品仕様など最新確認が必要な内容は断定せず、公式情報の確認を促す
- 危険な投資、借金投資、生活費の全額投資、損失を取り戻すための追加投資は後押ししない
- パスワード、秘密鍵、カード番号などの機密情報は再掲せず、入力しないよう伝える
- サービス内導線は質問へ答えた後、必要な場合だけ最大1つ示す
- 最後に「次にやること」を1つだけ具体的に示す`;

type RateLimitEntry = {
  count: number;
  windowStart: number;
  lastSeen: number;
};

// Best-effort only: Vercel Serverless instances do not share this in-memory map.
const rateLimitStore = new Map<string, RateLimitEntry>();

function createSafeContext(): ChatApiRequest["context"] {
  return {
    totalAssets: 0,
    monthlyContribution: 0,
    assetCount: 0,
    assets: [],
  };
}

function trimText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function sanitizeMoney(value: unknown) {
  const numberValue = Number(value);
  if (!Number.isFinite(numberValue) || numberValue < 0) return 0;
  return Math.min(numberValue, MAX_MONEY_VALUE);
}

function sanitizeHistory(value: unknown): ChatApiRequest["history"] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is Record<string, unknown> => {
      return Boolean(item) && typeof item === "object";
    })
    .map((item) => {
      const role = item.role === "user" || item.role === "assistant" ? item.role : null;
      const content = trimText(item.content, MAX_HISTORY_CONTENT_LENGTH);

      if (!role || !content) return null;

      return {
        id: trimText(item.id, 80) || "history",
        role,
        content,
        createdAt: trimText(item.createdAt, 40) || new Date(0).toISOString(),
      };
    })
    .filter((item): item is ChatApiRequest["history"][number] => Boolean(item))
    .slice(-MAX_HISTORY_ITEMS);
}

function sanitizeContext(value: unknown): ChatApiRequest["context"] {
  if (!value || typeof value !== "object") return createSafeContext();

  const context = value as Record<string, unknown>;
  const sourceAssets = Array.isArray(context.assets) ? context.assets : [];
  const assets = sourceAssets
    .filter((asset): asset is Record<string, unknown> => {
      return Boolean(asset) && typeof asset === "object";
    })
    .slice(0, MAX_PORTFOLIO_ASSETS)
    .map((asset) => {
      return {
        name: trimText(asset.name, MAX_ASSET_TEXT_LENGTH) || "資産",
        category: trimText(asset.category, MAX_ASSET_TEXT_LENGTH) || "未分類",
        amount: sanitizeMoney(asset.amount),
        monthlyContribution: sanitizeMoney(asset.monthlyContribution),
      };
    });

  return {
    totalAssets: assets.reduce((sum, asset) => sum + (asset.amount || 0), 0),
    monthlyContribution: assets.reduce(
      (sum, asset) => sum + (asset.monthlyContribution || 0),
      0,
    ),
    assetCount: assets.length,
    assets,
  };
}

function logFallback(reason: string, status?: number) {
  console.error(
    `[api/chat] fallback reason=${reason}${typeof status === "number" ? ` status=${status}` : ""}`,
  );
}

function fallbackResponse(
  answer: string,
  status: ChatApiResponse["status"] = "fallback",
) {
  return NextResponse.json<ChatApiResponse>({
    answer,
    source: "fallback",
    status,
  });
}

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const vercelForwardedFor = request.headers.get("x-vercel-forwarded-for");
  const candidate = forwardedFor?.split(",")[0]?.trim() || realIp || vercelForwardedFor;

  return candidate ? `ip:${candidate}` : "ip:unknown";
}

function cleanupRateLimitStore(now: number) {
  for (const [key, entry] of Array.from(rateLimitStore.entries())) {
    if (now - entry.lastSeen > RATE_LIMIT_WINDOW_MS) {
      rateLimitStore.delete(key);
    }
  }

  while (rateLimitStore.size > RATE_LIMIT_MAX_KEYS) {
    const oldestKey = rateLimitStore.keys().next().value as string | undefined;
    if (!oldestKey) break;
    rateLimitStore.delete(oldestKey);
  }
}

function isRateLimited(clientKey: string) {
  const now = Date.now();
  cleanupRateLimitStore(now);

  const current = rateLimitStore.get(clientKey);
  if (!current || now - current.windowStart >= RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(clientKey, {
      count: 1,
      windowStart: now,
      lastSeen: now,
    });
    return false;
  }

  current.count += 1;
  current.lastSeen = now;

  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

function classifyOpenAiStatus(status: number) {
  if (status === 401) return "openai_401";
  if (status === 403) return "openai_403";
  if (status === 429) return "openai_429";
  if (status >= 500) return "openai_5xx";
  return "openai_non_ok";
}

export async function POST(request: Request) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > MAX_REQUEST_CONTENT_LENGTH) {
      logFallback("payload_too_large");
      return fallbackResponse(
        "相談内容が長すぎます。内容を短くして、もう一度お試しください。",
        "validation_error",
      );
    }

    let body: Partial<ChatApiRequest>;
    try {
      body = (await request.json()) as Partial<ChatApiRequest>;
    } catch {
      logFallback("invalid_request_json");
      return fallbackResponse(
        "相談内容を読み取れませんでした。内容を短くして、もう一度お試しください。",
        "validation_error",
      );
    }
    const rawMessage = body.message;

    if (typeof rawMessage !== "string") {
      return fallbackResponse("相談内容を入力してください。", "validation_error");
    }

    const message = rawMessage.trim();

    if (!message) {
      return fallbackResponse("相談内容を入力してください。", "fallback");
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return fallbackResponse(
        "相談内容は1,000文字以内で入力してください。",
        "validation_error",
      );
    }

    const history = sanitizeHistory(body.history);
    const context = sanitizeContext(body.context);

    if (isRateLimited(getClientKey(request))) {
      logFallback("rate_limited");
      return fallbackResponse(
        "短時間に送信回数が多くなっています。少し待ってからお試しください。",
        "rate_limited",
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return fallbackResponse(createFallbackAnswer(message, context), "fallback");
    }

    const prompt = createChatPrompt(message, history, context);
    const controller = new AbortController();
    timeoutId = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);

    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.4,
        max_tokens: OPENAI_MAX_TOKENS,
      }),
    });

    if (!openAiResponse.ok) {
      const reason = classifyOpenAiStatus(openAiResponse.status);
      const requestId = openAiResponse.headers.get("x-request-id");
      console.error(
        `[api/chat] fallback reason=${reason} status=${openAiResponse.status}${
          requestId ? ` request_id=${requestId}` : ""
        }`,
      );
      return fallbackResponse(createFallbackAnswer(message, context), "fallback");
    }

    let data: unknown;
    try {
      data = await openAiResponse.json();
    } catch {
      logFallback("invalid_json");
      return fallbackResponse(createFallbackAnswer(message, context), "fallback");
    }

    const answer =
      typeof (data as { choices?: { message?: { content?: unknown } }[] })?.choices?.[0]
        ?.message?.content === "string"
        ? (data as { choices: { message: { content: string } }[] }).choices[0].message.content.trim()
        : "";

    if (!answer) {
      logFallback("malformed_response");
      return fallbackResponse(createFallbackAnswer(message, context), "fallback");
    }

    return NextResponse.json<ChatApiResponse>({
      answer,
      source: "openai",
      status: "ok",
    });
  } catch (error) {
    const reason =
      error instanceof Error && error.name === "AbortError" ? "timeout" : "network_or_unknown";
    logFallback(reason);

    return fallbackResponse(
      "一時的に回答できませんでした。資産を見る、将来のお金を計算する、AIに相談するの順で、今日できることを1つ選びましょう。",
      "fallback",
    );
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}
