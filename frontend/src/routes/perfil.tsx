import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/common/Button";
import { LoadingState } from "@/components/common/LoadingState";
import { PersonCard } from "@/components/PersonCard";
import { formatLongDate } from "@/lib/format";
import { getCurrentUser } from "@/services/authService";
import { getPeople } from "@/services/peopleService";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Meu perfil — Aquijaz" },
      {
        name: "description",
        content: "Suas contribuições ao arquivo do Aquijaz: memórias criadas e fotografias enviadas.",
      },
      { property: "og:title", content: "Meu perfil — Aquijaz" },
      { property: "og:description", content: "Suas memórias criadas e fotografias enviadas." },
    ],
  }),
  component: PerfilPage,
});

function PerfilPage() {
  const canFetch = typeof window !== "undefined";
  const userQuery = useQuery({ queryKey: ["current-user"], queryFn: getCurrentUser, enabled: canFetch });
  const peopleQuery = useQuery({
    queryKey: ["people", "perfil"],
    queryFn: () => getPeople({ pageSize: 100, sort: "az" }),
    enabled: canFetch,
  });

  const user = userQuery.data;
  const authoredPeople = peopleQuery.data?.items.filter((person) => person.authorId === user?.id) ?? [];
  const friendCount = user?.friends?.length ?? 0;

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-10 md:py-16">
      <header className="border-b border-border pb-10">
        <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <div className="flex min-w-0 items-center gap-5">
            <img
              src={
                user?.avatarUrl ??
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80"
              }
              alt={`Retrato de ${user?.name ?? "usuária"}`}
              className="h-20 w-20 shrink-0 rounded-full border border-border object-cover"
            />
            <div className="min-w-0">
              <p className="rule-label text-sage">Perfil</p>
              <h1 className="font-display truncate text-3xl leading-tight md:text-4xl">{user?.name ?? "—"}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="truncate">{user?.email}</span>
                <span className="text-foreground">
                  <strong className="font-semibold">{friendCount}</strong> seguindo
                </span>
                <span className="text-foreground">
                  <strong className="font-semibold">{friendCount}</strong> seguidores
                </span>
              </div>
            </div>
          </div>

          <Button asChild variant="outline">
            <Link to="/criar-memoria">
              <Plus size={16} aria-hidden="true" />
              Criar memória
            </Link>
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <span className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2 text-foreground">
            <MapPin size={15} aria-hidden="true" />
            {user?.city ?? "Cidade não informada"}
          </span>
          <span className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2 text-foreground">
            <CalendarDays size={15} aria-hidden="true" />
            No Aquijaz desde {formatLongDate(user?.memberSince)}
          </span>
          <span className="inline-flex items-center gap-2 border border-border bg-card px-4 py-2 text-foreground">
            {authoredPeople.length} {authoredPeople.length === 1 ? "memória criada" : "memórias criadas"}
          </span>
        </div>
      </header>

      <section aria-labelledby="minhas-memorias" className="mt-12">
        <h2 id="minhas-memorias" className="font-display border-b border-border pb-4 text-2xl md:text-3xl">
          Memórias que ajudei a preservar
        </h2>
        <div className="mt-8">
          {peopleQuery.isPending ? (
            <LoadingState count={3} />
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {authoredPeople.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
