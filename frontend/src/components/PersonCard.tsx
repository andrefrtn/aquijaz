import { Link } from "@tanstack/react-router";
import type { Person } from "@/types";
import { formatLifespan } from "@/lib/format";

interface PersonCardProps {
  person: Person;
}

export function PersonCard({ person }: PersonCardProps) {
  return (
    <article className="group">
      <Link
        to="/memoria/$id"
        params={{ id: person.id }}
        className="block focus-visible:outline-none"
        aria-label={`Abrir a memória de ${person.fullName}`}
      >
        <div className="overflow-hidden border border-border bg-beige">
          <img
            src={person.coverPhotoUrl}
            alt={`Fotografia de ${person.knownAs ?? person.fullName}`}
            loading="lazy"
            className="aspect-[3/4] w-full object-cover grayscale transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
        <p className="rule-label mt-4 text-sage">{person.category}</p>
        <h3 className="font-display mt-1.5 text-xl leading-snug text-foreground group-hover:text-primary">
          {person.knownAs ?? person.fullName}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatLifespan(person.birthDate, person.deathDate)} · {person.city}
        </p>
      </Link>
    </article>
  );
}