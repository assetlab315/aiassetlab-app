type Props = {
  eyebrow?: string;
  title: string;
  description: string;
};

export default function PageTitle({
  eyebrow = "AI Asset Lab",
  title,
  description,
}: Props) {
  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="mb-2 text-sm font-semibold text-blue-600">{eyebrow}</p>
      <h1 className="text-3xl font-black tracking-tight text-slate-900">
        {title}
      </h1>
      <p className="mt-3 max-w-3xl leading-7 text-slate-600">
        {description}
      </p>
    </section>
  );
}
