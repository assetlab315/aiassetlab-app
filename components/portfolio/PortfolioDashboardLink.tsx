export function PortfolioDashboardLink() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 text-sm text-slate-600 shadow-sm">
      <p className="font-semibold text-slate-900">Dashboardからの導線</p>
      <p className="mt-2 leading-6">
        Dashboardのおすすめ機能からこのPortfolioへ遷移する想定です。MVPではURL直アクセスでも確認できます。
      </p>
      <a href="/dashboard" className="mt-4 inline-flex font-bold text-blue-600 hover:text-blue-700">
        Dashboardへ戻る
      </a>
    </div>
  );
}
