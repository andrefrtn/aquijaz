import { CATEGORIES, type Category } from "@/types";
import { cn } from "@/lib/utils";

type Value = Category | "Todas";

interface CategoryFilterProps {
  value: Value;
  onChange: (value: Value) => void;
  includeAll?: boolean;
}

export function CategoryFilter({ value, onChange, includeAll = true }: CategoryFilterProps) {
  const options: Value[] = includeAll ? ["Todas", ...CATEGORIES] : [...CATEGORIES];

  return (
    <div role="group" aria-label="Filtrar por categoria" className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={cn(
            "border px-4 py-2 text-sm transition-colors",
            value === option
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-foreground hover:border-primary hover:text-primary",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}