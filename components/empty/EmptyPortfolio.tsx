type Props = {
  onAddAsset?: () => void;
};

export default function EmptyPortfolio({ onAddAsset }: Props) {
  return (
    <section
      aria-labelledby="empty-portfolio-title"
      className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="text-xl">
          💴
        </span>
        <h2 id="empty-portfolio-title" className="text-xl font-black text-slate-900">
          資産はまだ登録されていません。
        </h2>
      </div>
      <p className="mt-4 leading-7 text-slate-600">
        最初は
        <br />
        ・現金
        <br />
        ・銀行預金
        <br />
        だけでもOKです。
      </p>
      {onAddAsset ? (
        <button
          type="button"
          onClick={onAddAsset}
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 py-2 text-sm font-black text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
        >
          資産を追加
        </button>
      ) : null}
    </section>
  );
}
