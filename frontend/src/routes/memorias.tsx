import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/common/Button";
import { LoadingState } from "@/components/common/LoadingState";
import { PersonCard } from "@/components/PersonCard";
import { getPeople } from "@/services/peopleService";

export const Route = createFileRoute("/memorias")({
  head: () => ({
    meta: [
      { title: "Memórias do arquivo — Aquijaz" },
      {
        name: "description",
        content:
          "Todas as memórias já criadas no Aquijaz, com as mais curtidas em destaque.",
      },
      { property: "og:title", content: "Memórias do arquivo — Aquijaz" },
      {
        property: "og:description",
        content: "Todas as memórias já criadas no Aquijaz, com as mais curtidas em destaque.",
      },
    ],
  }),
  component: MemoriasPage,
});

function MemoriasPage() {
  const canFetch = typeof window !== "undefined";
  const query = useQuery({
    queryKey: ["people", "todas"],
    queryFn: () => getPeople({ pageSize: 100 }),
    enabled: canFetch,
  });

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 md:px-10 md:py-12">
      <div className="grid gap-4 border-b border-border pb-6 md:grid-cols-[1.2fr_auto] md:items-end">
        <div>
          <p className="rule-label text-sage">Acervo completo</p>
          <h1 className="font-display mt-2 text-4xl leading-tight md:text-5xl">Memórias</h1>
        </div>
        <Button asChild variant="outline">
          <Link to="/criar-memoria">Criar memória</Link>
        </Button>
      </div>

      <div className="mt-8">
        {query.isPending ? (
          <LoadingState count={9} />
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {query.data?.items.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
