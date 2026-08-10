import type { Story } from "@/types";

interface StoryCardProps {
  story: Story;
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <article className="border-t border-border pt-6">
      <h3 className="font-display text-xl">{story.title}</h3>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-foreground/85">{story.content}</p>
      <p className="mt-4 text-xs text-muted-foreground">
        {story.author}
        {story.year ? ` · ${story.year}` : ""}
      </p>
    </article>
  );
}