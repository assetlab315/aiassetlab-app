import type { ReactNode } from "react";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";

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
      <AppHeader />
      <main className="px-4 py-8 md:px-8">
        <div className={`mx-auto w-full ${sizeClass[size]} space-y-6`}>
          {children}
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
