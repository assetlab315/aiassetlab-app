type Props = {
  value: string;
  canSend: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
};

export default function ChatInput({ value, canSend, onChange, onSend }: Props) {
  return (
    <div className="mt-4 flex gap-3">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            onSend();
          }
        }}
        rows={2}
        placeholder="例：今の資産配分で大丈夫？"
        className="min-h-[56px] flex-1 resize-none rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
      />
      <button
        type="button"
        onClick={onSend}
        disabled={!canSend}
        className="rounded-2xl bg-blue-600 px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        送信
      </button>
    </div>
  );
}
