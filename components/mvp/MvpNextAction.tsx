import Link from "next/link";

export default function MvpNextAction() {
  return (
    <section className="rounded-3xl bg-blue-600 p-6 text-white shadow-sm">
      <p className="text-sm font-semibold text-blue-100">次にやること</p>
      <h2 className="mt-2 text-xl font-bold">Dashboardを中心に回遊確認する</h2>
      <p className="mt-3 leading-7 text-blue-50">
        診断後にDashboardへ進み、Portfolio、Simulator、AI Chatへ自然に移動できるかを確認します。
        MVPでは機能追加よりも、迷わず使えることを優先します。
      </p>
      <Link
        href="/dashboard"
        className="mt-5 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-bold text-blue-600 transition hover:bg-blue-50"
      >
        Dashboardを確認する
      </Link>
    </section>
  );
}
