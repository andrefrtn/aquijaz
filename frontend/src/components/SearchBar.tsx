import { Search } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/common/Button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  buttonLabel?: string;
  onSearch: (term: string) => void;
  className?: string;
}

export function SearchBar({
  defaultValue = "",
  placeholder = "Pesquise uma pessoa...",
  buttonLabel = "Pesquisar",
  onSearch,
  className,
}: SearchBarProps) {
  const id = useId();
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSearch(value.trim());
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn("flex w-full flex-col gap-2 sm:flex-row", className)}
    >
      <label htmlFor={id} className="sr-only">
        Pesquisar por uma pessoa
      </label>
      <div className="relative flex-1">
        <Search
          size={17}
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className="h-13 w-full border border-input bg-card pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-primary focus:outline-none"
        />
      </div>
      <Button type="submit" size="lg" className="sm:w-auto">
        {buttonLabel}
      </Button>
    </form>
  );
}