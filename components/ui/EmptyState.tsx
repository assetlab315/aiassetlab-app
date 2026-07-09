import Button from "./Button";

type Props = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: Props) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <p className="text-4xl">🧭</p>
      <h2 className="mt-4 text-2xl font-black text-slate-900">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
        {description}
      </p>
      {actionLabel && actionHref ? (
        <div className="mt-6">
          <Button href={actionHref}>{actionLabel}</Button>
        </div>
      ) : null}
    </div>
  );
}
