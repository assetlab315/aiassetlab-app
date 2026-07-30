import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading: boolean;
  loadingLabel: ReactNode;
  children: ReactNode;
};

export default function LoadingButton({
  isLoading,
  loadingLabel,
  children,
  disabled,
  className = "",
  ...props
}: Props) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={`min-h-11 rounded-2xl bg-blue-600 px-5 py-2 text-sm font-black text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-300 ${className}`}
    >
      {isLoading ? loadingLabel : children}
    </button>
  );
}
