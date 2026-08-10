import { Link } from "@tanstack/react-router";
import { ImagePlus, MapPin } from "lucide-react";
import { Button } from "@/components/common/Button";
import { formatLifespan } from "@/lib/format";
import type { Person } from "@/types";

interface MemoryHeaderProps {
  person: Person;
  photoCount: number;
}

export function MemoryHeader({ person, photoCount }: MemoryHeaderProps) {
  return (
    <header className="grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-14">
      <div className="border border-border bg-beige">
        <img
          src={person.coverPhotoUrl}
          alt={`Fotografia principal de ${person.fullName}`}
          className="aspect-[3/4] w-full object-cover grayscale"
        />
      </div>
      <div className="flex flex-col justify-center">
        <p className="rule-label text-sage">{person.category} · Arquivo nº {photoCount + 1}</p>
        <h1 className="font-display mt-3 text-4xl leading-[1.05] md:text-6xl">
          {person.knownAs ?? person.fullName}
        </h1>
        {person.knownAs ? (
          <p className="mt-2 text-sm text-muted-foreground">{person.fullName}</p>
        ) : null}
        <p className="mt-5 border-t border-border pt-5 text-sm text-foreground/80">
          {formatLifespan(person.birthDate, person.deathDate)}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin size={14} aria-hidden="true" />
          {person.city}, {person.country}
        </p>
        <p className="mt-6 max-w-prose text-[1.02rem] leading-relaxed text-foreground/85">
          {person.biography}
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link to="/adicionar-foto" search={{ pessoa: person.id }}>
              <ImagePlus size={16} aria-hidden="true" />
              Adicionar fotografia
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}