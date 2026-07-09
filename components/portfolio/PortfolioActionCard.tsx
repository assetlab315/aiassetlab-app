type PortfolioActionCardProps = {
  action: string;
};

export function PortfolioActionCard({ action }: PortfolioActionCardProps) {
  return (
    <section className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
      <p className="text-sm font-semibold text-indigo-700">AI Next Action</p>
      <h2 className="mt-2 text-xl font-bold text-slate-900">今月やること</h2>
      <p className="mt-3 text-sm leading-7 text-slate-700">{action}</p>
      <a
        href="/simulator"
        className="mt-5 inline-flex rounded-full bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
      >
        シミュレーターで将来を確認する
      </a>
    </section>
  );
}
