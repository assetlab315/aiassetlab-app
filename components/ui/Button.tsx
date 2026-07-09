import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export default function Button({ href, children, variant = "primary" }: Props) {
  const className =
    variant === "primary"
      ? "inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700"
      : "inline-flex items-center justify-center rounded-full bg-slate-100 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200";

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return <button className={className}>{children}</button>;
}
