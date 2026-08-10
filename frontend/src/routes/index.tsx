import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/common/Button";
import { LoadingState } from "@/components/common/LoadingState";
import { FeaturedMemory } from "@/components/FeaturedMemory";
import { PersonCard } from "@/components/PersonCard";
import { SearchBar } from "@/components/SearchBar";
import { getFeaturedPeople, getRecentPeople } from "@/services/peopleService";
import { CATEGORIES } from "@/types";

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
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&h=1100&q=80",
    alt: "Retrato em preto e branco de uma mulher",
    className: "col-span-2 aspect-[4/5]",
  },
  {
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=700&h=700&q=80",
    alt: "Grupo de pessoas reunidas em uma fotografia de mem?ria",
    className: "aspect-square mt-6",
  },
  {
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&h=950&q=80",
    alt: "Retrato em preto e branco de um homem",
    className: "aspect-[3/4]",
  },
];

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
            {heroPhotos.map((photo) => (
              <div key={photo.src} className={`border border-border bg-beige ${photo.className}`}>
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="h-full w-full object-cover grayscale"
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

      <section aria-labelledby="categorias" className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-[1400px] px-5 py-10 md:px-10 md:py-12">
          <h2 id="categorias" className="font-display text-3xl md:text-4xl">
            Explore memórias
          </h2>
          <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
            Percorra o arquivo pelos ofícios, afetos e trajetórias que atravessam as fotografias.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
            {CATEGORIES.map((category) => (
              <li key={category}>
                <Link
                  to="/explorar"
                  search={{ q: "" }}
                  className="flex h-24 items-end bg-background p-4 transition-colors hover:bg-card md:h-28"
                >
                  <span className="font-display text-xl md:text-2xl">{category}</span>
                </Link>
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
