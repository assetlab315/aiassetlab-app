export type StoredDiagnosisResult = {
  id: string;
  score: number;
  type: string;
  comment: string;
  answers: Record<string, number>;
  created_at: string;
  source: "local" | "cloud-cache";
};

export type DiagnosisResultInput = {
  score: number;
  type: string;
  comment: string;
  answers: Record<string, number>;
};

const DIAGNOSIS_STORAGE_KEY = "ai_asset_lab_diagnosis_results_v1";
const MAX_DIAGNOSIS_RESULTS = 10;

function getStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function createLocalDiagnosisId() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sanitizeResult(value: unknown): StoredDiagnosisResult | null {
  if (!value || typeof value !== "object") return null;

  const item = value as Partial<StoredDiagnosisResult>;
  if (
    typeof item.id !== "string" ||
    typeof item.score !== "number" ||
    typeof item.type !== "string" ||
    typeof item.comment !== "string" ||
    !item.answers ||
    typeof item.answers !== "object"
  ) {
    return null;
  }

  return {
    id: item.id,
    score: item.score,
    type: item.type,
    comment: item.comment,
    answers: item.answers as Record<string, number>,
    created_at:
      typeof item.created_at === "string" ? item.created_at : new Date().toISOString(),
    source: item.source === "cloud-cache" ? "cloud-cache" : "local",
  };
}

export function loadLocalDiagnosisResults(): StoredDiagnosisResult[] {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const raw = storage.getItem(DIAGNOSIS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => sanitizeResult(item))
      .filter((item): item is StoredDiagnosisResult => Boolean(item));
  } catch {
    return [];
  }
}

export function loadLocalDiagnosisResult(id: string | null) {
  if (!id) return null;
  return loadLocalDiagnosisResults().find((result) => result.id === id) ?? null;
}

export function saveLocalDiagnosisResult(
  input: DiagnosisResultInput,
  options: { id?: string; source?: StoredDiagnosisResult["source"] } = {},
) {
  const storage = getStorage();
  if (!storage) return null;

  const result: StoredDiagnosisResult = {
    id: options.id ?? createLocalDiagnosisId(),
    score: input.score,
    type: input.type,
    comment: input.comment,
    answers: input.answers,
    created_at: new Date().toISOString(),
    source: options.source ?? "local",
  };

  const nextResults = [
    result,
    ...loadLocalDiagnosisResults().filter((item) => item.id !== result.id),
  ].slice(0, MAX_DIAGNOSIS_RESULTS);

  try {
    storage.setItem(DIAGNOSIS_STORAGE_KEY, JSON.stringify(nextResults));
    return result;
  } catch {
    return null;
  }
}

export function createInlineDiagnosisResult(
  params: Pick<URLSearchParams, "get">,
): StoredDiagnosisResult | null {
  const score = Number(params.get("score"));
  const type = params.get("type");
  const comment = params.get("comment");
  const answersRaw = params.get("answers");

  if (!Number.isFinite(score) || !type || !comment || !answersRaw) return null;

  try {
    const answers = JSON.parse(answersRaw);
    if (!answers || typeof answers !== "object") return null;

    return {
      id: "inline",
      score,
      type,
      comment,
      answers: answers as Record<string, number>,
      created_at: new Date().toISOString(),
      source: "local",
    };
  } catch {
    return null;
  }
}

export function createInlineDiagnosisUrl(input: DiagnosisResultInput) {
  const params = new URLSearchParams({
    score: String(input.score),
    type: input.type,
    comment: input.comment,
    answers: JSON.stringify(input.answers),
  });

  return `/result?${params.toString()}`;
}
