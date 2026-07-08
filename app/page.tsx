import Link from "next/link";

export default function Dashboard() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <section className="aal-card p-8 mb-6">
        <p className="text-blue-600 font-bold mb-2">AI Asset Dashboard β</p>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4">資産形成を、AIで見える化。</h1>
        <p className="text-gray-600 mb-6">診断・積立シミュレーション・ポートフォリオを1つの画面で管理します。</p>
        <Link className="aal-button" href="/diagnosis">AI診断を始める</Link>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="aal-card p-6">
          <p className="text-sm text-gray-500">資産形成スコア</p>
          <p className="text-4xl font-extrabold text-blue-600">--点</p>
        </div>
        <div className="aal-card p-6">
          <p className="text-sm text-gray-500">次にやること</p>
          <p className="font-bold">AI診断を完了する</p>
        </div>
        <div className="aal-card p-6">
          <p className="text-sm text-gray-500">おすすめ</p>
          <p className="font-bold">毎月の積立額を確認</p>
        </div>
      </section>
    </main>
  );
}
