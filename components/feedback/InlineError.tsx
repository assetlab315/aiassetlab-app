type Props = {
  message: string;
};

export default function InlineError({ message }: Props) {
  return (
    <p
      role="alert"
      aria-live="assertive"
      className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-700"
    >
      {message}
    </p>
  );
}
