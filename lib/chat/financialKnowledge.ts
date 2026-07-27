export const CURRENT_NISA_KNOWLEDGE =
  "現行新NISA:つみたて投資枠は年120万円、成長投資枠は年240万円、生涯非課税保有限度額は1800万円。旧つみたてNISAの年額上限を現行制度として案内しない。";

export function getFinancialKnowledgeForQuestion(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("nisa") || message.includes("新NISA")) {
    return CURRENT_NISA_KNOWLEDGE;
  }

  return "";
}
