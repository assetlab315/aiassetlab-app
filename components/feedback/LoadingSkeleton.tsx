type Props = {
  variant: "dashboard-card" | "portfolio-list" | "chat-answer";
  label?: string;
};

const base =
  "animate-pulse rounded-3xl border border-slate-100 bg-white shadow-sm motion-reduce:animate-none";

export default function LoadingSkeleton({ variant, label = "読み込み中" }: Props) {
  if (variant === "portfolio-list") {
    return (
      <section aria-label={label} aria-busy="true" className={`${base} p-5`}>
        <div className="h-5 w-36 rounded-full bg-slate-200" />
        <div className="mt-5 space-y-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-100 p-4">
              <div className="h-4 w-2/5 rounded-full bg-slate-200" />
              <div className="mt-3 h-6 w-3/5 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === "chat-answer") {
    return (
      <div aria-label={label} aria-busy="true" className="flex justify-start">
        <div className="max-w-[92%] rounded-3xl border border-slate-100 bg-slate-50 px-5 py-4 text-slate-500 sm:max-w-[82%]">
          <div className="h-4 w-40 rounded-full bg-slate-200" />
          <div className="mt-3 h-4 w-56 rounded-full bg-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <section aria-label={label} aria-busy="true" className={`${base} p-6`}>
      <div className="h-4 w-28 rounded-full bg-slate-200" />
      <div className="mt-4 h-8 w-3/4 rounded-full bg-slate-200" />
      <div className="mt-3 h-4 w-2/3 rounded-full bg-slate-100" />
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-20 rounded-2xl bg-slate-100" />
        ))}
      </div>
    </section>
  );
}
