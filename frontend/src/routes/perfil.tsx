import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
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

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-6 border-b border-border pb-10 sm:flex sm:justify-between">
        <div className="flex min-w-0 items-center gap-5">
          <img
            src={user?.avatarUrl ?? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80"}
            alt={`Retrato de ${user?.name ?? "usuária"}`}
            className="h-16 w-16 shrink-0 border border-border object-cover sm:h-20 sm:w-20"
          />
          <div className="min-w-0">
            <p className="rule-label text-sage">Perfil</p>
            <h1 className="font-display truncate text-3xl md:text-4xl">{user?.name ?? "—"}</h1>
            <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link to="/criar-memoria">Criar memória</Link>
        </Button>
      </header>

      <dl className="mt-10 grid gap-6 sm:grid-cols-3">
        {[
          { label: "Cidade", value: user?.city ?? "—" },
          { label: "No Aquijaz desde", value: formatLongDate(user?.memberSince) },
          { label: "Memórias criadas", value: String(authoredPeople.length) },
        ].map((item) => (
          <div key={item.label} className="border border-border bg-card p-6">
            <dt className="rule-label text-muted-foreground">{item.label}</dt>
            <dd className="font-display mt-2 text-xl">{item.value}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="minhas-memorias" className="mt-16">
        <h2 id="minhas-memorias" className="font-display border-b border-border pb-4 text-2xl md:text-3xl">
          Memórias que ajudei a preservar
        </h2>
        <div className="mt-10">
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
