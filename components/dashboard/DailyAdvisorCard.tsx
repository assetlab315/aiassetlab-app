"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ActionAdvisor, DailyAdvisor } from "../../features/dashboard/types";
import DailyAdvisorDetails from "./DailyAdvisorDetails";
import Card from "../ui/Card";

type Props = {
  advisor: DailyAdvisor;
  actionAdvisor: ActionAdvisor;
};

export default function DailyAdvisorCard({ advisor, actionAdvisor }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const chatHref = useMemo(
    () => `/chat?prompt=${encodeURIComponent(actionAdvisor.chatPrompt)}`,
    [actionAdvisor.chatPrompt],
  );

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
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((current) => !current)}
          className="min-h-11 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-700 hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
        >
          詳しく見る
        </button>
        <Link
          href={chatHref}
          className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-blue-600 px-4 py-2 text-sm font-black text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
        >
          AIに相談する
        </Link>
      </div>
      {isExpanded ? <DailyAdvisorDetails actionAdvisor={actionAdvisor} /> : null}
    </Card>
  );
}
