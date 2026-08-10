import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingState } from "@/components/common/LoadingState";
import { MemoryHeader } from "@/components/MemoryHeader";
import { PhotoGallery } from "@/components/PhotoGallery";
import { PhotoViewer } from "@/components/PhotoViewer";
import { StoryCard } from "@/components/StoryCard";
import { Timeline, type TimelineItem } from "@/components/Timeline";
import { formatYear } from "@/lib/format";
import { getPersonById, getPhotos, getStories } from "@/services/peopleService";
import type { Person, Photo } from "@/types";

export const Route = createFileRoute("/memoria/$id")({
  head: () => ({
    meta: [
      { title: "Arquivo de memória — Aquijaz" },
      {
        name: "description",
        content:
          "Fotografias, histórias e lembranças reunidas no arquivo de memória de uma pessoa no Aquijaz.",
      },
      { property: "og:title", content: "Arquivo de memória — Aquijaz" },
      {
        property: "og:description",
        content: "Fotografias, histórias e lembranças reunidas em um arquivo pessoal.",
      },
    ],
  }),
  component: MemoriaPage,
});

function buildTimeline(person: Person, photoCount: number): TimelineItem[] {
  const items: TimelineItem[] = [
    {
      year: formatYear(person.birthDate),
      title: "Nascimento",
      description: `Nasce em ${person.city}, ${person.country}.`,
    },
    {
      year: String(Number(formatYear(person.birthDate)) + 25),
      title: "Anos de formação",
      description:
        "Período em que se firma no ofício e nas relações que aparecem com mais frequência nas fotografias do arquivo.",
    },
  ];

  if (person.deathDate) {
    items.push({
      year: formatYear(person.deathDate),
      title: "Falecimento",
      description: "Data registrada por familiares no momento da criação deste arquivo.",
    });
  }

  items.push({
    year: formatYear(person.createdAt),
    title: "Arquivo aberto no Aquijaz",
    description: `${photoCount} fotografias reunidas até agora. O arquivo continua aberto a novas contribuições.`,
  });

  return items;
}

function MemoriaPage() {
  const { id } = Route.useParams();
  const [selected, setSelected] = useState<Photo | null>(null);

  const personQuery = useQuery({ queryKey: ["person", id], queryFn: () => getPersonById(id) });
  const photosQuery = useQuery({ queryKey: ["photos", id], queryFn: () => getPhotos(id) });
  const storiesQuery = useQuery({ queryKey: ["stories", id], queryFn: () => getStories(id) });

  if (personQuery.isPending) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10">
        <LoadingState count={3} label="Carregando arquivo" />
      </div>
    );
  }

  if (personQuery.isError || !personQuery.data) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 py-24 md:px-10">
        <EmptyState
          title="Arquivo não encontrado"
          description="Esta memória pode ter sido removida ou o endereço está incorreto."
          action={
            <Button asChild variant="outline">
              <Link to="/explorar">Voltar para explorar</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const person = personQuery.data;
  const photos = photosQuery.data ?? [];

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-20">
      <MemoryHeader person={person} photoCount={photos.length} />

      <section aria-labelledby="galeria" className="mt-24">
        <div className="mb-8 grid gap-4 border-b border-border pb-6 sm:flex sm:items-end sm:justify-between">
          <div>
            <p className="rule-label text-sage">Galeria</p>
            <h2 id="galeria" className="font-display mt-2 text-3xl md:text-4xl">
              Fotografias do arquivo
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">{photos.length} imagens</p>
        </div>

        {photosQuery.isPending ? (
          <LoadingState count={6} label="Carregando fotografias" />
        ) : photos.length === 0 ? (
          <EmptyState
            title="Ainda não há fotografias"
            description="Se você tem uma imagem desta pessoa, ela pode ser a primeira deste arquivo."
            action={
              <Button asChild>
                <Link to="/adicionar-foto" search={{ pessoa: person.id }}>
                  Adicionar fotografia
                </Link>
              </Button>
            }
          />
        ) : (
          <PhotoGallery photos={photos} onSelect={setSelected} />
        )}
      </section>

      <div className="mt-24 grid gap-16 md:grid-cols-[1.3fr_1fr] md:gap-20">
        <section aria-labelledby="historias">
          <p className="rule-label text-sage">Histórias e lembranças</p>
          <h2 id="historias" className="font-display mt-2 text-3xl md:text-4xl">
            O que contam sobre {person.knownAs ?? person.fullName}
          </h2>
          <div className="mt-8 space-y-8">
            {storiesQuery.data?.length ? (
              storiesQuery.data.map((story) => <StoryCard key={story.id} story={story} />)
            ) : (
              <EmptyState
                title="Nenhuma história registrada"
                description="As primeiras lembranças escritas aparecerão aqui."
              />
            )}
          </div>
        </section>

        <section aria-labelledby="linha-do-tempo">
          <p className="rule-label text-sage">Linha do tempo</p>
          <h2 id="linha-do-tempo" className="font-display mt-2 mb-8 text-3xl md:text-4xl">
            Percurso
          </h2>
          <Timeline items={buildTimeline(person, photos.length)} />
        </section>
      </div>

      <PhotoViewer photo={selected} onClose={() => setSelected(null)} />
    </div>
  );
}