import Card from "../ui/Card";
import Button from "../ui/Button";

type Props = {
  label?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export default function AIAdviceCard({
  label = "今日のAIアドバイス",
  title = "今月あと5,000円積み立てると、未来の選択肢が広がります。",
  description = "まずは無理なく続けることが最優先です。増やせる月だけ少し上乗せするだけでも、長期では大きな差になります。",
  ctaLabel = "AIに相談する",
  ctaHref = "/chat",
}: Props) {
  return (
    <Card variant="cta" className="overflow-hidden">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-black text-blue-100">{label}</p>
          <h2 className="mt-3 text-2xl font-black leading-tight text-white">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-blue-50">
            {description}
          </p>
        </div>
        <div className="shrink-0">
          <Button href={ctaHref} variant="secondary">
            {ctaLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
}
