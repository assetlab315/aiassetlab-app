import type { ActionAdvisor } from "../../features/dashboard/types";

type Props = {
  actionAdvisor: ActionAdvisor;
};

export default function DailyAdvisorDetails({ actionAdvisor }: Props) {
  return (
    <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 text-sm leading-6 text-slate-700 md:grid-cols-3">
      <div>
        <h3 className="font-bold text-slate-900">理由</h3>
        <p className="mt-1">{actionAdvisor.reason}</p>
      </div>
      <div>
        <h3 className="font-bold text-slate-900">現在の状況</h3>
        <p className="mt-1">{actionAdvisor.currentStatus}</p>
      </div>
      <div>
        <h3 className="font-bold text-slate-900">おすすめ</h3>
        <ul className="mt-1 space-y-1">
          {actionAdvisor.recommendations.map((recommendation) => (
            <li key={recommendation}>・{recommendation}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
