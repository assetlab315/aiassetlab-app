import { CHAT_SUGGESTIONS } from "../../features/chat/constants";

type Props = {
  onSelect: (message: string) => void;
};

export default function ChatSuggestions({ onSelect }: Props) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-900">
        おすすめ質問
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {CHAT_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSelect(suggestion)}
            className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
