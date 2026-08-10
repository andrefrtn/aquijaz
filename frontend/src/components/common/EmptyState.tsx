import type { LucideIcon } from "lucide-react";
import { Archive } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon: Icon = Archive, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center border border-dashed border-border px-6 py-16 text-center">
      <Icon size={26} className="text-sage" aria-hidden="true" />
      <h3 className="font-display mt-5 text-xl">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}