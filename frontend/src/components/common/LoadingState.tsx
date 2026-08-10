import { cn } from "@/lib/utils";

interface LoadingStateProps {
  count?: number;
  label?: string;
  className?: string;
}

export function LoadingState({ count = 6, label = "Carregando memórias", className }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3", className)}
    >
      <span className="sr-only">{label}…</span>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-[3/4] w-full bg-beige" />
          <div className="mt-4 h-3 w-1/3 bg-beige" />
          <div className="mt-3 h-4 w-3/4 bg-beige" />
        </div>
      ))}
    </div>
  );
}