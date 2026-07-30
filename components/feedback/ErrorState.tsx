import LoadingButton from "./LoadingButton";

type Props = {
  title: string;
  description: string;
  actionLabel?: string;
  loadingLabel?: string;
  isRetrying?: boolean;
  onRetry?: () => void;
};

export default function ErrorState({
  title,
  description,
  actionLabel = "再試行",
  loadingLabel = "再試行中…",
  isRetrying = false,
  onRetry,
}: Props) {
  return (
    <section
      role="alert"
      aria-live="assertive"
      className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-black text-slate-900">{title}</h2>
      <p className="mt-3 leading-7 text-slate-600">{description}</p>
      {onRetry ? (
        <div className="mt-5">
          <LoadingButton
            type="button"
            isLoading={isRetrying}
            loadingLabel={loadingLabel}
            onClick={onRetry}
          >
            {actionLabel}
          </LoadingButton>
        </div>
      ) : null}
    </section>
  );
}
