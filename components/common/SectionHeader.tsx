type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function SectionHeader({ eyebrow, title, description }: Props) {
  return (
    <div>
      {eyebrow ? (
        <p className="mb-2 text-sm font-black text-blue-600">{eyebrow}</p>
      ) : null}
      <h2 className="text-2xl font-black tracking-tight text-slate-900">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-2xl leading-7 text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}
