import type { SimulatorResult } from "../../features/simulator/types";

type Props = {
  result: SimulatorResult;
};

export default function AdviceCard({ result }: Props) {
  const hasLargeProfit = result.profit > result.principal * 0.4;

  return (
    <section className="rounded-2xl bg-blue-600 p-6 text-white shadow-sm">
      <p className="text-sm font-semibold text-blue-100">AIコメント</p>

      <h2 className="mt-2 text-xl font-bold">
        {hasLargeProfit
          ? "長期継続の効果が見えています"
          : "まずは無理なく続けることが大切です"}
      </h2>

      <p className="mt-3 leading-7 text-blue-50">
        {hasLargeProfit
          ? "この条件では、時間を味方につけることで運用益の割合が大きくなります。毎月の積立を自動化し、途中でやめない仕組みを作ることが重要です。"
          : "積立額を急に増やすよりも、まずは継続できる金額で始めることが大切です。慣れてきたら、収入アップ分を少しずつ積立に回しましょう。"}
      </p>
    </section>
  );
}
