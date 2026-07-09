import SimulatorClient from "../../components/simulator/SimulatorClient";

export default function SimulatorPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <section className="mb-8">
          <p className="mb-2 text-sm font-semibold text-blue-600">
            AI Asset Lab
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            積立シミュレーター
          </h1>
          <p className="mt-3 text-slate-600">
            毎月の積立額から、将来の資産額・元本・運用益をかんたんに確認できます。
          </p>
        </section>

        <SimulatorClient />
      </div>
    </main>
  );
}
