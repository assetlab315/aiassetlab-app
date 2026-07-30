import { Bot } from "lucide-react";

const emptyChatSuggestions = [
  "新NISAを始めたい",
  "家計を見直したい",
  "投資割合を相談したい",
];

type Props = {
  onSelect: (value: string) => void;
};

export default function EmptyChat({ onSelect }: Props) {
  return (
    <section
      aria-labelledby="empty-chat-title"
      className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"
        >
          <Bot className="h-5 w-5" />
        </span>
        <h2 id="empty-chat-title" className="text-lg font-black text-slate-900">
          AIに相談してみましょう
        </h2>
      </div>
      <div className="mt-4 flex flex-wrap gap-2" aria-label="相談例">
        {emptyChatSuggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSelect(suggestion)}
            className="min-h-10 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </section>
  );
}
