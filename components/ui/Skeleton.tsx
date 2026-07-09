type Props = {
  className?: string;
};

export default function Skeleton({ className = "h-4 w-full" }: Props) {
  return <div className={`animate-pulse rounded-full bg-slate-200 ${className}`} />;
}
