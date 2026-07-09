import { CHAT_SUGGESTIONS } from "../../features/chat/constants";

export default function ChatSuggestions({
  onSelect,
}: {
  onSelect: (suggestion: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {CHAT_SUGGESTIONS.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          aria-label={`${suggestion}を入力する`}
          onClick={() => onSelect(suggestion)}
          className="min-h-11 shrink-0 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
