import type { ChatUserContext } from "../../features/chat/types";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

export default function ChatContextPanel({
  context,
  onRefresh,
}: {
  context: ChatUserContext;
  onRefresh: () => void;
}) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-blue-600">AIが見ている情報</p>
          <h2 className="mt-1 text-lg font-bold text-slate-900">あなたの資産状況</h2>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-50"
        >
          更新
        </button>
      </div>

      <div className="mt-5 space-y-3">
        <div className="rounded-2xl bg-blue-50 p-4">
          <p className="text-sm text-blue-700">総資産</p>
          <p className="mt-1 text-2xl font-bold text-blue-700">
            {formatCurrency(context.totalAssets)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">登録数</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{context.assetCount}件</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">毎月積立</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {formatCurrency(context.monthlyContribution)}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs leading-6 text-slate-500">
        資産画面で登録した内容を読み取り、AI相談の文脈として利用します。
      </p>
    </div>
  );
}
