import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  size?: "md" | "lg" | "xl";
};

const sizeClass = {
  md: "max-w-4xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
};

export default function PageContainer({ children, size = "xl" }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="px-4 py-6 md:px-8 md:py-8 lg:py-10">
        <div className={`mx-auto w-full ${sizeClass[size]} space-y-5 md:space-y-6 lg:space-y-8`}>
          {children}
        </div>
      </main>
    </div>
  );
}
