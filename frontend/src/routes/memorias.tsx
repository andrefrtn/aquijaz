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
          "Todas as memórias já criadas no Aquijaz, ordenadas da mais recente para a mais antiga.",
      },
      { property: "og:title", content: "Memórias do arquivo — Aquijaz" },
      {
        property: "og:description",
        content: "Todas as memórias já criadas no Aquijaz, da mais recente à mais antiga.",
      },
    ],
  }),
  component: MemoriasPage,
});

function MemoriasPage() {
  const query = useQuery({
    queryKey: ["people", "todas"],
    queryFn: () => getPeople({ pageSize: 100 }),
  });

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
      <div className="grid gap-6 border-b border-border pb-10 md:grid-cols-[1.2fr_auto] md:items-end">
        <div>
          <p className="rule-label text-sage">Acervo completo</p>
          <h1 className="font-display mt-3 text-4xl leading-tight md:text-6xl">Memórias</h1>
        </div>
        <Button asChild variant="outline">
          <Link to="/criar-memoria">Criar memória</Link>
        </Button>
      </div>

      <div className="mt-12">
        {query.isPending ? (
          <LoadingState count={9} />
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {query.data?.items.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}