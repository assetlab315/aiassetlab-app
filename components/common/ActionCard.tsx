import Card from "../ui/Card";
import Button from "../ui/Button";

type Props = {
  step: string;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  tone?: "blue" | "emerald" | "violet";
};

const toneClass = {
  blue: "bg-blue-50 text-blue-700",
  emerald: "bg-emerald-50 text-emerald-700",
  violet: "bg-violet-50 text-violet-700",
};

export default function ActionCard({
  step,
  title,
  description,
  href,
  actionLabel,
  tone = "blue",
}: Props) {
  return (
    <Card variant="feature" className="flex h-full flex-col justify-between">
      <div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${toneClass[tone]}`}
        >
          {step}
        </span>
        <h3 className="mt-4 text-xl font-black text-slate-900">{title}</h3>
        <p className="mt-3 leading-7 text-slate-600">{description}</p>
      </div>
      <div className="mt-6">
        <Button href={href}>{actionLabel} →</Button>
      </div>
    </Card>
  );
}
