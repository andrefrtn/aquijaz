export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <ol className="relative border-l border-border pl-6">
      {items.map((item) => (
        <li key={`${item.year}-${item.title}`} className="pb-8 last:pb-0">
          <span
            aria-hidden="true"
            className="absolute -left-[4.5px] mt-2 h-2 w-2 rounded-full bg-sage"
          />
          <p className="rule-label text-accent">{item.year}</p>
          <h4 className="font-display mt-1 text-lg">{item.title}</h4>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        </li>
      ))}
    </ol>
  );
}