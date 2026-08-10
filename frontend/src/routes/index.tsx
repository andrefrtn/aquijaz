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
    className: "aspect-square mt-10",
  },
  {
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&h=950&q=80",
    alt: "Retrato em preto e branco de um homem",
    className: "aspect-[3/4]",
  },
];

function Index() {
  const navigate = useNavigate();
  const featured = useQuery({ queryKey: ["featured"], queryFn: getFeaturedPeople });
  const recent = useQuery({ queryKey: ["recent"], queryFn: () => getRecentPeople(4) });

  const [highlight, ...grid] = featured.data ?? [];

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-[1400px] gap-14 px-5 py-16 md:grid-cols-[1.05fr_1fr] md:items-center md:px-10 md:py-24">
          <div className="fade-up">
            <p className="rule-label text-sage">Arquivo aberto de memórias</p>
            <h1 className="font-display mt-5 text-[2.6rem] leading-[1.02] md:text-[4.4rem]">
              Memórias não deveriam desaparecer.
            </h1>
            <p className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-foreground/80">
              O Aquijaz reúne histórias, fotografias e lembranças de pessoas que fizeram parte de
              nossas vidas.
            </p>
            <div className="mt-10 max-w-xl">
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

      <section aria-labelledby="destaques" className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-4 border-b border-border pb-6 sm:flex sm:items-end sm:justify-between">
          <h2 id="destaques" className="font-display text-3xl md:text-5xl">
            Memórias em destaque
          </h2>
          <Link to="/memorias" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Ver todas <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-12">
          {featured.isPending ? (
            <LoadingState count={3} />
          ) : (
            <div className="grid gap-12">
              {highlight ? <FeaturedMemory person={highlight} /> : null}
              <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {grid.map((person) => (
                  <PersonCard key={person.id} person={person} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section aria-labelledby="categorias" className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-24">
          <h2 id="categorias" className="font-display text-3xl md:text-5xl">
            Explore memórias
          </h2>
          <p className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">
            Percorra o arquivo pelos ofícios, afetos e trajetórias que atravessam as fotografias.
          </p>
          <ul className="mt-12 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
            {CATEGORIES.map((category) => (
              <li key={category}>
                <Link
                  to="/explorar"
                  search={{ q: "" }}
                  className="flex h-32 items-end bg-background p-5 transition-colors hover:bg-card md:h-40"
                >
                  <span className="font-display text-xl md:text-2xl">{category}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:items-center md:gap-20">
          <div className="border border-border bg-beige">
            <img
              src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1000&h=900&q=80"
              alt="Família reunida em uma fotografia de memória"
              className="aspect-[10/9] w-full object-cover grayscale"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl leading-[1.08] md:text-5xl">
              Você pode ter uma fotografia que ninguém mais tem.
            </h2>
            <p className="mt-6 max-w-prose text-[1rem] leading-relaxed text-foreground/80">
              Ela está esquecida em um álbum, dentro de um envelope de laboratório, no fundo de uma
              gaveta. Enquanto permanece ali, é uma imagem única e invisível. Digitalizada e
              descrita, ela volta a fazer parte da história de alguém — e de todos que vierem
              procurar por esse nome.
            </p>
            <div className="mt-10">
              <Button asChild size="lg" variant="accent">
                <Link to="/adicionar-foto" search={{ pessoa: "" }}>
                  Adicionar uma fotografia
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="recentes" className="mx-auto max-w-[1400px] border-t border-border px-5 py-20 md:px-10 md:py-24">
        <div className="grid gap-4 border-b border-border pb-6 sm:flex sm:items-end sm:justify-between">
          <h2 id="recentes" className="font-display text-3xl md:text-4xl">
            Memórias adicionadas recentemente
          </h2>
          <Link to="/explorar" search={{ q: "" }} className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Explorar arquivo <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-12">
          {recent.isPending ? (
            <LoadingState count={4} />
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
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
