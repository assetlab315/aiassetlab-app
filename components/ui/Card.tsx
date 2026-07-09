import type { ReactNode } from "react";

type CardVariant = "default" | "feature" | "cta" | "soft";

type Props = {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
};

const variantClass: Record<CardVariant, string> = {
  default: "bg-white shadow-sm",
  feature: "border border-slate-100 bg-white shadow-sm",
  cta: "bg-blue-600 text-white shadow-sm",
  soft: "border border-slate-100 bg-slate-50",
};

export default function Card({
  children,
  className = "",
  variant = "default",
}: Props) {
  return (
    <section className={`rounded-3xl p-6 ${variantClass[variant]} ${className}`}>
      {children}
    </section>
  );
}
