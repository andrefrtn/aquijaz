import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Archive, ArrowRight, BookOpen, Film, Landmark, Music, Palette, Trophy, UsersRound } from "lucide-react";
import { Button } from "@/components/common/Button";
import { LoadingState } from "@/components/common/LoadingState";
import { FeaturedMemory } from "@/components/FeaturedMemory";
import { PersonCard } from "@/components/PersonCard";
import { SearchBar } from "@/components/SearchBar";
import { getFeaturedPeople, getRecentPeople } from "@/services/peopleService";
import { CATEGORIES, type Category } from "@/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aquijaz — Memórias não deveriam desaparecer" },
      {
        name: "description",
        content:
          "Arquivo aberto de fotografias, histórias e lembranças de pessoas que fizeram parte de nossas vidas.",
      },
      { property: "og:title", content: "Aquijaz — Memórias não deveriam desaparecer" },
      {
        property: "og:description",
        content: "Fotografias, histórias e lembranças reunidas em um arquivo aberto.",
      },
    ],
  }),
  component: Index,
});

const heroPhotos = [
  {
    src: "https://images.pexels.com/photos/35077931/pexels-photo-35077931.jpeg",
    alt: "loja de brinquedo",
    className: "col-span-2 aspect-[4/5]",
  },
  {
    src: "https://images.pexels.com/photos/37194807/pexels-photo-37194807.jpeg",
    alt: "idosos",
    className: "aspect-square mt-6",
  },
  {
    src: "https://images.pexels.com/photos/19226414/pexels-photo-19226414.jpeg",
    alt: "bicicleta",
    className: "aspect-[3/4]",
  },
];

const categoryIcons: Record<Category, typeof Music> = {
  Música: Music,
  Cinema: Film,
  Literatura: BookOpen,
  Arte: Palette,
  Esporte: Trophy,
  História: Landmark,
  Família: UsersRound,
  Outras: Archive,
};

function Index() {
  const navigate = useNavigate();
  const canFetch = typeof window !== "undefined";
  const featured = useQuery({ queryKey: ["featured"], queryFn: getFeaturedPeople, enabled: canFetch });
  const recent = useQuery({ queryKey: ["recent"], queryFn: () => getRecentPeople(4), enabled: canFetch });

  const [highlight, ...grid] = featured.data ?? [];

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-10 md:grid-cols-[1.05fr_1fr] md:items-center md:px-10 md:py-14">
          <div className="fade-up">
            <p className="rule-label text-sage">Arquivo aberto de memórias</p>
            <h1 className="font-display mt-3 text-[2.25rem] leading-[1.02] md:text-[3.7rem]">
              Memórias não deveriam desaparecer.
            </h1>
            <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-foreground/80">
              O Aquijaz reúne histórias, fotografias e lembranças de pessoas que fizeram parte de
              nossas vidas.
            </p>
            <div className="mt-6 max-w-xl">
              <SearchBar onSearch={(term) => void navigate({ to: "/explorar", search: { q: term } })} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {heroPhotos.map((photo, index) => (
              <div key={photo.src} className={`border border-border bg-beige ${photo.className}`}>
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="h-full w-full object-cover grayscale opacity-0 animate-[hero-photo-in_700ms_ease-out_forwards]"
                  style={{ animationDelay: `${index * 140}ms` }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="destaques" className="mx-auto max-w-[1400px] px-5 py-10 md:px-10 md:py-14">
        <div className="grid gap-4 border-b border-border pb-4 sm:flex sm:items-end sm:justify-between">
          <h2 id="destaques" className="font-display text-3xl md:text-4xl">
            Mais curtidas
          </h2>
          <Link to="/memorias" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Ver todas <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8">
          {featured.isPending ? (
            <LoadingState count={3} />
          ) : (
            <div className="grid gap-8">
              {highlight ? <FeaturedMemory person={highlight} /> : null}
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                {grid.map((person) => (
                  <PersonCard key={person.id} person={person} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="categorias" className="border-y border-border bg-card">
        <div className="mx-auto max-w-[1400px] px-5 py-8 md:px-10 md:py-10">
          <div className="grid gap-3 sm:flex sm:items-end sm:justify-between">
            <div>
              <p className="rule-label text-sage">Categorias</p>
              <h2 id="categorias" className="font-display mt-2 text-3xl md:text-4xl">
                Explore memórias
              </h2>
            </div>
            <Link to="/explorar" search={{ q: "" }} className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Ver arquivo completo <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CATEGORIES.map((category) => (
              <li key={category}>
                {(() => {
                  const Icon = categoryIcons[category];
                  return (
                <Link
                  to="/explorar"
                  search={{ q: "", categoria: category }}
                  className="group flex min-h-24 items-center gap-3 rounded-xs border border-border bg-background p-4 transition-colors hover:border-primary hover:bg-secondary/60"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="font-display text-xl leading-tight">{category}</span>
                </Link>
                  );
                })()}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="recentes" className="mx-auto max-w-[1400px] border-t border-border px-5 py-10 md:px-10 md:py-14">
        <div className="grid gap-4 border-b border-border pb-4 sm:flex sm:items-end sm:justify-between">
          <h2 id="recentes" className="font-display text-3xl md:text-4xl">
            Memórias adicionadas recentemente
          </h2>
          <Link to="/explorar" search={{ q: "" }} className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Explorar arquivo <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-8">
          {recent.isPending ? (
            <LoadingState count={4} />
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {recent.data?.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
