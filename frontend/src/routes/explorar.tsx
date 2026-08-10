import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingState } from "@/components/common/LoadingState";
import { SelectField } from "@/components/common/Input";
import { CategoryFilter } from "@/components/CategoryFilter";
import { PersonCard } from "@/components/PersonCard";
import { SearchBar } from "@/components/SearchBar";
import { DECADES, getPeople, type SortOrder } from "@/services/peopleService";
import type { Category } from "@/types";

export const Route = createFileRoute("/explorar")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Explorar memórias — Aquijaz" },
      {
        name: "description",
        content:
          "Busque por nome, filtre por categoria e período e percorra o arquivo de memórias do Aquijaz.",
      },
      { property: "og:title", content: "Explorar memórias — Aquijaz" },
      {
        property: "og:description",
        content: "Busque por nome, filtre por categoria e período e percorra o arquivo.",
      },
    ],
  }),
  component: ExplorarPage,
});

const PAGE_SIZE = 6;

function ExplorarPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | "Todas">("Todas");
  const [decade, setDecade] = useState("Todos");
  const [sort, setSort] = useState<SortOrder>("recentes");
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["people", q, category, decade, sort, page],
    queryFn: () =>
      getPeople({ search: q, category, decade, sort, page: 1, pageSize: page * PAGE_SIZE }),
  });

  const items = query.data?.items ?? [];

  function resetAndSearch(term: string) {
    setPage(1);
    void navigate({ to: "/explorar", search: { q: term } });
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 md:py-20">
      <p className="rule-label text-sage">Arquivo</p>
      <h1 className="font-display mt-3 text-4xl leading-tight md:text-6xl">Explorar memórias</h1>
      <p className="mt-4 max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground">
        Percorra o arquivo por nome, categoria ou período. Cada ficha reúne fotografias e histórias
        enviadas por quem conviveu com aquela pessoa.
      </p>

      <div className="mt-10 max-w-2xl">
        <SearchBar defaultValue={q} onSearch={resetAndSearch} />
      </div>

      <div className="mt-10 flex flex-col gap-6 border-y border-border py-6">
        <CategoryFilter
          value={category}
          onChange={(value) => {
            setCategory(value);
            setPage(1);
          }}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
          <SelectField
            label="Período de nascimento"
            value={decade}
            onChange={(event) => {
              setDecade(event.target.value);
              setPage(1);
            }}
          >
            <option value="Todos">Todos os períodos</option>
            {DECADES.map((item) => (
              <option key={item} value={item}>
                Década de {item}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Ordenar por"
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as SortOrder);
              setPage(1);
            }}
          >
            <option value="recentes">Adicionadas recentemente</option>
            <option value="antigos">Nascimento mais antigo</option>
            <option value="az">Nome (A–Z)</option>
            <option value="za">Nome (Z–A)</option>
          </SelectField>
        </div>
      </div>

      <div className="mt-10">
        {query.isPending ? (
          <LoadingState count={6} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Nenhuma memória encontrada"
            description="Tente outro nome, remova os filtros ou seja a primeira pessoa a criar este arquivo."
          />
        ) : (
          <>
            <p className="rule-label mb-6 text-muted-foreground">
              {query.data?.total} memórias no arquivo
            </p>
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
            {query.data?.hasMore ? (
              <div className="mt-14 flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  disabled={query.isFetching}
                  onClick={() => setPage((value) => value + 1)}
                >
                  {query.isFetching ? "Carregando…" : "Carregar mais memórias"}
                </Button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}