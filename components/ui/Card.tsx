import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: Props) {
  return (
    <section className={`rounded-3xl bg-white p-6 shadow-sm ${className}`}>
      {children}
    </section>
  );
}
