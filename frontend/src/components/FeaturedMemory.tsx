import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/common/Button";
import { formatLifespan } from "@/lib/format";
import type { Person } from "@/types";

interface FeaturedMemoryProps {
  person: Person;
}

export function FeaturedMemory({ person }: FeaturedMemoryProps) {
  return (
    <article className="grid gap-8 border border-border bg-card p-5 md:grid-cols-[1.1fr_1fr] md:p-8">
      <div className="bg-beige">
        <img
          src={person.coverPhotoUrl}
          alt={`Fotografia principal de ${person.fullName}`}
          className="aspect-[4/5] w-full object-cover grayscale"
        />
      </div>
      <div className="flex flex-col justify-center">
        <p className="rule-label text-accent">Memória em destaque</p>
        <h3 className="font-display mt-3 text-3xl leading-[1.1] md:text-[2.6rem]">
          {person.knownAs ?? person.fullName}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {formatLifespan(person.birthDate, person.deathDate)} · {person.city}, {person.country}
        </p>
        <p className="mt-6 max-w-prose text-[0.95rem] leading-relaxed text-foreground/85">
          {person.biography}
        </p>
        <div className="mt-8">
          <Button asChild variant="outline">
            <Link to="/memoria/$id" params={{ id: person.id }}>
              Ver arquivo completo
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}