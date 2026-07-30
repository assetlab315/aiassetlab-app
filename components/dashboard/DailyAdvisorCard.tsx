import type { DailyAdvisor } from "../../features/dashboard/types";
import Card from "../ui/Card";

type Props = {
  advisor: DailyAdvisor;
};

export default function DailyAdvisorCard({ advisor }: Props) {
  return (
    <Card className="border border-blue-100 bg-white">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="text-lg">
          🤖
        </span>
        <h2 className="text-sm font-black text-blue-600">{advisor.title}</h2>
      </div>
      <div className="mt-4 space-y-2 text-base font-bold leading-7 text-slate-900 md:text-lg">
        {advisor.messages.map((message) => (
          <p key={message}>{message}</p>
        ))}
      </div>
    </Card>
  );
}
