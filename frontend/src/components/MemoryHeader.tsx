import { Link } from "@tanstack/react-router";
import { Edit3, ImagePlus, MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/common/Button";
import { LikeButton } from "@/components/LikeButton";
import { formatLifespan } from "@/lib/format";
import type { Person } from "@/types";

interface MemoryHeaderProps {
  person: Person;
  photoCount: number;
  canManage?: boolean;
  onDelete?: () => void;
}

export function MemoryHeader({ person, photoCount, canManage = false, onDelete }: MemoryHeaderProps) {
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
        {person.authorName ? (
          <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
            {person.authorAvatarUrl ? (
              <img
                src={person.authorAvatarUrl}
                alt={`Foto de ${person.authorName}`}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : null}
            <span>Publicado por {person.authorName}</span>
          </div>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <LikeButton person={person} variant="button" />
          <Button asChild>
            <Link to="/adicionar-foto" search={{ pessoa: person.id }}>
              <ImagePlus size={16} aria-hidden="true" />
              Adicionar fotografia
            </Link>
          </Button>
          {canManage ? (
            <>
              <Button asChild variant="outline">
                <Link to="/editar-memoria/$id" params={{ id: person.id }}>
                  <Edit3 size={16} aria-hidden="true" />
                  Editar post
                </Link>
              </Button>
              <Button type="button" variant="outline" onClick={onDelete}>
                <Trash2 size={16} aria-hidden="true" />
                Apagar post
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
