import Card from "../ui/Card";
import Button from "../ui/Button";

export default function AIAdviceCard() {
  return (
    <Card variant="cta" className="overflow-hidden">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-black text-blue-100">今日のAIアドバイス</p>
          <h2 className="mt-3 text-2xl font-black leading-tight text-white">
            今月あと5,000円積み立てると、未来の選択肢が広がります。
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-blue-50">
            まずは無理なく続けることが最優先です。増やせる月だけ少し上乗せするだけでも、長期では大きな差になります。
          </p>
        </div>
        <div className="shrink-0">
          <Button href="/chat" variant="secondary">
            AIに相談する
          </Button>
        </div>
      </div>
    </Card>
  );
}
